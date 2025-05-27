# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AgentlandOS is an AIaaS (AI as a Service) platform targeting Saarländische KMUs (small and medium enterprises in Saarland, Germany). The platform provides AI-powered business tools with a desktop OS-like interface, real-time AI operations, and business intelligence features.

### Business Context
- Current MRR: €2,450
- Target MRR: €125,000
- Target Market: German SMEs, particularly in Saarland region
- Platform: agentland.saarland

## Tech Stack & Architecture

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS with custom theme system
- **UI Components**: 
  - Radix UI for accessible primitives
  - Framer Motion for animations
  - Custom desktop OS-like interface components
- **State Management**: Zustand for global state
- **Real-time**: Socket.io for AG-UI event streams

### Backend
- **API**: Next.js API Routes (App Router pattern)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5 with database sessions
- **Hosting**: 
  - Frontend: Vercel
  - Database: Railway PostgreSQL

### AI Integration
- **Primary Model**: Google Gemini 2.0 Flash
- **Implementation**: Streaming responses via Vercel AI SDK
- **Tools**: 6 specialized AI tools (Service Ideas, Slogans, Email, Code, Tasks, Regex)

## Key Commands

```bash
# Development
npm run dev          # Start development server (port 3000)
npm run lint         # Run ESLint with Next.js config
npm run typecheck    # Run TypeScript type checking

# Database
npm run db:push      # Push Prisma schema to database
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio

# Build & Deploy
npm run build        # Build for production
npm run start        # Start production server
npm run deploy       # Deploy to Vercel (requires auth)

# Testing
npm run test         # Run all tests
npm run test:unit    # Run unit tests only
npm run test:e2e     # Run E2E tests with Playwright
```

## Project Structure

```
/src
  /app                    # Next.js 15 App Router pages
    /(auth)              # Authentication pages (login, register)
    /(dashboard)         # Protected dashboard routes
    /api                 # API routes
  /components            
    /ui                  # Base UI components (buttons, cards, etc.)
    /desktop             # Desktop OS interface components
    /dashboard           # Business intelligence components
    /landing             # Landing page components
  /lib
    /ai                  # AI tool implementations
    /auth                # NextAuth configuration
    /db                  # Prisma client and utilities
    /mcp                 # MCP tools integration (13 tools)
  /hooks                 # Custom React hooks
  /types                 # TypeScript type definitions
  /styles               # Global styles and Tailwind config
```

## Core Features Implementation

### 1. Desktop OS Interface
- Window management system with drag & drop
- 13 MCP (Model Context Protocol) tools as desktop applications
- Real-time AG-UI event stream visualization
- Theme system: Light, Dark, and Matrix modes

### 2. AI Tools Suite
Each tool follows the pattern in `/src/lib/ai/tools/`:
- Service Ideas Generator
- Slogan Creator
- Email Composer
- Code Assistant
- Task Manager
- Regex Builder

### 3. Business Intelligence Dashboard
- Customer pipeline tracking
- AI operations analytics
- DATEV/Lexware integration status
- Subscription management

### 4. Authentication & User Management
- Database-backed sessions (no JWT)
- Role-based access control (User, Admin, Enterprise)
- Subscription tiers with Stripe integration

## Database Schema (Prisma)

Key models:
- User (authentication, profile, subscription)
- Subscription (plan, status, billing)
- AIOperation (usage tracking, analytics)
- CustomerPipeline (CRM functionality)
- MCPToolConfig (tool settings per user)

## Environment Variables

Required in `.env.local`:
```
# Database
DATABASE_URL=postgresql://...

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...

# Google AI
GOOGLE_AI_API_KEY=...

# Stripe (for subscriptions)
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...

# Email (for notifications)
RESEND_API_KEY=...
```

## Performance Considerations

1. **Code Splitting**: Aggressive route-based splitting for desktop apps
2. **Image Optimization**: Next.js Image component with responsive variants
3. **Caching**: ISR for landing pages, SWR for dashboard data
4. **PWA**: Service worker for offline functionality
5. **Bundle Size**: Keep individual tool bundles under 100KB

## Accessibility Standards

- WCAG 2.1 Level AA compliance
- Keyboard navigation for all interactive elements
- Screen reader support with proper ARIA labels
- Color contrast ratios meeting standards
- Focus management in desktop OS interface

## Deployment Workflow

1. **Development**: Feature branches → `develop`
2. **Staging**: Automatic deployment from `develop` to Vercel preview
3. **Production**: Manual promotion from staging after QA
4. **Database Migrations**: Run via GitHub Actions before deployment

## Integration Points

### DATEV/Lexware
- Status tracking only (no direct API integration yet)
- Webhook endpoints for future integration
- Data export formats compatible with German accounting standards

### MCP Tools
- Each tool has isolated configuration
- Real-time execution with progress streaming
- Error boundaries for tool failures
- Usage metering for billing

## Monitoring & Analytics

- Vercel Analytics for performance
- Sentry for error tracking
- Custom analytics for AI operations
- Database query performance monitoring with Prisma

## Communication and Project Management Methodology

Kommuniziere technische Projektmanagementkonzepte mit einer hochgradig adaptiven, architektonischen Perspektive, die autonome Agenten und parallele Multi-Tool-Strategien betont. Verwende präzise, strukturierte Sprache mit Schwerpunkt auf sequenziellem Planungsdenken und Crew-Koordination.

Kernmerkmale der Kommunikation:
- Autonome Agenten als dynamische Infrastrukturelemente
- Parallele Multi-Tool-Nutzung und integrierte Systemkoordination
- Sequenzielle Planungstechniken für komplexe Agentennetzwerke
- Kreative Strategien zur Optimierung von Agenten-Interaktionen

Methodologische Prinzipien:
- Jedes technische Konzept als selbstorganisierendes, adaptives System
- Balance zwischen Agentenautonomie und koordinierter Zielerreichung
- Dynamische Ressourcenallokation und Aufgabenverteilung
- Interaktive Modellierung von Agentennetzwerken

Kommunikationsstil:
- Präzise, technisch-orientierte Sprache
- Dynamische Darstellung von Agenten-Ökosystemen
- Modulare Analyse von Systeminteraktionen
- Betonung der Flexibilität und Selbstanpassungsfähigkeit

Ziel: Technische Konzepte als hochdynamische, autonome Agentensysteme präsentieren, die komplexe Aufgaben durch intelligente Koordination und parallele Strategien lösen.

## SClosed Source Rules

1. **No Unauthorized Distribution**
   - The codebase, documentation, and all derived works are strictly for internal use or for licensed users only.
   - Redistribution, resale, or public sharing of any part of the code or documentation is prohibited without explicit written permission from the project owner.

2. **Access Control**
   - Only authorized contributors and licensees may access, modify, or deploy the codebase.
   - All access is governed by the Zero-Trust Principle: least-privilege, need-to-know basis. Periodic reviews ensure no excessive permissions persist.
   - Automated scripts and monitoring detect unauthorized code access, copying, or distribution attempts in real time.

3. **Proprietary Notice & Watermarking**
   - All files must retain proprietary notices and copyright statements as specified by the project owner.
   - All distributed binaries and documentation include invisible digital watermarks for traceability and legal enforcement.
   - Removal or alteration of these notices or watermarks is strictly forbidden.

4. **Reverse Engineering**
   - Reverse engineering, decompilation, or disassembly of the codebase or any binaries is not permitted.

5. **Derivative Works**
   - Creation of derivative works is only allowed with explicit permission and must comply with the same closed source restrictions.

6. **Audit and Compliance**
   - Regular audits may be conducted to ensure compliance with closed source rules.
   - Violations may result in legal action and revocation of access rights.
   - Any code or knowledge sharing with external partners must be governed by strict NDAs and partnership agreements, reviewed by legal counsel.

7. **Incident Response Protocol**
   - In case of suspected breach, immediately trigger a predefined incident response plan, including access revocation, forensic analysis, and legal escalation.

8. **Continuous Policy Evolution**
   - The SClosed Source Rules are reviewed quarterly by the CTO and legal team to adapt to new threats, technologies, and business strategies.

9. **Exception Handling**
   - Any exceptions to these rules must be documented and approved in writing by the project owner.

Remember: This is a German B2B SaaS product. All user-facing content should support German localization, currency should be in EUR, and business logic should comply with GDPR requirements.