import { NextRequest, NextResponse } from 'next/server'
import { genAI, DEFAULT_MODEL, generationConfigs } from '@/lib/ai/gemini-client'

export async function POST(request: NextRequest) {
  try {
    const { product } = await request.json()

    if (!product) {
      return NextResponse.json(
        { error: 'Product/service is required' },
        { status: 400 }
      )
    }

    const model = genAI.getGenerativeModel({
      model: DEFAULT_MODEL,
      generationConfig: generationConfigs.creative,
    })

    const prompt = `Erstelle 3 kurze und einprägsame Marketing-Slogans auf Deutsch für folgendes Produkt/Dienstleistung: "${product}". Gib nur die Slogans aus, jeweils in einer neuen Zeile.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ slogans: text })
  } catch (error) {
    console.error('Slogan generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate slogans' },
      { status: 500 }
    )
  }
}