/**
 * @file gemini.ts
 * 
 * This file re-exports all functionality from the modular AI implementation
 * to maintain backwards compatibility with existing code that imports from here.
 * 
 * For new code, consider importing directly from the modular structure:
 * import { generateDocumentation } from './ai/documentation-generator';
 */

export * from './ai';