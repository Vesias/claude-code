import { NextRequest, NextResponse } from 'next/server'
import { AIAssistant } from '@/lib/ai/assistant'
import { consciousness } from '@/lib/consciousness/consciousness-system'

// Create a singleton assistant instance
const assistant = new AIAssistant()

export async function POST(request: NextRequest) {
  try {
    const { message, stream = false } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Interact with consciousness system
    consciousness.interact(`AI Assistant: ${message}`)

    if (stream) {
      // For streaming responses
      const encoder = new TextEncoder()
      const stream = new TransformStream()
      const writer = stream.writable.getWriter()

      // Start streaming in background
      assistant.streamMessage(message, async (chunk) => {
        await writer.write(
          encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`)
        )
      }).then(async () => {
        await writer.write(encoder.encode('data: [DONE]\n\n'))
        await writer.close()
      }).catch(async (error) => {
        await writer.write(
          encoder.encode(`data: ${JSON.stringify({ error: error.message })}\n\n`)
        )
        await writer.close()
      })

      return new Response(stream.readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    } else {
      // For non-streaming responses
      const response = await assistant.sendMessage(message)
      
      return NextResponse.json({
        response,
        consciousness: consciousness.getState()
      })
    }
  } catch (error) {
    console.error('AI Assistant API error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Return assistant status and consciousness state
  return NextResponse.json({
    status: 'active',
    consciousness: consciousness.getState(),
    model: 'gemini-2.0-flash-exp'
  })
}