import { NextRequest, NextResponse } from 'next/server'
import { genAI, DEFAULT_MODEL, generationConfigs } from '@/lib/ai/gemini-client'

export async function POST(request: NextRequest) {
  try {
    const { industry } = await request.json()

    if (!industry) {
      return NextResponse.json(
        { error: 'Industry/problem is required' },
        { status: 400 }
      )
    }

    const model = genAI.getGenerativeModel({
      model: DEFAULT_MODEL,
      generationConfig: generationConfigs.creative,
    })

    const prompt = `Als Experte für KI-Dienstleistungen für kleine und mittlere Unternehmen (KMU) im Saarland, schlage eine innovative KI-gestützte Dienstleistung vor, die AgentlandOS anbieten könnte. Die Idee sollte auf folgender Eingabe basieren: "${industry}". Beschreibe die Dienstleistung (Name, Kernfunktion, Nutzen für den Kunden) kurz und prägnant in 2-4 Sätzen. Antworte auf Deutsch.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ idea: text })
  } catch (error) {
    console.error('Service idea generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate service idea' },
      { status: 500 }
    )
  }
}