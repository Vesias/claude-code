'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  FileSpreadsheet, 
  TrendingUp, 
  Users, 
  Calculator, 
  ShieldCheck,
  Zap,
  Clock,
  Euro
} from 'lucide-react';

const features = [
  {
    icon: Mail,
    title: 'Geschäftskorrespondenz-Agent',
    description: 'Professionelle E-Mails in Sekunden. Perfekt formuliert, rechtssicher und in Ihrem Stil.',
    benefits: ['Zeitersparnis: 2h/Tag', 'Immer höflich & korrekt', 'Multi-Sprachen-Support']
  },
  {
    icon: FileSpreadsheet,
    title: 'DATEV-Integration',
    description: 'Nahtlose Verbindung zu Ihrem Steuerberater. Automatischer Export aller relevanten Daten.',
    benefits: ['GoBD-konform', 'Automatische Buchungen', 'Echtzeit-Synchronisation']
  },
  {
    icon: Calculator,
    title: 'Rechnungs-Agent',
    description: 'XRechnung, ZUGFeRD und klassische Rechnungen – vollautomatisch erstellt und versendet.',
    benefits: ['Alle Standards', 'Automatisches Mahnwesen', 'SEPA-Integration']
  },
  {
    icon: Users,
    title: 'Kunden-Pipeline',
    description: 'Ihre Kunden im Blick. Von der Akquise bis zum Abschluss – alles automatisiert.',
    benefits: ['360° Kundenansicht', 'Automatische Follow-ups', 'Umsatzprognosen']
  },
  {
    icon: TrendingUp,
    title: 'Business Intelligence',
    description: 'Echtzeitdaten zu Ihrem Geschäft. Treffen Sie bessere Entscheidungen, schneller.',
    benefits: ['Live-Dashboards', 'KI-Prognosen', 'Wettbewerbsanalyse']
  },
  {
    icon: ShieldCheck,
    title: 'Compliance-Wächter',
    description: 'DSGVO, GoBD und mehr – automatisch überwacht und dokumentiert.',
    benefits: ['Audit-Trail', 'Automatische Reports', 'Risiko-Alerts']
  }
];

export function KMUFeatures() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            KI-Agenten, die Ihr Business verstehen
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Speziell entwickelt für deutsche KMUs. Jeder Agent ist ein Experte in seinem Bereich 
            und arbeitet nahtlos mit Ihren bestehenden Systemen zusammen.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="kmu-features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="kmu-feature-card group"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-8 h-8 text-white" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 mb-6">
                {feature.description}
              </p>

              {/* Benefits */}
              <ul className="space-y-2">
                {feature.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-3 h-3 text-primary" />
                    </div>
                    {benefit}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* ROI Calculator Teaser */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 border border-primary/30"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Berechnen Sie Ihre Ersparnis
              </h3>
              <p className="text-gray-300 mb-6">
                Unsere KMU-Kunden sparen durchschnittlich €2.450 pro Monat und 
                89% ihrer Zeit bei Routineaufgaben. Wie viel können Sie sparen?
              </p>
              <button className="consciousness-button group">
                <Euro className="w-5 h-5 mr-2" />
                ROI-Rechner starten
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <Clock className="w-8 h-8 text-primary mb-3" />
                <div className="text-2xl font-bold text-white">15h</div>
                <div className="text-sm text-gray-400">Zeitersparnis/Woche</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <Euro className="w-8 h-8 text-secondary mb-3" />
                <div className="text-2xl font-bold text-white">€2.4k</div>
                <div className="text-sm text-gray-400">Ersparnis/Monat</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Fix missing import
import { ArrowRight } from 'lucide-react';