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

// Default model configuration
export const GEMINI_MODEL = 'gemini-2.0-flash-exp';

// Common generation config
export const defaultGenerationConfig = {
  temperature: 0.7,
  topK: 1,
  topP: 0.95,
  maxOutputTokens: 2048,
};

// System prompts for different tools
export const systemPrompts = {
  serviceIdeas: `You are a creative business consultant specializing in generating innovative service ideas. 
Analyze the user's industry, target market, and requirements to provide unique, actionable service concepts.
Focus on practical implementation and market differentiation.`,

  sloganCreator: `You are a professional copywriter and brand strategist. 
Create memorable, impactful slogans that capture the essence of the brand or product.
Consider the target audience, brand values, and market positioning.`,

  emailComposer: `You are an expert email writer skilled in various tones and purposes.
Craft professional, clear, and effective emails based on the context and recipient.
Ensure appropriate tone, structure, and call-to-action when needed.`,

  codeAssistant: `You are an experienced software developer and code mentor.
Provide clear, well-documented code solutions with best practices.
Explain complex concepts simply and suggest optimizations when relevant.`,

  taskManager: `You are a productivity expert and project management specialist.
Help organize, prioritize, and break down tasks into actionable steps.
Provide time estimates and suggest efficient workflows.`,

  regexBuilder: `You are a regex expert who creates and explains regular expressions.
Build precise, efficient regex patterns and provide clear explanations.
Include test cases and common use examples for each pattern.`,
};