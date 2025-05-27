"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { 
  FileText, 
  Brain, 
  Cpu, 
  Database, 
  CheckCircle,
  ArrowRight,
  Play
} from "lucide-react"

const pipelineSteps = [
  {
    id: 1,
    icon: FileText,
    title: "Eingabe",
    description: "Dokumente, E-Mails oder Anfragen",
    color: "blue"
  },
  {
    id: 2,
    icon: Brain,
    title: "Analyse",
    description: "KI versteht Kontext und Intention",
    color: "purple"
  },
  {
    id: 3,
    icon: Cpu,
    title: "Verarbeitung",
    description: "Multi-Agent Workflow startet",
    color: "indigo"
  },
  {
    id: 4,
    icon: Database,
    title: "Integration",
    description: "Verbindung mit Ihren Systemen",
    color: "pink"
  },
  {
    id: 5,
    icon: CheckCircle,
    title: "Ergebnis",
    description: "Fertige Lösung in Sekunden",
    color: "green"
  }
]

export default function PipelineViz() {
  const [activeStep, setActiveStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const startAnimation = () => {
    setIsAnimating(true)
    setActiveStep(0)
    
    // Animate through steps
    pipelineSteps.forEach((_, index) => {
      setTimeout(() => {
        setActiveStep(index + 1)
      }, (index + 1) * 800)
    })

    setTimeout(() => {
      setIsAnimating(false)
      setActiveStep(0)
    }, pipelineSteps.length * 800 + 500)
  }

  return (
    <section id="pipeline" className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            So funktioniert AgentlandOS
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Erleben Sie, wie unsere KI-Agenten Ihre Aufgaben in Sekundenschnelle erledigen.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startAnimation}
            disabled={isAnimating}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play size={20} />
            {isAnimating ? "Animation läuft..." : "Demo starten"}
          </motion.button>
        </motion.div>

        {/* Pipeline Visualization */}
        <div className="relative">
          {/* Connection Lines */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2" />
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
            {pipelineSteps.map((step, index) => {
              const Icon = step.icon
              const isActive = activeStep > index
              const isCurrent = activeStep === index + 1
              
              const colorClasses = {
                blue: "bg-blue-100 text-blue-600",
                purple: "bg-purple-100 text-purple-600",
                indigo: "bg-indigo-100 text-indigo-600",
                pink: "bg-pink-100 text-pink-600",
                green: "bg-green-100 text-green-600"
              }

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale: isCurrent ? 1.1 : 1
                  }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Icon Container */}
                  <motion.div
                    animate={{
                      scale: isCurrent ? [1, 1.2, 1] : 1,
                    }}
                    transition={{ duration: 0.5 }}
                    className={`w-20 h-20 rounded-full ${
                      isActive ? colorClasses[step.color] : "bg-gray-100 text-gray-400"
                    } flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <Icon size={32} />
                  </motion.div>

                  {/* Step Info */}
                  <h3 className={`font-semibold mb-2 ${
                    isActive ? "text-gray-900" : "text-gray-400"
                  }`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm ${
                    isActive ? "text-gray-600" : "text-gray-400"
                  }`}>
                    {step.description}
                  </p>

                  {/* Arrow (except last item) */}
                  {index < pipelineSteps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2">
                      <ArrowRight className={`${
                        activeStep > index + 1 ? "text-blue-600" : "text-gray-300"
                      }`} size={24} />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Example Use Cases */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">
              Kundenservice
            </h4>
            <p className="text-sm text-gray-600">
              Automatische Bearbeitung von Kundenanfragen mit personalisierter Antwort in unter 5 Sekunden.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">
              Dokumentenanalyse
            </h4>
            <p className="text-sm text-gray-600">
              Extraktion wichtiger Informationen aus Verträgen und Rechnungen in Echtzeit.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">
              Prozessoptimierung
            </h4>
            <p className="text-sm text-gray-600">
              Identifikation von Engpässen und automatische Workflow-Anpassungen.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}