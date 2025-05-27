'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Euro, FileText, Users, TrendingUp, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface BusinessWorkspaceProps {
  workspace: {
    id: string;
    name: string;
    businessProfile?: {
      companyName: string;
      taxId: string;
      industry: string;
      size: 'micro' | 'small' | 'medium';
    };
    subscription?: {
      tier: 'starter' | 'professional' | 'enterprise';
      mrr: number;
      nextBillingDate: string;
    };
    complianceStatus?: {
      gdpr: boolean;
      gobd: boolean;
      lastAudit: string;
    };
  };
}

export function BusinessWorkspace({ workspace }: BusinessWorkspaceProps) {
  const subscriptionColors = {
    starter: 'from-blue-500 to-blue-600',
    professional: 'from-purple-500 to-purple-600',
    enterprise: 'from-yellow-500 to-yellow-600'
  };

  return (
    <div className="space-y-6">
      {/* Business Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {workspace.businessProfile?.companyName || workspace.name}
              </h2>
              <p className="text-gray-400">
                {workspace.businessProfile?.industry} • {workspace.businessProfile?.size === 'micro' ? 'Kleinstunternehmen' : workspace.businessProfile?.size === 'small' ? 'Kleinunternehmen' : 'Mittelstand'}
              </p>
            </div>
          </div>
          
          {workspace.subscription && (
            <div className={`bg-gradient-to-r ${subscriptionColors[workspace.subscription.tier]} px-4 py-2 rounded-lg`}>
              <p className="text-white font-semibold capitalize">
                {workspace.subscription.tier} Plan
              </p>
              <p className="text-white/80 text-sm">
                €{workspace.subscription.mrr}/Monat
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Business Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Revenue Card */}
        <Card className="p-6 bg-gray-900/50 border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Monatlicher Umsatz</p>
              <p className="text-2xl font-bold text-white mt-1">
                €{workspace.subscription?.mrr || 0}
              </p>
              <p className="text-green-500 text-sm mt-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12% zum Vormonat
              </p>
            </div>
            <Euro className="w-8 h-8 text-primary" />
          </div>
        </Card>

        {/* Compliance Status */}
        <Card className="p-6 bg-gray-900/50 border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Compliance Status</p>
              <div className="mt-2 space-y-1">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${workspace.complianceStatus?.gdpr ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-white text-sm">GDPR/DSGVO</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${workspace.complianceStatus?.gobd ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <span className="text-white text-sm">GoBD</span>
                </div>
              </div>
            </div>
            <Shield className="w-8 h-8 text-primary" />
          </div>
        </Card>

        {/* Active Agents */}
        <Card className="p-6 bg-gray-900/50 border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Aktive Business Agents</p>
              <p className="text-2xl font-bold text-white mt-1">6</p>
              <div className="flex -space-x-2 mt-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-gray-900" title="Email Agent" />
                <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900" title="DATEV Agent" />
                <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-gray-900" title="Invoice Agent" />
                <div className="w-6 h-6 bg-yellow-500 rounded-full border-2 border-gray-900" title="CRM Agent" />
              </div>
            </div>
            <Users className="w-8 h-8 text-primary" />
          </div>
        </Card>
      </div>

      {/* German Business Features */}
      <Card className="p-6 bg-gray-900/50 border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-primary" />
          Deutsche Geschäftsfunktionen
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-primary transition-colors text-left"
          >
            <h4 className="font-semibold text-white">DATEV Integration</h4>
            <p className="text-gray-400 text-sm mt-1">
              Automatischer Export für Ihren Steuerberater
            </p>
            <p className="text-primary text-xs mt-2">Konfigurieren →</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-primary transition-colors text-left"
          >
            <h4 className="font-semibold text-white">Lexware Anbindung</h4>
            <p className="text-gray-400 text-sm mt-1">
              Nahtlose Buchhaltungsintegration
            </p>
            <p className="text-primary text-xs mt-2">Verbinden →</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-primary transition-colors text-left"
          >
            <h4 className="font-semibold text-white">E-Rechnung Generator</h4>
            <p className="text-gray-400 text-sm mt-1">
              XRechnung & ZUGFeRD kompatibel
            </p>
            <p className="text-primary text-xs mt-2">Agent starten →</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-primary transition-colors text-left"
          >
            <h4 className="font-semibold text-white">Umsatzsteuer-Voranmeldung</h4>
            <p className="text-gray-400 text-sm mt-1">
              Automatisierte UStVA mit ELSTER
            </p>
            <p className="text-primary text-xs mt-2">Einrichten →</p>
          </motion.button>
        </div>
      </Card>
    </div>
  );
}