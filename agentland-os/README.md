# AgentLand OS 🤖

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/agentland-os)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/agentland)

[English](#english) | [Deutsch](#deutsch)

---

## English

### Overview

AgentLand OS is a cutting-edge multi-agent operating system designed for the Saarland region. It provides a comprehensive platform for AI agent orchestration, task automation, and intelligent workflow management.

### Features

- 🚀 **Multi-Agent Architecture**: Coordinate multiple AI agents for complex tasks
- 🔄 **Dynamic Task Routing**: Intelligent task distribution based on agent capabilities
- 📊 **Real-time Monitoring**: Track agent performance and system metrics
- 🔐 **Secure Authentication**: JWT-based authentication with session management
- 🗄️ **PostgreSQL Database**: Powered by Railway for reliable data persistence
- 🎨 **Modern UI**: Built with React/Vue and Tailwind CSS
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

### Tech Stack

- **Frontend**: React/Vue.js, Vite, Tailwind CSS
- **Backend**: Node.js, Express/Fastify
- **Database**: PostgreSQL (Railway)
- **Caching**: Redis
- **Deployment**: Vercel (Frontend), Railway (Backend & Database)
- **CI/CD**: GitHub Actions

### Quick Start

#### Prerequisites

- Node.js 18.x or higher
- Docker & Docker Compose (for local development)
- Git

#### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/agentland-os.git
   cd agentland-os
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```
   
   Required environment variables:
   - `DATABASE_URL`: PostgreSQL connection string
   - `NEXTAUTH_SECRET`: Secret for NextAuth.js
   - `GOOGLE_GENERATIVE_AI_API_KEY`: Your Google Gemini API key (get it from https://makersuite.google.com/app/apikey)

4. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

5. **Run database migrations**
   ```bash
   npm run migrate:dev
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

   Visit http://localhost:3000 to see the application.

### Deployment

#### Vercel Deployment (Frontend)

1. Fork this repository
2. Connect your GitHub account to Vercel
3. Import the project
4. Configure environment variables in Vercel dashboard
5. Deploy!

#### Railway Deployment (Backend & Database)

1. Create a new Railway project
2. Add PostgreSQL service
3. Deploy from GitHub
4. Configure environment variables using Railway dashboard
5. Copy the database URL to your Vercel environment variables

### Environment Variables

See `.env.production.example` for all required environment variables.

Key variables:
- `DATABASE_URL`: Railway PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `NEXTAUTH_URL`: Your production URL
- `NEXTAUTH_SECRET`: NextAuth secret key

### API Documentation

API endpoints are documented at `/api/docs` when running in development mode.

### Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Deutsch

### Übersicht

AgentLand OS ist ein hochmodernes Multi-Agenten-Betriebssystem, das speziell für die Region Saarland entwickelt wurde. Es bietet eine umfassende Plattform für KI-Agenten-Orchestrierung, Aufgabenautomatisierung und intelligentes Workflow-Management.

### Funktionen

- 🚀 **Multi-Agenten-Architektur**: Koordination mehrerer KI-Agenten für komplexe Aufgaben
- 🔄 **Dynamisches Task-Routing**: Intelligente Aufgabenverteilung basierend auf Agenten-Fähigkeiten
- 📊 **Echtzeit-Monitoring**: Verfolgung der Agenten-Performance und Systemmetriken
- 🔐 **Sichere Authentifizierung**: JWT-basierte Authentifizierung mit Session-Management
- 🗄️ **PostgreSQL-Datenbank**: Unterstützt von Railway für zuverlässige Datenpersistenz
- 🎨 **Moderne Benutzeroberfläche**: Gebaut mit React/Vue und Tailwind CSS
- 📱 **Responsive Design**: Funktioniert nahtlos auf Desktop und mobilen Geräten

### Technologie-Stack

- **Frontend**: React/Vue.js, Vite, Tailwind CSS
- **Backend**: Node.js, Express/Fastify
- **Datenbank**: PostgreSQL (Railway)
- **Caching**: Redis
- **Deployment**: Vercel (Frontend), Railway (Backend & Datenbank)
- **CI/CD**: GitHub Actions

### Schnellstart

#### Voraussetzungen

- Node.js 18.x oder höher
- Docker & Docker Compose (für lokale Entwicklung)
- Git

#### Lokale Entwicklung

1. **Repository klonen**
   ```bash
   git clone https://github.com/yourusername/agentland-os.git
   cd agentland-os
   ```

2. **Abhängigkeiten installieren**
   ```bash
   npm install
   ```

3. **Umgebungsvariablen einrichten**
   ```bash
   cp .env.example .env
   # Bearbeiten Sie .env mit Ihrer Konfiguration
   ```

4. **Mit Docker Compose starten**
   ```bash
   docker-compose up -d
   ```

5. **Datenbankmigrationen ausführen**
   ```bash
   npm run migrate:dev
   ```

6. **Entwicklungsserver starten**
   ```bash
   npm run dev
   ```

   Besuchen Sie http://localhost:3000, um die Anwendung zu sehen.

### Deployment

#### Vercel Deployment (Frontend)

1. Forken Sie dieses Repository
2. Verbinden Sie Ihr GitHub-Konto mit Vercel
3. Importieren Sie das Projekt
4. Konfigurieren Sie Umgebungsvariablen im Vercel Dashboard
5. Deployen!

#### Railway Deployment (Backend & Datenbank)

1. Erstellen Sie ein neues Railway-Projekt
2. Fügen Sie PostgreSQL-Service hinzu
3. Deployen Sie von GitHub
4. Konfigurieren Sie Umgebungsvariablen über das Railway Dashboard
5. Kopieren Sie die Datenbank-URL in Ihre Vercel-Umgebungsvariablen

### Umgebungsvariablen

Siehe `.env.production.example` für alle erforderlichen Umgebungsvariablen.

Wichtige Variablen:
- `DATABASE_URL`: Railway PostgreSQL-Verbindungsstring
- `JWT_SECRET`: Geheimer Schlüssel für JWT-Token
- `NEXTAUTH_URL`: Ihre Produktions-URL
- `NEXTAUTH_SECRET`: NextAuth Geheimschlüssel

### API-Dokumentation

API-Endpunkte sind unter `/api/docs` dokumentiert, wenn im Entwicklungsmodus ausgeführt.

### Beitragen

1. Forken Sie das Repository
2. Erstellen Sie Ihren Feature-Branch (`git checkout -b feature/amazing-feature`)
3. Committen Sie Ihre Änderungen (`git commit -m 'Füge ein tolles Feature hinzu'`)
4. Pushen Sie zum Branch (`git push origin feature/amazing-feature`)
5. Öffnen Sie einen Pull Request

### Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe LICENSE-Datei für Details.

---

## Project Structure / Projektstruktur

```
agentland-os/
├── .github/
│   └── workflows/
│       └── deploy.yml         # CI/CD pipeline
├── api/                       # Backend API endpoints
│   ├── auth/                  # Authentication endpoints
│   ├── agents/                # Agent management
│   └── tasks/                 # Task orchestration
├── src/                       # Frontend source code
│   ├── components/            # React/Vue components
│   ├── pages/                 # Application pages
│   ├── hooks/                 # Custom hooks
│   └── utils/                 # Utility functions
├── public/                    # Static assets
├── scripts/                   # Automation scripts
│   ├── migrate.sh            # Database migration script
│   └── deploy.sh             # Deployment script
├── docker-compose.yml        # Docker configuration
├── vercel.json              # Vercel configuration
├── package.json             # Node.js dependencies
├── .env.example             # Example environment variables
├── .env.production.example  # Production environment template
└── README.md               # This file / Diese Datei
```

## Support / Unterstützung

- 📧 Email: support@agentland.saarland
- 💬 Discord: [Join our community](https://discord.gg/agentland)
- 📚 Documentation: [docs.agentland.saarland](https://docs.agentland.saarland)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/agentland-os/issues)

---

Built with ❤️ in Saarland / Gebaut mit ❤️ im Saarland

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>