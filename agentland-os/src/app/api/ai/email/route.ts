import { NextRequest, NextResponse } from 'next/server'
import { genAI, DEFAULT_MODEL, generationConfigs } from '@/lib/ai/gemini-client'

export async function POST(request: NextRequest) {
  try {
    const { topic, tone } = await request.json()

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      )
    }

    const model = genAI.getGenerativeModel({
      model: DEFAULT_MODEL,
      generationConfig: generationConfigs.balanced,
    })

    const prompt = `Verfasse einen E-Mail-Entwurf auf Deutsch. Die E-Mail soll sich um Folgendes drehen: "${topic}". Der gewünschte Ton ist "${tone || 'freundlich'}". Stelle sicher, dass die E-Mail eine klare Struktur, eine passende Anrede und eine Grußformel enthält.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ email: text })
  } catch (error) {
    console.error('Email generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate email draft' },
      { status: 500 }
    )
  }
}