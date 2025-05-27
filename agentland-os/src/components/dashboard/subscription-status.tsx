"use client"

import { useEffect, useState } from "react"
import { CreditCard, CheckCircle, AlertCircle, Calendar } from "lucide-react"

interface Subscription {
  id: string
  customer: string
  plan: string
  status: "active" | "trial" | "expiring" | "cancelled"
  amount: number
  nextBilling: string
  features: string[]
}

export function SubscriptionStatus() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: "1",
      customer: "TechCorp GmbH",
      plan: "Enterprise",
      status: "active",
      amount: 599,
      nextBilling: "2025-06-15",
      features: ["Unlimited AI Operations", "Priority Support", "Custom Integrations"]
    },
    {
      id: "2",
      customer: "StartupHub Berlin",
      plan: "Professional",
      status: "active",
      amount: 299,
      nextBilling: "2025-06-08",
      features: ["5000 AI Operations/mo", "Email Support", "API Access"]
    },
    {
      id: "3",
      customer: "Digital Agency",
      plan: "Starter",
      status: "trial",
      amount: 99,
      nextBilling: "2025-06-01",
      features: ["1000 AI Operations/mo", "Community Support"]
    },
    {
      id: "4",
      customer: "Innovation Labs",
      plan: "Professional",
      status: "expiring",
      amount: 299,
      nextBilling: "2025-05-30",
      features: ["5000 AI Operations/mo", "Email Support", "API Access"]
    }
  ])

  const [metrics, setMetrics] = useState({
    totalMRR: 1296,
    activeSubscriptions: 32,
    churnRate: 2.3,
    averageLifetimeValue: 4850
  })

  // Calculate status distribution
  const statusCounts = subscriptions.reduce((acc, sub) => {
    acc[sub.status] = (acc[sub.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const getStatusColor = (status: Subscription["status"]) => {
    switch (status) {
      case "active": return "text-green-400"
      case "trial": return "text-blue-400"
      case "expiring": return "text-orange-400"
      case "cancelled": return "text-red-400"
      default: return "text-gray-400"
    }
  }

  const getStatusIcon = (status: Subscription["status"]) => {
    switch (status) {
      case "active": return <CheckCircle className="w-4 h-4" />
      case "trial": return <Calendar className="w-4 h-4" />
      case "expiring": return <AlertCircle className="w-4 h-4" />
      case "cancelled": return <AlertCircle className="w-4 h-4" />
      default: return null
    }
  }

  // Simulate real-time MRR updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        totalMRR: prev.totalMRR + Math.floor((Math.random() - 0.3) * 100),
        activeSubscriptions: Math.max(30, prev.activeSubscriptions + Math.floor((Math.random() - 0.5) * 2))
      }))
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
        <CreditCard className="w-5 h-5 text-green-400" />
        Subscription Overview
      </h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-700/30 rounded-lg">
          <p className="text-gray-400 text-sm">Monthly Recurring Revenue</p>
          <p className="text-2xl font-bold mt-1 text-green-400">€{metrics.totalMRR.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-gray-700/30 rounded-lg">
          <p className="text-gray-400 text-sm">Active Subscriptions</p>
          <p className="text-2xl font-bold mt-1">{metrics.activeSubscriptions}</p>
        </div>
        <div className="p-4 bg-gray-700/30 rounded-lg">
          <p className="text-gray-400 text-sm">Churn Rate</p>
          <p className="text-2xl font-bold mt-1 text-orange-400">{metrics.churnRate}%</p>
        </div>
        <div className="p-4 bg-gray-700/30 rounded-lg">
          <p className="text-gray-400 text-sm">Avg Lifetime Value</p>
          <p className="text-2xl font-bold mt-1">€{metrics.averageLifetimeValue}</p>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-400 mb-3">Status Distribution</h3>
        <div className="flex gap-4">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="flex items-center gap-2">
              <div className={`flex items-center gap-1 ${getStatusColor(status as Subscription["status"])}`}>
                {getStatusIcon(status as Subscription["status"])}
                <span className="capitalize text-sm">{status}</span>
              </div>
              <span className="text-gray-400 text-sm">({count})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Subscriptions */}
      <div>
        <h3 className="text-sm font-semibold text-gray-400 mb-3">Recent Subscriptions</h3>
        <div className="space-y-2">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{sub.customer}</h4>
                    <div className={`flex items-center gap-1 text-xs ${getStatusColor(sub.status)}`}>
                      {getStatusIcon(sub.status)}
                      <span className="capitalize">{sub.status}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {sub.plan} Plan • €{sub.amount}/mo
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Next billing: {new Date(sub.nextBilling).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}