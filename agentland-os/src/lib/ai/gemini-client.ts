import { GoogleGenerativeAI } from '@google/generative-ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is not set');
}

// Standard Gemini client for non-streaming use cases
export const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY
);

// Vercel AI SDK Gemini provider for streaming
export const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

// Available models
export const GEMINI_MODELS = {
  FLASH: 'gemini-2.0-flash-exp',
  PRO: 'gemini-1.5-pro',
  FLASH_8B: 'gemini-2.0-flash-8b',
} as const;

// Default model
export const DEFAULT_MODEL = GEMINI_MODELS.FLASH;

// Common generation configurations
export const generationConfigs = {
  creative: {
    temperature: 0.9,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048,
  },
  balanced: {
    temperature: 0.7,
    topK: 20,
    topP: 0.9,
    maxOutputTokens: 2048,
  },
  precise: {
    temperature: 0.3,
    topK: 5,
    topP: 0.8,
    maxOutputTokens: 2048,
  },
  code: {
    temperature: 0.2,
    topK: 1,
    topP: 0.7,
    maxOutputTokens: 4096,
  },
} as const;

// Helper function to create a model instance
export function createModel(modelName: string = DEFAULT_MODEL) {
  return genAI.getGenerativeModel({ model: modelName });
}

// Helper function for streaming with Vercel AI SDK
export function getStreamingModel(modelName: string = DEFAULT_MODEL) {
  return google(modelName);
}