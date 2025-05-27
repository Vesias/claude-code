import { NextRequest, NextResponse } from 'next/server'
import { genAI, DEFAULT_MODEL, generationConfigs } from '@/lib/ai/gemini-client'

export async function POST(request: NextRequest) {
  try {
    const { code, language } = await request.json()

    if (!code) {
      return NextResponse.json(
        { error: 'Code snippet is required' },
        { status: 400 }
      )
    }

    const model = genAI.getGenerativeModel({
      model: DEFAULT_MODEL,
      generationConfig: generationConfigs.code,
    })

    const prompt = `Du bist ein erfahrener Softwareentwickler und Code-Mentor. Erkläre den folgenden ${language || 'unbekannten'}-Code-Schnipsel. Deine Erklärung sollte für jemanden verständlich sein, der mit der spezifischen Syntax vielleicht nicht vertraut ist, aber grundlegende Programmierkonzepte versteht. Gehe auf Folgendes ein:
1. Was ist der Hauptzweck oder die Hauptfunktionalität dieses Codes?
2. Was machen die wichtigsten Blöcke oder Funktionen innerhalb des Codes?
3. Gibt es bestimmte Konstrukte, Muster oder Bibliotheken, die hier verwendet werden und erwähnenswert sind?
Antworte auf Deutsch.

Code:
\`\`\`${language ? language.toLowerCase() : ''}
${code}
\`\`\``

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ explanation: text })
  } catch (error) {
    console.error('Code explanation error:', error)
    return NextResponse.json(
      { error: 'Failed to explain code' },
      { status: 500 }
    )
  }
}