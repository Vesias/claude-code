'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Building2, TrendingUp, Clock, Euro, Users, Award } from 'lucide-react';

const stories = [
  {
    company: 'Bäckerei Schneider GmbH',
    industry: 'Lebensmittelhandwerk',
    location: 'Saarbrücken',
    quote: 'Die DATEV-Integration hat unsere Buchhaltung revolutioniert. Was früher 2 Tage dauerte, erledigt der Agent in 2 Stunden.',
    metrics: {
      timeSaved: '90%',
      revenuIncrease: '+35%',
      tasksAutomated: '250/Monat'
    },
    contact: 'Klaus Schneider, Geschäftsführer'
  },
  {
    company: 'TechSolutions Saar',
    industry: 'IT-Dienstleistungen',
    location: 'St. Ingbert',
    quote: 'Der Email-Agent schreibt bessere Angebote als ich selbst. Unsere Abschlussrate ist um 40% gestiegen.',
    metrics: {
      timeSaved: '15h/Woche',
      revenuIncrease: '+40%',
      tasksAutomated: '500/Monat'
    },
    contact: 'Sarah Weber, Vertriebsleiterin'
  },
  {
    company: 'Metallbau Fischer',
    industry: 'Handwerk',
    location: 'Neunkirchen',
    quote: 'Endlich haben wir unsere Kundenpipeline im Griff. Die KI erinnert uns an Follow-ups und erstellt automatisch Angebote.',
    metrics: {
      timeSaved: '80%',
      revenuIncrease: '+28%',
      tasksAutomated: '180/Monat'
    },
    contact: 'Thomas Fischer, Inhaber'
  }
];

export function SuccessStories() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 success-stories">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Saarländische Erfolgsgeschichten
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Über 150 KMUs im Saarland vertrauen bereits auf AgentlandOS. 
            Lesen Sie, wie unsere KI-Agenten ihren Arbeitsalltag transformiert haben.
          </p>
        </motion.div>

        {/* Success Stories */}
        <div className="space-y-8">
          {stories.map((story, index) => (
            <motion.div
              key={story.company}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="success-story-card"
            >
              <div className="grid md:grid-cols-3 gap-8">
                {/* Company Info */}
                <div className="md:col-span-2">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="story-company">{story.company}</h3>
                      <p className="story-industry">{story.industry} • {story.location}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-lg mb-4 pl-16">
                    "{story.quote}"
                  </p>
                  
                  <p className="text-sm text-gray-500 pl-16">
                    — {story.contact}
                  </p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-semibold text-white">{story.metrics.timeSaved}</div>
                      <div className="text-sm text-gray-500">Zeitersparnis</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-secondary" />
                    <div>
                      <div className="font-semibold text-white">{story.metrics.revenuIncrease}</div>
                      <div className="text-sm text-gray-500">Umsatzsteigerung</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-accent" />
                    <div>
                      <div className="font-semibold text-white">{story.metrics.tasksAutomated}</div>
                      <div className="text-sm text-gray-500">Automatisierte Aufgaben</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          <div className="text-center">
            <div className="kmu-metric">
              <div className="kmu-metric-value">150+</div>
              <div className="kmu-metric-label">Zufriedene KMUs</div>
            </div>
          </div>
          <div className="text-center">
            <div className="kmu-metric">
              <div className="kmu-metric-value">89%</div>
              <div className="kmu-metric-label">Durchschn. Zeitersparnis</div>
            </div>
          </div>
          <div className="text-center">
            <div className="kmu-metric">
              <div className="kmu-metric-value">€2.4k</div>
              <div className="kmu-metric-label">Ersparnis/Monat</div>
            </div>
          </div>
          <div className="text-center">
            <div className="kmu-metric">
              <div className="kmu-metric-value">4.9★</div>
              <div className="kmu-metric-label">Kundenbewertung</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Add missing import
import { Zap } from 'lucide-react';