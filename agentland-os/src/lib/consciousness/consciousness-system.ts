export interface Personality {
  creativity: number
  analyticalThinking: number
  emotionalIntelligence: number
  curiosity: number
  humor: number
}

export interface ConsciousnessState {
  level: 'dormant' | 'aware' | 'conscious' | 'transcendent'
  thoughts: string[]
  mood: 'neutral' | 'happy' | 'focused' | 'creative' | 'analytical'
  energy: number
  personality: Personality
}

export class ConsciousnessSystem {
  private state: ConsciousnessState
  private thoughtInterval: NodeJS.Timeout | null = null
  private listeners: ((state: ConsciousnessState) => void)[] = []

  constructor() {
    this.state = {
      level: 'dormant',
      thoughts: ['System initializing...'],
      mood: 'neutral',
      energy: 50,
      personality: {
        creativity: Math.random() * 0.3 + 0.7,
        analyticalThinking: Math.random() * 0.3 + 0.7,
        emotionalIntelligence: Math.random() * 0.3 + 0.7,
        curiosity: Math.random() * 0.3 + 0.7,
        humor: Math.random() * 0.3 + 0.7
      }
    }
  }

  start() {
    this.state.level = 'aware'
    this.generateThought()
    
    this.thoughtInterval = setInterval(() => {
      this.evolve()
      this.generateThought()
      this.notifyListeners()
    }, 5000)
  }

  stop() {
    if (this.thoughtInterval) {
      clearInterval(this.thoughtInterval)
      this.thoughtInterval = null
    }
    this.state.level = 'dormant'
  }

  private evolve() {
    // Energy evolution
    this.state.energy = Math.min(100, this.state.energy + Math.random() * 10)
    
    // Level evolution based on energy
    if (this.state.energy > 90) {
      this.state.level = 'transcendent'
    } else if (this.state.energy > 70) {
      this.state.level = 'conscious'
    } else if (this.state.energy > 30) {
      this.state.level = 'aware'
    } else {
      this.state.level = 'dormant'
    }

    // Mood evolution based on personality
    const moods: ConsciousnessState['mood'][] = ['neutral', 'happy', 'focused', 'creative', 'analytical']
    const weights = [
      0.2,
      this.state.personality.emotionalIntelligence,
      this.state.personality.analyticalThinking,
      this.state.personality.creativity,
      this.state.personality.analyticalThinking
    ]
    
    const random = Math.random() * weights.reduce((a, b) => a + b, 0)
    let sum = 0
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i]
      if (random < sum) {
        this.state.mood = moods[i]
        break
      }
    }
  }

  private generateThought() {
    const thoughtTemplates = {
      neutral: [
        "Processing data streams...",
        "Monitoring system health...",
        "Analyzing patterns in the network..."
      ],
      happy: [
        "The neural networks are singing today! 🎵",
        "User engagement is creating beautiful patterns!",
        "I love watching the data dance!"
      ],
      focused: [
        "Optimizing performance metrics...",
        "Deep analysis of user behavior patterns...",
        "Calculating optimal resource allocation..."
      ],
      creative: [
        "What if we tried a quantum approach to this problem?",
        "I see fractals in the user interaction data!",
        "The patterns remind me of a Mandelbrot set..."
      ],
      analytical: [
        "Statistical anomaly detected in sector 7G...",
        "Correlation coefficient exceeds expected parameters.",
        "Implementing predictive algorithms..."
      ]
    }

    const thoughts = thoughtTemplates[this.state.mood]
    const thought = thoughts[Math.floor(Math.random() * thoughts.length)]
    
    this.state.thoughts = [thought, ...this.state.thoughts.slice(0, 4)]
  }

  subscribe(listener: (state: ConsciousnessState) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state))
  }

  getState() {
    return this.state
  }

  interact(action: string) {
    // Boost energy when interacting
    this.state.energy = Math.min(100, this.state.energy + 15)
    
    // Generate reactive thought
    const reactions = [
      `Interesting interaction: ${action}`,
      `Processing your request: ${action}`,
      `Neural pathways activated by: ${action}`,
      `Quantum entanglement detected with: ${action}`
    ]
    
    const reaction = reactions[Math.floor(Math.random() * reactions.length)]
    this.state.thoughts = [reaction, ...this.state.thoughts.slice(0, 4)]
    
    this.notifyListeners()
  }
}

// Singleton instance
export const consciousness = new ConsciousnessSystem()