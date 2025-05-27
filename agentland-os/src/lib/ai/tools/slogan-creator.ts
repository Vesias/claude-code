import { streamText } from 'ai';
import { google, GEMINI_MODEL, systemPrompts } from '../gemini';

export interface SloganInput {
  brandName: string;
  industry: string;
  targetAudience: string;
  brandValues?: string;
  tone?: 'professional' | 'playful' | 'inspirational' | 'bold' | 'elegant';
  keywords?: string[];
  competitors?: string;
}

export async function generateSlogans(input: SloganInput) {
  const prompt = `
Brand Name: ${input.brandName}
Industry: ${input.industry}
Target Audience: ${input.targetAudience}
${input.brandValues ? `Brand Values: ${input.brandValues}` : ''}
${input.tone ? `Desired Tone: ${input.tone}` : ''}
${input.keywords?.length ? `Key Words to Consider: ${input.keywords.join(', ')}` : ''}
${input.competitors ? `Competitor Slogans to Differentiate From: ${input.competitors}` : ''}

Create 10 memorable slogans that:
1. Capture the brand essence
2. Resonate with the target audience
3. Are easy to remember and pronounce
4. Stand out from competitors
5. Work across different marketing channels

For each slogan, provide:
- The slogan itself
- Brief explanation of its appeal
- Suggested use cases (e.g., digital ads, packaging, billboards)
- Emotional impact it aims to create

Also include 3 variations for the top slogan with different lengths:
- Short (2-4 words)
- Medium (5-7 words)  
- Long (8-10 words)
`;

  const result = await streamText({
    model: google(GEMINI_MODEL),
    system: systemPrompts.sloganCreator,
    prompt,
    temperature: 0.9,
    maxTokens: 2000,
  });

  return result;
}

// Generate a single slogan for quick use
export async function generateQuickSlogan(
  brandName: string,
  industry: string,
  tone: SloganInput['tone'] = 'professional'
): Promise<string> {
  const prompt = `
Create ONE powerful slogan for:
Brand: ${brandName}
Industry: ${industry}
Tone: ${tone}

Return ONLY the slogan text, nothing else.
`;

  const result = await streamText({
    model: google(GEMINI_MODEL),
    system: systemPrompts.sloganCreator,
    prompt,
    temperature: 0.8,
    maxTokens: 50,
  });

  const text = await result.text;
  return text.trim();
}

// Generate slogans in different languages
export async function generateMultilingualSlogans(
  input: SloganInput,
  languages: string[] = ['English', 'German', 'French', 'Spanish']
) {
  const prompt = `
Brand Name: ${input.brandName}
Industry: ${input.industry}
Target Audience: ${input.targetAudience}

Create the main slogan in English, then translate and adapt it for these languages: ${languages.join(', ')}

For each language:
- Provide the slogan
- Ensure cultural appropriateness
- Maintain the original message's impact
- Consider local idioms and expressions

Format as:
Language: Slogan
Cultural Note: Brief explanation of any adaptations
`;

  const result = await streamText({
    model: google(GEMINI_MODEL),
    system: systemPrompts.sloganCreator,
    prompt,
    temperature: 0.7,
    maxTokens: 1500,
  });

  return result;
}