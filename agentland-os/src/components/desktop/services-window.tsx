"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Sparkles, 
  Zap, 
  Globe, 
  Target, 
  BarChart, 
  Shield, 
  GraduationCap,
  Loader2
} from 'lucide-react'

interface ServiceWindowProps {
  onClose?: () => void
}

export function ServicesWindow({ onClose }: ServiceWindowProps) {
  const [industryInput, setIndustryInput] = useState('')
  const [serviceIdeaOutput, setServiceIdeaOutput] = useState('Hier könnte Ihre nächste große KI-Innovation stehen...')
  const [productInput, setProductInput] = useState('')
  const [sloganOutput, setSloganOutput] = useState('Ihre kreativen Marketing-Slogans erscheinen hier...')
  const [emailTopicInput, setEmailTopicInput] = useState('')
  const [emailTone, setEmailTone] = useState('freundlich')
  const [emailOutput, setEmailOutput] = useState('Ihr E-Mail-Entwurf wird hier angezeigt...')
  const [codeInput, setCodeInput] = useState('')
  const [codeLanguage, setCodeLanguage] = useState('JavaScript')
  const [codeExplanationOutput, setCodeExplanationOutput] = useState('Die Erklärung Ihres Codes erscheint hier...')
  const [loading, setLoading] = useState<string | null>(null)

  const handleGenerateServiceIdea = async () => {
    if (!industryInput.trim()) {
      setServiceIdeaOutput('Bitte geben Sie Ihre Branche oder ein Problem an.')
      return
    }

    setLoading('service-idea')
    try {
      const response = await fetch('/api/ai/service-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry: industryInput })
      })
      
      if (!response.ok) throw new Error('Failed to generate idea')
      
      const data = await response.json()
      setServiceIdeaOutput(data.idea)
    } catch (error) {
      console.error('Service idea error:', error)
      setServiceIdeaOutput('Fehler beim Generieren der Idee. Bitte versuchen Sie es später erneut.')
    } finally {
      setLoading(null)
    }
  }

  const handleGenerateSlogan = async () => {
    if (!productInput.trim()) {
      setSloganOutput('Bitte geben Sie Ihr Produkt oder Ihren Service an.')
      return
    }

    setLoading('slogan')
    try {
      const response = await fetch('/api/ai/slogan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: productInput })
      })
      
      if (!response.ok) throw new Error('Failed to generate slogans')
      
      const data = await response.json()
      setSloganOutput(data.slogans)
    } catch (error) {
      console.error('Slogan error:', error)
      setSloganOutput('Fehler beim Generieren der Slogans. Bitte versuchen Sie es später erneut.')
    } finally {
      setLoading(null)
    }
  }

  const handleGenerateEmail = async () => {
    if (!emailTopicInput.trim()) {
      setEmailOutput('Bitte geben Sie ein Thema oder Stichpunkte für die E-Mail an.')
      return
    }

    setLoading('email')
    try {
      const response = await fetch('/api/ai/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: emailTopicInput, tone: emailTone })
      })
      
      if (!response.ok) throw new Error('Failed to generate email')
      
      const data = await response.json()
      setEmailOutput(data.email)
    } catch (error) {
      console.error('Email error:', error)
      setEmailOutput('Fehler beim Generieren des E-Mail-Entwurfs. Bitte versuchen Sie es später erneut.')
    } finally {
      setLoading(null)
    }
  }

  const handleExplainCode = async () => {
    if (!codeInput.trim()) {
      setCodeExplanationOutput('Bitte fügen Sie einen Code-Schnipsel ein.')
      return
    }

    setLoading('code')
    try {
      const response = await fetch('/api/ai/code-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeInput, language: codeLanguage })
      })
      
      if (!response.ok) throw new Error('Failed to explain code')
      
      const data = await response.json()
      setCodeExplanationOutput(data.explanation)
    } catch (error) {
      console.error('Code explanation error:', error)
      setCodeExplanationOutput('Fehler beim Erklären des Codes. Bitte versuchen Sie es später erneut.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
        Transformieren Sie Ihr Unternehmen mit KI
      </h2>

      {/* Service Idea Generator */}
      <div className="mb-8 p-6 bg-black/40 rounded-lg border border-green-500/30">
        <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          KI-Service Idee für Ihr Unternehmen
        </h3>
        <label className="block text-sm text-gray-400 mb-2">Ihre Branche oder Ihr Problem:</label>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={industryInput}
            onChange={(e) => setIndustryInput(e.target.value)}
            placeholder="z.B. Einzelhandel, Kundenbindung"
            className="flex-1 px-4 py-2 bg-black/60 border border-green-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-400"
          />
          <button
            onClick={handleGenerateServiceIdea}
            disabled={loading === 'service-idea'}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg font-medium text-white hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading === 'service-idea' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : null}
            Idee generieren
          </button>
        </div>
        <div className="p-4 bg-black/40 rounded-lg border-l-4 border-purple-500 text-gray-300 whitespace-pre-wrap">
          {serviceIdeaOutput}
        </div>
      </div>

      {/* Slogan Generator */}
      <div className="mb-8 p-6 bg-black/40 rounded-lg border border-green-500/30">
        <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          KI-gestützter Marketing Slogan Generator
        </h3>
        <label className="block text-sm text-gray-400 mb-2">Ihr Produkt/Service:</label>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={productInput}
            onChange={(e) => setProductInput(e.target.value)}
            placeholder="z.B. Öko-Kaffee, Fahrrad-Reparatur"
            className="flex-1 px-4 py-2 bg-black/60 border border-green-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-400"
          />
          <button
            onClick={handleGenerateSlogan}
            disabled={loading === 'slogan'}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg font-medium text-white hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading === 'slogan' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : null}
            Slogans generieren
          </button>
        </div>
        <div className="p-4 bg-black/40 rounded-lg border-l-4 border-purple-500 text-gray-300 whitespace-pre-wrap">
          {sloganOutput}
        </div>
      </div>

      {/* Email Draft Generator */}
      <div className="mb-8 p-6 bg-black/40 rounded-lg border border-green-500/30">
        <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          KI-gestützte E-Mail-Entwurfshilfe
        </h3>
        <label className="block text-sm text-gray-400 mb-2">Thema / Stichpunkte für E-Mail:</label>
        <textarea
          value={emailTopicInput}
          onChange={(e) => setEmailTopicInput(e.target.value)}
          placeholder="z.B. Meeting-Anfrage, Produktvorstellung, Feedback-Bitte"
          rows={3}
          className="w-full px-4 py-2 mb-4 bg-black/60 border border-green-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-400 resize-none"
        />
        <label className="block text-sm text-gray-400 mb-2">Gewünschter Ton:</label>
        <select
          value={emailTone}
          onChange={(e) => setEmailTone(e.target.value)}
          className="w-full px-4 py-2 mb-4 bg-black/60 border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-400"
        >
          <option value="formell">Formell</option>
          <option value="freundlich">Freundlich</option>
          <option value="überzeugend">Überzeugend</option>
          <option value="informativ">Informativ</option>
          <option value="dringend">Dringend</option>
        </select>
        <button
          onClick={handleGenerateEmail}
          disabled={loading === 'email'}
          className="w-full px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg font-medium text-white hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading === 'email' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : null}
          E-Mail-Entwurf generieren
        </button>
        <div className="mt-4 p-4 bg-black/40 rounded-lg border-l-4 border-purple-500 text-gray-300 whitespace-pre-wrap min-h-[100px]">
          {emailOutput}
        </div>
      </div>

      {/* Code Explainer */}
      <div className="mb-8 p-6 bg-black/40 rounded-lg border border-green-500/30">
        <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          KI-gestützter Code-Erklärer
        </h3>
        <label className="block text-sm text-gray-400 mb-2">Code-Schnipsel:</label>
        <textarea
          value={codeInput}
          onChange={(e) => setCodeInput(e.target.value)}
          placeholder="Fügen Sie hier Ihren Code ein..."
          rows={5}
          className="w-full px-4 py-2 mb-4 bg-black/60 border border-green-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-400 resize-none font-mono text-sm"
        />
        <label className="block text-sm text-gray-400 mb-2">Programmiersprache:</label>
        <select
          value={codeLanguage}
          onChange={(e) => setCodeLanguage(e.target.value)}
          className="w-full px-4 py-2 mb-4 bg-black/60 border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-400"
        >
          <option value="Python">Python</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Java">Java</option>
          <option value="C++">C++</option>
          <option value="HTML">HTML</option>
          <option value="CSS">CSS</option>
          <option value="SQL">SQL</option>
          <option value="Unbekannt">Andere/Unbekannt</option>
        </select>
        <button
          onClick={handleExplainCode}
          disabled={loading === 'code'}
          className="w-full px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg font-medium text-white hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading === 'code' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : null}
          Code erklären
        </button>
        <div className="mt-4 p-4 bg-black/40 rounded-lg border-l-4 border-purple-500 text-gray-300 whitespace-pre-wrap min-h-[100px]">
          {codeExplanationOutput}
        </div>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ServiceCard
          icon={<Zap className="w-10 h-10" />}
          title="MCP Automation"
          description="Verbinden Sie Ihre Business-Tools mit KI-Power."
          gradient="from-yellow-400 to-orange-500"
        />
        <ServiceCard
          icon={<Globe className="w-10 h-10" />}
          title="Web Dominanz"
          description="KI-gestützte SEO & Content-Strategie."
          gradient="from-blue-400 to-purple-500"
        />
        <ServiceCard
          icon={<Target className="w-10 h-10" />}
          title="Individuelle Lösungen"
          description="Maßgeschneiderte KI-Automatisierungen."
          gradient="from-green-400 to-teal-500"
        />
        <ServiceCard
          icon={<BarChart className="w-10 h-10" />}
          title="KI Analytics"
          description="Prädiktive Einblicke & Berichterstattung."
          gradient="from-purple-400 to-pink-500"
        />
        <ServiceCard
          icon={<Shield className="w-10 h-10" />}
          title="Smarter Support"
          description="Immer verfügbare intelligente Hilfe."
          gradient="from-red-400 to-orange-500"
        />
        <ServiceCard
          icon={<GraduationCap className="w-10 h-10" />}
          title="KI Training"
          description="Stärken Sie Ihr Team."
          gradient="from-indigo-400 to-blue-500"
        />
      </div>
    </div>
  )
}

interface ServiceCardProps {
  icon: React.ReactNode
  title: string
  description: string
  gradient: string
}

function ServiceCard({ icon, title, description, gradient }: ServiceCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, translateY: -5 }}
      whileTap={{ scale: 0.95 }}
      className="relative p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-green-500/20 cursor-pointer overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300"
        style={{ backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
      />
      
      <div className={`mb-4 bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}>
        {icon}
      </div>
      
      <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
      
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-20 blur-3xl group-hover:opacity-30 transition-opacity"
        style={{ backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
      />
    </motion.div>
  )
}