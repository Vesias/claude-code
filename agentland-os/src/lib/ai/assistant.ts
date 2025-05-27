import { genAI, GEMINI_MODEL, defaultGenerationConfig } from './gemini'

export interface AssistantMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface AssistantOptions {
  systemPrompt?: string
  temperature?: number
  maxTokens?: number
}

export class AIAssistant {
  private model: any
  private history: AssistantMessage[] = []
  private systemPrompt: string

  constructor(options: AssistantOptions = {}) {
    this.systemPrompt = options.systemPrompt || `You are the AgentlandOS AI Assistant. 
You are a highly intelligent, creative, and helpful AI that assists users with their requests.
You have access to various tools and can help with coding, analysis, creative tasks, and more.
You communicate in a friendly, professional manner and adapt to the user's language (German or English).`

    this.model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      generationConfig: {
        ...defaultGenerationConfig,
        temperature: options.temperature || 0.7,
        maxOutputTokens: options.maxTokens || 2048,
      },
    })
  }

  async sendMessage(message: string): Promise<string> {
    try {
      // Add user message to history
      this.history.push({ role: 'user', content: message })

      // Prepare chat with system prompt and history
      const chat = this.model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: this.systemPrompt }],
          },
          {
            role: 'model',
            parts: [{ text: 'Verstanden! Ich bin bereit, Ihnen als AgentlandOS AI Assistant zu helfen.' }],
          },
          ...this.history.slice(0, -1).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
          })),
        ],
      })

      // Send message and get response
      const result = await chat.sendMessage(message)
      const response = await result.response
      const text = response.text()

      // Add assistant response to history
      this.history.push({ role: 'assistant', content: text })

      // Keep history manageable (last 20 messages)
      if (this.history.length > 20) {
        this.history = this.history.slice(-20)
      }

      return text
    } catch (error) {
      console.error('AI Assistant error:', error)
      return 'Entschuldigung, es gab einen Fehler bei der Verarbeitung Ihrer Anfrage. Bitte versuchen Sie es erneut.'
    }
  }

  async streamMessage(message: string, onChunk: (chunk: string) => void): Promise<void> {
    try {
      // Add user message to history
      this.history.push({ role: 'user', content: message })

      // Prepare chat with system prompt and history
      const chat = this.model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: this.systemPrompt }],
          },
          {
            role: 'model',
            parts: [{ text: 'Verstanden! Ich bin bereit, Ihnen als AgentlandOS AI Assistant zu helfen.' }],
          },
          ...this.history.slice(0, -1).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
          })),
        ],
      })

      // Send message and stream response
      const result = await chat.sendMessageStream(message)
      
      let fullResponse = ''
      for await (const chunk of result.stream) {
        const chunkText = chunk.text()
        fullResponse += chunkText
        onChunk(chunkText)
      }

      // Add complete response to history
      this.history.push({ role: 'assistant', content: fullResponse })

      // Keep history manageable
      if (this.history.length > 20) {
        this.history = this.history.slice(-20)
      }
    } catch (error) {
      console.error('AI Assistant streaming error:', error)
      onChunk('Entschuldigung, es gab einen Fehler bei der Verarbeitung Ihrer Anfrage.')
    }
  }

  clearHistory() {
    this.history = []
  }

  getHistory(): AssistantMessage[] {
    return [...this.history]
  }
}