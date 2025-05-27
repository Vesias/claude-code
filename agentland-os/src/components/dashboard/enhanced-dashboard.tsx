"use client"

import { useState, useEffect } from 'react'
import { EnhancedNav } from '@/components/layout/enhanced-nav'
import { AGUIEventStream } from './agui-event-stream'
import { TaskTimeline } from './task-timeline'
import { ConnectorStatus } from './connector-status'
import MCPToolsOrchestra from './mcp-tools-orchestra'
import { BIDashboard } from './bi-dashboard'
import { CustomerPipelineViz } from './customer-pipeline-viz'
import { LivingDataFlow } from './living-data-flow'

export function EnhancedDashboard() {
  const [activeView, setActiveView] = useState('dashboard')
  const [consciousnessLevel, setConsciousnessLevel] = useState(0)

  // Living consciousness simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setConsciousnessLevel(prev => (prev + 1) % 100)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="agentland-consciousness-container" data-consciousness-level={consciousnessLevel}>
      {/* Enhanced Navigation with Living System */}
      <nav className="main-nav" role="navigation" aria-label="AgentlandOS Navigation">
        <EnhancedNav activeView={activeView} onViewChange={setActiveView} />
      </nav>
      
      {/* Living Data Flow Background - Neural Network */}
      <div className="data-flow-canvas" aria-hidden="true">
        <LivingDataFlow />
      </div>
      
      {/* AG-UI Event Stream - Living Communication */}
      <aside className="agui-stream-container" role="complementary" aria-label="AI Event Stream">
        <AGUIEventStream />
      </aside>
      
      {/* MCP Tools Orchestra - Neural Coordination */}
      <section className="mcp-orchestra-container" aria-label="MCP Tools Status">
        <div className="mcp-orchestra">
          <MCPToolsOrchestra />
        </div>
      </section>
      
      {/* Task Timeline - Consciousness Planning */}
      <aside className="task-timeline" role="complementary" aria-label="Project Timeline">
        <TaskTimeline />
      </aside>
      
      {/* Main Dashboard Grid - Living Content */}
      <main className="dashboard-main-content" role="main">
        {/* Customer Pipeline Visualizer */}
        <section className="pipeline-viz" aria-label="Customer Pipeline">
          <CustomerPipelineViz />
        </section>
        
        {/* Business Intelligence Dashboard */}
        <section 
          className="bi-dashboard" 
          aria-label="Business Intelligence Metrics"
          role="region"
        >
          <BIDashboard />
        </section>
      </main>
      
      {/* Connector Status - System Health */}
      <aside className="connector-status" role="complementary" aria-label="System Connectors">
        <ConnectorStatus />
      </aside>
      
      {/* Consciousness Level Indicator */}
      <div 
        className="consciousness-indicator" 
        role="status" 
        aria-label={`System consciousness level: ${consciousnessLevel}%`}
      >
        <div className="consciousness-core breathing">
          <div className="neural-pulse" />
          <div className="awareness-ring" />
          <div className="consciousness-level">{consciousnessLevel}%</div>
        </div>
      </div>
    </div>
  )
}
