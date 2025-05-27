# AgentlandOS Memory Bank

## ProjectBrief

**Kernziel**: AgentlandOS ist eine revolutionäre Zero-Capital AIaaS-Plattform für deutsche KMUs mit Multi-Tenant-Architektur und selbst-orchestrierendem MCP-Ökosystem.

**Hauptanforderungen**:
- LocalAI-basierte Embedding-Infrastruktur (statt Ollama) für flexible Deployments
- Multi-Tenant-Architektur mit PostgreSQL RLS und Workspace-Sharing
- 13 MCP-Tools in 4 Kategorien: Development, AI/Semantic, Content/Media, Utility
- AG-UI Protocol für Echtzeit-Event-Streaming
- Hetzner-Hosting für GDPR-Compliance mit GPU-Support
- Lago/OpenMeter für präzises API-Usage-Tracking
- Minimale API-Keys: Nur Claude Login (OAuth) + Google AI

**Monetarisierungsstrategie**:
- Zero-Capital-Start durch Cloud-Startup-Programme (bis €300K Credits)
- Hybrid-Preismodell: Base-Subscription + Usage-Based-Pricing
- Starter (€299/mo), Professional (€899/mo), Enterprise (€2,500+/mo)
- Break-Even bei 750K-1M Requests/Monat für Self-Hosting

## ProductContext

**Revolutionäre Vision**: Ein selbst-orchestrierendes AIaaS-Ökosystem, das sich adaptiv an Nutzeranforderungen anpasst und ohne Startkapital maximalen Mehrwert generiert.

**Multi-Tenant-Konzept**:
- User können persönliche Accounts erstellen
- Companies können User einladen und Speicher teilen
- Workspaces ermöglichen isolierte oder gemeinsame Projekte
- Tenant-spezifische Vector-Namespaces in Qdrant

**Zielgruppen-Evolution**:
- Steuerberater: DATEV/Lexware-Vollintegration mit KI-Plausibilitätsprüfung
- Gastronomie: Multi-Channel-Bestellsystem mit Predictive Ordering
- Einzelhandel: Omnichannel mit KI-Preisoptimierung
- Manufacturing: Produktionsoptimierung mit LocalAI-Edge-Deployment

**Zero-Capital-Enabler**:
- AWS Activate, Google Cloud, Microsoft Programs (je bis €100K)
- Open-Source-First mit Apache 2.0 Modellen
- Client-Side-Inference reduziert Infrastructure-Costs um 60-80%

## SystemPatterns

**Transformative Architektur**:
```
┌─────────────────────────────────────────────────────────┐
│                    AG-UI Event Stream                    │
├─────────────────────────────────────────────────────────┤
│  Frontend (Next.js)  ←→  API Gateway  ←→  MCP Orchestra │
├─────────────────────────────────────────────────────────┤
│              Multi-Tenant Orchestration Layer           │
├─────────────────────────────────────────────────────────┤
│  LocalAI │ Qdrant │ PostgreSQL RLS │ Docker Swarm      │
└─────────────────────────────────────────────────────────┘
```

**MCP-Tool-Kategorisierung**:
1. **Development & Code**: GitHub, Filesystem (Docker), Desktop-Commander
2. **AI & Semantic**: LocalAI-Embeddings, Qdrant, Claude-Crew, Taskmaster-AI
3. **Content & Media**: Markdownify, OSP-Marketing, HyperBrowser, Magic-MCP
4. **Utility & Tools**: Toolbox, Fetch

**Multi-Tenant-Isolation**:
- PostgreSQL Row-Level Security (RLS) für Daten-Isolation
- Qdrant Namespaces für Vector-Isolation
- Docker Container-Isolation für Tool-Execution
- Kubernetes Namespace-Isolation für Compute-Resources

**LocalAI-Integration**:
- Drop-in OpenAI-Replacement mit GPU-Optional-Operation
- All-mpnet-base-v2 für deutsche Embeddings
- P2P-Inferencing für verteilte Deployments
- WebAssembly-Support via LlamaEdge für Ultra-Lightweight-Clients

## CodingGuidelines

**Adaptive Entwicklungs-Prinzipien**:
- Event-Driven-First: Alle Komponenten kommunizieren via Events
- Container-Native: Jeder MCP-Server läuft in isoliertem Container
- Multi-Tenant-by-Design: Tenant-Context in jeder Operation
- Self-Healing: Automatische Recovery-Mechanismen
- Observable: Comprehensive Logging und Monitoring

**Zero-Capital-Optimierungen**:
- Spot-Instances für 70-90% Compute-Savings
- Model-Quantization (Q4_K_M) für 95% Memory-Reduction
- Aggressive Caching für 60-80% Hit-Rates
- Batch-Processing für Inference-Effizienz

**Security-First**:
- OAuth2/OIDC mit Tenant-Scoping
- WebAuthn für Passwordless-Authentication
- End-to-End-Encryption für sensitive Daten
- Prompt-Injection-Protection für AI-Security

**Performance-Targets**:
- <200ms API-Response (95th percentile)
- 99.9% Uptime während Geschäftszeiten
- 500+ Concurrent Users bis Week 12
- <0.1% Integration-Error-Rate