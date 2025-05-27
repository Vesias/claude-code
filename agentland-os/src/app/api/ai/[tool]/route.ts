import { NextRequest } from 'next/server';
import { z } from 'zod';
import { generateServiceIdeas } from '@/lib/ai/tools/service-ideas';
import { generateSlogans } from '@/lib/ai/tools/slogan-creator';
import { composeEmail } from '@/lib/ai/tools/email-composer';
import { assistWithCode } from '@/lib/ai/tools/code-assistant';
import { manageTasks } from '@/lib/ai/tools/task-manager';
import { buildRegex } from '@/lib/ai/tools/regex-builder';

// Input validation schemas
const serviceIdeasSchema = z.object({
  industry: z.string(),
  targetMarket: z.string(),
  budget: z.string().optional(),
  challenges: z.string().optional(),
  competitors: z.string().optional(),
  uniqueValue: z.string().optional(),
});

const sloganSchema = z.object({
  brandName: z.string(),
  industry: z.string(),
  targetAudience: z.string(),
  brandValues: z.string().optional(),
  tone: z.enum(['professional', 'playful', 'inspirational', 'bold', 'elegant']).optional(),
  keywords: z.array(z.string()).optional(),
  competitors: z.string().optional(),
});

const emailSchema = z.object({
  purpose: z.enum(['business', 'sales', 'support', 'follow-up', 'invitation', 'apology', 'thank-you', 'other']),
  recipient: z.string(),
  recipientRole: z.string().optional(),
  sender: z.string().optional(),
  senderRole: z.string().optional(),
  subject: z.string().optional(),
  keyPoints: z.array(z.string()),
  tone: z.enum(['formal', 'friendly', 'casual', 'urgent', 'empathetic']).optional(),
  context: z.string().optional(),
  callToAction: z.string().optional(),
  attachments: z.array(z.string()).optional(),
});

const codeAssistantSchema = z.object({
  task: z.enum(['debug', 'optimize', 'explain', 'generate', 'review', 'refactor', 'test']),
  language: z.string(),
  code: z.string().optional(),
  requirements: z.string().optional(),
  context: z.string().optional(),
  framework: z.string().optional(),
  errorMessage: z.string().optional(),
  performanceGoals: z.string().optional(),
});

const taskManagerSchema = z.object({
  action: z.enum(['organize', 'prioritize', 'breakdown', 'schedule', 'analyze', 'delegate']),
  tasks: z.array(z.string()).optional(),
  project: z.string().optional(),
  deadline: z.string().optional(),
  resources: z.array(z.string()).optional(),
  constraints: z.string().optional(),
  teamSize: z.number().optional(),
  currentProgress: z.string().optional(),
});

const regexBuilderSchema = z.object({
  task: z.enum(['create', 'explain', 'test', 'optimize', 'convert', 'debug']),
  description: z.string().optional(),
  pattern: z.string().optional(),
  testCases: z.array(z.string()).optional(),
  language: z.string().optional(),
  flags: z.array(z.string()).optional(),
  examples: z.object({
    valid: z.array(z.string()),
    invalid: z.array(z.string()),
  }).optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { tool: string } }
) {
  try {
    const tool = params.tool;
    const body = await request.json();

    // Route to appropriate tool handler
    switch (tool) {
      case 'service-ideas': {
        const input = serviceIdeasSchema.parse(body);
        const stream = await generateServiceIdeas(input);
        return stream.toDataStreamResponse();
      }

      case 'slogan-creator': {
        const input = sloganSchema.parse(body);
        const stream = await generateSlogans(input);
        return stream.toDataStreamResponse();
      }

      case 'email-composer': {
        const input = emailSchema.parse(body);
        const stream = await composeEmail(input);
        return stream.toDataStreamResponse();
      }

      case 'code-assistant': {
        const input = codeAssistantSchema.parse(body);
        const stream = await assistWithCode(input);
        return stream.toDataStreamResponse();
      }

      case 'task-manager': {
        const input = taskManagerSchema.parse(body);
        const stream = await manageTasks(input);
        return stream.toDataStreamResponse();
      }

      case 'regex-builder': {
        const input = regexBuilderSchema.parse(body);
        const stream = await buildRegex(input);
        return stream.toDataStreamResponse();
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid tool specified' }),
          { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        );
    }
  } catch (error) {
    console.error('API Error:', error);
    
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid input',
          details: error.errors 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}