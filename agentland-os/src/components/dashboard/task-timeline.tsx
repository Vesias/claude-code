"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, CheckCircle, Circle } from 'lucide-react'

interface TimelineTask {
  id: string
  title: string
  description: string
  progress: number
  status: 'completed' | 'active' | 'pending'
  week: number
}

export function TaskTimeline() {
  const [tasks, setTasks] = useState<TimelineTask[]>([
    {
      id: '1',
      title: 'Fix CI/CD Pipeline',
      description: 'Emergency stabilization completed',
      progress: 100,
      status: 'completed',
      week: 1
    },
    {
      id: '2', 
      title: 'GmbH Registration',
      description: 'Legal entity formation in progress',
      progress: 60,
      status: 'active',
      week: 2
    },
    {
      id: '3',
      title: 'GDPR Compliance Setup',
      description: 'Implementing Enzuzo for SMB compliance',
      progress: 40,
      status: 'active',
      week: 2
    },
    {
      id: '4',
      title: 'MCP Core Integration',
      description: 'Qdrant, Toolbox, Markdownify pending',
      progress: 0,
      status: 'pending',
      week: 3
    },
    {
      id: '5',
      title: 'AG-UI Implementation', 
      description: 'Event stream architecture setup',
      progress: 0,
      status: 'pending',
      week: 4
    },
    {
      id: '6',
      title: 'Pilot Customer Launch',
      description: '15 pilots for €10K MRR target',
      progress: 0,
      status: 'pending',
      week: 8
    }
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prev => prev.map(task => {
        if (task.status === 'active' && task.progress < 100) {
          return {
            ...task,
            progress: Math.min(task.progress + Math.random() * 5, 100)
          }
        }
        return task
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="task-timeline">
      <div className="timeline-header">
        <div className="timeline-title flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          16-Week Roadmap
        </div>
        <div className="timeline-week flex items-center gap-1 text-xs">
          <Clock className="w-3 h-3" />
          Week 2 of 16
        </div>
      </div>
      
      <div className="timeline-items">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            className={`timeline-item ${task.status}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-start gap-2">
              {task.status === 'completed' ? (
                <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
              )}
              <div className="flex-1">
                <div className="task-title">{task.title}</div>
                <div className="task-desc">{task.description}</div>
                <div className="task-progress mt-2">
                  <div className="bg-gray-700 h-2 rounded-full overflow-hidden">
                    <motion.div
                      className="task-progress-bar h-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${task.progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {Math.round(task.progress)}% complete
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}