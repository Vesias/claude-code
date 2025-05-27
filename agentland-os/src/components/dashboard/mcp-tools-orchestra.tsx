"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Terminal, GitBranch, Database, Globe, Shield, 
  FileSearch, Code, Users, Package, Gauge, Lock,
  Cloud, Layers
} from "lucide-react"

interface MCPTool {
  id: string
  name: string
  icon: any
  status: "active" | "ready" | "pending"
  connections: string[]
  activity: number
  lastUsed?: Date
}

const MCP_TOOLS: MCPTool[] = [
  { id: "terminal", name: "Terminal", icon: Terminal, status: "active", connections: ["git", "docker"], activity: 0.8 },
  { id: "git", name: "Git Client", icon: GitBranch, status: "active", connections: ["terminal", "code-editor"], activity: 0.6 },
  { id: "database", name: "Database Viewer", icon: Database, status: "ready", connections: ["api-tester"], activity: 0.3 },
  { id: "browser", name: "Browser", icon: Globe, status: "active", connections: ["api-tester", "security"], activity: 0.7 },
  { id: "file-explorer", name: "File Explorer", icon: FileSearch, status: "active", connections: ["code-editor", "git"], activity: 0.9 },
  { id: "code-editor", name: "Code Editor", icon: Code, status: "ready", connections: ["file-explorer", "git", "terminal"], activity: 0.4 },
  { id: "collaboration", name: "Collaboration Hub", icon: Users, status: "pending", connections: ["git"], activity: 0.1 },
  { id: "docker", name: "Docker Manager", icon: Package, status: "ready", connections: ["terminal", "deployment"], activity: 0.5 },
  { id: "performance", name: "Performance Monitor", icon: Gauge, status: "pending", connections: ["logs", "api-tester"], activity: 0.2 },
  { id: "security", name: "Security Scanner", icon: Shield, status: "pending", connections: ["browser", "code-editor"], activity: 0.1 },
  { id: "api-tester", name: "API Tester", icon: Cloud, status: "active", connections: ["browser", "database"], activity: 0.6 },
  { id: "deployment", name: "Deployment Tool", icon: Layers, status: "ready", connections: ["docker", "git"], activity: 0.3 },
  { id: "logs", name: "Log Viewer", icon: Terminal, status: "ready", connections: ["performance", "security"], activity: 0.4 },
]

export default function MCPToolsOrchestra() {
  const [tools, setTools] = useState(MCP_TOOLS)
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [dataFlows, setDataFlows] = useState<Array<{id: string, from: string, to: string, timestamp: number}>>([])

  // Simulate tool activity
  useEffect(() => {
    const interval = setInterval(() => {
      setTools(prevTools => 
        prevTools.map(tool => ({
          ...tool,
          activity: Math.max(0, Math.min(1, tool.activity + (Math.random() - 0.5) * 0.2)),
          lastUsed: Math.random() > 0.7 ? new Date() : tool.lastUsed
        }))
      )

      // Simulate data flows
      if (Math.random() > 0.6) {
        const activeTool = tools.find(t => t.status === "active" && t.connections.length > 0)
        if (activeTool) {
          const targetId = activeTool.connections[Math.floor(Math.random() * activeTool.connections.length)]
          setDataFlows(prev => [...prev, {
            id: `flow-${Date.now()}`,
            from: activeTool.id,
            to: targetId,
            timestamp: Date.now()
          }])
        }
      }

      // Clean old data flows
      setDataFlows(prev => prev.filter(flow => Date.now() - flow.timestamp < 3000))
    }, 500)

    return () => clearInterval(interval)
  }, [tools])

  const getToolPosition = (index: number) => {
    const angle = (index / tools.length) * Math.PI * 2
    const radius = 180
    return {
      x: Math.cos(angle) * radius + 200,
      y: Math.sin(angle) * radius + 200
    }
  }

  return (
    <div className="relative h-full bg-gradient-to-br from-blue-950/20 to-purple-950/20 rounded-xl overflow-hidden">
      {/* SVG Connections */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Tool Connections */}
        {tools.map((tool, i) => {
          const pos1 = getToolPosition(i)
          return tool.connections.map(connectionId => {
            const connectedTool = tools.find(t => t.id === connectionId)
            if (!connectedTool) return null
            const j = tools.indexOf(connectedTool)
            const pos2 = getToolPosition(j)
            
            return (
              <line
                key={`${tool.id}-${connectionId}`}
                x1={pos1.x}
                y1={pos1.y}
                x2={pos2.x}
                y2={pos2.y}
                stroke="url(#connectionGradient)"
                strokeWidth="1"
                strokeDasharray={selectedTool === tool.id || selectedTool === connectionId ? "5,5" : "0"}
                className="transition-all"
              />
            )
          })
        })}

        {/* Data Flow Animations */}
        <AnimatePresence>
          {dataFlows.map(flow => {
            const fromTool = tools.find(t => t.id === flow.from)
            const toTool = tools.find(t => t.id === flow.to)
            if (!fromTool || !toTool) return null
            
            const fromPos = getToolPosition(tools.indexOf(fromTool))
            const toPos = getToolPosition(tools.indexOf(toTool))
            
            return (
              <motion.circle
                key={flow.id}
                r="4"
                fill="#22c55e"
                initial={{ x: fromPos.x, y: fromPos.y, opacity: 1 }}
                animate={{ x: toPos.x, y: toPos.y, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            )
          })}
        </AnimatePresence>
      </svg>

      {/* Tool Nodes */}
      {tools.map((tool, index) => {
        const position = getToolPosition(index)
        const Icon = tool.icon
        
        return (
          <motion.div
            key={tool.id}
            className={`absolute w-16 h-16 -translate-x-8 -translate-y-8 cursor-pointer transition-all ${
              selectedTool === tool.id ? "z-20" : "z-10"
            }`}
            style={{ left: position.x, top: position.y }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedTool(tool.id === selectedTool ? null : tool.id)}
          >
            {/* Activity Ring */}
            <div className="absolute inset-0">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="30"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="4"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="30"
                  fill="none"
                  stroke={
                    tool.status === "active" ? "#22c55e" :
                    tool.status === "ready" ? "#f59e0b" :
                    "#ef4444"
                  }
                  strokeWidth="4"
                  strokeDasharray={`${188.5 * tool.activity} 188.5`}
                  className="transition-all"
                />
              </svg>
            </div>

            {/* Tool Icon */}
            <div className={`absolute inset-2 rounded-lg flex items-center justify-center transition-all ${
              tool.status === "active" ? "bg-green-500/20 border-green-500/50" :
              tool.status === "ready" ? "bg-yellow-500/20 border-yellow-500/50" :
              "bg-red-500/20 border-red-500/50"
            } border backdrop-blur-sm`}>
              <Icon size={24} className="text-white" />
            </div>

            {/* Last Used Indicator */}
            {tool.lastUsed && (Date.now() - tool.lastUsed.getTime() < 5000) && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            )}
          </motion.div>
        )
      })}

      {/* Selected Tool Info */}
      <AnimatePresence>
        {selectedTool && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white"
          >
            <h3 className="font-semibold mb-2">
              {tools.find(t => t.id === selectedTool)?.name}
            </h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Status:</span>{" "}
                <span className={`capitalize ${
                  tools.find(t => t.id === selectedTool)?.status === "active" ? "text-green-400" :
                  tools.find(t => t.id === selectedTool)?.status === "ready" ? "text-yellow-400" :
                  "text-red-400"
                }`}>
                  {tools.find(t => t.id === selectedTool)?.status}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Activity:</span>{" "}
                <span>{Math.round((tools.find(t => t.id === selectedTool)?.activity || 0) * 100)}%</span>
              </div>
              <div>
                <span className="text-gray-400">Connections:</span>{" "}
                <span>{tools.find(t => t.id === selectedTool)?.connections.length}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Orchestra Status */}
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 text-white">
        <div className="text-xs font-mono mb-1">MCP ORCHESTRA STATUS</div>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>Active: {tools.filter(t => t.status === "active").length}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
            <span>Ready: {tools.filter(t => t.status === "ready").length}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span>Pending: {tools.filter(t => t.status === "pending").length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}