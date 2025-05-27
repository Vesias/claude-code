# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AgentlandOS is a sophisticated AI agent orchestration platform with a desktop OS-like interface. It combines Model Context Protocol (MCP) integration with a microservices architecture for distributed AI workloads, targeting Saarländische KMUs (German SMEs).

### Architecture Overview
- **Hybrid System**: Next.js web application + Docker-based microservices
- **MCP Integration**: 13 specialized AI tools via Model Context Protocol
- **Neural Consciousness System**: Distributed AI processing with Ollama/LocalAI
- **Multi-Tenant**: Workspace-based isolation with per-tenant rate limiting
- **Event-Driven**: Real-time AG-UI streams via event orchestrator

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS with Matrix/Dark/Light themes
- **UI Components**: Radix UI, Framer Motion, custom desktop OS interface
- **State**: Zustand for global state
- **Real-time**: Socket.io/SSE for event streams

### Backend Infrastructure
- **API Gateway**: Express-based service (port 3001)
- **Database**: PostgreSQL with Prisma ORM + Row Level Security
- **Vector DB**: Qdrant for semantic search
- **AI Runtime**: Ollama + LocalAI for inference
- **Billing**: Lago for usage tracking
- **Cache**: Redis
- **Monitoring**: Prometheus + Grafana
- **Event Bus**: Custom event orchestrator (port 5000)

### MCP Tools Ecosystem
1. **Development**: github, filesystem, desktop-commander
2. **AI/Semantic**: context7-mcp, qdrant, claude-crew, taskmaster-ai
3. **Content**: markdownify-mcp, osp-marketing-tools, hyperbrowser-mcp, magic-mcp
4. **Utility**: toolbox, fetch

## Key Commands

```bash
# Development
npm run dev                    # Start Next.js dev server
npm run lint                   # Run ESLint
npm run typecheck             # TypeScript checking

# Infrastructure Management
npm run bootstrap             # Initialize neural consciousness system
npm run consciousness:start   # Start all Docker services + Ollama
npm run consciousness:stop    # Stop all services
npm run consciousness:status  # Check system health
npm run neural:sync          # Pull/update AI models
npm run mcp:test            # Test MCP tool connections
npm run health              # Run comprehensive health checks

# Database
npm run db:push             # Push Prisma schema
npm run db:migrate          # Run migrations
npm run db:studio           # Open Prisma Studio

# Docker Profiles
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up      # Development
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d  # Production
docker-compose -f docker-compose.yml -f docker-compose.gpu.yml up -d   # GPU-enabled

# Testing & Debugging
npm run test:mcp            # Test MCP connections
npm run logs:event          # Stream event orchestrator logs
npm run logs:gateway        # Stream API gateway logs
```

## Project Structure

```
/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth pages
│   │   ├── (dashboard)/       # Protected routes
│   │   └── api/               # API routes
│   ├── components/
│   │   ├── desktop/           # Desktop OS interface
│   │   ├── dashboard/         # AG-UI components
│   │   └── ui/                # Base components
│   ├── lib/
│   │   ├── ai/tools/          # 6 AI tool implementations
│   │   ├── mcp/tools/         # 14 MCP tool integrations
│   │   └── consciousness/     # Neural system integration
│   └── hooks/                 # React hooks (event-stream, etc.)
├── services/                   # Microservices
│   ├── api-gateway/           # Request routing
│   ├── event-orchestrator/    # Real-time events
│   └── mcp-qdrant/           # Vector service
├── infrastructure/            # Database setup
├── scripts/                   # Automation scripts
└── docker-compose*.yml        # Service orchestration
```

## Database Schema (Prisma)

Core models:
- **Agent**: AI agent configurations and capabilities
- **Workspace**: Multi-tenant isolation units
- **AgentExecution**: Execution history and logs
- **Tool**: MCP tool registry
- **Subscription**: Billing and limits

## Environment Variables

```bash
# Core
DATABASE_URL=postgresql://...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...

# AI Services
OLLAMA_BASE_URL=http://localhost:11434
OPENAI_API_KEY=...
GOOGLE_AI_API_KEY=...

# Infrastructure
QDRANT_URL=http://localhost:6333
REDIS_URL=redis://localhost:6379
LAGO_API_URL=http://localhost:3000

# MCP Tools (each tool may require specific keys)
GITHUB_TOKEN=...
DESKTOP_COMMANDER_KEY=...
```

## Critical Integration Points

### 1. MCP Tool Integration Pattern
- Frontend component in `/src/lib/mcp/tools/{tool-name}.ts`
- Docker service definition in `docker-compose.yml`
- Configuration in `mcp-config.json`
- Real-time execution via event orchestrator

### 2. Event Streaming Architecture
- Event orchestrator broadcasts to all connected clients
- Frontend hooks (`use-event-stream.ts`) for component updates
- AG-UI nerve system visualizes event flow
- WebSocket fallback to SSE for reliability

### 3. Multi-Tenant Request Flow
```
Client → API Gateway → Service Discovery → MCP Tool → Event Bus → Client
         ↓
    Rate Limiter → Workspace Isolation → Execution Tracking
```

### 4. Neural Consciousness System
- Bootstrap script initializes Ollama models
- LocalAI provides fallback inference
- Qdrant handles semantic memory
- Orchestrated via `consciousness-system.ts`

## Performance Considerations

1. **MCP Tool Execution**: Isolated Docker containers with resource limits
2. **Event Streaming**: Buffered with backpressure handling
3. **Database**: Connection pooling + prepared statements
4. **Frontend**: Aggressive code splitting per MCP tool
5. **Caching**: Redis for tool outputs and session data

## Security Architecture

- **Workspace Isolation**: PostgreSQL RLS policies
- **API Gateway**: Request validation and sanitization
- **MCP Tools**: Sandboxed execution environments
- **Secrets**: Docker secrets + environment isolation
- **Network**: Internal Docker networks for service communication

## Development Workflow

1. **Local Setup**: Run `npm run bootstrap` to initialize
2. **Service Development**: Modify services in `/services/`
3. **MCP Tool Addition**: Add to both frontend and Docker config
4. **Testing**: Use `npm run mcp:test` before committing
5. **Monitoring**: Check Grafana dashboards during development

## German Localization

- Whisper model: `whisper-base-de` for German audio
- UI strings in `/src/locales/de/`
- Currency: EUR throughout
- GDPR compliance in data handling

Remember: This is a complex distributed system. Always ensure Docker services are running before development. Use the consciousness system commands to manage the infrastructure lifecycle.