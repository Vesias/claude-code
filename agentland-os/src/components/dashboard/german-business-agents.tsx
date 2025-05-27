'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Megaphone, 
  FileSpreadsheet, 
  Users, 
  CheckSquare, 
  Code,
  Euro,
  Building,
  Calculator
} from 'lucide-react';

interface BusinessAgent {
  id: string;
  name: string;
  germanName: string;
  description: string;
  icon: React.ElementType;
  color: string;
  category: 'communication' | 'finance' | 'marketing' | 'operations';
  status: 'active' | 'inactive' | 'training';
}

const businessAgents: BusinessAgent[] = [
  {
    id: 'email-composer',
    name: 'Email Composer Agent',
    germanName: 'Geschäftskorrespondenz-Agent',
    description: 'Erstellt professionelle E-Mails nach deutschen Standards',
    icon: Mail,
    color: 'from-blue-500 to-blue-600',
    category: 'communication',
    status: 'active'
  },
  {
    id: 'slogan-creator',
    name: 'Slogan Creator Agent',
    germanName: 'Marketing-Slogan-Agent',
    description: 'Generiert eingängige Werbeslogans für Ihr Unternehmen',
    icon: Megaphone,
    color: 'from-purple-500 to-purple-600',
    category: 'marketing',
    status: 'active'
  },
  {
    id: 'datev-connector',
    name: 'DATEV Integration Agent',
    germanName: 'DATEV-Schnittstellen-Agent',
    description: 'Automatisiert Buchhaltungsexporte für Steuerberater',
    icon: FileSpreadsheet,
    color: 'from-green-500 to-green-600',
    category: 'finance',
    status: 'active'
  },
  {
    id: 'invoice-processor',
    name: 'Invoice Processor Agent',
    germanName: 'Rechnungsverarbeitungs-Agent',
    description: 'XRechnung & ZUGFeRD kompatible Rechnungserstellung',
    icon: Calculator,
    color: 'from-yellow-500 to-yellow-600',
    category: 'finance',
    status: 'active'
  },
  {
    id: 'crm-pipeline',
    name: 'Customer Pipeline Agent',
    germanName: 'Kundenbeziehungs-Agent',
    description: 'Verwaltet Kundenbeziehungen und Vertriebspipeline',
    icon: Users,
    color: 'from-pink-500 to-pink-600',
    category: 'operations',
    status: 'training'
  },
  {
    id: 'task-manager',
    name: 'Task Manager Agent',
    germanName: 'Aufgabenverwaltungs-Agent',
    description: 'Organisiert Projekte und Team-Aufgaben effizient',
    icon: CheckSquare,
    color: 'from-indigo-500 to-indigo-600',
    category: 'operations',
    status: 'active'
  }
];

export function GermanBusinessAgents() {
  const categories = {
    communication: { name: 'Kommunikation', icon: Mail },
    finance: { name: 'Finanzen & Buchhaltung', icon: Euro },
    marketing: { name: 'Marketing & Vertrieb', icon: Megaphone },
    operations: { name: 'Betrieb & Organisation', icon: Building }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          Spezialisierte Business-Agenten für deutsche KMUs
        </h2>
        <p className="text-gray-400">
          KI-gestützte Automatisierung für Ihre Geschäftsprozesse
        </p>
      </div>

      {/* Agent Categories */}
      {Object.entries(categories).map(([categoryKey, category]) => {
        const categoryAgents = businessAgents.filter(
          agent => agent.category === categoryKey
        );

        if (categoryAgents.length === 0) return null;

        return (
          <div key={categoryKey} className="space-y-4">
            <div className="flex items-center space-x-2 text-gray-300">
              <category.icon className="w-5 h-5" />
              <h3 className="text-lg font-semibold">{category.name}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryAgents.map((agent, index) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm"
                >
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      agent.status === 'active' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : agent.status === 'training'
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}>
                      {agent.status === 'active' ? 'Aktiv' : 
                       agent.status === 'training' ? 'Training' : 'Inaktiv'}
                    </span>
                  </div>

                  {/* Agent Card */}
                  <div className="p-6">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center mb-4`}>
                      <agent.icon className="w-6 h-6 text-white" />
                    </div>

                    <h4 className="text-lg font-semibold text-white mb-1">
                      {agent.germanName}
                    </h4>
                    <p className="text-sm text-gray-400 mb-4">
                      {agent.description}
                    </p>

                    <button
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
                        agent.status === 'active'
                          ? 'bg-primary/20 text-primary hover:bg-primary/30 border border-primary/50'
                          : 'bg-gray-700/50 text-gray-400 cursor-not-allowed border border-gray-700'
                      }`}
                      disabled={agent.status !== 'active'}
                    >
                      {agent.status === 'active' ? 'Agent starten' : 
                       agent.status === 'training' ? 'In Entwicklung' : 'Nicht verfügbar'}
                    </button>
                  </div>

                  {/* Gradient Overlay */}
                  <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${agent.color}`} />
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Integration Notice */}
      <div className="mt-8 p-6 bg-blue-900/20 border border-blue-500/30 rounded-xl">
        <div className="flex items-start space-x-3">
          <Building className="w-6 h-6 text-blue-400 mt-0.5" />
          <div>
            <h4 className="text-white font-semibold mb-1">
              Nahtlose Integration in Ihre bestehenden Systeme
            </h4>
            <p className="text-gray-300 text-sm">
              Alle Business-Agenten sind kompatibel mit DATEV, Lexware, ELSTER und anderen 
              deutschen Standardsystemen. Die Agenten arbeiten GDPR-konform und erfüllen 
              alle Anforderungen der GoBD.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}