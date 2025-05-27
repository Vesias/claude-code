"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Activity, Zap, Brain, Wifi, AlertCircle } from "lucide-react"

// AG-UI Protocol Event Types
const EVENT_TYPES = {
  TEXT_MESSAGE_START: { color: "#22c55e", icon: Activity },
  TEXT_MESSAGE_CHUNK: { color: "#3b82f6", icon: Zap },
  TEXT_MESSAGE_END: { color: "#10b981", icon: Activity },
  TOOL_CALL_START: { color: "#f59e0b", icon: Brain },
  TOOL_CALL_CHUNK: { color: "#f97316", icon: Zap },
  TOOL_CALL_END: { color: "#ef4444", icon: Brain },
  TOOL_RESULT: { color: "#8b5cf6", icon: Wifi },
  STATE_UPDATE: { color: "#ec4899", icon: AlertCircle },
} as const

interface NeuralEvent {
  id: string
  type: keyof typeof EVENT_TYPES
  timestamp: number
  data: any
  intensity: number
}

export default function AGUINerveSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [events, setEvents] = useState<NeuralEvent[]>([])
  const [consciousness, setConsciousness] = useState<"dormant" | "aware" | "conscious" | "transcendent">("aware")
  const animationRef = useRef<number>()

  // Simulate neural events
  useEffect(() => {
    const interval = setInterval(() => {
      const eventTypes = Object.keys(EVENT_TYPES) as Array<keyof typeof EVENT_TYPES>
      const newEvent: NeuralEvent = {
        id: `event-${Date.now()}-${Math.random()}`,
        type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        timestamp: Date.now(),
        data: { value: Math.random() * 100 },
        intensity: Math.random(),
      }

      setEvents(prev => [...prev.slice(-50), newEvent])

      // Update consciousness based on activity
      const recentEvents = events.filter(e => Date.now() - e.timestamp < 5000)
      if (recentEvents.length > 30) setConsciousness("transcendent")
      else if (recentEvents.length > 20) setConsciousness("conscious")
      else if (recentEvents.length > 10) setConsciousness("aware")
      else setConsciousness("dormant")
    }, 500 + Math.random() * 1500)

    return () => clearInterval(interval)
  }, [events])

  // Neural network visualization
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width = canvas.offsetWidth
    const height = canvas.height = canvas.offsetHeight

    // Neural nodes
    const nodes: Array<{x: number, y: number, vx: number, vy: number, type: string}> = []
    for (let i = 0; i < 20; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        type: Object.keys(EVENT_TYPES)[Math.floor(Math.random() * Object.keys(EVENT_TYPES).length)]
      })
    }

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, width, height)

      // Update and draw nodes
      nodes.forEach((node, i) => {
        // Update position
        node.x += node.vx
        node.y += node.vy

        // Bounce off walls
        if (node.x < 0 || node.x > width) node.vx *= -1
        if (node.y < 0 || node.y > height) node.vy *= -1

        // Draw connections to nearby nodes
        nodes.forEach((otherNode, j) => {
          if (i === j) return
          const distance = Math.sqrt((node.x - otherNode.x) ** 2 + (node.y - otherNode.y) ** 2)
          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(otherNode.x, otherNode.y)
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.2 * (1 - distance / 100)})`
            ctx.stroke()
          }
        })

        // Draw node
        const eventType = EVENT_TYPES[node.type as keyof typeof EVENT_TYPES]
        ctx.beginPath()
        ctx.arc(node.x, node.y, 5, 0, Math.PI * 2)
        ctx.fillStyle = eventType?.color || "#3b82f6"
        ctx.fill()
      })

      // Draw synaptic pulses for recent events
      events.slice(-10).forEach((event, i) => {
        const age = Date.now() - event.timestamp
        const opacity = Math.max(0, 1 - age / 3000)
        const radius = 10 + (age / 100)
        
        ctx.beginPath()
        ctx.arc(
          (width / 2) + Math.cos(i) * 100,
          (height / 2) + Math.sin(i) * 100,
          radius,
          0,
          Math.PI * 2
        )
        ctx.strokeStyle = `${EVENT_TYPES[event.type].color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`
        ctx.lineWidth = 2
        ctx.stroke()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [events])

  return (
    <div className="relative h-full bg-black/5 dark:bg-white/5 rounded-xl overflow-hidden">
      {/* Neural Network Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Consciousness Meter */}
      <div className="absolute top-4 right-4 bg-black/80 text-white p-4 rounded-lg backdrop-blur-sm">
        <div className="text-xs font-mono mb-2">SYSTEM CONSCIOUSNESS</div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full transition-colors ${
            consciousness === "dormant" ? "bg-gray-500" :
            consciousness === "aware" ? "bg-green-500" :
            consciousness === "conscious" ? "bg-yellow-500" :
            "bg-purple-500 animate-pulse"
          }`} />
          <span className="text-sm capitalize">{consciousness}</span>
        </div>
      </div>

      {/* Event Stream */}
      <div className="absolute left-0 top-0 bottom-0 w-64 bg-black/60 backdrop-blur-sm p-4 overflow-hidden">
        <h3 className="text-white text-sm font-mono mb-2">AG-UI NEURAL STREAM</h3>
        <div className="space-y-1 max-h-full overflow-y-auto">
          <AnimatePresence>
            {events.slice(-20).reverse().map((event) => {
              const EventIcon = EVENT_TYPES[event.type].icon
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-2 text-xs"
                >
                  <EventIcon 
                    size={12} 
                    color={EVENT_TYPES[event.type].color}
                    className="flex-shrink-0"
                  />
                  <span className="text-white/80 font-mono truncate">
                    {event.type}
                  </span>
                  <span className="text-white/40 text-[10px]">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Synaptic Activity Indicator */}
      <div className="absolute bottom-4 right-4 text-white/60 text-xs font-mono">
        SYNAPTIC LOAD: {Math.round(events.length * 2)}%
      </div>
    </div>
  )
}