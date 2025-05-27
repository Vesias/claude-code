'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Zap, Building2, Rocket } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Starter',
    icon: Zap,
    price: 99,
    description: 'Perfekt für Einzelunternehmer und kleine Teams',
    features: [
      { name: '3 KI-Agenten Ihrer Wahl', included: true },
      { name: 'Bis zu 1.000 Aufgaben/Monat', included: true },
      { name: 'E-Mail Support', included: true },
      { name: 'DATEV-Export', included: true },
      { name: 'Basic Dashboard', included: true },
      { name: 'API-Zugang', included: false },
      { name: 'Dedizierter Account Manager', included: false },
      { name: 'Custom Agenten', included: false }
    ],
    cta: 'Jetzt starten',
    popular: false
  },
  {
    name: 'Professional',
    icon: Building2,
    price: 299,
    description: 'Die beliebteste Wahl für wachsende Unternehmen',
    features: [
      { name: 'Alle 6 Business-Agenten', included: true },
      { name: 'Unbegrenzte Aufgaben', included: true },
      { name: 'Priority Support (24h)', included: true },
      { name: 'DATEV + Lexware Integration', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'API-Zugang', included: true },
      { name: 'Dedizierter Account Manager', included: false },
      { name: 'Custom Agenten', included: false }
    ],
    cta: 'Professional wählen',
    popular: true
  },
  {
    name: 'Enterprise',
    icon: Rocket,
    price: 999,
    description: 'Maßgeschneiderte Lösungen für Ihr Unternehmen',
    features: [
      { name: 'Alle Agenten + Custom Development', included: true },
      { name: 'Unbegrenzte Aufgaben & User', included: true },
      { name: '24/7 Premium Support', included: true },
      { name: 'Alle Integrationen', included: true },
      { name: 'Enterprise Analytics & BI', included: true },
      { name: 'Vollständiger API-Zugang', included: true },
      { name: 'Dedizierter Account Manager', included: true },
      { name: 'Custom Agenten nach Bedarf', included: true }
    ],
    cta: 'Kontakt aufnehmen',
    popular: false
  }
];

export function PricingPlans() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Transparente Preise, keine versteckten Kosten
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Wählen Sie den Plan, der zu Ihrem Unternehmen passt. 
            Jederzeit kündbar, keine Mindestlaufzeit.
          </p>
        </motion.div>

        {/* Pricing Grid */}
        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`pricing-card ${plan.popular ? 'professional' : ''}`}
            >
              {/* Plan Icon */}
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                <plan.icon className="w-6 h-6 text-white" />
              </div>

              {/* Plan Name */}
              <h3 className="pricing-tier">{plan.name}</h3>

              {/* Price */}
              <div className="pricing-value mb-2">
                <span className="currency">€</span>
                {plan.price}
                <span className="period">/Monat</span>
              </div>

              {/* Description */}
              <p className="text-gray-400 mb-8">
                {plan.description}
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={feature.included ? 'text-gray-300' : 'text-gray-600'}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link href={plan.name === 'Enterprise' ? '/contact' : '/register'}>
                <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-primary to-secondary text-black hover:shadow-lg hover:shadow-primary/30'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}>
                  {plan.cta}
                </button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-gray-400 mb-8">
            Alle Preise verstehen sich zzgl. 19% MwSt. | 14 Tage kostenlose Testphase | Keine Kreditkarte erforderlich
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-8 items-center">
            <div className="flex items-center gap-2 text-gray-500">
              <Check className="w-5 h-5 text-primary" />
              <span>SSL-verschlüsselt</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Check className="w-5 h-5 text-primary" />
              <span>DSGVO-konform</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Check className="w-5 h-5 text-primary" />
              <span>Server in Deutschland</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Check className="w-5 h-5 text-primary" />
              <span>Tägliche Backups</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}