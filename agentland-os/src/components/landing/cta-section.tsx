'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export function CTASection() {
  return (
    <section className="cta-section">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Bereit, Ihr Business zu transformieren?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Starten Sie heute mit AgentlandOS und erleben Sie, wie KI-Agenten 
            Ihren Arbeitsalltag revolutionieren. Keine Kreditkarte erforderlich.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/register">
              <button className="cta-button group">
                <span>14 Tage kostenlos testen</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
            
            <button className="flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-full font-semibold hover:bg-white/20 transition-all">
              <Calendar className="w-5 h-5" />
              Demo vereinbaren
            </button>
          </div>
          
          <p className="text-gray-400">
            Oder rufen Sie uns an: <span className="text-white font-semibold">+49 681 123 456</span>
          </p>
        </motion.div>

        {/* Live Chat Widget Placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <button className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
            <MessageCircle className="w-6 h-6 text-white" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}