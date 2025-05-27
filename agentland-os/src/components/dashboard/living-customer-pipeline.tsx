"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Users, Euro, Sparkles, Zap, TrendingUp } from "lucide-react"

interface LeadNeuron {
  id: string
  name: string
  company: string
  value: number
  energy: number
  connections: string[]
  stage: string
  momentum: number
}

interface PipelineStage {
  id: string
  name: string
  color: string
  leads: LeadNeuron[]
  synapticStrength: number
}

// Neural particle system for background
class NeuralParticle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  color: string

  constructor(x: number, y: number, color: string) {
    this.x = x
    this.y = y
    this.vx = (Math.random() - 0.5) * 2
    this.vy = (Math.random() - 0.5) * 2
    this.life = 1
    this.color = color
  }

  update() {
    this.x += this.vx
    this.y += this.vy
    this.life -= 0.01
    this.vx *= 0.99
    this.vy *= 0.99
  }
}

export default function LivingCustomerPipeline() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<NeuralParticle[]>([])
  const [stages, setStages] = useState<PipelineStage[]>([
    {
      id: "discovery",
      name: "Discovery",
      color: "#3b82f6",
      leads: [
        { id: "l1", name: "Klaus Weber", company: "Weber GmbH", value: 15000, energy: 0.8, connections: ["l2"], stage: "discovery", momentum: 0.7 },
        { id: "l2", name: "Anna Schmidt", company: "Schmidt AG", value: 25000, energy: 0.6, connections: ["l1", "l3"], stage: "discovery", momentum: 0.5 },
      ],
      synapticStrength: 0.7
    },
    {
      id: "qualification",
      name: "Qualification",
      color: "#f59e0b",
      leads: [
        { id: "l3", name: "Peter Müller", company: "Müller & Co", value: 35000, energy: 0.9, connections: ["l2"], stage: "qualification", momentum: 0.8 },
      ],
      synapticStrength: 0.8
    },
    {
      id: "proposal",
      name: "Proposal",
      color: "#8b5cf6",
      leads: [
        { id: "l4", name: "Maria Fischer", company: "Fischer Solutions", value: 45000, energy: 0.7, connections: [], stage: "proposal", momentum: 0.6 },
      ],
      synapticStrength: 0.6
    },
    {
      id: "negotiation",
      name: "Negotiation",
      color: "#ec4899",
      leads: [],
      synapticStrength: 0.5
    },
    {
      id: "closed",
      name: "Closed Won",
      color: "#22c55e",
      leads: [],
      synapticStrength: 0.9
    }
  ])

  // Neural background animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.update()
        
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, 2 * particle.life, 0, Math.PI * 2)
        ctx.fillStyle = `${particle.color}${Math.floor(particle.life * 255).toString(16).padStart(2, '0')}`
        ctx.fill()

        return particle.life > 0
      })

      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination } = result
    const sourceStage = stages.find(s => s.id === source.droppableId)
    const destStage = stages.find(s => s.id === destination.droppableId)

    if (!sourceStage || !destStage) return

    const lead = sourceStage.leads[source.index]
    
    // Create energy pulse at destination
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const destIndex = stages.findIndex(s => s.id === destination.droppableId)
      const x = (destIndex + 1) * (rect.width / (stages.length + 1))
      const y = rect.height / 2

      // Create burst of particles
      for (let i = 0; i < 20; i++) {
        particlesRef.current.push(new NeuralParticle(x, y, destStage.color))
      }
    }

    // Update stages
    const newStages = stages.map(stage => {
      if (stage.id === source.droppableId) {
        return {
          ...stage,
          leads: stage.leads.filter((_, i) => i !== source.index),
          synapticStrength: Math.min(1, stage.synapticStrength + 0.1)
        }
      }
      if (stage.id === destination.droppableId) {
        const newLeads = [...stage.leads]
        newLeads.splice(destination.index, 0, {
          ...lead,
          stage: destination.droppableId,
          energy: Math.min(1, lead.energy + 0.1),
          momentum: Math.min(1, lead.momentum + 0.2)
        })
        return {
          ...stage,
          leads: newLeads,
          synapticStrength: Math.min(1, stage.synapticStrength + 0.15)
        }
      }
      return stage
    })

    setStages(newStages)
  }

  const totalPipelineValue = stages.reduce((sum, stage) => 
    sum + stage.leads.reduce((stageSum, lead) => stageSum + lead.value, 0), 0
  )

  return (
    <div className="relative h-full">
      {/* Neural Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-30"
      />

      {/* Pipeline Header */}
      <div className="relative z-10 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            Living Customer Pipeline
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-300">
                Total Energy: €{totalPipelineValue.toLocaleString('de-DE')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Stages */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-5 gap-4 relative z-10">
          {stages.map((stage, stageIndex) => (
            <div key={stage.id} className="relative">
              {/* Stage Header */}
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-300 mb-1">{stage.name}</h4>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {stage.leads.length} leads
                  </span>
                  <div className="flex items-center gap-1">
                    <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: stage.color }}
                        animate={{ width: `${stage.synapticStrength * 100}%` }}
                        transition={{ type: "spring", stiffness: 100 }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Droppable Area */}
              <Droppable droppableId={stage.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[400px] rounded-lg border-2 border-dashed transition-all p-2 ${
                      snapshot.isDraggingOver
                        ? `border-${stage.color} bg-${stage.color}/10`
                        : "border-gray-700 bg-gray-800/30"
                    }`}
                  >
                    <AnimatePresence>
                      {stage.leads.map((lead, index) => (
                        <Draggable key={lead.id} draggableId={lead.id} index={index}>
                          {(provided, snapshot) => (
                            <motion.div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className={`mb-2 ${
                                snapshot.isDragging ? "opacity-50" : ""
                              }`}
                            >
                              <div className="relative bg-gray-800 rounded-lg p-3 border border-gray-700 cursor-move hover:border-gray-600 transition-all">
                                {/* Energy Aura */}
                                <div
                                  className="absolute inset-0 rounded-lg opacity-20"
                                  style={{
                                    background: `radial-gradient(circle, ${stage.color} 0%, transparent 70%)`,
                                    transform: `scale(${1 + lead.energy * 0.2})`
                                  }}
                                />

                                {/* Lead Content */}
                                <div className="relative z-10">
                                  <div className="flex items-start justify-between mb-1">
                                    <h5 className="text-sm font-medium text-white">{lead.name}</h5>
                                    <Sparkles 
                                      size={12} 
                                      className="text-yellow-400"
                                      style={{ opacity: lead.momentum }}
                                    />
                                  </div>
                                  <p className="text-xs text-gray-400 mb-2">{lead.company}</p>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-green-400">
                                      €{lead.value.toLocaleString('de-DE')}
                                    </span>
                                    <div className="flex gap-1">
                                      {[...Array(3)].map((_, i) => (
                                        <div
                                          key={i}
                                          className="w-1 h-3 rounded-full"
                                          style={{
                                            backgroundColor: i < lead.energy * 3 ? stage.color : "#374151",
                                            opacity: i < lead.energy * 3 ? 1 : 0.3
                                          }}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                {/* Connection Lines */}
                                {lead.connections.length > 0 && (
                                  <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-blue-400 animate-pulse" />
                                )}
                              </div>
                            </motion.div>
                          )}
                        </Draggable>
                      ))}
                    </AnimatePresence>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              {/* Stage Value */}
              <div className="mt-2 text-center">
                <span className="text-xs text-gray-500">
                  €{stage.leads.reduce((sum, lead) => sum + lead.value, 0).toLocaleString('de-DE')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Pipeline Flow Indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500"
          animate={{
            x: ["-100%", "100%"]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
    </div>
  )
}