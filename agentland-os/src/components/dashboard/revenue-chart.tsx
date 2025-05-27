"use client"

import { useEffect, useState } from "react"
import { Calendar, TrendingUp } from "lucide-react"

interface RevenueData {
  month: string
  revenue: number
  projectedRevenue: number
}

export function RevenueChart() {
  const [selectedPeriod, setSelectedPeriod] = useState<"6m" | "1y" | "all">("6m")
  const [data, setData] = useState<RevenueData[]>([
    { month: "Jan", revenue: 8500, projectedRevenue: 9000 },
    { month: "Feb", revenue: 9200, projectedRevenue: 9500 },
    { month: "Mar", revenue: 10100, projectedRevenue: 10500 },
    { month: "Apr", revenue: 11300, projectedRevenue: 11000 },
    { month: "May", revenue: 11800, projectedRevenue: 12000 },
    { month: "Jun", revenue: 12450, projectedRevenue: 13000 }
  ])

  const maxRevenue = Math.max(...data.map(d => Math.max(d.revenue, d.projectedRevenue)))
  const chartHeight = 250

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => 
        prevData.map(item => ({
          ...item,
          revenue: item.revenue + (Math.random() - 0.5) * 200
        }))
      )
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          Revenue Analytics
        </h2>
        <div className="flex gap-2">
          {(["6m", "1y", "all"] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 text-sm rounded-lg transition-all ${
                selectedPeriod === period
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-400 hover:bg-gray-600"
              }`}
            >
              {period === "6m" ? "6 Months" : period === "1y" ? "1 Year" : "All Time"}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative" style={{ height: chartHeight }}>
        <div className="absolute inset-0 flex items-end justify-between gap-4">
          {data.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full flex gap-2 items-end mb-2" style={{ height: chartHeight - 30 }}>
                {/* Actual Revenue Bar */}
                <div
                  className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md transition-all duration-500 hover:opacity-80"
                  style={{
                    height: `${(item.revenue / maxRevenue) * 100}%`,
                    minHeight: "20px"
                  }}
                />
                {/* Projected Revenue Bar */}
                <div
                  className="flex-1 bg-gradient-to-t from-purple-600/50 to-purple-400/50 rounded-t-md border-2 border-purple-400 border-dashed transition-all duration-500"
                  style={{
                    height: `${(item.projectedRevenue / maxRevenue) * 100}%`,
                    minHeight: "20px"
                  }}
                />
              </div>
              <span className="text-xs text-gray-400">{item.month}</span>
            </div>
          ))}
        </div>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 -ml-8">
          <span>€{(maxRevenue / 1000).toFixed(0)}k</span>
          <span>€{(maxRevenue / 2000).toFixed(0)}k</span>
          <span>€0</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded" />
          <span className="text-gray-400">Actual Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500/50 border-2 border-purple-400 border-dashed rounded" />
          <span className="text-gray-400">Projected Revenue</span>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 p-4 bg-gray-700/30 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Total Revenue (6 months)</span>
          <span className="text-xl font-bold text-green-400">
            €{data.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}