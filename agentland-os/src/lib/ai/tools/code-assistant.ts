import { streamText } from 'ai';
import { google, GEMINI_MODEL, systemPrompts } from '../gemini';

export interface CodeAssistantInput {
  task: 'debug' | 'optimize' | 'explain' | 'generate' | 'review' | 'refactor' | 'test';
  language: string;
  code?: string;
  requirements?: string;
  context?: string;
  framework?: string;
  errorMessage?: string;
  performanceGoals?: string;
}

export async function assistWithCode(input: CodeAssistantInput) {
  const taskPrompts = {
    debug: `Debug the following code and identify issues:`,
    optimize: `Optimize this code for better performance:`,
    explain: `Explain this code in detail:`,
    generate: `Generate code based on these requirements:`,
    review: `Review this code for best practices and potential improvements:`,
    refactor: `Refactor this code for better maintainability:`,
    test: `Create comprehensive tests for this code:`,
  };

  const prompt = `
Task: ${taskPrompts[input.task]}
Programming Language: ${input.language}
${input.framework ? `Framework/Library: ${input.framework}` : ''}
${input.context ? `Context: ${input.context}` : ''}
${input.errorMessage ? `Error Message: ${input.errorMessage}` : ''}
${input.performanceGoals ? `Performance Goals: ${input.performanceGoals}` : ''}

${input.code ? `Code:\n\`\`\`${input.language}\n${input.code}\n\`\`\`` : ''}
${input.requirements ? `Requirements:\n${input.requirements}` : ''}

Provide:
1. ${input.task === 'debug' ? 'Identified issues and root causes' : ''}
   ${input.task === 'optimize' ? 'Performance improvements with benchmarks' : ''}
   ${input.task === 'explain' ? 'Line-by-line explanation with concepts' : ''}
   ${input.task === 'generate' ? 'Complete, working implementation' : ''}
   ${input.task === 'review' ? 'Detailed review with severity levels' : ''}
   ${input.task === 'refactor' ? 'Refactored code with explanation of changes' : ''}
   ${input.task === 'test' ? 'Unit tests, integration tests, and edge cases' : ''}
2. Best practices and recommendations
3. Alternative approaches if applicable
4. Relevant documentation links or resources
`;

  const result = await streamText({
    model: google(GEMINI_MODEL),
    system: systemPrompts.codeAssistant,
    prompt,
    temperature: 0.3,
    maxTokens: 3000,
  });

  return result;
}

// Generate code snippets for common patterns
export async function generateCodeSnippet(
  pattern: string,
  language: string,
  framework?: string
) {
  const prompt = `
Generate a production-ready ${pattern} pattern in ${language}${framework ? ` using ${framework}` : ''}.

Include:
1. Complete implementation
2. Usage example
3. Common variations
4. Performance considerations
5. Error handling

Make it reusable and follow current best practices.
`;

  const result = await streamText({
    model: google(GEMINI_MODEL),
    system: systemPrompts.codeAssistant,
    prompt,
    temperature: 0.2,
    maxTokens: 2000,
  });

  return result;
}

// Convert code between languages/frameworks
export async function convertCode(
  code: string,
  fromLang: string,
  toLang: string,
  fromFramework?: string,
  toFramework?: string
) {
  const prompt = `
Convert this ${fromLang}${fromFramework ? `/${fromFramework}` : ''} code to ${toLang}${toFramework ? `/${toFramework}` : ''}:

\`\`\`${fromLang}
${code}
\`\`\`

Ensure:
1. Functionality remains identical
2. Follow ${toLang} idioms and conventions
3. Use appropriate libraries/packages
4. Add necessary imports/dependencies
5. Include setup instructions if needed

Provide both the converted code and a migration guide highlighting key differences.
`;

  const result = await streamText({
    model: google(GEMINI_MODEL),
    system: systemPrompts.codeAssistant,
    prompt,
    temperature: 0.2,
    maxTokens: 2500,
  });

  return result;
}

// Generate documentation from code
export async function generateDocumentation(
  code: string,
  language: string,
  docType: 'api' | 'user' | 'technical' | 'inline'
) {
  const prompt = `
Generate ${docType} documentation for this ${language} code:

\`\`\`${language}
${code}
\`\`\`

Include:
${docType === 'api' ? '- Endpoint descriptions\n- Request/response formats\n- Authentication requirements\n- Rate limits\n- Example calls' : ''}
${docType === 'user' ? '- Getting started guide\n- Feature overview\n- Common use cases\n- Troubleshooting\n- FAQ' : ''}
${docType === 'technical' ? '- Architecture overview\n- Component descriptions\n- Data flow\n- Dependencies\n- Deployment guide' : ''}
${docType === 'inline' ? '- Function/method documentation\n- Parameter descriptions\n- Return values\n- Examples\n- Exceptions/errors' : ''}

Format appropriately for ${docType === 'inline' ? 'code comments' : 'markdown documentation'}.
`;

  const result = await streamText({
    model: google(GEMINI_MODEL),
    system: systemPrompts.codeAssistant,
    prompt,
    temperature: 0.4,
    maxTokens: 2000,
  });

  return result;
}