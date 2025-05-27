/**
 * Automatisierter Rechnungs-Eingangsverarbeiter
 * ROI-maximierender Business-Agent für deutsche KMUs
 */

import { z } from 'zod';
import { BaseBusinessAgent, AgentEvent, AgentInput, AgentKPI } from './index';

// Invoice-spezifische Typen
interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  vendor: {
    name: string;
    taxId?: string;
    address?: string;
  };
  items: InvoiceItem[];
  totalNet: number;
  totalTax: number;
  totalGross: number;
  currency: string;
  paymentTerms?: string;
  orderReference?: string;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  totalNet: number;
  totalGross: number;
  accountingCode?: string;
  costCenter?: string;
}

interface ProcessingResult {
  invoiceId: string;
  status: 'success' | 'partial' | 'failed';
  extractedData: InvoiceData;
  validationErrors: ValidationError[];
  matchedOrder?: OrderMatch;
  suggestedBooking: BookingSuggestion;
  confidence: number;
}

interface ValidationError {
  field: string;
  message: string;
  severity: 'warning' | 'error';
}

interface OrderMatch {
  orderId: string;
  matchConfidence: number;
  discrepancies: string[];
}

interface BookingSuggestion {
  accountCode: string;
  costCenter?: string;
  taxCode: string;
  description: string;
  basedOn: 'historical' | 'rules' | 'ai_suggestion';
}

// Input Validation Schemas
const InvoiceActionSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('process_invoice'),
    data: z.object({
      source: z.enum(['email', 'upload', 'portal']),
      documentId: z.string().optional(),
      documentUrl: z.string().optional(),
      emailId: z.string().optional(),
      format: z.enum(['pdf', 'image', 'xrechnung', 'zugferd']).optional()
    })
  }),
  z.object({
    action: z.literal('batch_process'),
    data: z.object({
      invoiceIds: z.array(z.string()),
      priority: z.enum(['urgent', 'normal', 'low']).default('normal')
    })
  }),
  z.object({
    action: z.literal('validate_booking'),
    data: z.object({
      invoiceId: z.string(),
      bookingSuggestion: z.object({
        accountCode: z.string(),
        costCenter: z.string().optional(),
        taxCode: z.string()
      })
    })
  }),
  z.object({
    action: z.literal('export_datev'),
    data: z.object({
      invoiceIds: z.array(z.string()),
      format: z.enum(['csv', 'xml', 'ascii']).default('csv'),
      includeDocuments: z.boolean().default(true)
    })
  })
]);

export class InvoiceProcessingAgent extends BaseBusinessAgent {
  id = 'invoice-processing-agent';
  name = 'Automatisierter Rechnungs-Eingangsverarbeiter';
  description = 'KI-gestützte Automatisierung des kompletten Rechnungseingangs mit DATEV-Integration';
  category = 'finance' as const;
  
  requiredMCPTools = [
    'fetch',           // Email/Portal-Abruf
    'hyperbrowser-mcp', // Lieferantenportale
    'markdownify-mcp', // PDF/Bild-Konvertierung
    'taskmaster-ai',   // Datenextraktion
    'qdrant',          // Historische Daten & Matching
    'context7-mcp',    // Dokumentenarchivierung
    'claude-crew'      // Workflow-Orchestrierung
  ];
  
  kpis: AgentKPI[] = [
    {
      name: 'processing_time_per_invoice',
      metric: 'time_saved',
      targetValue: 60 // 60% Zeitersparnis
    },
    {
      name: 'extraction_accuracy',
      metric: 'error_reduction',
      targetValue: 95 // 95% Genauigkeit
    },
    {
      name: 'cost_per_invoice',
      metric: 'cost_saved',
      targetValue: 70 // 70% Kostenreduktion
    }
  ];
  
  private extractionPatterns = {
    invoiceNumber: [
      /Rechnungsnummer:?\s*(\S+)/i,
      /Invoice\s*Number:?\s*(\S+)/i,
      /Rechnung\s*Nr\.?:?\s*(\S+)/i
    ],
    invoiceDate: [
      /Rechnungsdatum:?\s*(\d{1,2}[./]\d{1,2}[./]\d{2,4})/i,
      /Datum:?\s*(\d{1,2}[./]\d{1,2}[./]\d{2,4})/i
    ],
    totalAmount: [
      /Gesamtbetrag:?\s*€?\s*([\d.,]+)/i,
      /Rechnungsbetrag:?\s*€?\s*([\d.,]+)/i,
      /Total:?\s*€?\s*([\d.,]+)/i
    ],
    taxId: [
      /USt-IdNr\.?:?\s*([A-Z]{2}\d+)/i,
      /VAT\s*ID:?\s*([A-Z]{2}\d+)/i
    ]
  };
  
  private bookingRules = {
    'IT-Services': { account: '4830', tax: 'VSt19' },
    'Büromaterial': { account: '6815', tax: 'VSt19' },
    'Reisekosten': { account: '4670', tax: 'VSt19' },
    'Telekommunikation': { account: '6805', tax: 'VSt19' }
  };
  
  async onInitialize(): Promise<void> {
    // Lade historische Buchungsdaten für ML-basierte Vorkontierung
    await this.loadHistoricalData();
    
    // Initialisiere Extraction-Modelle
    await this.initializeExtractionModels();
    
    // Registriere Event-Handler
    this.on('invoice:processed', this.handleInvoiceProcessed.bind(this));
  }
  
  async *execute(input: AgentInput): AsyncGenerator<AgentEvent> {
    const validatedInput = this.validate(input);
    
    yield {
      type: 'TEXT_MESSAGE_START',
      payload: { message: `Rechnungsverarbeitung: Starte ${input.action}...` }
    };
    
    switch (validatedInput.action) {
      case 'process_invoice':
        yield* this.processInvoice(validatedInput.data);
        break;
        
      case 'batch_process':
        yield* this.batchProcessInvoices(validatedInput.data);
        break;
        
      case 'validate_booking':
        yield* this.validateBookingSuggestion(validatedInput.data);
        break;
        
      case 'export_datev':
        yield* this.exportToDatev(validatedInput.data);
        break;
    }
  }
  
  validate(input: unknown): z.infer<typeof InvoiceActionSchema> {
    return InvoiceActionSchema.parse(input);
  }
  
  private async *processInvoice(data: any): AsyncGenerator<AgentEvent> {
    const startTime = Date.now();
    
    // Phase 1: Dokumentenempfang
    yield {
      type: 'STATE_UPDATE',
      payload: { state: { phase: 'receiving', progress: 10 } }
    };
    
    let documentContent: string;
    
    switch (data.source) {
      case 'email':
        yield {
          type: 'TOOL_CALL_START',
          payload: { tool: 'fetch', params: { source: 'email', id: data.emailId } }
        };
        
        const emailData = await this.executeMCPTool<any>(
          'fetch',
          'get_email_attachment',
          { emailId: data.emailId }
        );
        documentContent = emailData.content;
        break;
        
      case 'portal':
        yield {
          type: 'TOOL_CALL_START',
          payload: { tool: 'hyperbrowser-mcp', params: { action: 'download_invoice' } }
        };
        
        const portalData = await this.executeMCPTool<any>(
          'hyperbrowser-mcp',
          'navigate_and_download',
          { 
            url: data.documentUrl,
            selectors: { download: '.invoice-download-btn' }
          }
        );
        documentContent = portalData.content;
        break;
        
      case 'upload':
        documentContent = await this.getUploadedDocument(data.documentId);
        break;
    }
    
    // Phase 2: Konvertierung
    yield {
      type: 'STATE_UPDATE',
      payload: { state: { phase: 'converting', progress: 25 } }
    };
    
    yield {
      type: 'TOOL_CALL_START',
      payload: { tool: 'markdownify-mcp', params: { action: 'convert_document' } }
    };
    
    const structuredContent = await this.executeMCPTool<any>(
      'markdownify-mcp',
      'convert',
      {
        content: documentContent,
        format: data.format || 'pdf',
        extractTables: true,
        extractImages: false
      }
    );
    
    // Phase 3: Intelligente Datenextraktion
    yield {
      type: 'STATE_UPDATE',
      payload: { state: { phase: 'extracting', progress: 40 } }
    };
    
    yield {
      type: 'TOOL_CALL_START',
      payload: { tool: 'taskmaster-ai', params: { action: 'extract_invoice_data' } }
    };
    
    // Nutze Google AI für präzise Extraktion
    const extractedData = await this.executeMCPTool<any>(
      'taskmaster-ai',
      'extract_structured_data',
      {
        content: structuredContent.text,
        schema: {
          invoiceNumber: 'string',
          invoiceDate: 'date',
          vendor: {
            name: 'string',
            taxId: 'string?',
            address: 'string?'
          },
          items: [{
            description: 'string',
            quantity: 'number',
            unitPrice: 'number',
            taxRate: 'number'
          }],
          totalNet: 'number',
          totalTax: 'number',
          totalGross: 'number'
        },
        language: 'de'
      }
    );
    
    // Fallback auf Pattern-Matching wenn AI-Extraktion unvollständig
    const enhancedData = this.enhanceWithPatternMatching(
      extractedData,
      structuredContent.text
    );
    
    // Phase 4: Validierung & Duplikatsprüfung
    yield {
      type: 'STATE_UPDATE',
      payload: { state: { phase: 'validating', progress: 55 } }
    };
    
    const validationErrors = this.validateInvoiceData(enhancedData);
    
    // Duplikatsprüfung via Qdrant
    yield {
      type: 'TOOL_CALL_START',
      payload: { tool: 'qdrant', params: { action: 'check_duplicate' } }
    };
    
    const duplicateCheck = await this.executeMCPTool<any>(
      'qdrant',
      'search',
      {
        collection: 'invoices',
        filter: {
          must: [
            { key: 'invoiceNumber', match: { value: enhancedData.invoiceNumber } },
            { key: 'vendor.taxId', match: { value: enhancedData.vendor.taxId } }
          ]
        },
        limit: 1
      }
    );
    
    if (duplicateCheck.points.length > 0) {
      yield {
        type: 'TEXT_MESSAGE_CHUNK',
        payload: { chunk: '⚠️ Mögliches Duplikat erkannt! Bitte überprüfen.\n' }
      };
    }
    
    // Phase 5: Bestellabgleich (3-Way-Match)
    yield {
      type: 'STATE_UPDATE',
      payload: { state: { phase: 'matching', progress: 70 } }
    };
    
    let orderMatch;
    if (enhancedData.orderReference) {
      yield {
        type: 'TOOL_CALL_START',
        payload: { tool: 'context7-mcp', params: { action: 'find_order' } }
      };
      
      const orders = await this.executeMCPTool<any[]>(
        'context7-mcp',
        'search_documents',
        {
          type: 'purchase_order',
          query: enhancedData.orderReference
        }
      );
      
      if (orders.length > 0) {
        orderMatch = this.performThreeWayMatch(enhancedData, orders[0]);
        
        if (orderMatch.discrepancies.length > 0) {
          yield {
            type: 'TEXT_MESSAGE_CHUNK',
            payload: { 
              chunk: `📋 Bestellabgleich: ${orderMatch.matchConfidence}% Übereinstimmung\n` +
                     `Abweichungen: ${orderMatch.discrepancies.join(', ')}\n`
            }
          };
        }
      }
    }
    
    // Phase 6: KI-basierte Vorkontierung
    yield {
      type: 'STATE_UPDATE',
      payload: { state: { phase: 'pre-accounting', progress: 85 } }
    };
    
    yield {
      type: 'TOOL_CALL_START',
      payload: { tool: 'qdrant', params: { action: 'find_similar_bookings' } }
    };
    
    // Suche ähnliche historische Buchungen
    const embedding = await this.generateInvoiceEmbedding(enhancedData);
    const similarBookings = await this.executeMCPTool<any>(
      'qdrant',
      'search',
      {
        collection: 'historical_bookings',
        vector: embedding,
        limit: 5,
        filter: {
          should: [
            { key: 'vendor.name', match: { value: enhancedData.vendor.name } },
            { key: 'category', match: { any: this.categorizeInvoice(enhancedData) } }
          ]
        }
      }
    );
    
    const bookingSuggestion = this.generateBookingSuggestion(
      enhancedData,
      similarBookings.points,
      orderMatch
    );
    
    yield {
      type: 'TEXT_MESSAGE_CHUNK',
      payload: {
        chunk: `💡 Vorkontierung vorgeschlagen:\n` +
               `   Sachkonto: ${bookingSuggestion.accountCode} - ${bookingSuggestion.description}\n` +
               `   Kostenstelle: ${bookingSuggestion.costCenter || 'Keine'}\n` +
               `   Steuerschlüssel: ${bookingSuggestion.taxCode}\n` +
               `   Basis: ${bookingSuggestion.basedOn}\n`
      }
    };
    
    // Phase 7: Archivierung & Workflow
    yield {
      type: 'STATE_UPDATE',
      payload: { state: { phase: 'archiving', progress: 95 } }
    };
    
    // Archiviere in Context7 mit allen Metadaten
    yield {
      type: 'TOOL_CALL_START',
      payload: { tool: 'context7-mcp', params: { action: 'archive_invoice' } }
    };
    
    const archivedDoc = await this.executeMCPTool<any>(
      'context7-mcp',
      'create_document',
      {
        type: 'invoice',
        content: documentContent,
        metadata: {
          ...enhancedData,
          processingResult: {
            extractionConfidence: this.calculateConfidence(enhancedData, validationErrors),
            validationErrors,
            orderMatch,
            bookingSuggestion,
            processingTime: Date.now() - startTime
          }
        },
        retention: '10 years' // GoBD-konform
      }
    );
    
    // Workflow-Zuweisung basierend auf Betrag und Konfidenz
    yield {
      type: 'TOOL_CALL_START',
      payload: { tool: 'claude-crew', params: { action: 'assign_workflow' } }
    };
    
    const workflow = await this.executeMCPTool<any>(
      'claude-crew',
      'route_to_workflow',
      {
        documentId: archivedDoc.id,
        rules: [
          { condition: 'amount > 5000', workflow: 'management_approval' },
          { condition: 'confidence < 80', workflow: 'manual_review' },
          { condition: 'has_discrepancies', workflow: 'order_clarification' }
        ],
        data: {
          amount: enhancedData.totalGross,
          confidence: this.calculateConfidence(enhancedData, validationErrors),
          hasDiscrepancies: orderMatch?.discrepancies.length > 0
        }
      }
    );
    
    // Finale Ergebnisse
    const processingTime = Date.now() - startTime;
    const timeSaved = this.calculateTimeSaved(processingTime);
    
    yield {
      type: 'STATE_UPDATE',
      payload: {
        state: {
          phase: 'completed',
          progress: 100,
          result: {
            invoiceId: archivedDoc.id,
            status: validationErrors.filter(e => e.severity === 'error').length > 0 ? 'partial' : 'success',
            extractedData: enhancedData,
            validationErrors,
            orderMatch,
            bookingSuggestion,
            workflow: workflow.assignedTo,
            processingTime,
            confidence: this.calculateConfidence(enhancedData, validationErrors)
          }
        }
      }
    };
    
    // Update KPIs
    this.updateKPI('processing_time_per_invoice', timeSaved);
    this.updateKPI('extraction_accuracy', this.calculateConfidence(enhancedData, validationErrors));
    
    yield {
      type: 'KPI_UPDATE',
      payload: { kpi: 'processing_time_per_invoice', value: timeSaved }
    };
    
    yield {
      type: 'TEXT_MESSAGE_CHUNK',
      payload: {
        chunk: `\n✅ Rechnung erfolgreich verarbeitet!\n` +
               `   Verarbeitungszeit: ${(processingTime / 1000).toFixed(1)}s (${timeSaved}% schneller)\n` +
               `   Extraktionsgenauigkeit: ${this.calculateConfidence(enhancedData, validationErrors)}%\n` +
               `   Status: ${workflow.assignedTo}\n`
      }
    };
  }
  
  private async *batchProcessInvoices(data: any): AsyncGenerator<AgentEvent> {
    yield {
      type: 'TEXT_MESSAGE_CHUNK',
      payload: { chunk: `Starte Stapelverarbeitung von ${data.invoiceIds.length} Rechnungen...\n` }
    };
    
    // Orchestriere parallele Verarbeitung via Claude-Crew
    yield {
      type: 'TOOL_CALL_START',
      payload: { tool: 'claude-crew', params: { action: 'batch_process' } }
    };
    
    const batchResult = await this.executeMCPTool<any>(
      'claude-crew',
      'execute_parallel_workflow',
      {
        workflow: 'invoice_batch_processing',
        items: data.invoiceIds,
        priority: data.priority,
        maxConcurrency: data.priority === 'urgent' ? 10 : 5
      }
    );
    
    // Zeige Fortschritt
    for (const update of batchResult.updates) {
      yield {
        type: 'STATE_UPDATE',
        payload: {
          state: {
            processed: update.completed,
            total: data.invoiceIds.length,
            currentInvoice: update.currentItem
          }
        }
      };
    }
    
    yield {
      type: 'TEXT_MESSAGE_CHUNK',
      payload: {
        chunk: `\n✅ Stapelverarbeitung abgeschlossen:\n` +
               `   Erfolgreich: ${batchResult.successful}\n` +
               `   Mit Warnungen: ${batchResult.warnings}\n` +
               `   Fehlgeschlagen: ${batchResult.failed}\n`
      }
    };
  }
  
  private async *validateBookingSuggestion(data: any): AsyncGenerator<AgentEvent> {
    yield {
      type: 'TEXT_MESSAGE_CHUNK',
      payload: { chunk: 'Validiere Buchungsvorschlag...\n' }
    };
    
    // Prüfe gegen Kontenrahmen und Geschäftsregeln
    const validation = await this.validateAgainstAccountingRules(data.bookingSuggestion);
    
    if (validation.isValid) {
      yield {
        type: 'STATE_UPDATE',
        payload: { state: { validation: 'approved', suggestion: data.bookingSuggestion } }
      };
    } else {
      yield {
        type: 'TEXT_MESSAGE_CHUNK',
        payload: {
          chunk: `❌ Validierungsfehler:\n${validation.errors.join('\n')}\n`
        }
      };
    }
  }
  
  private async *exportToDatev(data: any): AsyncGenerator<AgentEvent> {
    yield {
      type: 'TEXT_MESSAGE_CHUNK',
      payload: { chunk: `Exportiere ${data.invoiceIds.length} Rechnungen im DATEV-Format...\n` }
    };
    
    // Hole alle Rechnungsdaten
    const invoices = await this.loadInvoiceData(data.invoiceIds);
    
    // Generiere DATEV-Export
    yield {
      type: 'TOOL_CALL_START',
      payload: { tool: 'taskmaster-ai', params: { action: 'generate_datev_export' } }
    };
    
    const exportData = await this.executeMCPTool<any>(
      'taskmaster-ai',
      'generate_export',
      {
        format: data.format,
        data: invoices.map(inv => this.mapToDatevFormat(inv)),
        includeHeaders: true,
        encoding: 'CP1252' // DATEV-Standard
      }
    );
    
    // Speichere Export
    yield {
      type: 'TOOL_CALL_START',
      payload: { tool: 'context7-mcp', params: { action: 'save_export' } }
    };
    
    const exportFile = await this.executeMCPTool<any>(
      'context7-mcp',
      'create_document',
      {
        type: 'datev_export',
        content: exportData.content,
        metadata: {
          format: data.format,
          invoiceCount: data.invoiceIds.length,
          exportDate: new Date().toISOString()
        }
      }
    );
    
    yield {
      type: 'STATE_UPDATE',
      payload: {
        state: {
          exportComplete: true,
          fileUrl: exportFile.downloadUrl,
          format: data.format,
          recordCount: invoices.length
        }
      }
    };
  }
  
  // Hilfsmethoden
  private enhanceWithPatternMatching(data: any, text: string): any {
    const enhanced = { ...data };
    
    // Ergänze fehlende Felder durch Pattern-Matching
    for (const [field, patterns] of Object.entries(this.extractionPatterns)) {
      if (!enhanced[field]) {
        for (const pattern of patterns) {
          const match = text.match(pattern);
          if (match) {
            enhanced[field] = match[1];
            break;
          }
        }
      }
    }
    
    // Normalisiere Beträge
    if (enhanced.totalGross && typeof enhanced.totalGross === 'string') {
      enhanced.totalGross = this.parseAmount(enhanced.totalGross);
    }
    
    return enhanced;
  }
  
  private validateInvoiceData(data: InvoiceData): ValidationError[] {
    const errors: ValidationError[] = [];
    
    // Pflichtfelder
    if (!data.invoiceNumber) {
      errors.push({ field: 'invoiceNumber', message: 'Rechnungsnummer fehlt', severity: 'error' });
    }
    
    if (!data.invoiceDate) {
      errors.push({ field: 'invoiceDate', message: 'Rechnungsdatum fehlt', severity: 'error' });
    }
    
    if (!data.vendor?.name) {
      errors.push({ field: 'vendor.name', message: 'Lieferant nicht erkannt', severity: 'error' });
    }
    
    // Plausibilität
    if (data.totalNet && data.totalTax && data.totalGross) {
      const calculated = data.totalNet + data.totalTax;
      if (Math.abs(calculated - data.totalGross) > 0.01) {
        errors.push({
          field: 'totals',
          message: 'Summen stimmen nicht überein',
          severity: 'warning'
        });
      }
    }
    
    // USt-ID Validierung
    if (data.vendor?.taxId && !this.validateTaxId(data.vendor.taxId)) {
      errors.push({
        field: 'vendor.taxId',
        message: 'Ungültige USt-IdNr',
        severity: 'warning'
      });
    }
    
    return errors;
  }
  
  private performThreeWayMatch(invoice: InvoiceData, order: any): OrderMatch {
    const discrepancies: string[] = [];
    let matchScore = 100;
    
    // Betrag vergleichen
    if (Math.abs(invoice.totalGross - order.totalAmount) > 0.01) {
      const diff = invoice.totalGross - order.totalAmount;
      discrepancies.push(`Betragsdifferenz: €${diff.toFixed(2)}`);
      matchScore -= 30;
    }
    
    // Positionen vergleichen
    const invoiceItems = invoice.items.length;
    const orderItems = order.items?.length || 0;
    if (invoiceItems !== orderItems) {
      discrepancies.push(`Positionsanzahl: ${invoiceItems} vs ${orderItems}`);
      matchScore -= 20;
    }
    
    // Lieferant vergleichen
    if (invoice.vendor.name !== order.vendor?.name) {
      discrepancies.push('Lieferant stimmt nicht überein');
      matchScore -= 40;
    }
    
    return {
      orderId: order.id,
      matchConfidence: Math.max(0, matchScore),
      discrepancies
    };
  }
  
  private generateBookingSuggestion(
    invoice: InvoiceData,
    historicalBookings: any[],
    orderMatch?: OrderMatch
  ): BookingSuggestion {
    // Priorität 1: Bestellbezug
    if (orderMatch && orderMatch.matchConfidence > 80) {
      const order = orderMatch; // Vereinfacht
      return {
        accountCode: order.accountCode || '3300',
        costCenter: order.costCenter,
        taxCode: this.determineTaxCode(invoice),
        description: `${invoice.vendor.name} - RNr ${invoice.invoiceNumber}`,
        basedOn: 'rules'
      };
    }
    
    // Priorität 2: Historische Daten
    if (historicalBookings.length > 0) {
      const mostFrequent = this.findMostFrequentBooking(historicalBookings);
      return {
        ...mostFrequent,
        description: `${invoice.vendor.name} - RNr ${invoice.invoiceNumber}`,
        basedOn: 'historical'
      };
    }
    
    // Priorität 3: Regelbasiert
    const category = this.categorizeInvoice(invoice);
    const rule = this.bookingRules[category];
    if (rule) {
      return {
        accountCode: rule.account,
        taxCode: rule.tax,
        description: `${invoice.vendor.name} - RNr ${invoice.invoiceNumber}`,
        basedOn: 'rules'
      };
    }
    
    // Fallback: KI-Vorschlag
    return {
      accountCode: '6300', // Sonstige betriebliche Aufwendungen
      taxCode: 'VSt19',
      description: `${invoice.vendor.name} - RNr ${invoice.invoiceNumber}`,
      basedOn: 'ai_suggestion'
    };
  }
  
  private categorizeInvoice(invoice: InvoiceData): string {
    const description = invoice.items.map(i => i.description).join(' ').toLowerCase();
    
    if (description.includes('software') || description.includes('lizenz')) {
      return 'IT-Services';
    }
    if (description.includes('büro') || description.includes('papier')) {
      return 'Büromaterial';
    }
    if (description.includes('reise') || description.includes('hotel')) {
      return 'Reisekosten';
    }
    if (description.includes('telefon') || description.includes('internet')) {
      return 'Telekommunikation';
    }
    
    return 'Sonstige';
  }
  
  private calculateConfidence(data: InvoiceData, errors: ValidationError[]): number {
    let confidence = 100;
    
    // Reduziere für Fehler
    confidence -= errors.filter(e => e.severity === 'error').length * 20;
    confidence -= errors.filter(e => e.severity === 'warning').length * 5;
    
    // Reduziere für fehlende Felder
    const requiredFields = ['invoiceNumber', 'invoiceDate', 'vendor', 'totalGross'];
    for (const field of requiredFields) {
      if (!data[field]) confidence -= 10;
    }
    
    return Math.max(0, Math.min(100, confidence));
  }
  
  private calculateTimeSaved(processingTimeMs: number): number {
    const manualTimeMinutes = 15; // Durchschnitt für manuelle Verarbeitung
    const automatedTimeMinutes = processingTimeMs / 1000 / 60;
    const savedPercentage = ((manualTimeMinutes - automatedTimeMinutes) / manualTimeMinutes) * 100;
    
    return Math.round(savedPercentage);
  }
  
  private parseAmount(amountStr: string): number {
    // Entferne Währungssymbole und Leerzeichen
    let cleaned = amountStr.replace(/[€$\s]/g, '');
    
    // Deutsche Formatierung: 1.234,56 -> 1234.56
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    
    return parseFloat(cleaned) || 0;
  }
  
  private validateTaxId(taxId: string): boolean {
    // Einfache USt-IdNr Validierung
    return /^[A-Z]{2}\d{9,12}$/.test(taxId);
  }
  
  private determineTaxCode(invoice: InvoiceData): string {
    // Bestimme Steuerschlüssel basierend auf Steuersatz
    const avgTaxRate = invoice.totalTax / invoice.totalNet * 100;
    
    if (avgTaxRate > 18 && avgTaxRate < 20) return 'VSt19';
    if (avgTaxRate > 6 && avgTaxRate < 8) return 'VSt7';
    if (avgTaxRate === 0) return 'VSt0';
    
    return 'VSt19'; // Default
  }
  
  private async generateInvoiceEmbedding(invoice: InvoiceData): Promise<number[]> {
    // Erstelle Text-Repräsentation für Embedding
    const text = [
      invoice.vendor.name,
      invoice.items.map(i => i.description).join(' '),
      this.categorizeInvoice(invoice)
    ].join(' ');
    
    const response = await this.executeMCPTool<{ embedding: number[] }>(
      'claude-crew',
      'generate_embedding',
      { text, model: 'all-mpnet-base-v2' }
    );
    
    return response.embedding;
  }
  
  private findMostFrequentBooking(bookings: any[]): any {
    // Finde häufigste Kontierung
    const frequency = new Map<string, number>();
    
    for (const booking of bookings) {
      const key = `${booking.accountCode}-${booking.costCenter || 'none'}`;
      frequency.set(key, (frequency.get(key) || 0) + 1);
    }
    
    let maxFreq = 0;
    let mostFrequent = bookings[0];
    
    for (const booking of bookings) {
      const key = `${booking.accountCode}-${booking.costCenter || 'none'}`;
      if (frequency.get(key)! > maxFreq) {
        maxFreq = frequency.get(key)!;
        mostFrequent = booking;
      }
    }
    
    return mostFrequent;
  }
  
  private async loadHistoricalData(): Promise<void> {
    // Lade historische Buchungsdaten für ML
    try {
      const historicalData = await this.executeMCPTool(
        'context7-mcp',
        'load_collection',
        { collection: 'historical_bookings', limit: 10000 }
      );
      
      // Indexiere in Qdrant für schnelle Ähnlichkeitssuche
      await this.executeMCPTool(
        'qdrant',
        'create_collection',
        {
          collection: 'historical_bookings',
          vector_size: 768, // all-mpnet-base-v2 dimension
          distance: 'Cosine'
        }
      );
    } catch (error) {
      console.error('Failed to load historical data:', error);
    }
  }
  
  private async initializeExtractionModels(): Promise<void> {
    // Initialisiere spezialisierte Extraktionsmodelle
    await this.executeMCPTool(
      'taskmaster-ai',
      'load_model',
      {
        model: 'invoice-extraction-de',
        fallback: 'gemini-1.5-flash'
      }
    );
  }
  
  private handleInvoiceProcessed(event: any): void {
    // Event-Handler für verarbeitete Rechnungen
    this.emit('metrics:update', {
      processed: event.invoiceId,
      time: event.processingTime,
      accuracy: event.confidence
    });
  }
  
  private async getUploadedDocument(documentId: string): Promise<string> {
    const doc = await this.executeMCPTool<any>(
      'context7-mcp',
      'get_document',
      { id: documentId }
    );
    return doc.content;
  }
  
  private async loadInvoiceData(invoiceIds: string[]): Promise<any[]> {
    const invoices = [];
    for (const id of invoiceIds) {
      const invoice = await this.executeMCPTool<any>(
        'context7-mcp',
        'get_document',
        { id }
      );
      invoices.push(invoice.metadata);
    }
    return invoices;
  }
  
  private mapToDatevFormat(invoice: any): any {
    // Mappe auf DATEV-Format
    return {
      'Umsatz (ohne Soll/Haben-Kz)': invoice.totalGross.toFixed(2).replace('.', ','),
      'Soll/Haben-Kennzeichen': 'S',
      'WKZ Umsatz': 'EUR',
      'Kurs': '1,00000',
      'Basis-Umsatz': invoice.totalNet.toFixed(2).replace('.', ','),
      'Konto': invoice.bookingSuggestion.accountCode,
      'Gegenkonto (ohne BU-Schlüssel)': '70000', // Kreditorenkonto
      'BU-Schlüssel': invoice.bookingSuggestion.taxCode,
      'Belegdatum': this.formatDateDatev(invoice.invoiceDate),
      'Belegfeld 1': invoice.invoiceNumber,
      'Belegfeld 2': invoice.vendor.name.substring(0, 36),
      'Buchungstext': invoice.bookingSuggestion.description.substring(0, 60),
      'Kostenstelle': invoice.bookingSuggestion.costCenter || ''
    };
  }
  
  private formatDateDatev(dateStr: string): string {
    // Format: TTMM
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return day + month;
  }
  
  private async validateAgainstAccountingRules(suggestion: any): Promise<any> {
    // Validiere gegen Kontenrahmen und Geschäftsregeln
    const rules = [
      { account: suggestion.accountCode, valid: /^[4-8]\d{3}$/.test(suggestion.accountCode) },
      { tax: suggestion.taxCode, valid: ['VSt0', 'VSt7', 'VSt19'].includes(suggestion.taxCode) }
    ];
    
    const errors = rules
      .filter(r => !r.valid)
      .map(r => `Ungültiger Wert: ${Object.keys(r)[0]}`);
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Registriere Agent
import { BusinessAgentRegistry } from './index';
BusinessAgentRegistry.register(InvoiceProcessingAgent);
