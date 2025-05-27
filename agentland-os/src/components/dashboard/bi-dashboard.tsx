"use client"

import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, Users, Euro, Activity, LucideIcon } from 'lucide-react'
import { ErrorBoundary } from 'react-error-boundary'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MetricCard } from './metric-card'

interface Metric {
  label: string
  value: string
  change: string
  positive: boolean
  icon: LucideIcon
  data: number[]
  color: string
}

// Loading fallback component
const LoadingState = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="h-[160px] bg-gray-900/30 rounded-xl" />
    ))}
  </div>
)

export function BIDashboard() {
  const [metrics, setMetrics] = useState<Metric[]>([
    {
      label: 'Monthly Recurring Revenue',
      value: '€2,450',
      change: '+12% from last month',
      positive: true,
      icon: Euro,
      data: [1200, 1400, 1800, 2100, 2450],
      color: 'hsl(var(--chart-1))'
    },
    {
      label: 'Active Customers',
      value: '3',
      change: '+2 this week',
      positive: true,
      icon: Users,
      data: [0, 1, 1, 2, 3],
      color: 'hsl(var(--chart-2))'
    },
    {
      label: 'Pipeline Value',
      value: '€45,600',
      change: '15 qualified leads',
      positive: true,
      icon: TrendingUp,
      data: [20000, 28000, 35000, 40000, 45600],
      color: 'hsl(var(--chart-3))'
    },
    {
      label: 'AI Operations',
      value: '1,234',
      change: "Today's API calls",
      positive: true,
      icon: Activity,
      data: [800, 950, 1100, 1180, 1234],
      color: 'hsl(var(--chart-4))'
    }
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map((metric, index) => {
        if (index === 3) { // AI Operations
          const currentValue = parseInt(metric.value.replace(',', ''))
          const newValue = currentValue + Math.floor(Math.random() * 10)
          return {
            ...metric,
            value: newValue.toLocaleString(),
            data: [...metric.data.slice(1), newValue]
          }
        }
        return metric
      }))
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <ErrorBoundary 
      fallback={
        <Card className="rounded-2xl border-red-500/20">
          <CardHeader>
            <CardTitle className="text-red-400">Error Loading Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              There was a problem loading the dashboard metrics. Please try refreshing the page.
            </p>
          </CardContent>
        </Card>
      }
    >
      <motion.div
        className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-green-500/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        role="region"
        aria-label="Business Intelligence Dashboard"
      >
        <Suspense fallback={<LoadingState />}>
          <AnimatePresence mode="wait">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {metrics.map((metric, index) => (
                <MetricCard
                  key={metric.label}
                  {...metric}
                  index={index}
                />
              ))}
            </div>
          </AnimatePresence>
        </Suspense>

        <style>{`
          @keyframes metricLoad {
            from { transform: scaleX(0); }
            to { transform: scaleX(1); }
          }
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
      </motion.div>
    </ErrorBoundary>
  )
}