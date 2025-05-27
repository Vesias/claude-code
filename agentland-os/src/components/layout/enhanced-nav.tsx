"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart, 
  Zap, 
  Settings, 
  Bell, 
  User,
  Activity,
  Brain,
  Network
} from 'lucide-react'

interface NavProps {
  activeView?: string
  onViewChange?: (view: string) => void
}

interface NavTab {
  id: string
  label: string
  icon: React.ComponentType<any>
  badge?: number
  description: string
}

export function EnhancedNav({ activeView = 'dashboard', onViewChange }: NavProps) {
  const [notifications, setNotifications] = useState(3)
  const [consciousnessState, setConsciousnessState] = useState('active')
  const [systemHealth, setSystemHealth] = useState(98)

  // Simulate living system consciousness
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemHealth(prev => {
        const delta = (Math.random() - 0.5) * 2
        return Math.max(95, Math.min(100, prev + delta))
      })
      
      const states = ['active', 'thinking', 'processing', 'learning']
      setConsciousnessState(states[Math.floor(Math.random() * states.length)])
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const tabs: NavTab[] = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: BarChart,
      description: 'System Overview & Metrics'
    },
    { 
      id: 'ai-services', 
      label: 'AI Services', 
      icon: Brain,
      badge: 5,
      description: 'Neural Network Operations'
    },
    { 
      id: 'mcp-tools', 
      label: 'MCP Tools', 
      icon: Activity,
      badge: 11,
      description: 'Model Context Protocol Orchestra'
    },
    { 
      id: 'neural-network', 
      label: 'Neural Net', 
      icon: Network,
      description: 'Living Data Flow Management'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart,
      description: 'Business Intelligence Engine'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings,
      description: 'System Configuration'
    }
  ]

  return (
    <nav className="main-nav" role="navigation" aria-label="AgentlandOS Navigation">
      {/* Brand Section with Living Consciousness */}
      <div className="nav-brand">
        <motion.div 
          className="nav-brand-icon"
          animate={{
            rotate: consciousnessState === 'processing' ? 360 : 0,
            scale: consciousnessState === 'thinking' ? 1.1 : 1
          }}
          transition={{ duration: 0.5 }}
          aria-label={`System state: ${consciousnessState}`}
        >
          🧠
        </motion.div>
        <div className="nav-brand-text">
          <span className="nav-brand-title">AgentlandOS</span>
          <div className="nav-brand-subtitle">
            <span className={`consciousness-state state-${consciousnessState}`}>
              {consciousnessState}
            </span>
            <span className="system-health">
              {systemHealth.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
      
      {/* Navigation Tabs with Neural Connections */}
      <div className="nav-tabs" role="tablist">
        {tabs.map((tab, index) => (
          <motion.div
            key={tab.id}
            className={`nav-tab ${activeView === tab.id ? 'active' : ''}`}
            role="tab"
            aria-selected={activeView === tab.id}
            aria-controls={`panel-${tab.id}`}
            tabIndex={0}
            onClick={() => onViewChange?.(tab.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onViewChange?.(tab.id)
              }
            }}
            whileHover={{ 
              scale: 1.02,
              y: -1
            }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              delay: index * 0.1,
              type: "spring",
              stiffness: 300
            }}
          >
            <div className="nav-tab-content">
              <div className="nav-tab-icon-wrapper">
                <tab.icon className="nav-tab-icon" aria-hidden="true" />
                {tab.badge && (
                  <motion.div 
                    className="nav-tab-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    {tab.badge}
                  </motion.div>
                )}
              </div>
              <span className="nav-tab-label">{tab.label}</span>
            </div>
            
            {/* Neural Connection Line */}
            <div className="neural-connection-line" />
            
            {/* Tooltip */}
            <div className="nav-tab-tooltip" role="tooltip">
              {tab.description}
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Action Section with System Status */}
      <div className="nav-actions">
        {/* System Health Indicator */}
        <div className="nav-system-health" aria-label={`System Health: ${systemHealth.toFixed(1)}%`}>
          <div className="health-ring">
            <svg className="health-svg" viewBox="0 0 36 36">
              <path
                className="health-circle-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <motion.path
                className="health-circle"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                strokeDasharray={`${systemHealth}, 100`}
                initial={{ strokeDasharray: "0, 100" }}
                animate={{ strokeDasharray: `${systemHealth}, 100` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <span className="health-text">{systemHealth.toFixed(0)}</span>
          </div>
        </div>
        
        {/* Notifications */}
        <motion.div 
          className="nav-notification"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          role="button"
          aria-label={`Notifications: ${notifications} unread`}
          tabIndex={0}
        >
          <Bell className="nav-notification-icon" />
          <AnimatePresence>
            {notifications > 0 && (
              <motion.div 
                className="nav-notification-badge"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {notifications > 9 ? '9+' : notifications}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* User Profile */}
        <motion.button 
          className="nav-user"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label="User Profile"
        >
          <div className="nav-user-avatar">
            <User className="nav-user-icon" />
          </div>
          <div className="nav-user-info">
            <span className="nav-user-name">Admin</span>
            <span className="nav-user-role">System Operator</span>
          </div>
        </motion.button>
      </div>
    </nav>
  )
}
