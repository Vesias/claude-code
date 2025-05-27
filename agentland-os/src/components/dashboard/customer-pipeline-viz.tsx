"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, Users, Euro, ArrowRight } from 'lucide-react'

interface Lead {
  id: string
  name: string
  value: number
  probability: number
}

interface PipelineStage {
  name: string
  count: number
  value: number
  leads: Lead[]
  color: string
}

export function CustomerPipelineViz() {
  const [stages, setStages] = useState<PipelineStage[]>([
    {
      name: 'Leads',
      count: 42,
      value: 126000,
      color: '#ff0088',
      leads: [
        { id: '1', name: 'ZF Friedrichshafen', value: 25000, probability: 0.2 },
        { id: '2', name: 'Bosch Homburg', value: 18000, probability: 0.3 },
        { id: '3', name: 'Steuerkanzlei Weber', value: 8500, probability: 0.4 },
        { id: '4', name: 'Restaurant Mediterrano', value: 12000, probability: 0.3 }
      ]
    },
    {
      name: 'Qualified',
      count: 15,
      value: 45600,
      color: '#0088ff',
      leads: [
        { id: '5', name: 'Modehaus Klein', value: 15000, probability: 0.6 },
        { id: '6', name: 'Handwerk Schmitt', value: 9800, probability: 0.7 },
        { id: '7', name: 'Bäckerei Müller', value: 7200, probability: 0.5 }
      ]
    },
    {
      name: 'Demo',
      count: 8,
      value: 24000,
      color: '#ffbd2e',
      leads: [
        { id: '8', name: 'IT-Service Saar', value: 12000, probability: 0.8 },
        { id: '9', name: 'Praxis Dr. Meyer', value: 6500, probability: 0.6 }
      ]
    },
    {
      name: 'Negotiation',
      count: 5,
      value: 15000,
      color: '#27c93f',
      leads: [
        { id: '10', name: 'Auto Müller GmbH', value: 8500, probability: 0.9 }
      ]
    },
    {
      name: 'Closed',
      count: 3,
      value: 2450,
      color: '#00ff88',
      leads: [
        { id: '11', name: 'Pilot Customer A', value: 850, probability: 1.0 },
        { id: '12', name: 'Pilot Customer B', value: 750, probability: 1.0 },
        { id: '13', name: 'Pilot Customer C', value: 850, probability: 1.0 }
      ]
    }
  ])

  const [draggedLead, setDraggedLead] = useState<Lead | null>(null)

  const handleDragStart = (lead: Lead) => {
    setDraggedLead(lead)
  }

  const handleDrop = (targetStageIndex: number) => {
    if (!draggedLead) return

    setStages(prev => {
      const newStages = [...prev]
      
      // Remove from source stage
      newStages.forEach(stage => {
        stage.leads = stage.leads.filter(lead => lead.id !== draggedLead.id)
        stage.count = stage.leads.length
        stage.value = stage.leads.reduce((sum, lead) => sum + lead.value, 0)
      })
      
      // Add to target stage
      newStages[targetStageIndex].leads.push(draggedLead)
      newStages[targetStageIndex].count = newStages[targetStageIndex].leads.length
      newStages[targetStageIndex].value = newStages[targetStageIndex].leads.reduce((sum, lead) => sum + lead.value, 0)
      
      return newStages
    })
    
    setDraggedLead(null)
  }

  return (
    <motion.div
      className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-pink-500/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-pink-400" />
        <h2 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-green-400 bg-clip-text text-transparent">
          Customer Acquisition Pipeline
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {stages.map((stage, stageIndex) => (
          <motion.div
            key={stage.name}
            className="bg-gray-900/60 rounded-xl p-4 border border-gray-700/50 hover:border-pink-500/30 transition-all"
            whileHover={{ scale: 1.02 }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(stageIndex)}
          >
            <div className="mb-4">
              <div className="text-sm font-medium text-pink-400 mb-1">
                {stage.name}
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {stage.count}
              </div>
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <Euro className="w-3 h-3" />
                {stage.value.toLocaleString()}
              </div>
            </div>

            <div className="space-y-2 max-h-32 overflow-y-auto">
              <AnimatePresence>
                {stage.leads.map((lead) => (
                  <motion.div
                    key={lead.id}
                    className="bg-pink-500/10 hover:bg-pink-500/20 p-2 rounded-lg cursor-grab active:cursor-grabbing transition-colors border border-pink-500/20"
                    draggable
                    onDragStart={() => handleDragStart(lead)}
                    whileHover={{ scale: 1.02 }}
                    whileDrag={{ scale: 1.05, rotate: 2 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    layout
                  >
                    <div className="text-xs font-medium text-white truncate">
                      {lead.name}
                    </div>
                    <div className="text-xs text-gray-400 flex justify-between">
                      <span>€{lead.value.toLocaleString()}</span>
                      <span>{Math.round(lead.probability * 100)}%</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {stageIndex < stages.length - 1 && (
              <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                <ArrowRight className="w-6 h-6 text-gray-600" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-sm text-gray-400">Total Pipeline</div>
          <div className="text-xl font-bold text-green-400">
            €{stages.reduce((sum, stage) => sum + stage.value, 0).toLocaleString()}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-400">Conversion Rate</div>
          <div className="text-xl font-bold text-blue-400">12.5%</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-400">Avg. Deal Size</div>
          <div className="text-xl font-bold text-yellow-400">€3,200</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-400">Sales Cycle</div>
          <div className="text-xl font-bold text-purple-400">45 days</div>
        </div>
      </div>
    </motion.div>
  )
}