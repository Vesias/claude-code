import { streamText } from 'ai';
import { google, GEMINI_MODEL, systemPrompts } from '../gemini';

export interface RegexBuilderInput {
  task: 'create' | 'explain' | 'test' | 'optimize' | 'convert' | 'debug';
  description?: string;
  pattern?: string;
  testCases?: string[];
  language?: string;
  flags?: string[];
  examples?: { valid: string[]; invalid: string[] };
}

export async function buildRegex(input: RegexBuilderInput) {
  const taskPrompts = {
    create: 'Create a regex pattern based on this description',
    explain: 'Explain this regex pattern in detail',
    test: 'Test this regex pattern against these cases',
    optimize: 'Optimize this regex pattern for performance',
    convert: 'Convert this pattern to work in different languages',
    debug: 'Debug why this regex pattern is not working as expected',
  };

  const prompt = `
Task: ${taskPrompts[input.task]}
${input.description ? `Description: ${input.description}` : ''}
${input.pattern ? `Pattern: ${input.pattern}` : ''}
${input.language ? `Target Language: ${input.language}` : ''}
${input.flags?.length ? `Flags: ${input.flags.join(', ')}` : ''}

${input.testCases?.length ? `Test Cases:\n${input.testCases.map((tc, i) => `${i + 1}. "${tc}"`).join('\n')}` : ''}
${input.examples?.valid?.length ? `Valid Examples:\n${input.examples.valid.map(e => `- "${e}"`).join('\n')}` : ''}
${input.examples?.invalid?.length ? `Invalid Examples:\n${input.examples.invalid.map(e => `- "${e}"`).join('\n')}` : ''}

Provide:
${input.task === 'create' ? `
1. Regex pattern with explanation of each component
2. Alternative patterns if applicable
3. Test results for provided examples
4. Common edge cases to consider
5. Performance characteristics` : ''}
${input.task === 'explain' ? `
1. Step-by-step breakdown of the pattern
2. Visual representation of pattern matching
3. What it matches and what it doesn't
4. Common use cases
5. Potential pitfalls` : ''}
${input.task === 'test' ? `
1. Match results for each test case
2. Captured groups for each match
3. Performance metrics
4. Edge cases discovered
5. Suggestions for improvement` : ''}
${input.task === 'optimize' ? `
1. Optimized pattern with benchmarks
2. Explanation of optimizations made
3. Trade-offs between readability and performance
4. Alternative approaches
5. Language-specific optimizations` : ''}
${input.task === 'convert' ? `
1. Converted patterns for major languages (JavaScript, Python, Java, PHP, Go)
2. Language-specific considerations
3. Flag mappings between languages
4. Code examples for each language
5. Common gotchas` : ''}
${input.task === 'debug' ? `
1. Issues identified in the pattern
2. Corrected pattern with fixes explained
3. Test results showing the fix
4. Common mistakes that led to the issue
5. Best practices to avoid similar issues` : ''}
`;

  const result = await streamText({
    model: google(GEMINI_MODEL),
    system: systemPrompts.regexBuilder,
    prompt,
    temperature: 0.2,
    maxTokens: 2000,
  });

  return result;
}

// Generate regex for common patterns
export async function generateCommonRegex(
  patternType: 'email' | 'phone' | 'url' | 'ip' | 'date' | 'password' | 'username' | 'custom',
  customRequirements?: string,
  strictness: 'loose' | 'moderate' | 'strict' = 'moderate'
) {
  const prompt = `
Generate a ${strictness} regex pattern for: ${patternType}
${customRequirements ? `Custom Requirements: ${customRequirements}` : ''}

Provide:
1. The regex pattern
2. Explanation of strictness level chosen
3. Valid examples (5-10)
4. Invalid examples (5-10)
5. Common variations covered
6. Known limitations
7. Usage example in JavaScript and Python

Make it production-ready with proper escaping and consider real-world edge cases.
`;

  const result = await streamText({
    model: google(GEMINI_MODEL),
    system: systemPrompts.regexBuilder,
    prompt,
    temperature: 0.1,
    maxTokens: 1500,
  });

  return result;
}

// Interactive regex builder with examples
export async function buildFromExamples(
  validExamples: string[],
  invalidExamples: string[],
  additionalConstraints?: string
) {
  const prompt = `
Build a regex pattern that matches these valid examples:
${validExamples.map((e, i) => `${i + 1}. "${e}"`).join('\n')}

And does NOT match these invalid examples:
${invalidExamples.map((e, i) => `${i + 1}. "${e}"`).join('\n')}

${additionalConstraints ? `Additional Constraints: ${additionalConstraints}` : ''}

Provide:
1. The most specific pattern that fits all requirements
2. Step-by-step logic of pattern construction
3. Verification against all examples
4. Potential false positives/negatives
5. Simpler alternatives if over-complicated
6. Confidence score (0-100) for the pattern

Show your reasoning process for building the pattern.
`;

  const result = await streamText({
    model: google(GEMINI_MODEL),
    system: systemPrompts.regexBuilder,
    prompt,
    temperature: 0.3,
    maxTokens: 2000,
  });

  return result;
}

// Regex pattern validator and improver
export async function validateAndImprove(
  pattern: string,
  intendedUse: string,
  testData?: string[]
) {
  const prompt = `
Validate and improve this regex pattern:
Pattern: ${pattern}
Intended Use: ${intendedUse}
${testData?.length ? `Test Data:\n${testData.map((td, i) => `${i + 1}. "${td}"`).join('\n')}` : ''}

Analyze and provide:
1. Validation results (syntax, efficiency, correctness)
2. Potential issues identified
3. Improved version with justification
4. Performance comparison
5. Edge cases the original might miss
6. Best practices applied
7. Alternative approaches for the same task

Focus on making it more robust and maintainable.
`;

  const result = await streamText({
    model: google(GEMINI_MODEL),
    system: systemPrompts.regexBuilder,
    prompt,
    temperature: 0.2,
    maxTokens: 1800,
  });

  return result;
}