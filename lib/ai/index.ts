/**
 * Main exports for Gemini AI functionality
 */

// Core client
export { model, genAI } from './client';

// Project generation functionality
export { generateProjectStructure } from './project-generator';
export { generateTechStack } from './tech-stack-generator';
export { generateSprintPlan } from './sprint-plan-generator';
export { generateFeatureImplementation } from './feature-implementation';
export { generateDocumentation } from './documentation-generator';

// JSON utilities
export { repairJson, extractJsonFromText } from './json-utils';

// Sprint planning helpers
export {
  createComprehensiveSprintPlan,
  enhanceSprintPlan,
  createBasicSprints
} from './sprint-plan-helpers';

export {
  createFeatureTask,
  mergeTaskLists,
  createStandardTasks
} from './sprint-models'; 