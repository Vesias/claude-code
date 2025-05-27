'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, TrendingUp, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

export function SaarlandHero() {
  return (
    <section className="saarland-hero relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Hero Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8"
        >
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-white">
            KI-Revolution für Saarländische KMUs
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6"
        >
          Ihre KI-Agenten arbeiten.
          <br />
          <span className="consciousness-text-gradient">
            Sie wachsen.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-12"
        >
          AgentlandOS revolutioniert Ihr Geschäft mit intelligenten KI-Agenten. 
          Von DATEV-Integration bis zur automatisierten Kundenbetreuung – 
          alles in einer Plattform.
        </motion.p>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-primary mb-2">89%</div>
            <div className="text-white/80">Zeitersparnis bei Routineaufgaben</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-primary mb-2">€2.450</div>
            <div className="text-white/80">Durchschnittliche Ersparnis/Monat</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-primary mb-2">100%</div>
            <div className="text-white/80">GDPR & GoBD konform</div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/register">
            <button className="cta-button group">
              <span>Kostenlos starten</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </Link>
          <Link href="#demo">
            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-full font-semibold hover:bg-white/20 transition-all hover:scale-105">
              Live-Demo ansehen
            </button>
          </Link>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-white/60"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span>DSGVO konform</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            <span>Made in Saarland</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            <span>150+ KMUs vertrauen uns</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  );
}