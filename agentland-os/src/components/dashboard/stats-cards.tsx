"use client"

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown, Users, DollarSign, Activity, Zap } from "lucide-react"

interface StatCard {
  title: string
  value: string | number
  change: number
  trend: "up" | "down"
  icon: React.ReactNode
  color: string
}

export function StatsCards() {
  const [stats, setStats] = useState<StatCard[]>([
    {
      title: "Monthly Revenue",
      value: "€12,450",
      change: 12.5,
      trend: "up",
      icon: <DollarSign className="w-6 h-6" />,
      color: "from-green-400 to-emerald-600"
    },
    {
      title: "Active Customers",
      value: 148,
      change: 8.2,
      trend: "up",
      icon: <Users className="w-6 h-6" />,
      color: "from-blue-400 to-blue-600"
    },
    {
      title: "AI Operations",
      value: "2,847",
      change: 24.1,
      trend: "up",
      icon: <Zap className="w-6 h-6" />,
      color: "from-purple-400 to-purple-600"
    },
    {
      title: "System Health",
      value: "98.5%",
      change: -0.3,
      trend: "down",
      icon: <Activity className="w-6 h-6" />,
      color: "from-orange-400 to-orange-600"
    }
  ])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prevStats => 
        prevStats.map(stat => ({
          ...stat,
          value: stat.title === "Monthly Revenue" 
            ? `€${(12450 + Math.random() * 1000).toFixed(0)}`
            : stat.title === "Active Customers"
            ? Math.floor(148 + Math.random() * 10)
            : stat.title === "AI Operations"
            ? (2847 + Math.floor(Math.random() * 100)).toLocaleString()
            : `${(98.5 + (Math.random() - 0.5) * 0.5).toFixed(1)}%`,
          change: Number((stat.change + (Math.random() - 0.5) * 2).toFixed(1))
        }))
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
              {stat.icon}
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              stat.trend === "up" ? "text-green-400" : "text-red-400"
            }`}>
              {stat.trend === "up" ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{Math.abs(stat.change)}%</span>
            </div>
          </div>
          <h3 className="text-gray-400 text-sm">{stat.title}</h3>
          <p className="text-2xl font-bold mt-1">{stat.value}</p>
        </div>
      ))}
    </div>
  )
}