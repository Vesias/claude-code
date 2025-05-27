# Environment Variables Documentation

This document provides detailed information about all environment variables used in AgentlandOS.

## Table of Contents

- [Setup Guide](#setup-guide)
- [Core Configuration](#core-configuration)
- [Database](#database)
- [Authentication](#authentication)
- [AI Services](#ai-services)
- [Infrastructure Services](#infrastructure-services)
- [MCP Tool Configuration](#mcp-tool-configuration)
- [Email Services](#email-services)
- [Payment Processing](#payment-processing)
- [Monitoring & Analytics](#monitoring--analytics)
- [Security & CORS](#security--cors)
- [Feature Flags](#feature-flags)
- [Development Tools](#development-tools)
- [German Business Integration](#german-business-integration)
- [Rate Limiting](#rate-limiting)
- [Logging](#logging)

## Setup Guide

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in the required values based on your environment

3. Never commit `.env.local` to version control

## Core Configuration

### `NEXT_PUBLIC_APP_URL`
- **Required**: Yes
- **Default**: `http://localhost:3000`
- **Description**: The base URL of your application. Used for generating absolute URLs.
- **Example**: `https://agentland.saarland`

### `NODE_ENV`
- **Required**: Yes
- **Default**: `development`
- **Options**: `development`, `production`, `test`
- **Description**: Determines the environment mode for the application

## Database

### `DATABASE_URL`
- **Required**: Yes
- **Format**: `postgresql://[user]:[password]@[host]:[port]/[database]?schema=public`
- **Description**: PostgreSQL connection string
- **Example**: `postgresql://postgres:mypassword@localhost:5433/agentlandos?schema=public`

## Authentication

### `NEXTAUTH_URL`
- **Required**: Yes
- **Default**: Same as `NEXT_PUBLIC_APP_URL`
- **Description**: The base URL for NextAuth.js callbacks

### `NEXTAUTH_SECRET`
- **Required**: Yes
- **Description**: Secret key for encrypting session tokens (minimum 32 characters)
- **Generation**: `openssl rand -base64 32`

### OAuth Providers (Optional)

#### Google OAuth
- `GOOGLE_CLIENT_ID`: OAuth client ID from Google Cloud Console
- `GOOGLE_CLIENT_SECRET`: OAuth client secret

#### GitHub OAuth
- `GITHUB_CLIENT_ID`: OAuth App ID from GitHub
- `GITHUB_CLIENT_SECRET`: OAuth App secret

## AI Services

### `GOOGLE_AI_API_KEY`
- **Required**: Yes
- **Description**: API key for Google AI (Gemini) - primary AI provider
- **Get it from**: https://makersuite.google.com/app/apikey

### `OPENAI_API_KEY`
- **Required**: No
- **Description**: OpenAI API key for fallback AI services
- **Get it from**: https://platform.openai.com/api-keys

### `OLLAMA_BASE_URL`
- **Required**: No
- **Default**: `http://localhost:11434`
- **Description**: URL for local Ollama instance

### `LOCALAI_BASE_URL`
- **Required**: No
- **Default**: `http://localhost:8080`
- **Description**: URL for LocalAI instance

## Infrastructure Services

### Qdrant Vector Database
- `QDRANT_URL`: URL for Qdrant instance (default: `http://localhost:6333`)
- `QDRANT_API_KEY`: Optional API key for secured Qdrant instances

### Redis Cache
- `REDIS_URL`: Redis connection URL (default: `redis://localhost:6379`)
- `REDIS_PASSWORD`: Optional password for secured Redis instances

### Lago Billing
- `LAGO_API_URL`: Lago API endpoint
- `LAGO_API_KEY`: Lago API authentication key

## MCP Tool Configuration

### `GITHUB_TOKEN`
- **Required**: For GitHub MCP tool
- **Description**: Personal access token for GitHub API
- **Scopes needed**: `repo`, `read:org`
- **Get it from**: https://github.com/settings/tokens

### `DESKTOP_COMMANDER_KEY`
- **Required**: For Desktop Commander tool
- **Description**: Authentication key for desktop automation

### Additional MCP Tools
- `CONTEXT7_API_KEY`: For Context7 semantic search
- `HYPERBROWSER_API_KEY`: For web automation
- `MAGIC_MCP_KEY`: For Magic MCP tool

## Email Services

### `RESEND_API_KEY`
- **Required**: Yes (for email features)
- **Description**: API key for Resend email service
- **Get it from**: https://resend.com/api-keys

### `RESEND_FROM_EMAIL`
- **Required**: Yes (for email features)
- **Default**: `noreply@agentland.saarland`
- **Description**: Verified sender email address

## Payment Processing

### Stripe Configuration
- `STRIPE_SECRET_KEY`: Secret key from Stripe Dashboard
- `STRIPE_WEBHOOK_SECRET`: Webhook endpoint secret for signature verification
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Public key for client-side Stripe.js

**Get these from**: https://dashboard.stripe.com/apikeys

## Monitoring & Analytics

### Sentry Error Tracking
- `SENTRY_DSN`: Data Source Name for error reporting
- `SENTRY_AUTH_TOKEN`: Authentication token for source maps

### PostHog Analytics
- `NEXT_PUBLIC_POSTHOG_KEY`: Project API key
- `NEXT_PUBLIC_POSTHOG_HOST`: PostHog instance URL

## Security & CORS

### `CORS_ALLOWED_ORIGINS`
- **Required**: No
- **Format**: Comma-separated list of URLs
- **Description**: Additional origins allowed for CORS
- **Example**: `https://agentland.saarland,https://app.agentland.saarland`

### `SESSION_MAX_AGE`
- **Required**: No
- **Default**: `86400` (24 hours)
- **Description**: Session duration in seconds

## Feature Flags

### `ENABLE_NEURAL_CONSCIOUSNESS`
- **Default**: `true`
- **Description**: Enable/disable neural consciousness system

### `ENABLE_MCP_TOOLS`
- **Default**: `true`
- **Description**: Enable/disable MCP tool integrations

### `ENABLE_GERMAN_LOCALIZATION`
- **Default**: `true`
- **Description**: Enable/disable German language support

### `ENABLE_ANALYTICS`
- **Default**: `false`
- **Description**: Enable/disable analytics tracking

## Development Tools

### `PRISMA_STUDIO_PORT`
- **Default**: `5555`
- **Description**: Port for Prisma Studio interface

### Docker Configuration
- `COMPOSE_PROJECT_NAME`: Docker Compose project name (default: `agentlandos`)
- `DOCKER_BUILDKIT`: Enable BuildKit for better Docker builds (default: `1`)

## German Business Integration

### DATEV Integration (Future)
- `DATEV_CLIENT_ID`: DATEV API client ID
- `DATEV_CLIENT_SECRET`: DATEV API client secret
- `DATEV_API_URL`: DATEV API endpoint

### Lexware Integration (Future)
- `LEXWARE_API_KEY`: Lexware API key
- `LEXWARE_API_URL`: Lexware API endpoint

## Rate Limiting

Configure requests per minute for different endpoint types:

- `RATE_LIMIT_AUTH`: Auth endpoints (default: `5`)
- `RATE_LIMIT_API`: General API endpoints (default: `60`)
- `RATE_LIMIT_AI`: AI tool endpoints (default: `20`)
- `RATE_LIMIT_PUBLIC`: Public endpoints (default: `100`)

## Logging

### `LOG_LEVEL`
- **Default**: `info`
- **Options**: `debug`, `info`, `warn`, `error`
- **Description**: Minimum log level to output

### `LOG_TO_FILE`
- **Default**: `true`
- **Description**: Whether to write logs to file

### `LOG_FILE_PATH`
- **Default**: `./logs/app.log`
- **Description**: Path for log file output

## Environment-Specific Configurations

### Development
```env
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/agentlandos_dev
```

### Production
```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://agentland.saarland
DATABASE_URL=postgresql://prod_user:secure_password@prod-db:5432/agentlandos
```

### Testing
```env
NODE_ENV=test
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/agentlandos_test
```

## Security Best Practices

1. **Never commit sensitive values**: Always use `.env.local` for sensitive data
2. **Use strong secrets**: Generate secure random values for secrets
3. **Rotate keys regularly**: Especially for production environments
4. **Limit scope**: Use minimal permissions for API keys
5. **Use environment-specific values**: Don't reuse keys between environments

## Troubleshooting

### Common Issues

1. **Database connection failed**
   - Check if PostgreSQL is running on the specified port
   - Verify credentials and database name
   - Ensure the database exists

2. **Authentication errors**
   - Verify `NEXTAUTH_SECRET` is at least 32 characters
   - Check `NEXTAUTH_URL` matches your application URL

3. **AI services not working**
   - Verify API keys are valid and have proper permissions
   - Check if local services (Ollama, LocalAI) are running

4. **Email not sending**
   - Verify Resend API key is valid
   - Check sender email is verified in Resend dashboard

For more help, check the logs or open an issue on GitHub.