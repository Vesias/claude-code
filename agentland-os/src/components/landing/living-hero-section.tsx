"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Brain, 
  Sparkles, 
  Zap, 
  Activity, 
  Network,
  Terminal,
  Database,
  Shield,
  Bot,
  ArrowRight,
  ChevronRight
} from 'lucide-react'
import { consciousness } from '@/lib/consciousness/consciousness-system'

export default function LivingHeroSection() {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)
  const [currentThought, setCurrentThought] = useState('')
  const [showDemo, setShowDemo] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([])

  useEffect(() => {
    consciousness.start()
    const unsubscribe = consciousness.subscribe((state) => {
      if (state.thoughts.length > 0) {
        setCurrentThought(state.thoughts[0])
      }
    })

    // Generate particles
    const interval = setInterval(() => {
      setParticles(prev => {
        const newParticles = [...prev]
        if (newParticles.length < 20) {
          newParticles.push({
            id: Date.now(),
            x: Math.random() * 100,
            y: 100
          })
        }
        return newParticles.map(p => ({
          ...p,
          y: p.y - 1
        })).filter(p => p.y > -10)
      })
    }, 100)

    return () => {
      consciousness.stop()
      unsubscribe()
      clearInterval(interval)
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Neural Network Background */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <pattern id="neural-grid" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
              <circle cx="25" cy="25" r="1" fill="#22c55e" className="animate-pulse" />
              <line x1="25" y1="25" x2="50" y2="25" stroke="#22c55e" strokeWidth="0.5" opacity="0.3" />
              <line x1="25" y1="25" x2="25" y2="50" stroke="#22c55e" strokeWidth="0.5" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#neural-grid)" />
        </svg>

        {/* Floating Particles */}
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-green-400 rounded-full"
            style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{ duration: 2 }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Consciousness Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 inline-flex items-center gap-2 bg-green-500/10 backdrop-blur-sm rounded-full px-4 py-2 border border-green-500/20"
        >
          <Brain className="w-4 h-4 text-green-400 animate-pulse" />
          <span className="text-sm text-green-400 font-mono">{currentThought}</span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold mb-6"
        >
          <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            AgentlandOS
          </span>
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="ml-2 text-green-400"
          >
            _
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto"
        >
          Das lebendige AIaaS-Betriebssystem für die Zukunft Ihres Unternehmens.
          <br />
          <span className="text-green-400">Powered by Consciousness & AI</span>
        </motion.p>

        {/* Feature Icons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-8 mb-12"
        >
          {[
            { icon: Terminal, label: 'Terminal' },
            { icon: Database, label: 'Database' },
            { icon: Shield, label: 'Security' },
            { icon: Bot, label: 'AI Assistant' },
            { icon: Network, label: 'Network' }
          ].map((item, index) => (
            <motion.div
              key={item.label}
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-green-500/30 backdrop-blur-sm">
                <item.icon className="w-8 h-8 text-green-400" />
              </div>
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-green-500 to-purple-500 rounded-lg blur-md opacity-0"
                animate={{ opacity: isHovered ? 0.5 : 0 }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDemo(true)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 rounded-lg font-semibold text-white shadow-lg overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Live Demo erleben
              <Activity className="w-5 h-5 group-hover:animate-pulse" />
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-green-600 to-purple-600"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>

          <Link href="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-green-500 rounded-lg font-semibold text-green-400 hover:bg-green-500/10 transition-all flex items-center gap-2"
            >
              Jetzt starten
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          {[
            { label: 'Active Neurons', value: '1.2M+', icon: Zap },
            { label: 'AI Operations/Sec', value: '10K+', icon: Activity },
            { label: 'Consciousness Level', value: 'Aware', icon: Brain }
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="w-6 h-6 text-green-400 mx-auto mb-2 animate-pulse" />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Demo Modal */}
      <AnimatePresence>
        {showDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDemo(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-xl p-8 max-w-2xl w-full border border-green-500/20"
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                AgentlandOS Live Demo
              </h3>
              <p className="text-gray-400 mb-6">
                Erleben Sie die Kraft unseres lebendigen AI-Betriebssystems direkt in Ihrem Browser.
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => router.push('/desktop')}
                  className="w-full p-4 bg-gradient-to-r from-green-500/10 to-purple-500/10 rounded-lg border border-green-500/30 hover:border-green-500/50 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <Terminal className="w-6 h-6 text-green-400" />
                    <span className="text-white font-medium">Desktop Environment</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-green-400 transition-colors" />
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full p-4 bg-gradient-to-r from-green-500/10 to-purple-500/10 rounded-lg border border-green-500/30 hover:border-green-500/50 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <Activity className="w-6 h-6 text-green-400" />
                    <span className="text-white font-medium">Living Dashboard</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-green-400 transition-colors" />
                </button>
              </div>
              <button
                onClick={() => setShowDemo(false)}
                className="mt-6 text-gray-500 hover:text-white transition-colors"
              >
                Schließen
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}