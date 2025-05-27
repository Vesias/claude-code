"use client"

import { motion } from "framer-motion"
import { 
  Brain, 
  Workflow, 
  Shield, 
  Zap, 
  Users, 
  BarChart,
  Code,
  Clock,
  Globe
} from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "Intelligente Multi-Agenten",
    description: "Spezialisierte KI-Agenten arbeiten nahtlos zusammen an komplexen Aufgaben.",
    color: "blue"
  },
  {
    icon: Workflow,
    title: "Automatisierte Workflows",
    description: "Erstellen Sie mühelos Prozesse, die sich selbst optimieren und anpassen.",
    color: "purple"
  },
  {
    icon: Shield,
    title: "100% DSGVO-konform",
    description: "Ihre Daten bleiben in Deutschland. Höchste Sicherheitsstandards garantiert.",
    color: "green"
  },
  {
    icon: Zap,
    title: "Blitzschnelle Ausführung",
    description: "Parallele Verarbeitung für maximale Effizienz und minimale Wartezeiten.",
    color: "yellow"
  },
  {
    icon: Users,
    title: "Team-Kollaboration",
    description: "Nahtlose Integration in bestehende Teams und Arbeitsabläufe.",
    color: "indigo"
  },
  {
    icon: BarChart,
    title: "Echtzeit-Analytics",
    description: "Detaillierte Einblicke in Performance und ROI Ihrer KI-Agenten.",
    color: "pink"
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
}

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Leistungsstarke Funktionen für Ihr Unternehmen
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AgentlandOS bietet alles, was Sie für die digitale Transformation 
            Ihres Unternehmens benötigen.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            const colorClasses = {
              blue: "bg-blue-100 text-blue-600",
              purple: "bg-purple-100 text-purple-600",
              green: "bg-green-100 text-green-600",
              yellow: "bg-yellow-100 text-yellow-600",
              indigo: "bg-indigo-100 text-indigo-600",
              pink: "bg-pink-100 text-pink-600"
            }

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className={`w-14 h-14 rounded-lg ${colorClasses[feature.color]} flex items-center justify-center mb-6`}>
                  <Icon size={28} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Additional Features Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                Bereit für die Zukunft?
              </h3>
              <p className="text-blue-100">
                Starten Sie noch heute mit AgentlandOS und transformieren Sie Ihr Unternehmen.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Jetzt durchstarten
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}