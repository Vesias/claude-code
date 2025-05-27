"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plug, CheckCircle, Clock, AlertCircle, Calendar, Circle } from 'lucide-react'

interface Connector {
  name: string
  status: 'connected' | 'pending' | 'testing' | 'planned' | 'error'
  description?: string
  lastSync?: Date
}

export function ConnectorStatus() {
  const [connectors, setConnectors] = useState<Connector[]>([
    {
      name: 'DATEV API',
      status: 'pending',
      description: 'Accounting system integration',
      lastSync: undefined
    },
    {
      name: 'Lexware REST',
      status: 'testing', 
      description: 'ERP system connector',
      lastSync: new Date(Date.now() - 5 * 60000) // 5 minutes ago
    },
    {
      name: 'Lieferando',
      status: 'connected',
      description: 'Food delivery platform',
      lastSync: new Date(Date.now() - 2 * 60000) // 2 minutes ago
    },
    {
      name: 'SAP Business One',
      status: 'planned',
      description: 'Enterprise resource planning',
      lastSync: undefined
    }
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'testing':
        return <Clock className="w-4 h-4 text-yellow-400" />
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-400" />
      case 'planned':
        return <Calendar className="w-4 h-4 text-blue-400" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />
      default:
        return <Circle className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "connector-status-badge text-xs px-2 py-1 rounded-full"
    switch (status) {
      case 'connected':
        return `${baseClasses} bg-green-500/20 text-green-400`
      case 'testing':
        return `${baseClasses} bg-yellow-500/20 text-yellow-400`
      case 'pending':
        return `${baseClasses} bg-orange-500/20 text-orange-400`
      case 'planned':
        return `${baseClasses} bg-blue-500/20 text-blue-400`
      case 'error':
        return `${baseClasses} bg-red-500/20 text-red-400`
      default:
        return `${baseClasses} bg-gray-500/20 text-gray-400`
    }
  }

  const formatStatus = (status: string) => {
    switch (status) {
      case 'connected': return 'Connected'
      case 'testing': return 'Testing'
      case 'pending': return 'Pending'
      case 'planned': return 'Planned'
      case 'error': return 'Error'
      default: return 'Unknown'
    }
  }

  useEffect(() => {
    // Simulate status updates
    const interval = setInterval(() => {
      setConnectors(prev => prev.map(connector => {
        if (connector.status === 'testing' && Math.random() > 0.8) {
          return {
            ...connector,
            status: Math.random() > 0.3 ? 'connected' : 'error',
            lastSync: new Date()
          }
        }
        if (connector.status === 'connected' && Math.random() > 0.95) {
          return {
            ...connector,
            lastSync: new Date()
          }
        }
        return connector
      }))
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      className="connector-status"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="connector-header">
        <div className="connector-icon">
          <Plug className="w-5 h-5 text-yellow-400" />
        </div>
        <div className="connector-title">Integration Status</div>
      </div>
      
      <div className="space-y-2">
        {connectors.map((connector, index) => (
          <motion.div
            key={connector.name}
            className="connector-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {getStatusIcon(connector.status)}
                <span className="connector-name text-sm font-medium">
                  {connector.name}
                </span>
              </div>
              {connector.description && (
                <div className="text-xs text-gray-500 mt-1">
                  {connector.description}
                </div>
              )}
              {connector.lastSync && (
                <div className="text-xs text-gray-600 mt-1">
                  Last sync: {connector.lastSync.toLocaleTimeString()}
                </div>
              )}
            </div>
            <span className={getStatusBadge(connector.status)}>
              {formatStatus(connector.status)}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}