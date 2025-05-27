"use client"

import { motion } from "framer-motion"
import { Check, X, Sparkles } from "lucide-react"
import { useState } from "react"

const pricingPlans = [
  {
    name: "Starter",
    price: "299",
    description: "Perfekt für kleine Teams und erste Automatisierungen",
    features: [
      { text: "Bis zu 3 KI-Agenten", included: true },
      { text: "1.000 Aufgaben/Monat", included: true },
      { text: "E-Mail Support", included: true },
      { text: "Standard-Integrationen", included: true },
      { text: "Basis-Analytics", included: true },
      { text: "Custom Workflows", included: false },
      { text: "Dedicated Support", included: false },
      { text: "On-Premise Option", included: false }
    ],
    cta: "Jetzt starten",
    highlighted: false
  },
  {
    name: "Professional",
    price: "799",
    description: "Für wachsende Unternehmen mit komplexen Anforderungen",
    features: [
      { text: "Bis zu 10 KI-Agenten", included: true },
      { text: "10.000 Aufgaben/Monat", included: true },
      { text: "Priority Support", included: true },
      { text: "Alle Integrationen", included: true },
      { text: "Advanced Analytics", included: true },
      { text: "Custom Workflows", included: true },
      { text: "Dedicated Support", included: true },
      { text: "On-Premise Option", included: false }
    ],
    cta: "Beliebteste Wahl",
    highlighted: true
  },
  {
    name: "Enterprise",
    price: "Individuell",
    description: "Maßgeschneiderte Lösungen für große Organisationen",
    features: [
      { text: "Unbegrenzte Agenten", included: true },
      { text: "Unbegrenzte Aufgaben", included: true },
      { text: "24/7 Premium Support", included: true },
      { text: "Custom Integrationen", included: true },
      { text: "Enterprise Analytics", included: true },
      { text: "Custom Workflows", included: true },
      { text: "Dedicated Support", included: true },
      { text: "On-Premise Option", included: true }
    ],
    cta: "Kontakt aufnehmen",
    highlighted: false
  }
]

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  return (
    <section id="pricing" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Transparente Preise für jeden Bedarf
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Wählen Sie den Plan, der zu Ihrem Unternehmen passt. 
            Keine versteckten Kosten, jederzeit kündbar.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-gray-200 rounded-lg p-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-md transition-colors ${
                billingCycle === "monthly"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600"
              }`}
            >
              Monatlich
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-2 rounded-md transition-colors ${
                billingCycle === "yearly"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600"
              }`}
            >
              Jährlich
              <span className="ml-2 text-green-600 text-sm font-medium">-20%</span>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => {
            const isHighlighted = plan.highlighted
            const price = plan.price === "Individuell" 
              ? plan.price 
              : billingCycle === "yearly" 
                ? Math.round(parseInt(plan.price) * 0.8)
                : plan.price

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`relative bg-white rounded-2xl shadow-xl p-8 ${
                  isHighlighted ? "ring-2 ring-blue-600" : ""
                }`}
              >
                {isHighlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Sparkles size={14} />
                      Empfohlen
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline justify-center gap-1">
                    {plan.price !== "Individuell" && (
                      <span className="text-4xl font-bold text-gray-900">€</span>
                    )}
                    <span className="text-5xl font-bold text-gray-900">
                      {price}
                    </span>
                    {plan.price !== "Individuell" && (
                      <span className="text-gray-600">/Monat</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="text-green-600 mt-0.5" size={20} />
                      ) : (
                        <X className="text-gray-400 mt-0.5" size={20} />
                      )}
                      <span className={feature.included ? "text-gray-700" : "text-gray-400"}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    isHighlighted
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {plan.cta}
                </motion.button>
              </motion.div>
            )
          })}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 mb-4">
            Alle Preise verstehen sich zzgl. MwSt. • 30 Tage Geld-zurück-Garantie
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Check className="text-green-600" size={16} />
              <span>Keine Einrichtungsgebühr</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="text-green-600" size={16} />
              <span>Kostenlose Updates</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="text-green-600" size={16} />
              <span>DSGVO-konform</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}