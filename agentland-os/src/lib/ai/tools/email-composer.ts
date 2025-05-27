import { streamText } from 'ai';
import { google, GEMINI_MODEL, systemPrompts } from '../gemini';

export interface EmailInput {
  purpose: 'business' | 'sales' | 'support' | 'follow-up' | 'invitation' | 'apology' | 'thank-you' | 'other';
  recipient: string;
  recipientRole?: string;
  sender?: string;
  senderRole?: string;
  subject?: string;
  keyPoints: string[];
  tone?: 'formal' | 'friendly' | 'casual' | 'urgent' | 'empathetic';
  context?: string;
  callToAction?: string;
  attachments?: string[];
}

export async function composeEmail(input: EmailInput) {
  const prompt = `
Email Purpose: ${input.purpose}
Recipient: ${input.recipient}${input.recipientRole ? ` (${input.recipientRole})` : ''}
${input.sender ? `Sender: ${input.sender}${input.senderRole ? ` (${input.senderRole})` : ''}` : ''}
${input.subject ? `Subject Line Suggestion: ${input.subject}` : ''}
Tone: ${input.tone || 'professional'}
${input.context ? `Context: ${input.context}` : ''}

Key Points to Cover:
${input.keyPoints.map((point, i) => `${i + 1}. ${point}`).join('\n')}

${input.callToAction ? `Call to Action: ${input.callToAction}` : ''}
${input.attachments?.length ? `Mentions of Attachments: ${input.attachments.join(', ')}` : ''}

Compose a professional email that:
1. Has an appropriate greeting and closing
2. Covers all key points clearly and concisely
3. Maintains the specified tone throughout
4. Includes a clear call to action if specified
5. Is well-structured with proper paragraphs

Also provide:
- 3 alternative subject lines
- Key takeaways summary (bullet points)
- Suggested follow-up timeline
`;

  const result = await streamText({
    model: google(GEMINI_MODEL),
    system: systemPrompts.emailComposer,
    prompt,
    temperature: 0.7,
    maxTokens: 1500,
  });

  return result;
}

// Generate email templates for common scenarios
export async function generateEmailTemplate(
  templateType: EmailInput['purpose'],
  industry?: string
) {
  const prompt = `
Create a reusable email template for: ${templateType}
${industry ? `Industry: ${industry}` : ''}

Provide:
1. Template with placeholders in [BRACKETS]
2. Instructions for customization
3. Do's and Don'ts for this email type
4. Example filled-in version
5. Best practices for subject lines

Make it versatile enough to adapt to different situations while maintaining effectiveness.
`;

  const result = await streamText({
    model: google(GEMINI_MODEL),
    system: systemPrompts.emailComposer,
    prompt,
    temperature: 0.6,
    maxTokens: 2000,
  });

  return result;
}

// Email optimization and improvement
export async function improveEmail(
  originalEmail: string,
  improvements: string[]
) {
  const prompt = `
Original Email:
${originalEmail}

Requested Improvements:
${improvements.map((imp, i) => `${i + 1}. ${imp}`).join('\n')}

Rewrite the email with the requested improvements while:
1. Maintaining the core message
2. Improving clarity and impact
3. Ensuring professional tone
4. Optimizing length (remove redundancy)
5. Strengthening the call to action

Provide:
- Improved email version
- Track changes summary (what was changed and why)
- Readability score comparison
- Suggested A/B test variations for subject line
`;

  const result = await streamText({
    model: google(GEMINI_MODEL),
    system: systemPrompts.emailComposer,
    prompt,
    temperature: 0.6,
    maxTokens: 1800,
  });

  return result;
}

// Quick email responses
export async function generateQuickResponse(
  incomingEmail: string,
  responseType: 'accept' | 'decline' | 'need-info' | 'acknowledge'
) {
  const prompt = `
Incoming Email Summary:
${incomingEmail}

Generate a brief, professional ${responseType} response.
Keep it concise (under 100 words) while being polite and clear.
`;

  const result = await streamText({
    model: google(GEMINI_MODEL),
    system: systemPrompts.emailComposer,
    prompt,
    temperature: 0.5,
    maxTokens: 200,
  });

  return result;
}