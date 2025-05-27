"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  MapPin, 
  Phone,
  Heart
} from "lucide-react"

const footerLinks = {
  produkt: [
    { label: "Funktionen", href: "#features" },
    { label: "Preise", href: "#pricing" },
    { label: "Pipeline", href: "#pipeline" },
    { label: "Roadmap", href: "#roadmap" },
  ],
  unternehmen: [
    { label: "Über uns", href: "#about" },
    { label: "Karriere", href: "#careers" },
    { label: "Blog", href: "#blog" },
    { label: "Presse", href: "#press" },
  ],
  rechtliches: [
    { label: "Impressum", href: "#imprint" },
    { label: "Datenschutz", href: "#privacy" },
    { label: "AGB", href: "#terms" },
    { label: "Cookie-Einstellungen", href: "#cookies" },
  ],
  support: [
    { label: "Dokumentation", href: "#docs" },
    { label: "FAQ", href: "#faq" },
    { label: "Status", href: "#status" },
    { label: "Kontakt", href: "#contact" },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold text-white">
                AgentlandOS
              </span>
            </Link>
            <p className="text-sm mb-4">
              Die führende Multi-Agent KI-Plattform für den saarländischen Mittelstand.
              Entwickelt mit ❤️ im Saarland.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>66111 Saarbrücken, Saarland</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>+49 681 123 456 78</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>info@agentland.saarland</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h3 className="font-semibold text-white mb-4">Produkt</h3>
            <ul className="space-y-2">
              {footerLinks.produkt.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Unternehmen</h3>
            <ul className="space-y-2">
              {footerLinks.unternehmen.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Rechtliches</h3>
            <ul className="space-y-2">
              {footerLinks.rechtliches.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 py-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-white mb-2">
                Bleiben Sie auf dem Laufenden
              </h3>
              <p className="text-sm">
                Erhalten Sie Updates zu neuen Features und Best Practices.
              </p>
            </div>
            <form className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="ihre@email.de"
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 flex-1 md:w-64"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Anmelden
              </motion.button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm">
            © 2025 AgentlandOS. Alle Rechte vorbehalten.
          </div>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-white transition-colors">
              <Github size={20} />
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              <Linkedin size={20} />
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              <Twitter size={20} />
            </Link>
          </div>
        </div>

        {/* Made with Love */}
        <div className="text-center mt-8 text-sm text-gray-500">
          Made with <Heart size={14} className="inline text-red-500" fill="currentColor" /> in Saarland
        </div>
      </div>
    </footer>
  )
}