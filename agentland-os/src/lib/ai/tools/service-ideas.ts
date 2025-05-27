import { streamText } from 'ai';
import { google, GEMINI_MODEL, systemPrompts } from '../gemini';

export interface ServiceIdeasInput {
  industry: string;
  targetMarket: string;
  budget?: string;
  challenges?: string;
  competitors?: string;
  uniqueValue?: string;
}

export async function generateServiceIdeas(input: ServiceIdeasInput) {
  const prompt = `
Industry: ${input.industry}
Target Market: ${input.targetMarket}
${input.budget ? `Budget Range: ${input.budget}` : ''}
${input.challenges ? `Current Challenges: ${input.challenges}` : ''}
${input.competitors ? `Main Competitors: ${input.competitors}` : ''}
${input.uniqueValue ? `Unique Value Proposition: ${input.uniqueValue}` : ''}

Generate 5 innovative service ideas that:
1. Address specific market needs
2. Differentiate from competitors
3. Are feasible within the budget constraints
4. Leverage current market trends
5. Have clear revenue potential

For each idea, provide:
- Service name and brief description
- Target customer segment
- Key features and benefits
- Implementation approach
- Potential revenue model
- Estimated startup requirements
`;

  const result = await streamText({
    model: google(GEMINI_MODEL),
    system: systemPrompts.serviceIdeas,
    prompt,
    temperature: 0.8,
    maxTokens: 2500,
  });

  return result;
}

// Non-streaming version for programmatic use
export async function getServiceIdeasList(input: ServiceIdeasInput): Promise<string[]> {
  const prompt = `
Industry: ${input.industry}
Target Market: ${input.targetMarket}

Generate a JSON array of 5 innovative service ideas. Return ONLY the JSON array, no other text.
Format: ["Service Name 1: Brief description", "Service Name 2: Brief description", ...]
`;

  const result = await streamText({
    model: google(GEMINI_MODEL),
    system: systemPrompts.serviceIdeas,
    prompt,
    temperature: 0.7,
    maxTokens: 500,
  });

  const text = await result.text;
  
  try {
    return JSON.parse(text);
  } catch {
    // Fallback: split by newlines if JSON parsing fails
    return text.split('\n').filter(line => line.trim().length > 0).slice(0, 5);
  }
}