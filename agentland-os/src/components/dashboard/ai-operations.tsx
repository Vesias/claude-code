"use client"

import { useEffect, useState } from "react"
import { Brain, Cpu, Zap, TrendingUp } from "lucide-react"

interface AIMetric {
  tool: string
  usage: number
  successRate: number
  avgResponseTime: number
  icon: React.ReactNode
  color: string
}

export function AIOperations() {
  const [metrics, setMetrics] = useState<AIMetric[]>([
    {
      tool: "Code Assistant",
      usage: 342,
      successRate: 96.5,
      avgResponseTime: 1.2,
      icon: <Cpu className="w-4 h-4" />,
      color: "from-blue-400 to-blue-600"
    },
    {
      tool: "Email Composer",
      usage: 289,
      successRate: 98.2,
      avgResponseTime: 0.8,
      icon: <Zap className="w-4 h-4" />,
      color: "from-purple-400 to-purple-600"
    },
    {
      tool: "Task Manager",
      usage: 456,
      successRate: 94.8,
      avgResponseTime: 0.5,
      icon: <Brain className="w-4 h-4" />,
      color: "from-green-400 to-green-600"
    }
  ])

  const [liveActivity, setLiveActivity] = useState<string[]>([
    "Code Assistant: Generated React component",
    "Email Composer: Drafted customer response",
    "Task Manager: Created sprint tasks",
    "Slogan Creator: Generated 5 variations"
  ])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update metrics
      setMetrics(prevMetrics => 
        prevMetrics.map(metric => ({
          ...metric,
          usage: metric.usage + Math.floor(Math.random() * 10),
          successRate: Math.min(100, Math.max(90, metric.successRate + (Math.random() - 0.5) * 2)),
          avgResponseTime: Math.max(0.3, metric.avgResponseTime + (Math.random() - 0.5) * 0.2)
        }))
      )

      // Add new activity
      const activities = [
        "Code Assistant: Refactored function",
        "Email Composer: Generated follow-up email",
        "Task Manager: Updated task priorities",
        "Regex Builder: Created validation pattern",
        "Service Ideas: Generated 3 proposals"
      ]
      const newActivity = activities[Math.floor(Math.random() * activities.length)]
      setLiveActivity(prev => [newActivity, ...prev.slice(0, 3)])
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const totalOperations = metrics.reduce((sum, metric) => sum + metric.usage, 0)
  const avgSuccessRate = metrics.reduce((sum, metric) => sum + metric.successRate, 0) / metrics.length

  return (
    <div>
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
        <Brain className="w-5 h-5 text-purple-400" />
        AI Operations Analytics
      </h2>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-700/30 rounded-lg">
          <p className="text-gray-400 text-sm">Total Operations</p>
          <p className="text-2xl font-bold mt-1">{totalOperations.toLocaleString()}</p>
          <p className="text-xs text-green-400 mt-1">+24.1% this week</p>
        </div>
        <div className="p-4 bg-gray-700/30 rounded-lg">
          <p className="text-gray-400 text-sm">Success Rate</p>
          <p className="text-2xl font-bold mt-1">{avgSuccessRate.toFixed(1)}%</p>
          <p className="text-xs text-green-400 mt-1">+2.3% improvement</p>
        </div>
      </div>

      {/* Tool Metrics */}
      <div className="space-y-3 mb-6">
        {metrics.map((metric) => (
          <div
            key={metric.tool}
            className="p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${metric.color}`}>
                  {metric.icon}
                </div>
                <h3 className="font-medium">{metric.tool}</h3>
              </div>
              <span className="text-sm text-gray-400">{metric.usage} uses</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Success Rate</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${metric.color}`}
                      style={{ width: `${metric.successRate}%` }}
                    />
                  </div>
                  <span className="text-xs">{metric.successRate.toFixed(1)}%</span>
                </div>
              </div>
              <div>
                <span className="text-gray-400">Avg Response</span>
                <p className="mt-1">{metric.avgResponseTime.toFixed(1)}s</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Live Activity Feed */}
      <div>
        <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Live Activity
        </h3>
        <div className="space-y-2">
          {liveActivity.map((activity, index) => (
            <div
              key={index}
              className="p-2 bg-gray-700/30 rounded text-sm text-gray-300 animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {activity}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}