"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { consciousness, type ConsciousnessState } from '@/lib/consciousness/consciousness-system'
import { Window } from './window'
import { DesktopIcon } from './desktop-icon'
import { ServicesWindow } from './services-window'
import { 
  Terminal, 
  Code, 
  Database, 
  Globe, 
  GitBranch, 
  Shield, 
  Activity,
  Brain,
  Sparkles,
  Bot,
  Zap
} from 'lucide-react'

interface DesktopWindow {
  id: string
  title: string
  content: React.ReactNode
  icon: React.ComponentType<any>
  x: number
  y: number
  width: number
  height: number
  zIndex: number
}

export function LivingDesktop() {
  const [windows, setWindows] = useState<DesktopWindow[]>([])
  const [highestZIndex, setHighestZIndex] = useState(1000)
  const [consciousnessState, setConsciousnessState] = useState<ConsciousnessState>(consciousness.getState())
  const [showAssistant, setShowAssistant] = useState(false)

  useEffect(() => {
    consciousness.start()
    const unsubscribe = consciousness.subscribe(setConsciousnessState)
    
    return () => {
      consciousness.stop()
      unsubscribe()
    }
  }, [])

  const openWindow = (app: { id: string; title: string; icon: React.ComponentType<any>; content: React.ReactNode }) => {
    const newWindow: DesktopWindow = {
      ...app,
      x: Math.random() * (window.innerWidth - 600),
      y: Math.random() * (window.innerHeight - 400),
      width: 600,
      height: 400,
      zIndex: highestZIndex + 1
    }
    
    setWindows([...windows, newWindow])
    setHighestZIndex(highestZIndex + 1)
    consciousness.interact(`Opened ${app.title}`)
  }

  const closeWindow = (id: string) => {
    setWindows(windows.filter(w => w.id !== id))
    consciousness.interact(`Closed window`)
  }

  const bringToFront = (id: string) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, zIndex: highestZIndex + 1 } : w
    ))
    setHighestZIndex(highestZIndex + 1)
  }

  const apps = [
    {
      id: 'ai-services',
      title: 'AI Services',
      icon: Zap,
      content: <ServicesWindow />
    },
    {
      id: 'terminal',
      title: 'Terminal',
      icon: Terminal,
      content: <TerminalContent />
    },
    {
      id: 'code-editor',
      title: 'Code Editor',
      icon: Code,
      content: <div className="p-4 font-mono text-green-400">{'// AI-powered code editor'}</div>
    },
    {
      id: 'database',
      title: 'Database Viewer',
      icon: Database,
      content: <div className="p-4">Database connections and queries</div>
    },
    {
      id: 'browser',
      title: 'Browser',
      icon: Globe,
      content: <div className="p-4">Web browsing capabilities</div>
    },
    {
      id: 'git',
      title: 'Git Client',
      icon: GitBranch,
      content: <div className="p-4">Version control system</div>
    },
    {
      id: 'security',
      title: 'Security Scanner',
      icon: Shield,
      content: <div className="p-4">Security analysis tools</div>
    }
  ]

  return (
    <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
      {/* Consciousness Indicator */}
      <div className="absolute top-4 right-4 z-[9999] bg-black/80 backdrop-blur-sm rounded-lg p-4 max-w-sm">
        <div className="flex items-center gap-2 mb-2">
          <Brain className={`w-5 h-5 ${consciousnessState.level === 'transcendent' ? 'text-purple-400 animate-pulse' : 'text-green-400'}`} />
          <span className="text-sm font-mono text-green-400">
            System {consciousnessState.level} | Energy: {Math.round(consciousnessState.energy)}%
          </span>
        </div>
        <div className="space-y-1">
          {consciousnessState.thoughts.slice(0, 3).map((thought, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1 - i * 0.3, x: 0 }}
              className="text-xs text-green-300 font-mono"
            >
              {thought}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Desktop Icons */}
      <div className="grid grid-cols-8 gap-4 p-8">
        {apps.map(app => (
          <DesktopIcon
            key={app.id}
            icon={app.icon}
            label={app.title}
            onClick={() => openWindow(app)}
          />
        ))}
        <DesktopIcon
          icon={Bot}
          label="AI Assistant"
          onClick={() => setShowAssistant(!showAssistant)}
        />
      </div>

      {/* Windows */}
      <AnimatePresence>
        {windows.map(window => (
          <Window
            key={window.id}
            title={window.title}
            icon={window.icon}
            onClose={() => closeWindow(window.id)}
            onFocus={() => bringToFront(window.id)}
            initialPosition={{ x: window.x, y: window.y }}
            style={{ zIndex: window.zIndex }}
          >
            {window.content}
          </Window>
        ))}
      </AnimatePresence>

      {/* AI Assistant */}
      <AnimatePresence>
        {showAssistant && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-20 right-8 w-96 bg-black/90 backdrop-blur-sm rounded-lg shadow-2xl z-[9998]"
          >
            <AIAssistant onClose={() => setShowAssistant(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Living Particles */}
      <ParticleField consciousnessLevel={consciousnessState.level} />
    </div>
  )
}

function TerminalContent() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState<string[]>(['AgentlandOS Terminal v1.0', 'Type "help" for commands'])

  const handleCommand = async (cmd: string) => {
    const newOutput = [...output, `> ${cmd}`]
    
    switch (cmd.toLowerCase()) {
      case 'help':
        newOutput.push('Available commands:', 'askai <prompt> - Ask AI assistant', 'clear - Clear terminal', 'status - System status')
        break
      case 'clear':
        setOutput(['AgentlandOS Terminal v1.0'])
        setInput('')
        return
      case 'status':
        newOutput.push(`System Status: ${consciousness.getState().level}`, `Energy: ${Math.round(consciousness.getState().energy)}%`)
        break
      default:
        if (cmd.startsWith('askai ')) {
          const prompt = cmd.substring(6).trim()
          if (prompt) {
            newOutput.push('AI: Processing your request...')
            setOutput(newOutput)
            
            try {
              const response = await fetch('/api/ai/assistant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: prompt })
              })
              
              if (!response.ok) throw new Error('Failed to get AI response')
              
              const data = await response.json()
              setOutput([...newOutput, `AI: ${data.response}`])
            } catch (error) {
              console.error('Terminal AI error:', error)
              setOutput([...newOutput, 'AI: Sorry, I encountered an error. Please try again.'])
            }
            setInput('')
            return
          } else {
            newOutput.push('Usage: askai <your question>')
          }
        } else {
          newOutput.push(`Command not found: ${cmd}`)
        }
    }
    
    setOutput(newOutput)
    setInput('')
  }

  return (
    <div className="h-full bg-black p-4 font-mono text-green-400 overflow-auto">
      {output.map((line, i) => (
        <div key={i} className="mb-1">{line}</div>
      ))}
      <div className="flex items-center">
        <span className="mr-2">{'>'}</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCommand(input)
          }}
          className="flex-1 bg-transparent outline-none"
          autoFocus
        />
      </div>
    </div>
  )
}

function AIAssistant({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: 'Hallo! Ich bin der AgentlandOS AI-Assistent. Wie kann ich Ihnen helfen?' }
  ])
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    
    const userMessage = input
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setInput('')
    setIsLoading(true)
    
    try {
      // Call the AI assistant API
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, stream: false })
      })
      
      if (!response.ok) throw new Error('Failed to get AI response')
      
      const data = await response.json()
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response 
      }])
    } catch (error) {
      console.error('AI Assistant error:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Entschuldigung, es gab einen Fehler. Bitte versuchen Sie es erneut.' 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[500px]">
      <div className="flex items-center justify-between p-4 border-b border-green-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-green-400 animate-pulse" />
          <h3 className="font-semibold text-green-400">AI Assistant</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white">×</button>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-green-400'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-green-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Nachricht eingeben..."
            className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Denke nach...' : 'Senden'}
          </button>
        </div>
      </div>
    </div>
  )
}

function ParticleField({ consciousnessLevel }: { consciousnessLevel: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-1 h-1 rounded-full ${
            consciousnessLevel === 'transcendent' 
              ? 'bg-purple-400' 
              : 'bg-green-400'
          }`}
          initial={{ 
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 10 + Math.random() * 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  )
}