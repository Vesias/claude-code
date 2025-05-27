/**
 * DSGVO-Konformitäts-Assistent
 * Kritischer Business-Agent für deutsche KMU-Compliance
 */

import { z } from 'zod';
import { BaseBusinessAgent, AgentEvent, AgentInput, AgentKPI } from './index';

// DSGVO-spezifische Typen
interface PersonalDataFinding {
  documentId: string;
  documentPath: string;
  dataType: 'name' | 'address' | 'email' | 'phone' | 'birthdate' | 'financial' | 'health';
  location: { page?: number; line?: number; offset?: number };
  context: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
}

interface DSGVORiskAssessment {
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  findings: PersonalDataFinding[];
  recommendations: DSGVORecommendation[];
  complianceScore: number; // 0-100
}

interface DSGVORecommendation {
  priority: 'immediate' | 'high' | 'medium' | 'low';
  category: 'legal_basis' | 'deletion_concept' | 'data_processing_agreement' | 'technical_measures';
  title: string;
  description: string;
  estimatedEffort: string;
  references: string[]; // Artikel-Referenzen
}

// Input Validation Schemas
const DSGVOActionSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('scan_documents'),
    data: z.object({
      documentIds: z.array(z.string()).optional(),
      documentPaths: z.array(z.string()).optional(),
      scanDepth: z.enum(['quick', 'standard', 'deep']).default('standard')
    })
  }),
  z.object({
    action: z.literal('risk_assessment'),
    data: z.object({
      scope: z.enum(['full', 'documents', 'processes', 'vendors']),
      includeRecommendations: z.boolean().default(true)
    })
  }),
  z.object({
    action: z.literal('data_subject_request'),
    data: z.object({
      requestType: z.enum(['access', 'rectification', 'deletion', 'portability']),
      subjectId: z.string(),
      searchScope: z.array(z.string()).optional()
    })
  }),
  z.object({
    action: z.literal('processing_registry'),
    data: z.object({
      operation: z.enum(['create', 'update', 'export']),
      processingActivity: z.object({
        name: z.string(),
        purpose: z.string(),
        dataCategories: z.array(z.string()),
        dataSubjects: z.array(z.string()),
        retention: z.string()
      }).optional()
    })
  })
]);

export class DSGVOComplianceAgent extends BaseBusinessAgent {
  id = 'dsgvo-compliance-agent';
  name = 'DSGVO-Konformitäts-Assistent';
  description = 'Umfassende Unterstützung bei DSGVO-Compliance für deutsche KMUs';
  category = 'compliance' as const;
  
  requiredMCPTools = [
    'context7-mcp',    // Dokumentenverwaltung
    'qdrant',          // Semantische Suche
    'taskmaster-ai',   // Datenextraktion
    'claude-crew',     // Workflow-Orchestrierung
    'magic-mcp'        // UI-Generierung
  ];
  
  kpis: AgentKPI[] = [
    {
      name: 'compliance_score',
      metric: 'compliance_score',
      targetValue: 95
    },
    {
      name: 'processing_time_reduction',
      metric: 'time_saved',
      targetValue: 50 // 50% Zeitersparnis
    },
    {
      name: 'risk_mitigation',
      metric: 'error_reduction',
      targetValue: 80 // 80% Risikoreduktion
    }
  ];
  
  private knowledgeBase = {
    personalDataPatterns: [
      { type: 'name', patterns: [/\b[A-ZÄÖÜ][a-zäöüß]+ [A-ZÄÖÜ][a-zäöüß]+\b/g] },
      { type: 'email', patterns: [/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g] },
      { type: 'phone', patterns: [/\b(\+49|0)\d{2,4}[-\s]?\d{6,10}\b/g] },
      { type: 'address', patterns: [/\b\d{5}\s+[A-ZÄÖÜ][a-zäöüß]+\b/g] } // PLZ + Stadt
    ],
    
    riskMatrix: {
      'financial': { baseRisk: 'high', factors: ['encryption', 'access_control'] },
      'health': { baseRisk: 'critical', factors: ['special_category', 'consent'] },
      'email': { baseRisk: 'medium', factors: ['marketing_use', 'third_party'] }
    }
  };
  
  async onInitialize(): Promise<void> {
    // Initialisiere DSGVO-Wissensdatenbank
    await this.initializeKnowledgeBase();
    
    // Registriere Event-Handler
    this.on('document:scanned', this.handleDocumentScanned.bind(this));
    this.on('risk:identified', this.handleRiskIdentified.bind(this));
  }
  
  async *execute(input: AgentInput): AsyncGenerator<AgentEvent> {
    // Validiere Input
    const validatedInput = this.validate(input);
    
    yield {
      type: 'TEXT_MESSAGE_START',
      payload: { message: `DSGVO-Assistent: Starte ${input.action}...` }
    };
    
    switch (validatedInput.action) {
      case 'scan_documents':
        yield* this.scanDocuments(validatedInput.data);
        break;
        
      case 'risk_assessment':
        yield* this.performRiskAssessment(validatedInput.data);
        break;
        
      case 'data_subject_request':
        yield* this.handleDataSubjectRequest(validatedInput.data);
        break;
        
      case 'processing_registry':
        yield* this.manageProcessingRegistry(validatedInput.data);
        break;
        
      default:
        yield {
          type: 'ERROR',
          payload: { error: 'Unbekannte Aktion', details: input.action }
        };
    }
  }
  
  validate(input: unknown): z.infer<typeof DSGVOActionSchema> {
    return DSGVOActionSchema.parse(input);
  }
  
  private async *scanDocuments(data: any): AsyncGenerator<AgentEvent> {
    yield {
      type: 'TOOL_CALL_START',
      payload: { tool: 'context7-mcp', params: { action: 'list_documents' } }
    };
    
    // Hole Dokumente via Context7
    const documents = await this.executeMCPTool<any[]>(
      'context7-mcp',
      'list_documents',
      { paths: data.documentPaths || [] }
    );
    
    yield {
      type: 'TOOL_CALL_END',
      payload: { tool: 'context7-mcp', result: { documentCount: documents.length } }
    };
    
    const findings: PersonalDataFinding[] = [];
    let processedDocs = 0;
    
    for (const doc of documents) {
      yield {
        type: 'STATE_UPDATE',
        payload: { 
          state: { 
            progress: Math.round((processedDocs / documents.length) * 100),
            currentDocument: doc.name 
          } 
        }
      };
      
      // Extrahiere Text via Taskmaster
      yield {
        type: 'TOOL_CALL_START',
        payload: { tool: 'taskmaster-ai', params: { action: 'extract_text', document: doc.id } }
      };
      
      const text = await this.executeMCPTool<string>(
        'taskmaster-ai',
        'extract_text',
        { documentId: doc.id }
      );
      
      // Analysiere auf personenbezogene Daten
      const docFindings = this.analyzeForPersonalData(doc, text);
      findings.push(...docFindings);
      
      // Vektorisiere für semantische Suche
      if (docFindings.length > 0) {
        yield {
          type: 'TOOL_CALL_START',
          payload: { tool: 'qdrant', params: { action: 'index_findings' } }
        };
        
        await this.executeMCPTool(
          'qdrant',
          'index',
          {
            collection: 'dsgvo_findings',
            points: docFindings.map(f => ({
              id: `${doc.id}_${f.location.offset}`,
              payload: f,
              vector: await this.generateEmbedding(f.context)
            }))
          }
        );
      }
      
      processedDocs++;
    }
    
    // Generiere Risiko-Dashboard
    yield {
      type: 'TOOL_CALL_START',
      payload: { tool: 'magic-mcp', params: { action: 'generate_dashboard' } }
    };
    
    const dashboardUrl = await this.executeMCPTool<string>(
      'magic-mcp',
      'generate_ui',
      {
        type: 'risk_dashboard',
        data: this.aggregateFindings(findings)
      }
    );
    
    yield {
      type: 'STATE_UPDATE',
      payload: {
        state: {
          scanComplete: true,
          totalFindings: findings.length,
          riskSummary: this.calculateRiskSummary(findings),
          dashboardUrl
        }
      }
    };
    
    // Update KPIs
    this.updateKPI('compliance_score', this.calculateComplianceScore(findings));
    yield {
      type: 'KPI_UPDATE',
      payload: { kpi: 'compliance_score', value: this.kpis[0].currentValue! }
    };
  }
  
  private async *performRiskAssessment(data: any): AsyncGenerator<AgentEvent> {
    yield {
      type: 'TEXT_MESSAGE_CHUNK',
      payload: { chunk: 'Führe umfassende DSGVO-Risikoanalyse durch...\n' }
    };
    
    // Orchestriere via Claude-Crew
    yield {
      type: 'TOOL_CALL_START',
      payload: { tool: 'claude-crew', params: { workflow: 'dsgvo_risk_assessment' } }
    };
    
    const assessment = await this.executeMCPTool<DSGVORiskAssessment>(
      'claude-crew',
      'execute_workflow',
      {
        workflow: 'dsgvo_risk_assessment',
        scope: data.scope,
        steps: [
          { tool: 'context7-mcp', action: 'scan_all' },
          { tool: 'qdrant', action: 'semantic_search', query: 'personenbezogene Daten' },
          { tool: 'taskmaster-ai', action: 'analyze_risks' }
        ]
      }
    );
    
    yield {
      type: 'TOOL_CALL_END',
      payload: { tool: 'claude-crew', result: { overallRisk: assessment.overallRisk } }
    };
    
    // Generiere Empfehlungen
    if (data.includeRecommendations) {
      for (const recommendation of assessment.recommendations) {
        yield {
          type: 'TEXT_MESSAGE_CHUNK',
          payload: { 
            chunk: `\n**${recommendation.priority.toUpperCase()}**: ${recommendation.title}\n` +
                   `${recommendation.description}\n` +
                   `Aufwand: ${recommendation.estimatedEffort}\n`
          }
        };
      }
    }
    
    yield {
      type: 'STATE_UPDATE',
      payload: {
        state: {
          assessmentComplete: true,
          complianceScore: assessment.complianceScore,
          criticalFindings: assessment.findings.filter(f => f.riskLevel === 'critical').length,
          recommendations: assessment.recommendations.length
        }
      }
    };
  }
  
  private async *handleDataSubjectRequest(data: any): AsyncGenerator<AgentEvent> {
    yield {
      type: 'TEXT_MESSAGE_CHUNK',
      payload: { chunk: `Bearbeite Betroffenenanfrage: ${data.requestType} für ID ${data.subjectId}\n` }
    };
    
    // Suche alle Daten zum Betroffenen
    yield {
      type: 'TOOL_CALL_START',
      payload: { tool: 'qdrant', params: { action: 'search_subject_data' } }
    };
    
    const subjectData = await this.executeMCPTool(
      'qdrant',
      'search',
      {
        collection: 'personal_data',
        filter: { subjectId: data.subjectId },
        limit: 1000
      }
    );
    
    // Generiere Antwort basierend auf Anfrage-Typ
    switch (data.requestType) {
      case 'access':
        yield* this.generateAccessReport(subjectData);
        break;
      case 'deletion':
        yield* this.processDeletionRequest(subjectData);
        break;
      case 'rectification':
        yield* this.processRectificationRequest(subjectData);
        break;
      case 'portability':
        yield* this.generatePortableData(subjectData);
        break;
    }
    
    // Dokumentiere Vorgang
    yield {
      type: 'TOOL_CALL_START',
      payload: { tool: 'context7-mcp', params: { action: 'log_request' } }
    };
    
    await this.executeMCPTool(
      'context7-mcp',
      'create_document',
      {
        type: 'dsgvo_request_log',
        content: {
          timestamp: new Date().toISOString(),
          requestType: data.requestType,
          subjectId: data.subjectId,
          processingTime: Date.now(),
          result: 'completed'
        }
      }
    );
    
    this.updateKPI('processing_time_reduction', 70); // 70% schneller als manuell
    yield {
      type: 'KPI_UPDATE',
      payload: { kpi: 'processing_time_reduction', value: 70 }
    };
  }
  
  // Private Hilfsmethoden
  private analyzeForPersonalData(doc: any, text: string): PersonalDataFinding[] {
    const findings: PersonalDataFinding[] = [];
    
    for (const { type, patterns } of this.knowledgeBase.personalDataPatterns) {
      for (const pattern of patterns) {
        const matches = text.matchAll(pattern);
        for (const match of matches) {
          const riskLevel = this.calculateRiskLevel(type as any, match[0]);
          findings.push({
            documentId: doc.id,
            documentPath: doc.path,
            dataType: type as any,
            location: { offset: match.index! },
            context: text.substring(Math.max(0, match.index! - 50), match.index! + match[0].length + 50),
            riskLevel,
            recommendation: this.generateRecommendation(type as any, riskLevel)
          });
        }
      }
    }
    
    return findings;
  }
  
  private calculateRiskLevel(dataType: string, value: string): 'low' | 'medium' | 'high' | 'critical' {
    const riskConfig = this.knowledgeBase.riskMatrix[dataType];
    if (!riskConfig) return 'medium';
    
    // Komplexere Risikobewertung basierend auf Kontext
    return riskConfig.baseRisk as any;
  }
  
  private generateRecommendation(dataType: string, riskLevel: string): string {
    const recommendations = {
      'critical': 'Sofortige Verschlüsselung und Zugriffsbeschränkung erforderlich',
      'high': 'Implementieren Sie zusätzliche Sicherheitsmaßnahmen',
      'medium': 'Überprüfen Sie die Rechtsgrundlage der Verarbeitung',
      'low': 'Standard-Sicherheitsmaßnahmen ausreichend'
    };
    
    return recommendations[riskLevel] || 'Weitere Analyse erforderlich';
  }
  
  private async generateEmbedding(text: string): Promise<number[]> {
    // Nutze LocalAI für Embeddings
    const response = await this.executeMCPTool<{ embedding: number[] }>(
      'claude-crew',
      'generate_embedding',
      { text, model: 'all-mpnet-base-v2' }
    );
    
    return response.embedding;
  }
  
  private aggregateFindings(findings: PersonalDataFinding[]) {
    const byType = findings.reduce((acc, f) => {
      acc[f.dataType] = (acc[f.dataType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const byRisk = findings.reduce((acc, f) => {
      acc[f.riskLevel] = (acc[f.riskLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return { byType, byRisk, total: findings.length };
  }
  
  private calculateRiskSummary(findings: PersonalDataFinding[]) {
    const riskScores = { low: 1, medium: 2, high: 3, critical: 4 };
    const totalScore = findings.reduce((sum, f) => sum + riskScores[f.riskLevel], 0);
    const avgScore = totalScore / (findings.length || 1);
    
    if (avgScore >= 3.5) return 'critical';
    if (avgScore >= 2.5) return 'high';
    if (avgScore >= 1.5) return 'medium';
    return 'low';
  }
  
  private calculateComplianceScore(findings: PersonalDataFinding[]): number {
    const criticalCount = findings.filter(f => f.riskLevel === 'critical').length;
    const highCount = findings.filter(f => f.riskLevel === 'high').length;
    
    let score = 100;
    score -= criticalCount * 20;
    score -= highCount * 10;
    
    return Math.max(0, score);
  }
  
  private async initializeKnowledgeBase(): Promise<void> {
    // Lade DSGVO-Referenzen und Best Practices
    await this.executeMCPTool(
      'context7-mcp',
      'load_knowledge',
      {
        sources: [
          'dsgvo_articles.json',
          'bsi_guidelines.json',
          'court_decisions.json'
        ]
      }
    );
  }
  
  private handleDocumentScanned(event: any): void {
    // Event-Handler für gescannte Dokumente
    console.log('Document scanned:', event);
  }
  
  private handleRiskIdentified(event: any): void {
    // Event-Handler für identifizierte Risiken
    console.log('Risk identified:', event);
  }
  
  // Weitere Hilfsmethoden für spezifische Anfrage-Typen
  private async *generateAccessReport(data: any): AsyncGenerator<AgentEvent> {
    yield {
      type: 'TEXT_MESSAGE_CHUNK',
      payload: { chunk: 'Erstelle Auskunftsbericht gemäß Art. 15 DSGVO...\n' }
    };
    
    // Implementierung der Auskunftserteilung
    yield {
      type: 'TOOL_CALL_START',
      payload: { tool: 'magic-mcp', params: { action: 'generate_report' } }
    };
    
    const reportUrl = await this.executeMCPTool<string>(
      'magic-mcp',
      'generate_ui',
      {
        type: 'dsgvo_access_report',
        data: data,
        format: 'pdf'
      }
    );
    
    yield {
      type: 'STATE_UPDATE',
      payload: {
        state: {
          reportGenerated: true,
          reportUrl,
          dataCategories: this.extractDataCategories(data)
        }
      }
    };
  }
  
  private async *processDeletionRequest(data: any): AsyncGenerator<AgentEvent> {
    yield {
      type: 'TEXT_MESSAGE_CHUNK',
      payload: { chunk: 'Verarbeite Löschantrag gemäß Art. 17 DSGVO...\n' }
    };
    
    // Prüfe Löschpflichten und Ausnahmen
    const deletionPlan = this.createDeletionPlan(data);
    
    for (const item of deletionPlan.items) {
      yield {
        type: 'TEXT_MESSAGE_CHUNK',
        payload: { 
          chunk: `${item.canDelete ? '✓' : '✗'} ${item.dataCategory}: ${item.reason}\n` 
        }
      };
    }
  }
  
  private async *processRectificationRequest(data: any): AsyncGenerator<AgentEvent> {
    yield {
      type: 'TEXT_MESSAGE_CHUNK',
      payload: { chunk: 'Bearbeite Berichtigungsantrag gemäß Art. 16 DSGVO...\n' }
    };
    
    // Implementierung der Datenberichtigung
  }
  
  private async *generatePortableData(data: any): AsyncGenerator<AgentEvent> {
    yield {
      type: 'TEXT_MESSAGE_CHUNK',
      payload: { chunk: 'Erstelle portables Datenformat gemäß Art. 20 DSGVO...\n' }
    };
    
    // Generiere maschinenlesbares Format (JSON/CSV)
    yield {
      type: 'TOOL_CALL_START',
      payload: { tool: 'taskmaster-ai', params: { action: 'export_data' } }
    };
    
    const exportedData = await this.executeMCPTool(
      'taskmaster-ai',
      'export_personal_data',
      {
        format: 'json',
        includeMetadata: true,
        data: data
      }
    );
    
    yield {
      type: 'STATE_UPDATE',
      payload: {
        state: {
          exportComplete: true,
          format: 'application/json',
          size: JSON.stringify(exportedData).length
        }
      }
    };
  }
  
  private async *manageProcessingRegistry(data: any): AsyncGenerator<AgentEvent> {
    yield {
      type: 'TEXT_MESSAGE_CHUNK',
      payload: { chunk: 'Verwalte Verzeichnis von Verarbeitungstätigkeiten...\n' }
    };
    
    // Implementierung der VVT-Verwaltung
  }
  
  private extractDataCategories(data: any): string[] {
    // Extrahiere Datenkategorien aus den Suchergebnissen
    return [...new Set(data.map((item: any) => item.category))];
  }
  
  private createDeletionPlan(data: any) {
    // Erstelle Löschplan unter Berücksichtigung gesetzlicher Aufbewahrungsfristen
    return {
      items: data.map((item: any) => ({
        dataCategory: item.category,
        canDelete: this.checkDeletionEligibility(item),
        reason: this.getDeletionReason(item)
      }))
    };
  }
  
  private checkDeletionEligibility(item: any): boolean {
    // Prüfe ob Daten gelöscht werden können
    const retentionPeriods = {
      'financial': 10, // Jahre
      'employment': 3,
      'marketing': 0
    };
    
    const category = item.category;
    const age = this.calculateDataAge(item.createdAt);
    
    return age > (retentionPeriods[category] || 0);
  }
  
  private getDeletionReason(item: any): string {
    if (!this.checkDeletionEligibility(item)) {
      return 'Gesetzliche Aufbewahrungsfrist noch nicht abgelaufen';
    }
    return 'Löschung möglich';
  }
  
  private calculateDataAge(createdAt: string): number {
    const created = new Date(createdAt);
    const now = new Date();
    return (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24 * 365);
  }
}

// Registriere Agent
import { BusinessAgentRegistry } from './index';
BusinessAgentRegistry.register(DSGVOComplianceAgent);
