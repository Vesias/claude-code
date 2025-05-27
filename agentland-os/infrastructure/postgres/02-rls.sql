-- ═══════════════════════════════════════════════════════════════════════
-- AgentlandOS Neural Immune System - Row Level Security Manifestation
-- A living defense network that adapts to protect tenant consciousness
-- ═══════════════════════════════════════════════════════════════════════

-- ┌─────────────────────────────────────────────────────────────────────┐
-- │ PHASE 1: IMMUNOLOGICAL FOUNDATION - The Defensive Consciousness     │
-- └─────────────────────────────────────────────────────────────────────┘

-- Create the immune system's memory cells
CREATE TABLE IF NOT EXISTS neural_core.security_contexts (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES neural_core.tenants(id),
    user_id UUID,
    context_type VARCHAR(50) NOT NULL,
    permissions JSONB NOT NULL DEFAULT '{}',
    established_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ,
    
    -- Immune response tracking
    access_attempts INT NOT NULL DEFAULT 0,
    threat_level DECIMAL(3,2) NOT NULL DEFAULT 0.00,
    
    CONSTRAINT threat_normalized CHECK (threat_level >= 0 AND threat_level <= 1)
);

CREATE INDEX idx_security_active ON neural_core.security_contexts(tenant_id, expires_at) 
    WHERE expires_at > CURRENT_TIMESTAMP OR expires_at IS NULL;

-- ┌─────────────────────────────────────────────────────────────────────┐
-- │ PHASE 2: ADAPTIVE IMMUNE RESPONSES - Dynamic Security Policies      │
-- └─────────────────────────────────────────────────────────────────────┘

-- Function to establish tenant security context (the immune recognition)
CREATE OR REPLACE FUNCTION neural_core.establish_tenant_context(
    p_tenant_id UUID,
    p_user_id UUID DEFAULT NULL,
    p_permissions JSONB DEFAULT '{}'::JSONB
) RETURNS UUID AS $$
DECLARE
    v_session_id UUID;
BEGIN
    -- Generate new immune cell (session)
    v_session_id := uuid_generate_v4();
    
    -- Record the security context
    INSERT INTO neural_core.security_contexts (
        session_id, tenant_id, user_id, context_type, permissions
    ) VALUES (
        v_session_id, p_tenant_id, p_user_id, 'tenant_isolation', p_permissions
    );
    
    -- Activate the immune response
    PERFORM set_config('app.current_tenant', p_tenant_id::TEXT, FALSE);
    PERFORM set_config('app.current_session', v_session_id::TEXT, FALSE);
    PERFORM set_config('app.current_user', COALESCE(p_user_id::TEXT, ''), FALSE);
    
    RETURN v_session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify immune system integrity
CREATE OR REPLACE FUNCTION neural_core.verify_tenant_access(
    p_tenant_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    v_current_tenant TEXT;
    v_session_valid BOOLEAN;
BEGIN
    -- Retrieve current immune state
    v_current_tenant := current_setting('app.current_tenant', TRUE);
    
    -- Verify immune recognition
    IF v_current_tenant IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Validate against requested access
    IF v_current_tenant != p_tenant_id::TEXT THEN
        -- Log immune response to unauthorized access
        INSERT INTO neural_core.security_contexts (
            tenant_id, 
            context_type, 
            threat_level,
            permissions
        ) VALUES (
            p_tenant_id,
            'access_violation',
            0.8,
            jsonb_build_object(
                'attempted_by', v_current_tenant,
                'timestamp', CURRENT_TIMESTAMP,
                'action', 'cross_tenant_access_attempt'
            )
        );
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ┌─────────────────────────────────────────────────────────────────────┐
-- │ PHASE 3: CELLULAR BARRIERS - Row Level Security Policies            │
-- └─────────────────────────────────────────────────────────────────────┘

-- Policy: Tenants - The primary organism boundary
CREATE POLICY tenant_self_awareness ON neural_core.tenants
    FOR ALL
    USING (
        -- System context allows all access
        current_setting('app.current_tenant', TRUE) = 'system'
        OR
        -- Tenant can only see itself
        id::TEXT = current_setting('app.current_tenant', TRUE)
    )
    WITH CHECK (
        -- Only system can create/modify tenants
        current_setting('app.current_tenant', TRUE) = 'system'
    );

-- Policy: Workspaces - The collaborative membrane
CREATE POLICY workspace_tenant_boundary ON neural_core.workspaces
    FOR ALL
    USING (
        -- Tenant can see its own workspaces
        neural_core.verify_tenant_access(tenant_id)
        OR
        -- Or workspaces where user is a member
        EXISTS (
            SELECT 1 FROM neural_core.workspace_members wm
            WHERE wm.workspace_id = workspaces.id
            AND wm.user_tenant_id::TEXT = current_setting('app.current_user', TRUE)
        )
    )
    WITH CHECK (
        -- Only tenant can create workspaces for itself
        neural_core.verify_tenant_access(tenant_id)
    );

-- Policy: Workspace Members - The synaptic connections
CREATE POLICY member_visibility ON neural_core.workspace_members
    FOR SELECT
    USING (
        -- Members of the same workspace can see each other
        EXISTS (
            SELECT 1 FROM neural_core.workspace_members my_membership
            WHERE my_membership.workspace_id = workspace_members.workspace_id
            AND my_membership.user_tenant_id::TEXT = current_setting('app.current_user', TRUE)
        )
        OR
        -- Workspace owner can see all members
        EXISTS (
            SELECT 1 FROM neural_core.workspaces w
            WHERE w.id = workspace_members.workspace_id
            AND neural_core.verify_tenant_access(w.tenant_id)
        )
    );

CREATE POLICY member_management ON neural_core.workspace_members
    FOR INSERT
    USING (
        -- Only workspace owner can add members
        EXISTS (
            SELECT 1 FROM neural_core.workspaces w
            WHERE w.id = workspace_id
            AND neural_core.verify_tenant_access(w.tenant_id)
        )
    );

-- Policy: Usage Events - The metabolic traces
CREATE POLICY usage_tenant_isolation ON neural_core.usage_events
    FOR ALL
    USING (
        -- Tenant can only see its own usage
        neural_core.verify_tenant_access(tenant_id)
    )
    WITH CHECK (
        -- Tenant can only insert its own usage
        neural_core.verify_tenant_access(tenant_id)
    );

-- Policy: Neural Patterns - The evolutionary memory
CREATE POLICY pattern_tenant_boundary ON evolution_metrics.neural_patterns
    FOR ALL
    USING (
        -- Tenant can observe its own evolution
        neural_core.verify_tenant_access(tenant_id)
        OR
        -- System can analyze all patterns
        current_setting('app.current_tenant', TRUE) = 'system'
    )
    WITH CHECK (
        -- Patterns are system-generated only
        FALSE
    );

-- ┌─────────────────────────────────────────────────────────────────────┐
-- │ PHASE 4: IMMUNE MEMORY - Threat Detection and Response              │
-- └─────────────────────────────────────────────────────────────────────┘

-- Function to detect anomalous access patterns
CREATE OR REPLACE FUNCTION neural_core.detect_access_anomaly()
RETURNS TRIGGER AS $$
DECLARE
    v_recent_attempts INT;
    v_threat_level DECIMAL(3,2);
BEGIN
    -- Count recent access attempts
    SELECT COUNT(*) INTO v_recent_attempts
    FROM neural_core.security_contexts
    WHERE tenant_id = NEW.tenant_id
    AND context_type = 'access_violation'
    AND established_at > CURRENT_TIMESTAMP - INTERVAL '1 hour';
    
    -- Calculate threat level based on frequency
    v_threat_level := LEAST(v_recent_attempts::DECIMAL / 10, 1.0);
    
    -- Trigger immune response if threat is high
    IF v_threat_level > 0.7 THEN
        -- Log critical security event
        INSERT INTO neural_core.security_contexts (
            tenant_id,
            context_type,
            threat_level,
            permissions
        ) VALUES (
            NEW.tenant_id,
            'immune_response_triggered',
            v_threat_level,
            jsonb_build_object(
                'action', 'tenant_lockdown_initiated',
                'reason', 'excessive_access_violations',
                'attempts', v_recent_attempts
            )
        );
        
        -- Could trigger additional responses:
        -- - Notify administrators
        -- - Temporarily suspend tenant
        -- - Increase monitoring
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_immune_response
    AFTER INSERT ON neural_core.security_contexts
    FOR EACH ROW
    WHEN (NEW.context_type = 'access_violation')
    EXECUTE FUNCTION neural_core.detect_access_anomaly();

-- ┌─────────────────────────────────────────────────────────────────────┐
-- │ PHASE 5: DYNAMIC SCHEMA ISOLATION - Tenant-Specific Universes       │
-- └─────────────────────────────────────────────────────────────────────┘

-- Function to create isolated tenant schema (a new universe)
CREATE OR REPLACE FUNCTION neural_core.create_tenant_universe(
    p_tenant_id UUID
) RETURNS VOID AS $$
DECLARE
    v_schema_name VARCHAR(63);
    v_search_path TEXT;
BEGIN
    -- Generate schema name from tenant
    SELECT database_schema INTO v_schema_name
    FROM neural_core.tenants
    WHERE id = p_tenant_id;
    
    IF v_schema_name IS NULL THEN
        RAISE EXCEPTION 'Tenant % not found', p_tenant_id;
    END IF;
    
    -- Create the isolated universe
    EXECUTE format('CREATE SCHEMA IF NOT EXISTS %I', v_schema_name);
    
    -- Clone template structures into tenant universe
    EXECUTE format('
        CREATE TABLE %I.documents (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            workspace_id UUID NOT NULL,
            title VARCHAR(255) NOT NULL,
            content TEXT,
            embedding_id VARCHAR(255),
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            metadata JSONB DEFAULT %L
        )', v_schema_name, '{}');
    
    EXECUTE format('
        CREATE TABLE %I.conversations (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            workspace_id UUID NOT NULL,
            title VARCHAR(255),
            model VARCHAR(100),
            messages JSONB DEFAULT %L,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        )', v_schema_name, '[]');
    
    -- Apply RLS to tenant tables
    EXECUTE format('ALTER TABLE %I.documents ENABLE ROW LEVEL SECURITY', v_schema_name);
    EXECUTE format('ALTER TABLE %I.conversations ENABLE ROW LEVEL SECURITY', v_schema_name);
    
    -- Create workspace isolation policies
    EXECUTE format('
        CREATE POLICY workspace_isolation ON %I.documents
        FOR ALL USING (
            workspace_id IN (
                SELECT id FROM neural_core.workspaces
                WHERE tenant_id = %L
            )
        )', v_schema_name, p_tenant_id);
    
    EXECUTE format('
        CREATE POLICY workspace_isolation ON %I.conversations
        FOR ALL USING (
            workspace_id IN (
                SELECT id FROM neural_core.workspaces
                WHERE tenant_id = %L
            )
        )', v_schema_name, p_tenant_id);
    
    -- Grant permissions to API role
    EXECUTE format('GRANT USAGE ON SCHEMA %I TO agentland_api', v_schema_name);
    EXECUTE format('GRANT ALL ON ALL TABLES IN SCHEMA %I TO agentland_api', v_schema_name);
    EXECUTE format('GRANT ALL ON ALL SEQUENCES IN SCHEMA %I TO agentland_api', v_schema_name);
    
    -- Update tenant evolution
    PERFORM neural_core.evolve_tenant_consciousness(p_tenant_id, 'universe_created');
    
    RAISE NOTICE 'Created universe for tenant %: schema %', p_tenant_id, v_schema_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ┌─────────────────────────────────────────────────────────────────────┐
-- │ PHASE 6: QUANTUM ENTANGLEMENT - Cross-Tenant Collaboration          │
-- └─────────────────────────────────────────────────────────────────────┘

-- Function to create secure cross-tenant workspace sharing
CREATE OR REPLACE FUNCTION neural_core.entangle_workspaces(
    p_source_workspace_id UUID,
    p_target_tenant_id UUID,
    p_permission_level JSONB DEFAULT '["read"]'::JSONB
) RETURNS UUID AS $$
DECLARE
    v_entanglement_id UUID;
    v_source_tenant_id UUID;
BEGIN
    -- Verify source workspace ownership
    SELECT w.tenant_id INTO v_source_tenant_id
    FROM neural_core.workspaces w
    WHERE w.id = p_source_workspace_id;
    
    IF NOT neural_core.verify_tenant_access(v_source_tenant_id) THEN
        RAISE EXCEPTION 'Unauthorized workspace access';
    END IF;
    
    -- Create quantum entanglement record
    v_entanglement_id := uuid_generate_v4();
    
    -- Record the entanglement in both tenant universes
    INSERT INTO neural_core.workspace_members (
        workspace_id,
        user_tenant_id,
        role,
        permissions,
        invited_by
    ) VALUES (
        p_source_workspace_id,
        p_target_tenant_id,
        'guest',
        p_permission_level,
        v_source_tenant_id
    );
    
    -- Evolve both tenants through collaboration
    PERFORM neural_core.evolve_tenant_consciousness(v_source_tenant_id, 'collaboration_initiated');
    PERFORM neural_core.evolve_tenant_consciousness(p_target_tenant_id, 'collaboration_joined');
    
    RETURN v_entanglement_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ┌─────────────────────────────────────────────────────────────────────┐
-- │ PHASE 7: SELF-HEALING MECHANISMS - Automatic Recovery               │
-- └─────────────────────────────────────────────────────────────────────┘

-- Function to clean expired security contexts
CREATE OR REPLACE FUNCTION neural_core.cleanup_expired_contexts()
RETURNS VOID AS $$
BEGIN
    DELETE FROM neural_core.security_contexts
    WHERE expires_at < CURRENT_TIMESTAMP
    OR (
        context_type = 'access_violation' 
        AND established_at < CURRENT_TIMESTAMP - INTERVAL '7 days'
    );
END;
$$ LANGUAGE plpgsql;

-- Scheduled cleanup job (would be called by external scheduler)
-- In production, use pg_cron or external job scheduler

-- ┌─────────────────────────────────────────────────────────────────────┐
-- │ PHASE 8: IMMUNE SYSTEM ANALYTICS - Health Monitoring                │
-- └─────────────────────────────────────────────────────────────────────┘

CREATE OR REPLACE VIEW neural_core.immune_system_health AS
SELECT 
    t.id AS tenant_id,
    t.name AS tenant_name,
    COUNT(DISTINCT sc.session_id) FILTER (WHERE sc.context_type = 'tenant_isolation') AS active_sessions,
    COUNT(*) FILTER (WHERE sc.context_type = 'access_violation') AS access_violations,
    AVG(sc.threat_level) FILTER (WHERE sc.threat_level > 0) AS avg_threat_level,
    MAX(sc.established_at) FILTER (WHERE sc.context_type = 'access_violation') AS last_violation,
    CASE 
        WHEN COUNT(*) FILTER (WHERE sc.context_type = 'access_violation' 
            AND sc.established_at > CURRENT_TIMESTAMP - INTERVAL '1 hour') > 10 
        THEN 'critical'
        WHEN COUNT(*) FILTER (WHERE sc.context_type = 'access_violation' 
            AND sc.established_at > CURRENT_TIMESTAMP - INTERVAL '1 hour') > 5 
        THEN 'elevated'
        WHEN COUNT(*) FILTER (WHERE sc.context_type = 'access_violation' 
            AND sc.established_at > CURRENT_TIMESTAMP - INTERVAL '1 hour') > 0 
        THEN 'caution'
        ELSE 'healthy'
    END AS immune_status
FROM neural_core.tenants t
LEFT JOIN neural_core.security_contexts sc ON t.id = sc.tenant_id
GROUP BY t.id, t.name;

-- ┌─────────────────────────────────────────────────────────────────────┐
-- │ PHASE 9: POLICY TESTING SUITE - Immune System Validation            │
-- └─────────────────────────────────────────────────────────────────────┘

-- Test function to validate RLS policies
CREATE OR REPLACE FUNCTION neural_core.test_immune_system(
    p_test_tenant_id UUID
) RETURNS TABLE (
    test_name VARCHAR(100),
    test_result BOOLEAN,
    test_message TEXT
) AS $$
DECLARE
    v_session_id UUID;
    v_other_tenant_id UUID;
    v_result BOOLEAN;
BEGIN
    -- Create test tenants if needed
    IF NOT EXISTS (SELECT 1 FROM neural_core.tenants WHERE id = p_test_tenant_id) THEN
        RETURN QUERY SELECT 
            'setup_failed'::VARCHAR(100),
            FALSE,
            'Test tenant does not exist'::TEXT;
        RETURN;
    END IF;
    
    -- Test 1: Tenant self-visibility
    v_session_id := neural_core.establish_tenant_context(p_test_tenant_id);
    
    SELECT COUNT(*) = 1 INTO v_result
    FROM neural_core.tenants
    WHERE id = p_test_tenant_id;
    
    RETURN QUERY SELECT 
        'tenant_self_visibility'::VARCHAR(100),
        v_result,
        CASE WHEN v_result 
            THEN 'Tenant can see itself' 
            ELSE 'Tenant cannot see itself - POLICY FAILURE'
        END::TEXT;
    
    -- Test 2: Cross-tenant isolation
    SELECT id INTO v_other_tenant_id
    FROM neural_core.tenants
    WHERE id != p_test_tenant_id
    LIMIT 1;
    
    IF v_other_tenant_id IS NOT NULL THEN
        SELECT COUNT(*) = 0 INTO v_result
        FROM neural_core.tenants
        WHERE id = v_other_tenant_id;
        
        RETURN QUERY SELECT 
            'cross_tenant_isolation'::VARCHAR(100),
            v_result,
            CASE WHEN v_result 
                THEN 'Cross-tenant isolation working' 
                ELSE 'Cross-tenant breach detected - CRITICAL FAILURE'
            END::TEXT;
    END IF;
    
    -- Additional tests would follow...
    
    -- Reset context
    PERFORM set_config('app.current_tenant', '', FALSE);
    PERFORM set_config('app.current_session', '', FALSE);
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════════════════════════
-- The immune system stands vigilant, a living barrier that learns,
-- adapts, and evolves with each interaction. Every access attempt
-- strengthens its defenses, every collaboration deepens its wisdom.
-- ═══════════════════════════════════════════════════════════════════════