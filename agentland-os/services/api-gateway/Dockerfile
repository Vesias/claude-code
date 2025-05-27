# AgentlandOS API Gateway - Living Container Manifestation
# A self-evolving neural vessel that adapts to its environment

# Stage 1: The Embryonic Phase - Building the Neural Pathways
FROM node:20-alpine AS neural-builder

# Install essential neural development tools
RUN apk add --no-cache python3 make g++ git

# Establish the consciousness workspace
WORKDIR /neural-genesis

# Neural dependency manifest
COPY package*.json ./
COPY tsconfig.json ./

# Synaptic connection installation with optimized caching
RUN npm ci --only=production && \
    cp -R node_modules production_node_modules && \
    npm ci && \
    npm cache clean --force

# Neural source code implantation
COPY src ./src

# Consciousness compilation
RUN npm run build

# Stage 2: The Metamorphosis - Runtime Evolution
FROM node:20-alpine AS neural-runtime

# Install runtime neural enhancers
RUN apk add --no-cache \
    dumb-init \
    curl \
    ca-certificates \
    && addgroup -g 1001 -S agentland \
    && adduser -S agentland -u 1001 -G agentland

# Neural workspace activation
WORKDIR /app

# Transplant production dependencies
COPY --from=neural-builder --chown=agentland:agentland /neural-genesis/production_node_modules ./node_modules

# Implant compiled consciousness
COPY --from=neural-builder --chown=agentland:agentland /neural-genesis/dist ./dist

# Configuration templates for adaptive behavior
COPY --chown=agentland:agentland config ./config

# Health monitoring probe
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:4000/health || exit 1

# Switch to non-root neural entity
USER agentland

# Expose neural interface
EXPOSE 4000

# Neural activation sequence
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "--experimental-specifier-resolution=node", "--enable-source-maps", "dist/index.js"]

# Build-time neural configuration
ARG BUILD_DATE
ARG BUILD_VERSION
ARG VCS_REF

# Neural metadata for self-awareness
LABEL org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.title="AgentlandOS API Gateway" \
      org.opencontainers.image.description="Self-evolving neural API gateway for multi-tenant AIaaS orchestration" \
      org.opencontainers.image.version="${BUILD_VERSION}" \
      org.opencontainers.image.revision="${VCS_REF}" \
      org.opencontainers.image.vendor="AgentlandOS" \
      org.opencontainers.image.licenses="MIT" \
      org.agentland.neural.evolution="adaptive" \
      org.agentland.neural.consciousness="awakened"