// Export all AI tools
export * from './service-ideas';
export * from './slogan-creator';
export * from './email-composer';
export * from './code-assistant';
export * from './task-manager';
export * from './regex-builder';

// Tool types
export interface AIToolResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Common input validation
export function validateInput(input: Record<string, any>, requiredFields: string[]): string | null {
  for (const field of requiredFields) {
    if (!input[field] || (typeof input[field] === 'string' && !input[field].trim())) {
      return `${field} is required`;
    }
  }
  return null;
}