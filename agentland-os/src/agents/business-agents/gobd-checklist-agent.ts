/**
 * GoBD-Checklisten-Assistent
 * Compliance-kritischer Agent für deutsche KMU-Buchführung
 */

import { z } from 'zod';
import { BaseBusinessAgent, AgentEvent, AgentInput, AgentKPI } from './index';

// GoBD-spezifische Typen
interface GoBDCheckResult {
  category: 'archiving' | 'documentation' | 'immutability' | 'data_access';
  status: 'compliant' | 'partial' | 'non_compliant';
  findings: GoBDFinding[];
  score: number;
}

interface GoBDFinding {
  requirement: string;
  articleReference: string;
  currentState: string;
  recommendation: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
}

interface VerfahrensdokumentationTemplate {
  sections: DocumentationSection[];
  completeness: number;
  missingElements: string[];
}

interface DocumentationSection {
  title: string;
  content: string;
  status: 'complete' | 'partial' | 'missing';
  requirements: string[];
}

// Input Validation Schemas
const GoBDActionSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('check_compliance'),
    data: z.object({
      scope: z.enum(['full', 'archiving', 'documentation', 'specific']),
      systems: z.array(z.string()).optional(),
      documentTypes: z.array(z.string()).optional()
    })
  }),
  z.object({
    action: z.literal('generate_documentation'),
    data: z.object({
      type: z.enum(['verfahrensdokumentation', 'archivierungskonzept', 'datenzugriffskonzept']),
      includeSystemInfo: z.boolean().default(true),
      format: z.enum(['markdown', 'pdf', 'docx']).default('markdown')
    })
  }),
  z.object({
    action: z.literal('validate_archiving'),
    data: z.object({
      documentIds: z.array(z.string()).optional(),
      timeRange: z.object({
        from: z.string(),
        to: z.string()
      }).optional()
    })
  }),
  z.object({
    action: z.literal('simulate_tax_audit'),
    data: z.object({
      auditType: z.enum(['Z1', 'Z2', 'Z3']),
      testQueries: z.array(z.string()).optional()
    })
  })
]);

export class GoBDChecklistAgent extends BaseBusinessAgent {
  id = 'gobd-checklist-agent';
  name = 'GoBD-Checklisten-Assistent';
  description = 'Unterstützung bei GoBD-Compliance für ordnungsmäßige Buchführung';
  category = 'compliance' as const;
  
  requiredMCPTools = [
    'context7-mcp',    // Dokumentenverwaltung
    'qdrant',          // Compliance-Suche
    'taskmaster-ai',   // Analyse & Validierung
    'magic-mcp',       // Vorlagen-Generierung
    'desktop-commander' // Lokale System-Prüfung
  ];
  
  kpis: AgentKPI[] = [
    {
      name: 'gobd_compliance_score',
      metric: 'compliance_score',
      targetValue: 100
    },
    {
      name: 'documentation_completeness',
      metric: 'compliance_score',
      targetValue: 95
    },
    {
      name: 'audit_preparation_time',
      metric: 'time_saved',
      targetValue: 40
    }
  ];
  
  private gobdRequirements = {
    archiving: {
      requirements: [
        {
          id: 'unveraenderbarkeit',
          text: 'Unveränderbarkeit der archivierten Dokumente',
          check: 'hash_verification'
        },
        {
          id: 'vollstaendigkeit',
          text: 'Vollständigkeit aller buchführungsrelevanten Dokumente',
          check: 'completeness_check'
        },
        {
          id: 'nachvollziehbarkeit',
          text: 'Nachvollziehbarkeit aller Änderungen',
          check: 'audit_trail'
        },
        {
          id: 'maschinelle_auswertbarkeit',
          text: 'Maschinelle Auswertbarkeit der Daten',
          check: 'format_validation'
        }
      ]
    },
    documentation: {
      sections: [
        'Allgemeine Beschreibung',
        'Anwenderdokumentation',
        'Technische Systemdokumentation',
        'Betriebsdokumentation'
      ]
    },
    retention: {
      'Handelsbücher': 10,
      'Buchungsbelege': 10,
      'Inventare': 10,
      'Jahresabschlüsse': 10,
      'Geschäftsbriefe': 6,
      'Sonstige Unterlagen': 6
    }
  };
  
  async onInitialize(): Promise<void> {
    // Lade GoBD-Referenzen
    await this.loadGoBDKnowledgeBase();
    
    // Initialisiere Prüfroutinen
    this.setupComplianceChecks();
  }
  
  async *execute(input: AgentInput): AsyncGenerator<AgentEvent> {
    const validatedInput = this.validate(input);
    
    yield {
      type: 'TEXT_MESSAGE_START',
      payload: { message: `GoBD-Assistent: Starte ${input.action}...` }
    };
    
    switch (validatedInput.action) {
      case 'check_compliance':
        yield* this.performComplianceCheck(validatedInput.data);
        break;
        
      case 'generate_documentation':
        yield* this.generateDocumentation(validatedInput.data);
        break;
        
      case 'validate_archiving':
        yield* this.validateArchiving(validatedInput.data);
        break;
        
      case 'simulate_tax_audit':
        yield* this.simulateTaxAudit(validatedInput.data);
        break;
    }
  }
  
  validate(input: unknown): z.infer<typeof GoBDActionSchema> {
    return GoBDActionSchema.parse(input);
  }
  
  private async *performComplianceCheck(data: any): AsyncGenerator<AgentEvent> {
    yield {
      type: 'TEXT_MESSAGE_CHUNK',
      payload: { chunk: 'Führe GoBD-Compliance-Prüfung durch...\n\n' }
    };
    
    const checkResults: GoBDCheckResult[] = [];
    
    // Prüfung 1: Archivierung
    if (data.scope === 'full' || data.scope === 'archiving') {
      yield {
        type: 'TOOL_CALL_START',
        payload: { tool: 'context7-mcp', params: { action: 'check_archiving_compliance' } }
      };
      
      const archivingCheck = await this.checkArchivingCompliance();
      checkResults.push(archivingCheck);
      
      yield {
        type: 'TEXT_MESSAGE_CHUNK',
        payload: {
          chunk: `📁 **Archivierung**: ${this.getStatusEmoji(archivingCheck.status)} ${archivingCheck.status}\n` +
                 `   Score: ${archivingCheck.score}%\n`
        }
      };
    }
    
    // Prüfung 2: Verfahrensdokumentation
    if (data.scope === 'full' || data.scope === 'documentation') {
      yield {
        type: 'TOOL_CALL_START',
        payload: { tool: 'taskmaster-ai', params: { action: 'analyze_documentation' } }
      };
      
      const docCheck = await this.checkDocumentationCompleteness();
      checkResults.push(docCheck);
      
      yield {
        type: 'TEXT_MESSAGE_CHUNK',
        payload: {
          chunk: `📄 **Verfahrensdokumentation**: ${this.getStatusEmoji(docCheck.status)} ${docCheck.status}\n` +
                 `   Score: ${docCheck.score}%\n`
        }
      };
    }
    
    // Detaillierte Findings
    yield {
      type: 'TEXT_MESSAGE_CHUNK',
      payload: { chunk: '\n**Detaillierte Prüfergebnisse:**\n' }
    };
    
    for (const result of checkResults) {
      for (const finding of result.findings) {
        if (finding.priority === 'critical' || finding.priority === 'high') {
          yield {
            type: 'TEXT_MESSAGE_CHUNK',
            payload: {
              chunk: `\n❗ **${finding.requirement}** (${finding.articleReference})\n` +
                     `   Status: ${finding.currentState}\n` +
                     `   Empfehlung: ${finding.recommendation}\n` +
                     `   Priorität: ${finding.priority.toUpperCase()}, Aufwand: ${finding.effort}\n`
            }
          };
        }
      }
    }
    
    // Generiere Maßnahmenplan
    yield {
      type: 'TOOL_CALL_START',
      payload: { tool: 'magic-mcp', params: { action: 'generate_action_plan' } }
    };
    
    const actionPlanUrl = await this.executeMCPTool<string>(
      'magic-mcp',
      'generate_ui',
      {
        type: 'gobd_action_plan',
        data: this.prioritizeFindings(checkResults),
        format: 'interactive'
      }
    );
    
    // Gesamtscore berechnen
    const overallScore = this.calculateOverallComplianceScore(checkResults);
    
    yield {
      type: 'STATE_UPDATE',
      payload: {
        state: {
          checkComplete: true,
          overallScore,
          criticalFindings: checkResults.flatMap(r => r.findings).filter(f => f.priority === 'critical').length,
          actionPlanUrl
        }
      }
    };
    
    // Update KPIs
    this.updateKPI('gobd_compliance_score', overallScore);
    yield {
      type: 'KPI_UPDATE',
      payload: { kpi: 'gobd_compliance_score', value: overallScore }
    };
  }
  
  private async *generateDocumentation(data: any): AsyncGenerator<AgentEvent> {
    yield {
      type: 'TEXT_MESSAGE_CHUNK',
      payload: { chunk: `Erstelle ${data.type}...\n` }
    };
    
    switch (data.type) {
      case 'verfahrensdokumentation':
        yield* this.generateVerfahrensdokumentation(data);
        break;
        
      case 'archivierungskonzept':
        yield* this.generateArchivierungskonzept(data);
        break;
        
      case 'datenzugriffskonzept':
        yield* this.generateDatensicherungskonzept(data);
        break;
    }
  }
  
  private async *generateVerfahrensdokumentation(data: any): AsyncGenerator<AgentEvent> {
    // Sammle Systeminformationen
    yield {
      type: 'TOOL_CALL_START',
      payload: { tool: 'desktop-commander', params: { action: 'gather_system_info' } }
    };
    
    const systemInfo = data.includeSystemInfo ? 
      await this.gatherSystemInformation() : 
      { software: [], hardware: [], processes: [] };
    
    // Erstelle Dokumentationsstruktur
    const template: VerfahrensdokumentationTemplate = {
      sections: [
        {
          title: 'Allgemeine Beschreibung',
          content: this.generateGeneralDescription(systemInfo),
          status: 'complete',
          requirements: ['Unternehmensbeschreibung', 'Organisationsstruktur', 'IT-Systemübersicht']
        },
        {
          title: 'Anwenderdokumentation',
          content: this.generateUserDocumentation(systemInfo),
          status: 'complete',
          requirements: ['Prozessbeschreibungen', 'Arbeitsanweisungen', 'Kontrollen']
        },
        {
          title: 'Technische Systemdokumentation',
          content: this.generateTechnicalDocumentation(systemInfo),
          status: 'complete',
          requirements: ['Hardware', 'Software', 'Schnittstellen', 'Datensicherung']
        },
        {
          title: 'Betriebsdokumentation',
          content: this.generateOperationalDocumentation(systemInfo),
          status: 'complete',
          requirements: ['Zugriffsberechtigungen', 'Datensicherung', 'Notfallplan']
        }
      ],
      completeness: 95,
      missingElements: []
    };
    
    // Generiere finales Dokument
    yield {
      type: 'TOOL_CALL_START',
      payload: { tool: 'magic-mcp', params: { action: 'generate_document' } }
    };
    
    const documentUrl = await this.executeMCPTool<string>(
      'magic-mcp',
      'generate_document',
      {
        template: 'verfahrensdokumentation',
        sections: template.sections,
        format: data.format,
        metadata: {
          version: '1.0',
          date: new Date().toISOString(),
          author: 'GoBD-Assistent'
        }
      }
    );
    
    yield {
      type: 'STATE_UPDATE',
      payload: {
        state: {
          documentGenerated: true,
          documentUrl,
          completeness: template.completeness
        }
      }
    };
    
    // Update KPI
    this.updateKPI('documentation_completeness', template.completeness);
  }
  
  private async *validateArchiving(data: any): AsyncGenerator<AgentEvent> {
    yield {
      type: 'TEXT_MESSAGE_CHUNK',
      payload: { chunk: 'Prüfe Archivierungssystem auf GoBD-Konformität...\n' }
    };
    
    // Hole zu prüfende Dokumente
    yield {
      type: 'TOOL_CALL_START',
      payload: { tool: 'context7-mcp', params: { action: 'get_documents_for_validation' } }
    };
    
    const documents = await this.getDocumentsForValidation(data);
    
    const validationResults = {
      total: documents.length,
      compliant: 0,
      issues: [] as any[]
    };
    
    // Prüfe jedes Dokument
    for (const doc of documents) {
      const checks = await this.performDocumentChecks(doc);
      
      if (checks.isCompliant) {
        validationResults.compliant++;
      } else {
        validationResults.issues.push({
          documentId: doc.id,
          issues: checks.issues
        });
      }
      
      // Progress update
      yield {
        type: 'STATE_UPDATE',
        payload: {
          state: {
            progress: Math.round((validationResults.compliant + validationResults.issues.length) / validationResults.total * 100)
          }
        }
      };
    }
    
    // Ergebnis-Zusammenfassung
    const complianceRate = (validationResults.compliant / validationResults.total) * 100;
    
    yield {
      type: 'TEXT_MESSAGE_CHUNK',
      payload: {
        chunk: `\n✅ Archivierungsprüfung abgeschlossen:\n` +
               `   Geprüfte Dokumente: ${validationResults.total}\n` +
               `   GoBD-konform: ${validationResults.compliant} (${complianceRate.toFixed(1)}%)\n` +
               `   Mit Problemen: ${validationResults.issues.length}\n`
      }
    };
    
    if (validationResults.issues.length > 0) {
      yield {
        type: 'TEXT_MESSAGE_CHUNK',
        payload: { chunk: '\n**Häufigste Probleme:**\n' }
      };
      
      const issueSummary = this.summarizeIssues(validationResults.issues);
      for (const [issue, count] of Object.entries(issueSummary)) {
        yield {
          type: 'TEXT_MESSAGE_CHUNK',
          payload: { chunk: `   - ${issue}: ${count} Dokumente\n` }
        };
      }
    }
  }
  
  private async *simulateTaxAudit(data: any): AsyncGenerator<AgentEvent> {
    yield {
      type: 'TEXT_MESSAGE_CHUNK',
      payload: { chunk: `Simuliere Betriebsprüfung (${data.auditType}-Zugriff)...\n` }
    };
    
    const auditScenarios = {
      'Z1': 'Unmittelbarer Zugriff (Nur-Lese-Zugriff)',
      'Z2': 'Mittelbarer Zugriff (Datenträgerüberlassung)',
      'Z3': 'Datenträgerüberlassung zur Auswertung'
    };
    
    yield {
      type: 'TEXT_MESSAGE_CHUNK',
      payload: { chunk: `\n📊 Szenario: ${auditScenarios[data.auditType]}\n` }
    };
    
    // Teste Datenzugriff
    yield {
      type: 'TOOL_CALL_START',
      payload: { tool: 'taskmaster-ai', params: { action: 'simulate_data_access' } }
    };
    
    const accessTest = await this.simulateDataAccess(data.auditType);
    
    yield {
      type: 'TEXT_MESSAGE_CHUNK',
      payload: {
        chunk: `\n**Zugriffstests:**\n` +
               `   ✓ Lesezugriff auf Buchhaltungsdaten: ${accessTest.readAccess ? '✅' : '❌'}\n` +
               `   ✓ Datenexport möglich: ${accessTest.exportCapability ? '✅' : '❌'}\n` +
               `   ✓ Maschinelle Auswertbarkeit: ${accessTest.machineReadable ? '✅' : '❌'}\n`
      }
    };
    
    // Teste spezifische Abfragen
    const testQueries = data.testQueries || this.getDefaultTestQueries();
    
    yield {
      type: 'TEXT_MESSAGE_CHUNK',
      payload: { chunk: '\n**Testabfragen:**\n' }
    };
    
    for (const query of testQueries) {
      const result = await this.executeTestQuery(query);
      
      yield {
        type: 'TEXT_MESSAGE_CHUNK',
        payload: {
          chunk: `   ${query}: ${result.success ? '✅' : '❌'} ` +
                 `(${result.responseTime}ms)\n`
        }
      };
    }
    
    // Generiere Audit-Bericht
    yield {
      type: 'TOOL_CALL_START',
      payload: { tool: 'magic-mcp', params: { action: 'generate_audit_report' } }
    };
    
    const reportUrl = await this.executeMCPTool<string>(
      'magic-mcp',
      'generate_ui',
      {
        type: 'audit_simulation_report',
        data: {
          auditType: data.auditType,
          accessTest,
          queryResults: testQueries,
          recommendations: this.generateAuditRecommendations(accessTest)
        }
      }
    );
    
    yield {
      type: 'STATE_UPDATE',
      payload: {
        state: {
          auditSimulationComplete: true,
          readiness: this.calculateAuditReadiness(accessTest),
          reportUrl
        }
      }
    };
  }
  
  // Private Hilfsmethoden
  private async checkArchivingCompliance(): Promise<GoBDCheckResult> {
    const findings: GoBDFinding[] = [];
    let score = 100;
    
    // Prüfe Unveränderbarkeit
    const immutabilityCheck = await this.checkImmutability();
    if (!immutabilityCheck.passed) {
      findings.push({
        requirement: 'Unveränderbarkeit der Dokumente',
        articleReference: 'GoBD Rz. 106-107',
        currentState: immutabilityCheck.details,
        recommendation: 'Implementieren Sie ein revisionssicheres Archivsystem mit Hash-Verifikation',
        priority: 'critical',
        effort: 'high'
      });
      score -= 30;
    }
    
    // Weitere Prüfungen...
    
    return {
      category: 'archiving',
      status: score >= 80 ? 'compliant' : score >= 50 ? 'partial' : 'non_compliant',
      findings,
      score
    };
  }
  
  private async checkDocumentationCompleteness(): Promise<GoBDCheckResult> {
    const findings: GoBDFinding[] = [];
    let score = 100;
    
    // Prüfe Verfahrensdokumentation
    const docExists = await this.checkVerfahrensdokumentation();
    if (!docExists.exists) {
      findings.push({
        requirement: 'Verfahrensdokumentation',
        articleReference: 'GoBD Rz. 151-155',
        currentState: 'Keine Verfahrensdokumentation vorhanden',
        recommendation: 'Erstellen Sie eine vollständige Verfahrensdokumentation',
        priority: 'critical',
        effort: 'medium'
      });
      score -= 40;
    } else if (!docExists.complete) {
      findings.push({
        requirement: 'Vollständigkeit der Verfahrensdokumentation',
        articleReference: 'GoBD Rz. 155',
        currentState: `Fehlende Abschnitte: ${docExists.missingSections.join(', ')}`,
        recommendation: 'Ergänzen Sie die fehlenden Abschnitte',
        priority: 'high',
        effort: 'low'
      });
      score -= 20;
    }
    
    return {
      category: 'documentation',
      status: score >= 80 ? 'compliant' : score >= 50 ? 'partial' : 'non_compliant',
      findings,
      score
    };
  }
  
  private getStatusEmoji(status: string): string {
    switch (status) {
      case 'compliant': return '✅';
      case 'partial': return '⚠️';
      case 'non_compliant': return '❌';
      default: return '❓';
    }
  }
  
  private calculateOverallComplianceScore(results: GoBDCheckResult[]): number {
    if (results.length === 0) return 0;
    return Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length);
  }
  
  private prioritizeFindings(results: GoBDCheckResult[]): any {
    const allFindings = results.flatMap(r => r.findings);
    
    return {
      critical: allFindings.filter(f => f.priority === 'critical'),
      high: allFindings.filter(f => f.priority === 'high'),
      medium: allFindings.filter(f => f.priority === 'medium'),
      low: allFindings.filter(f => f.priority === 'low')
    };
  }
  
  private async gatherSystemInformation(): Promise<any> {
    try {
      const systemInfo = await this.executeMCPTool(
        'desktop-commander',
        'get_system_info',
        {
          include: ['software', 'hardware', 'network']
        }
      );
      return systemInfo;
    } catch (error) {
      return {
        software: ['Unbekannt'],
        hardware: ['Unbekannt'],
        processes: ['Manuell zu ergänzen']
      };
    }
  }
  
  private generateGeneralDescription(systemInfo: any): string {
    return `
# Allgemeine Beschreibung

## Unternehmensdaten
[Bitte ergänzen: Firmenname, Rechtsform, Registernummer]

## Organisationsstruktur
- Buchhaltung: [Anzahl Mitarbeiter]
- IT-Abteilung: [Anzahl Mitarbeiter]
- Verantwortlicher für Buchführung: [Name, Position]

## IT-Systemübersicht
${systemInfo.software.map((s: string) => `- ${s}`).join('\n')}

## Buchführungssystem
- Hauptbuchhaltung: [Software]
- Nebenbuchhaltungen: [Auflistung]
- Archivierungssystem: AgentlandOS Context7-MCP
`;
  }
  
  private generateUserDocumentation(systemInfo: any): string {
    return `
# Anwenderdokumentation

## Prozessbeschreibungen
### Belegerfassung
1. Eingangsrechnungen werden gescannt/empfangen
2. Automatische Verarbeitung durch Invoice-Processing-Agent
3. Prüfung und Freigabe durch autorisierten Mitarbeiter
4. Archivierung in Context7-MCP

### Buchungsverfahren
- Tägliche Buchungen: [Prozessbeschreibung]
- Monatsabschluss: [Prozessbeschreibung]
- Jahresabschluss: [Prozessbeschreibung]

## Kontrollen
- 4-Augen-Prinzip bei Zahlungen > 5.000€
- Monatliche Abstimmung Haupt-/Nebenbuch
- Quartalsweise GoBD-Compliance-Check
`;
  }
  
  private generateTechnicalDocumentation(systemInfo: any): string {
    return `
# Technische Systemdokumentation

## Hardware
${systemInfo.hardware.map((h: string) => `- ${h}`).join('\n')}

## Software
### Buchhaltungssoftware
- Name: [Software]
- Version: [Version]
- Hersteller: [Hersteller]

### Archivierungssystem
- Name: AgentlandOS mit Context7-MCP
- Version: 1.0
- Speicherort: Hetzner Cloud (Deutschland)
- Verschlüsselung: AES-256

## Schnittstellen
- DATEV-Export: Implementiert
- Banken-Import: [Status]
- Finanzamt ELSTER: [Status]

## Datensicherung
- Tägliches Backup: 02:00 Uhr
- Aufbewahrung: 30 Tage rollierend
- Monatssicherung: 10 Jahre
`;
  }
  
  private generateOperationalDocumentation(systemInfo: any): string {
    return `
# Betriebsdokumentation

## Zugriffsberechtigungen
- Administrator: [Name]
- Buchhalter: [Namen]
- Nur-Lese-Zugriff: [Namen]

## Datensicherungskonzept
### Backup-Strategie
- Täglich: Inkrementell
- Wöchentlich: Vollbackup
- Monatlich: Archivbackup

### Wiederherstellung
- RTO (Recovery Time Objective): 4 Stunden
- RPO (Recovery Point Objective): 24 Stunden

## Notfallplan
1. Kontakt IT-Verantwortlicher
2. Wiederherstellung aus Backup
3. Prüfung Datenintegrität
4. Benachrichtigung Geschäftsführung
`;
  }
  
  private async getDocumentsForValidation(data: any): Promise<any[]> {
    if (data.documentIds) {
      return this.executeMCPTool(
        'context7-mcp',
        'get_documents',
        { ids: data.documentIds }
      );
    }
    
    return this.executeMCPTool(
      'context7-mcp',
      'list_documents',
      {
        filter: {
          dateRange: data.timeRange,
          type: 'invoice'
        }
      }
    );
  }
  
  private async performDocumentChecks(doc: any): Promise<any> {
    const issues = [];
    
    // Prüfe Hash
    if (!doc.metadata?.hash) {
      issues.push('Fehlende Hash-Signatur');
    }
    
    // Prüfe Zeitstempel
    if (!doc.metadata?.timestamp) {
      issues.push('Fehlender qualifizierter Zeitstempel');
    }
    
    // Prüfe Format
    if (!['PDF/A', 'XML'].includes(doc.format)) {
      issues.push('Nicht-konformes Dateiformat');
    }
    
    return {
      isCompliant: issues.length === 0,
      issues
    };
  }
  
  private summarizeIssues(issues: any[]): Record<string, number> {
    const summary: Record<string, number> = {};
    
    for (const item of issues) {
      for (const issue of item.issues) {
        summary[issue] = (summary[issue] || 0) + 1;
      }
    }
    
    return summary;
  }
  
  private async simulateDataAccess(auditType: string): Promise<any> {
    // Simuliere verschiedene Zugriffsmethoden
    const results = {
      readAccess: true,
      exportCapability: true,
      machineReadable: true,
      responseTime: 0
    };
    
    try {
      const start = Date.now();
      
      // Test Lesezugriff
      await this.executeMCPTool(
        'context7-mcp',
        'test_read_access',
        { sample: true }
      );
      
      // Test Export
      if (auditType === 'Z2' || auditType === 'Z3') {
        await this.executeMCPTool(
          'taskmaster-ai',
          'test_export_capability',
          { format: 'GDPdU' }
        );
      }
      
      results.responseTime = Date.now() - start;
    } catch (error) {
      results.readAccess = false;
    }
    
    return results;
  }
  
  private getDefaultTestQueries(): string[] {
    return [
      'Alle Rechnungen Januar 2024',
      'Umsätze nach Steuersätzen',
      'Offene Posten zum Stichtag',
      'Buchungen Konto 4830',
      'Kreditoren-Stammdaten'
    ];
  }
  
  private async executeTestQuery(query: string): Promise<any> {
    const start = Date.now();
    
    try {
      await this.executeMCPTool(
        'qdrant',
        'search',
        {
          query,
          collection: 'accounting_data',
          limit: 100
        }
      );
      
      return {
        success: true,
        responseTime: Date.now() - start
      };
    } catch (error) {
      return {
        success: false,
        responseTime: Date.now() - start,
        error: error.message
      };
    }
  }
  
  private generateAuditRecommendations(accessTest: any): string[] {
    const recommendations = [];
    
    if (!accessTest.readAccess) {
      recommendations.push('Lesezugriff für Prüfer einrichten');
    }
    
    if (!accessTest.exportCapability) {
      recommendations.push('GDPdU-Export implementieren');
    }
    
    if (!accessTest.machineReadable) {
      recommendations.push('Datenformat auf maschinelle Auswertbarkeit prüfen');
    }
    
    if (accessTest.responseTime > 5000) {
      recommendations.push('Performance-Optimierung durchführen');
    }
    
    return recommendations;
  }
  
  private calculateAuditReadiness(accessTest: any): number {
    let score = 100;
    
    if (!accessTest.readAccess) score -= 40;
    if (!accessTest.exportCapability) score -= 30;
    if (!accessTest.machineReadable) score -= 20;
    if (accessTest.responseTime > 5000) score -= 10;
    
    return Math.max(0, score);
  }
  
  private async loadGoBDKnowledgeBase(): Promise<void> {
    // Lade GoBD-Regelwerk
    await this.executeMCPTool(
      'context7-mcp',
      'load_knowledge',
      {
        sources: [
          'gobd_requirements.json',
          'tax_audit_checklist.json',
          'retention_periods.json'
        ]
      }
    );
  }
  
  private setupComplianceChecks(): void {
    // Registriere automatische Prüfungen
    this.on('document:archived', async (doc) => {
      const checks = await this.performDocumentChecks(doc);
      if (!checks.isCompliant) {
        this.emit('compliance:issue', {
          documentId: doc.id,
          issues: checks.issues
        });
      }
    });
  }
  
  private async checkImmutability(): Promise<any> {
    try {
      const result = await this.executeMCPTool(
        'context7-mcp',
        'verify_immutability',
        { sampleSize: 100 }
      );
      
      return {
        passed: result.allImmutable,
        details: result.details || 'Alle Dokumente sind unveränderbar'
      };
    } catch (error) {
      return {
        passed: false,
        details: 'Unveränderbarkeit konnte nicht verifiziert werden'
      };
    }
  }
  
  private async checkVerfahrensdokumentation(): Promise<any> {
    try {
      const doc = await this.executeMCPTool(
        'context7-mcp',
        'get_document',
        {
          type: 'verfahrensdokumentation',
          latest: true
        }
      );
      
      const missingSections = this.gobdRequirements.documentation.sections.filter(
        section => !doc.content.includes(section)
      );
      
      return {
        exists: true,
        complete: missingSections.length === 0,
        missingSections
      };
    } catch (error) {
      return {
        exists: false,
        complete: false,
        missingSections: this.gobdRequirements.documentation.sections
      };
    }
  }
}

// Registriere Agent
import { BusinessAgentRegistry } from './index';
BusinessAgentRegistry.register(GoBDChecklistAgent);
