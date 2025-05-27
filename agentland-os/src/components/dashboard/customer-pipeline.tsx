"use client"

import { useEffect, useState } from "react"
import { Users, UserPlus, UserCheck, UserX } from "lucide-react"

interface PipelineStage {
  name: string
  count: number
  value: number
  color: string
  icon: React.ReactNode
}

interface Customer {
  id: string
  name: string
  stage: string
  value: number
  probability: number
}

export function CustomerPipeline() {
  const [stages, setStages] = useState<PipelineStage[]>([
    {
      name: "Leads",
      count: 45,
      value: 67500,
      color: "from-blue-400 to-blue-600",
      icon: <UserPlus className="w-4 h-4" />
    },
    {
      name: "Qualified",
      count: 28,
      value: 84000,
      color: "from-purple-400 to-purple-600",
      icon: <Users className="w-4 h-4" />
    },
    {
      name: "Proposal",
      count: 12,
      value: 48000,
      color: "from-orange-400 to-orange-600",
      icon: <UserCheck className="w-4 h-4" />
    },
    {
      name: "Negotiation",
      count: 8,
      value: 40000,
      color: "from-green-400 to-green-600",
      icon: <UserCheck className="w-4 h-4" />
    }
  ])

  const [recentCustomers, setRecentCustomers] = useState<Customer[]>([
    { id: "1", name: "TechCorp GmbH", stage: "Proposal", value: 4500, probability: 75 },
    { id: "2", name: "Digital Services AG", stage: "Qualified", value: 3200, probability: 60 },
    { id: "3", name: "Innovation Labs", stage: "Negotiation", value: 5800, probability: 85 },
    { id: "4", name: "StartupHub Berlin", stage: "Leads", value: 2100, probability: 30 }
  ])

  const totalPipelineValue = stages.reduce((sum, stage) => sum + stage.value, 0)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStages(prevStages => 
        prevStages.map(stage => ({
          ...stage,
          count: Math.max(0, stage.count + Math.floor((Math.random() - 0.5) * 3)),
          value: Math.max(0, stage.value + Math.floor((Math.random() - 0.5) * 5000))
        }))
      )
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
        <Users className="w-5 h-5 text-blue-400" />
        Customer Pipeline
      </h2>

      {/* Pipeline Funnel */}
      <div className="space-y-3 mb-6">
        {stages.map((stage, index) => {
          const widthPercentage = 100 - (index * 20)
          return (
            <div key={stage.name} className="relative">
              <div
                className={`relative bg-gradient-to-r ${stage.color} rounded-lg p-4 transition-all duration-500`}
                style={{ width: `${widthPercentage}%` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      {stage.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{stage.name}</h3>
                      <p className="text-sm opacity-90">
                        {stage.count} customers • €{(stage.value / 1000).toFixed(1)}k
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{stage.count}</p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Total Pipeline Value */}
      <div className="p-4 bg-gray-700/30 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Total Pipeline Value</span>
          <span className="text-2xl font-bold text-green-400">
            €{(totalPipelineValue / 1000).toFixed(1)}k
          </span>
        </div>
      </div>

      {/* Recent Opportunities */}
      <div>
        <h3 className="text-sm font-semibold text-gray-400 mb-3">Recent Opportunities</h3>
        <div className="space-y-2">
          {recentCustomers.map((customer) => (
            <div
              key={customer.id}
              className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-all"
            >
              <div>
                <p className="font-medium">{customer.name}</p>
                <p className="text-xs text-gray-400">{customer.stage}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">€{customer.value.toLocaleString()}</p>
                <p className="text-xs text-gray-400">{customer.probability}% probability</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}