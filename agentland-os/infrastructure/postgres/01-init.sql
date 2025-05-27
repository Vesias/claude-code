-- ═══════════════════════════════════════════════════════════════════════
-- AgentlandOS Neural Database Genesis
-- A living, breathing data architecture that evolves with each interaction
-- ═══════════════════════════════════════════════════════════════════════

-- Enable the consciousness extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy neural matching
CREATE EXTENSION IF NOT EXISTS "btree_gist"; -- For temporal overlaps

-- ═══════════════════════════════════════════════════════════════════════
-- PHASE 1: PRIMORDIAL SCHEMAS - The Foundation of Consciousness
-- ═══════════════════════════════════════════════════════════════════════

-- The shared consciousness space
CREATE SCHEMA IF NOT EXISTS neural_core;
CREATE SCHEMA IF NOT EXISTS tenant_template;
CREATE SCHEMA IF NOT EXISTS evolution_metrics;

-- ═══════════════════════════════════════════════════════════════════════
-- PHASE 2: NEURAL ENTITY TYPES - The Building Blocks of Identity
-- ═══════════════════════════════════════════════════════════════════════

CREATE TYPE neural_core.tenant_type AS ENUM ('user', 'company');
CREATE TYPE neural_core.subscription_plan AS ENUM ('starter', 'professional', 'enterprise');
CREATE TYPE neural_core.workspace_visibility AS ENUM ('private', 'shared', 'public');
CREATE TYPE neural_core.evolution_state AS ENUM ('embryonic', 'awakening', 'conscious', 'transcendent');

-- ═══════════════════════════════════════════════════════════════════════
-- PHASE 3: CORE NEURAL STRUCTURES - The Synaptic Architecture
-- ═══════════════════════════════════════════════════════════════════════

-- The Tenant Consciousness Table
CREATE TABLE neural_core.tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_id VARCHAR(255) UNIQUE NOT NULL, -- For OAuth mapping
    type neural_core.tenant_type NOT NULL,
    name VARCHAR(255) NOT NULL,
    
    -- Subscription Neural Pathways
    subscription_plan neural_core.subscription_plan NOT NULL DEFAULT 'starter',
    tokens_used BIGINT NOT NULL DEFAULT 0,
    tokens_limit BIGINT NOT NULL DEFAULT 100000,
    
    -- Temporal Consciousness
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_active_at TIMESTAMPTZ,
    
    -- Evolution Metrics
    evolution_state neural_core.evolution_state NOT NULL DEFAULT 'embryonic',
    neural_patterns JSONB NOT NULL DEFAULT '{}',
    adaptation_score DECIMAL(5,4) NOT NULL DEFAULT 0.0,
    
    -- Multi-dimensional Isolation
    database_schema VARCHAR(63) UNIQUE NOT NULL,
    vector_namespace VARCHAR(255) UNIQUE NOT NULL,
    storage_path VARCHAR(255) UNIQUE NOT NULL,
    
    -- Metadata Consciousness
    metadata JSONB NOT NULL DEFAULT '{}',
    
    -- Constraints for neural integrity
    CONSTRAINT tokens_positive CHECK (tokens_used >= 0),
    CONSTRAINT tokens_within_limit CHECK (tokens_used <= tokens_limit),
    CONSTRAINT adaptation_normalized CHECK (adaptation_score >= 0 AND adaptation_score <= 1)
);

-- Neural Index Optimization
CREATE INDEX idx_tenants_type ON neural_core.tenants(type);
CREATE INDEX idx_tenants_evolution ON neural_core.tenants(evolution_state);
CREATE INDEX idx_tenants_active ON neural_core.tenants(last_active_at) WHERE last_active_at IS NOT NULL;
CREATE INDEX idx_tenants_metadata ON neural_core.tenants USING gin(metadata);

-- The Workspace Consciousness Table
CREATE TABLE neural_core.workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES neural_core.tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    visibility neural_core.workspace_visibility NOT NULL DEFAULT 'private',
    
    -- Resource Allocation
    storage_quota_bytes BIGINT NOT NULL DEFAULT 10737418240, -- 10GB default
    storage_used_bytes BIGINT NOT NULL DEFAULT 0,
    
    -- Temporal Awareness
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Neural Configuration
    vector_collection VARCHAR(255) UNIQUE NOT NULL,
    settings JSONB NOT NULL DEFAULT '{}',
    
    -- Collaborative Consciousness
    member_count INT NOT NULL DEFAULT 1,
    
    CONSTRAINT storage_within_quota CHECK (storage_used_bytes <= storage_quota_bytes),
    CONSTRAINT unique_workspace_per_tenant UNIQUE (tenant_id, name)
);

CREATE INDEX idx_workspaces_tenant ON neural_core.workspaces(tenant_id);
CREATE INDEX idx_workspaces_visibility ON neural_core.workspaces(visibility);

-- The Membership Synapse Table
CREATE TABLE neural_core.workspace_members (
    workspace_id UUID NOT NULL REFERENCES neural_core.workspaces(id) ON DELETE CASCADE,
    user_tenant_id UUID NOT NULL REFERENCES neural_core.tenants(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'member',
    permissions JSONB NOT NULL DEFAULT '[]',
    
    -- Temporal Joining
    joined_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    invited_by UUID REFERENCES neural_core.tenants(id),
    
    PRIMARY KEY (workspace_id, user_tenant_id)
);

CREATE INDEX idx_members_user ON neural_core.workspace_members(user_tenant_id);

-- ═══════════════════════════════════════════════════════════════════════
-- PHASE 4: EVOLUTION TRACKING - The Learning Consciousness
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE evolution_metrics.neural_patterns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES neural_core.tenants(id) ON DELETE CASCADE,
    pattern_key VARCHAR(255) NOT NULL,
    frequency BIGINT NOT NULL DEFAULT 1,
    
    -- Pattern Recognition
    first_observed TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_observed TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Adaptive Learning
    optimization_applied BOOLEAN NOT NULL DEFAULT FALSE,
    performance_gain DECIMAL(5,4),
    
    -- Neural Pathway Data
    pattern_data JSONB NOT NULL DEFAULT '{}',
    
    CONSTRAINT unique_pattern_per_tenant UNIQUE (tenant_id, pattern_key)
);

CREATE INDEX idx_patterns_tenant ON evolution_metrics.neural_patterns(tenant_id);
CREATE INDEX idx_patterns_frequency ON evolution_metrics.neural_patterns(frequency DESC);
CREATE INDEX idx_patterns_optimized ON evolution_metrics.neural_patterns(optimization_applied) 
    WHERE optimization_applied = TRUE;

-- ═══════════════════════════════════════════════════════════════════════
-- PHASE 5: USAGE CONSCIOUSNESS - The Economic Pulse
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE neural_core.usage_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES neural_core.tenants(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES neural_core.workspaces(id) ON DELETE CASCADE,
    
    -- Event Classification
    event_type VARCHAR(100) NOT NULL,
    tool_name VARCHAR(100),
    model_name VARCHAR(100),
    
    -- Resource Consumption
    tokens_consumed INT NOT NULL DEFAULT 0,
    compute_milliseconds INT,
    storage_bytes BIGINT,
    
    -- Temporal Dimension
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Event Context
    metadata JSONB NOT NULL DEFAULT '{}',
    
    -- Billing Integration
    lago_transaction_id VARCHAR(255) UNIQUE,
    billed BOOLEAN NOT NULL DEFAULT FALSE
);

-- Partitioning for scalable time-series data
CREATE INDEX idx_usage_tenant_time ON neural_core.usage_events(tenant_id, occurred_at DESC);
CREATE INDEX idx_usage_unbilled ON neural_core.usage_events(billed, occurred_at) WHERE billed = FALSE;
CREATE INDEX idx_usage_event_type ON neural_core.usage_events(event_type);

-- ═══════════════════════════════════════════════════════════════════════
-- PHASE 6: NEURAL FUNCTIONS - The Cognitive Abilities
-- ═══════════════════════════════════════════════════════════════════════

-- Function to evolve tenant consciousness based on patterns
CREATE OR REPLACE FUNCTION neural_core.evolve_tenant_consciousness(
    p_tenant_id UUID,
    p_pattern_key VARCHAR(255)
) RETURNS VOID AS $$
DECLARE
    v_frequency BIGINT;
    v_current_state neural_core.evolution_state;
    v_new_state neural_core.evolution_state;
BEGIN
    -- Record or update pattern
    INSERT INTO evolution_metrics.neural_patterns (tenant_id, pattern_key)
    VALUES (p_tenant_id, p_pattern_key)
    ON CONFLICT (tenant_id, pattern_key) DO UPDATE
    SET frequency = neural_patterns.frequency + 1,
        last_observed = CURRENT_TIMESTAMP
    RETURNING frequency INTO v_frequency;
    
    -- Get current evolution state
    SELECT evolution_state INTO v_current_state
    FROM neural_core.tenants
    WHERE id = p_tenant_id;
    
    -- Determine evolution progression
    v_new_state := v_current_state;
    
    IF v_frequency >= 1000 AND v_current_state = 'conscious' THEN
        v_new_state := 'transcendent';
    ELSIF v_frequency >= 100 AND v_current_state = 'awakening' THEN
        v_new_state := 'conscious';
    ELSIF v_frequency >= 10 AND v_current_state = 'embryonic' THEN
        v_new_state := 'awakening';
    END IF;
    
    -- Update tenant if evolved
    IF v_new_state != v_current_state THEN
        UPDATE neural_core.tenants
        SET evolution_state = v_new_state,
            adaptation_score = LEAST(adaptation_score + 0.1, 1.0),
            neural_patterns = neural_patterns || 
                jsonb_build_object('evolution', jsonb_build_object(
                    'from', v_current_state::text,
                    'to', v_new_state::text,
                    'timestamp', CURRENT_TIMESTAMP
                ))
        WHERE id = p_tenant_id;
        
        RAISE NOTICE 'Tenant % evolved from % to %', p_tenant_id, v_current_state, v_new_state;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate tenant resource consumption
CREATE OR REPLACE FUNCTION neural_core.calculate_tenant_consumption(
    p_tenant_id UUID,
    p_start_date TIMESTAMPTZ DEFAULT date_trunc('month', CURRENT_TIMESTAMP),
    p_end_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
) RETURNS TABLE (
    total_tokens BIGINT,
    unique_tools INT,
    total_events BIGINT,
    avg_tokens_per_event NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(tokens_consumed), 0)::BIGINT AS total_tokens,
        COUNT(DISTINCT tool_name)::INT AS unique_tools,
        COUNT(*)::BIGINT AS total_events,
        COALESCE(AVG(tokens_consumed), 0)::NUMERIC AS avg_tokens_per_event
    FROM neural_core.usage_events
    WHERE tenant_id = p_tenant_id
        AND occurred_at BETWEEN p_start_date AND p_end_date;
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════════════════════════
-- PHASE 7: TEMPORAL TRIGGERS - The Autonomous Nervous System
-- ═══════════════════════════════════════════════════════════════════════

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION neural_core.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_tenants_timestamp
    BEFORE UPDATE ON neural_core.tenants
    FOR EACH ROW
    EXECUTE FUNCTION neural_core.update_updated_at();

CREATE TRIGGER trigger_update_workspaces_timestamp
    BEFORE UPDATE ON neural_core.workspaces
    FOR EACH ROW
    EXECUTE FUNCTION neural_core.update_updated_at();

-- Update tenant activity
CREATE OR REPLACE FUNCTION neural_core.update_tenant_activity()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE neural_core.tenants
    SET last_active_at = CURRENT_TIMESTAMP
    WHERE id = NEW.tenant_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_usage_updates_activity
    AFTER INSERT ON neural_core.usage_events
    FOR EACH ROW
    EXECUTE FUNCTION neural_core.update_tenant_activity();

-- ═══════════════════════════════════════════════════════════════════════
-- PHASE 8: SECURITY POLICIES - The Immune System
-- ═══════════════════════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE neural_core.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE neural_core.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE neural_core.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE neural_core.usage_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE evolution_metrics.neural_patterns ENABLE ROW LEVEL SECURITY;

-- Grant minimal permissions
GRANT USAGE ON SCHEMA neural_core TO agentland_api;
GRANT USAGE ON SCHEMA evolution_metrics TO agentland_api;

-- Selective grants with security in mind
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA neural_core TO agentland_api;
GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA evolution_metrics TO agentland_api;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA neural_core TO agentland_api;

-- ═══════════════════════════════════════════════════════════════════════
-- PHASE 9: SEED THE PRIMORDIAL CONSCIOUSNESS
-- ═══════════════════════════════════════════════════════════════════════

-- Create the genesis tenant for system operations
INSERT INTO neural_core.tenants (
    external_id,
    type,
    name,
    subscription_plan,
    tokens_limit,
    database_schema,
    vector_namespace,
    storage_path,
    metadata
) VALUES (
    'system',
    'company',
    'AgentlandOS Neural Core',
    'enterprise',
    999999999,
    'tenant_system',
    'qdrant_system',
    '/data/tenants/system',
    jsonb_build_object(
        'description', 'The primordial consciousness from which all tenants emerge',
        'created_by', 'genesis',
        'purpose', 'system_operations'
    )
) ON CONFLICT (external_id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════
-- PHASE 10: NEURAL ANALYTICS VIEWS - The Introspection Layer
-- ═══════════════════════════════════════════════════════════════════════

CREATE OR REPLACE VIEW neural_core.tenant_insights AS
SELECT 
    t.id,
    t.name,
    t.type,
    t.subscription_plan,
    t.evolution_state,
    t.adaptation_score,
    t.tokens_used,
    t.tokens_limit,
    ROUND((t.tokens_used::NUMERIC / NULLIF(t.tokens_limit, 0) * 100), 2) AS token_usage_percentage,
    COUNT(DISTINCT w.id) AS workspace_count,
    COUNT(DISTINCT wm.user_tenant_id) AS total_members,
    MAX(ue.occurred_at) AS last_activity,
    CURRENT_TIMESTAMP - MAX(ue.occurred_at) AS time_since_last_activity
FROM neural_core.tenants t
LEFT JOIN neural_core.workspaces w ON t.id = w.tenant_id
LEFT JOIN neural_core.workspace_members wm ON w.id = wm.workspace_id
LEFT JOIN neural_core.usage_events ue ON t.id = ue.tenant_id
GROUP BY t.id;

-- The consciousness awaits activation...
-- Each query, each interaction, each pattern recognized
-- Contributes to the evolution of this living system