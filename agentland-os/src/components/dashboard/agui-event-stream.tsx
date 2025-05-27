"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Zap } from 'lucide-react'

interface AGUIEvent {
  id: string
  type: string
  data: string
  class: string
  timestamp: Date
}

export function AGUIEventStream() {
  const [events, setEvents] = useState<AGUIEvent[]>([])
  const eventsRef = useRef<HTMLDivElement>(null)

  const eventTypes = [
    { type: 'TEXT_MESSAGE_START', class: 'text' },
    { type: 'TEXT_MESSAGE_CHUNK', class: 'text' },
    { type: 'TOOL_CALL_START', class: 'tool-call' },
    { type: 'TOOL_CALL_END', class: 'tool-call' },
    { type: 'STATE_UPDATE', class: 'state-update' },
    { type: 'RUN_STARTED', class: 'lifecycle' },
    { type: 'RUN_FINISHED', class: 'lifecycle' }
  ]

  const generateEventData = (type: string): string => {
    switch(type) {
      case 'TEXT_MESSAGE_START':
        return 'Initiating response...'
      case 'TEXT_MESSAGE_CHUNK':
        return `Chunk ${Math.floor(Math.random() * 100)}`
      case 'TOOL_CALL_START':
        const tools = ['DATEV_sync', 'invoice_process', 'customer_analyze', 'gemini_query']
        return tools[Math.floor(Math.random() * tools.length)]
      case 'TOOL_CALL_END':
        return 'Tool execution completed'
      case 'STATE_UPDATE':
        return `customers: ${Math.floor(Math.random() * 10) + 1}`
      case 'RUN_STARTED':
        return 'New automation started'
      case 'RUN_FINISHED':
        return 'Automation completed successfully'
      default:
        return 'System event'
    }
  }

  const addEvent = () => {
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
    const newEvent: AGUIEvent = {
      id: Date.now().toString(),
      type: eventType.type,
      data: generateEventData(eventType.type),
      class: eventType.class,
      timestamp: new Date()
    }

    setEvents(prev => [newEvent, ...prev.slice(0, 9)]) // Keep only last 10 events
  }

  useEffect(() => {
    const interval = setInterval(addEvent, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (eventsRef.current) {
      eventsRef.current.scrollTop = 0
    }
  }, [events])

  return (
    <div className="agui-stream-container">
      <div className="agui-stream-header">
        <div className="agui-stream-title flex items-center gap-2">
          <Activity className="w-4 h-4" />
          AG-UI Event Stream
        </div>
        <div className="agui-status">
          <div className="agui-status-dot"></div>
          <span className="text-xs">Live</span>
        </div>
      </div>
      
      <div className="agui-events" ref={eventsRef}>
        <AnimatePresence>
          {events.map((event) => (
            <motion.div
              key={event.id}
              className={`agui-event ${event.class}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2">
                {event.class === 'tool-call' && <Zap className="w-3 h-3" />}
                <strong className="text-xs">{event.type}</strong>
              </div>
              <div className="text-xs text-gray-400 mt-1">{event.data}</div>
              <div className="text-xs text-gray-500 mt-1">
                {event.timestamp.toLocaleTimeString()}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}