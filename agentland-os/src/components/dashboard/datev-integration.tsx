"use client"

import { useEffect, useState } from "react"
import { FileText, CheckCircle, AlertCircle, RefreshCw, Download, Upload } from "lucide-react"

interface SyncStatus {
  system: string
  status: "connected" | "syncing" | "error" | "disconnected"
  lastSync: string
  recordsSynced: number
  pendingRecords: number
}

interface ExportJob {
  id: string
  type: string
  date: string
  status: "completed" | "processing" | "failed"
  records: number
}

export function DatevIntegration() {
  const [syncStatuses, setSyncStatuses] = useState<SyncStatus[]>([
    {
      system: "DATEV Unternehmen Online",
      status: "connected",
      lastSync: "2025-05-27T10:30:00",
      recordsSynced: 1847,
      pendingRecords: 12
    },
    {
      system: "Lexware buchhalter",
      status: "syncing",
      lastSync: "2025-05-27T09:45:00",
      recordsSynced: 932,
      pendingRecords: 45
    },
    {
      system: "DATEV Lohn und Gehalt",
      status: "connected",
      lastSync: "2025-05-27T08:00:00",
      recordsSynced: 156,
      pendingRecords: 0
    }
  ])

  const [recentExports, setRecentExports] = useState<ExportJob[]>([
    {
      id: "1",
      type: "Buchungsstapel",
      date: "2025-05-26",
      status: "completed",
      records: 234
    },
    {
      id: "2",
      type: "Kontenrahmen SKR03",
      date: "2025-05-26",
      status: "completed",
      records: 1200
    },
    {
      id: "3",
      type: "Lohnjournal",
      date: "2025-05-25",
      status: "processing",
      records: 48
    }
  ])

  const [isManualSyncing, setIsManualSyncing] = useState(false)

  const getStatusColor = (status: SyncStatus["status"]) => {
    switch (status) {
      case "connected": return "text-green-400"
      case "syncing": return "text-blue-400"
      case "error": return "text-red-400"
      case "disconnected": return "text-gray-400"
      default: return "text-gray-400"
    }
  }

  const getStatusIcon = (status: SyncStatus["status"]) => {
    switch (status) {
      case "connected": return <CheckCircle className="w-4 h-4" />
      case "syncing": return <RefreshCw className="w-4 h-4 animate-spin" />
      case "error": return <AlertCircle className="w-4 h-4" />
      case "disconnected": return <AlertCircle className="w-4 h-4" />
      default: return null
    }
  }

  const handleManualSync = async () => {
    setIsManualSyncing(true)
    // Simulate sync process
    await new Promise(resolve => setTimeout(resolve, 3000))
    setSyncStatuses(prev => prev.map(status => ({
      ...status,
      lastSync: new Date().toISOString(),
      pendingRecords: 0
    })))
    setIsManualSyncing(false)
  }

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSyncStatuses(prev => prev.map(status => {
        if (status.status === "syncing") {
          return {
            ...status,
            recordsSynced: status.recordsSynced + Math.floor(Math.random() * 20),
            pendingRecords: Math.max(0, status.pendingRecords - Math.floor(Math.random() * 5))
          }
        }
        return status
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-400" />
          DATEV / Lexware Integration
        </h2>
        <button
          onClick={handleManualSync}
          disabled={isManualSyncing}
          className={`flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all ${
            isManualSyncing ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${isManualSyncing ? "animate-spin" : ""}`} />
          Sync Now
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sync Status */}
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-4">System Status</h3>
          <div className="space-y-3">
            {syncStatuses.map((sync) => (
              <div
                key={sync.system}
                className="p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{sync.system}</h4>
                    <div className={`flex items-center gap-1 text-sm mt-1 ${getStatusColor(sync.status)}`}>
                      {getStatusIcon(sync.status)}
                      <span className="capitalize">{sync.status}</span>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-gray-400">Last sync</p>
                    <p>{new Date(sync.lastSync).toLocaleTimeString()}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                  <div>
                    <span className="text-gray-400">Records synced</span>
                    <p className="font-semibold">{sync.recordsSynced.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Pending</span>
                    <p className={`font-semibold ${sync.pendingRecords > 0 ? "text-orange-400" : ""}`}>
                      {sync.pendingRecords}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Exports */}
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-4">Recent Exports</h3>
          <div className="space-y-3">
            {recentExports.map((job) => (
              <div
                key={job.id}
                className="p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{job.type}</h4>
                    <p className="text-sm text-gray-400 mt-1">
                      {new Date(job.date).toLocaleDateString()} • {job.records} records
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {job.status === "completed" ? (
                      <button className="p-2 bg-green-600/20 hover:bg-green-600/30 rounded-lg text-green-400 transition-all">
                        <Download className="w-4 h-4" />
                      </button>
                    ) : job.status === "processing" ? (
                      <div className="p-2 bg-blue-600/20 rounded-lg text-blue-400">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      </div>
                    ) : (
                      <div className="p-2 bg-red-600/20 rounded-lg text-red-400">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 p-3 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg text-blue-400 transition-all">
              <Upload className="w-4 h-4" />
              <span className="text-sm">Import Data</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-3 bg-green-600/20 hover:bg-green-600/30 rounded-lg text-green-400 transition-all">
              <Download className="w-4 h-4" />
              <span className="text-sm">Export Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Compliance Status */}
      <div className="mt-6 p-4 bg-green-600/20 rounded-lg border border-green-600/30">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <div>
            <h3 className="font-semibold text-green-400">GoBD Compliance Active</h3>
            <p className="text-sm text-gray-300 mt-1">
              All data exports comply with German accounting standards and tax regulations
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}