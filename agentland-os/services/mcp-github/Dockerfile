FROM node:20-alpine

WORKDIR /app

# Install dependencies
RUN npm install -g @auchenberg/claude-code-mcp@latest

# Create entrypoint script
RUN echo '#!/bin/sh' > /app/entrypoint.sh && \
    echo 'exec npx @auchenberg/claude-code-mcp serve' >> /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

EXPOSE 3000

ENTRYPOINT ["/app/entrypoint.sh"]