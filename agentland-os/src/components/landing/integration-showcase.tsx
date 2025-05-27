'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, FileSpreadsheet, Receipt, Shield } from 'lucide-react';

export function IntegrationShowcase() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 integration-showcase">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Nahtlose Integration in Ihre Systeme
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            AgentlandOS arbeitet perfekt mit den Tools zusammen, die deutsche KMUs täglich nutzen.
            Keine aufwendige Umstellung, sofort einsatzbereit.
          </p>
        </motion.div>

        <div className="integration-logos">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="integration-logo"
          >
            <div className="text-2xl font-bold text-white">DATEV</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="integration-logo"
          >
            <div className="text-2xl font-bold text-white">Lexware</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="integration-logo"
          >
            <div className="text-2xl font-bold text-white">ELSTER</div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 mt-16"
        >
          <div className="text-center">
            <FileSpreadsheet className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Automatischer Export</h3>
            <p className="text-gray-400">
              Alle Buchungen werden automatisch im richtigen Format exportiert
            </p>
          </div>
          
          <div className="text-center">
            <Receipt className="w-12 h-12 text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Rechtskonforme Belege</h3>
            <p className="text-gray-400">
              GoBD-konforme Archivierung aller Dokumente und Belege
            </p>
          </div>
          
          <div className="text-center">
            <Shield className="w-12 h-12 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Sichere Verbindung</h3>
            <p className="text-gray-400">
              Ende-zu-Ende verschlüsselte Datenübertragung
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}