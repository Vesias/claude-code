"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TrendingUp, Euro, Users, Activity, Zap, Target } from "lucide-react"

interface KPIMetric {
  id: string
  label: string
  value: number
  unit: string
  trend: number
  icon: any
  color: string
  heartbeat: number
}

export default function LivingKPIMetabolism() {
  const [metrics, setMetrics] = useState<KPIMetric[]>([
    {
      id: "mrr",
      label: "Monthly Recurring Revenue",
      value: 2450,
      unit: "€",
      trend: 12,
      icon: Euro,
      color: "#22c55e",
      heartbeat: 0
    },
    {
      id: "customers",
      label: "Active Customers",
      value: 3,
      unit: "",
      trend: 33,
      icon: Users,
      color: "#3b82f6",
      heartbeat: 0
    },
    {
      id: "pipeline",
      label: "Pipeline Value",
      value: 45600,
      unit: "€",
      trend: 8,
      icon: Target,
      color: "#f59e0b",
      heartbeat: 0
    },
    {
      id: "operations",
      label: "AI Operations/Day",
      value: 1247,
      unit: "",
      trend: 15,
      icon: Activity,
      color: "#8b5cf6",
      heartbeat: 0
    }
  ])

  // Simulate living metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.value + (Math.random() - 0.3) * (metric.value * 0.01),
        trend: Math.max(-50, Math.min(50, metric.trend + (Math.random() - 0.5) * 5)),
        heartbeat: (metric.heartbeat + 0.1) % (Math.PI * 2)
      })))
    }, 100)

    return () => clearInterval(interval)
  }, [])

  const formatValue = (value: number, unit: string) => {
    if (unit === "€") {
      return `€${value.toLocaleString('de-DE', { maximumFractionDigits: 0 })}`
    }
    return value.toLocaleString('de-DE', { maximumFractionDigits: 0 })
  }

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      {metrics.map((metric) => {
        const Icon = metric.icon
        const pulseSize = Math.sin(metric.heartbeat) * 0.1 + 1

        return (
          <motion.div
            key={metric.id}
            className="relative bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Metabolic Background */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full">
                <defs>
                  <radialGradient id={`metabolic-${metric.id}`}>
                    <stop offset="0%" stopColor={metric.color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={metric.color} stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle
                  cx="50%"
                  cy="50%"
                  r={50 * pulseSize}
                  fill={`url(#metabolic-${metric.id})`}
                  className="animate-pulse"
                />
              </svg>
            </div>

            {/* KPI Content */}
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="p-3 rounded-lg"
                    style={{ 
                      backgroundColor: `${metric.color}20`,
                      transform: `scale(${pulseSize})`
                    }}
                  >
                    <Icon size={24} style={{ color: metric.color }} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">{metric.label}</p>
                    <motion.p 
                      className="text-2xl font-bold text-white"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {formatValue(metric.value, metric.unit)}
                    </motion.p>
                  </div>
                </div>
              </div>

              {/* Trend Indicator */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-700/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ 
                      backgroundColor: metric.trend > 0 ? "#22c55e" : "#ef4444",
                      width: `${Math.abs(metric.trend) * 2}%`
                    }}
                    animate={{ width: `${Math.abs(metric.trend) * 2}%` }}
                    transition={{ type: "spring", stiffness: 100 }}
                  />
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp 
                    size={16} 
                    className={metric.trend > 0 ? "text-green-500" : "text-red-500 rotate-180"}
                  />
                  <span className={metric.trend > 0 ? "text-green-500" : "text-red-500"}>
                    {Math.abs(metric.trend).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Activity Sparkline */}
              <div className="mt-4">
                <svg className="w-full h-8">
                  {Array.from({ length: 20 }).map((_, i) => {
                    const height = Math.sin((metric.heartbeat + i * 0.3)) * 10 + 15
                    return (
                      <rect
                        key={i}
                        x={i * 5 + "%"}
                        y={24 - height}
                        width="4%"
                        height={height}
                        fill={metric.color}
                        opacity={0.3 + (i / 20) * 0.7}
                        rx="1"
                      />
                    )
                  })}
                </svg>
              </div>
            </div>

            {/* Energy Field */}
            <div className="absolute -bottom-20 -right-20 w-40 h-40">
              <motion.div
                className="w-full h-full rounded-full"
                style={{
                  background: `radial-gradient(circle, ${metric.color}30 0%, transparent 70%)`,
                  filter: "blur(30px)"
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          </motion.div>
        )
      })}

      {/* Global Metabolism Indicator */}
      <div className="col-span-2 mt-4">
        <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg p-4 border border-purple-700/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="text-purple-400" />
              <span className="text-white font-semibold">System Metabolism</span>
            </div>
            <div className="flex items-center gap-4">
              {metrics.map(metric => (
                <div key={metric.id} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full animate-pulse"
                    style={{ backgroundColor: metric.color }}
                  />
                  <span className="text-xs text-gray-400">{metric.id.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Global Pulse */}
          <div className="mt-3 h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              animate={{
                x: ["-100%", "100%"]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}