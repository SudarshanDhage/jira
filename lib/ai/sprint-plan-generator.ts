import { model } from './client';
import { repairJson } from './json-utils';
import { enhanceSprintPlan, createComprehensiveSprintPlan } from './sprint-plan-helpers';

/**
 * Generates comprehensive sprint plan based on project data and selected tech stack
 */
export async function generateSprintPlan(projectData: any, techStack: any) {
  try {
    console.log('Starting comprehensive sprint plan generation with Gemini API');
    
    // Extract all features to ensure they are covered in the plan
    const coreFeatures = projectData?.coreFeatures || [];
    const suggestedFeatures = projectData?.suggestedFeatures || [];
    const allFeatures = [...coreFeatures, ...suggestedFeatures];
    
    // Create a feature list to explicitly include in the prompt
    const featuresList = allFeatures.map(feature => 
      `- ${feature.name}: ${feature.description}`
    ).join('\n');
    
    const prompt = `
    I need a COMPLETE and COMPREHENSIVE sprint plan that covers ALL features of this project from start to finish. 
    The plan must be highly detailed and include EVERYTHING needed to implement the project successfully.
    
    Project details: ${JSON.stringify(projectData, null, 2)}
    Tech Stack: ${JSON.stringify(techStack, null, 2)}
    
    ALL OF THESE FEATURES MUST BE IMPLEMENTED (make sure every single one is included in your sprint plan):
    ${featuresList}
    
    Create TWO COMPLETELY DIFFERENT detailed sprint plans:
    
    1. A "Developer Sprint Plan" for human developers:
       - Include 3-5 sprints (2 weeks each) that cover ALL features listed above
       - Each sprint should have a different focus (setup, core features, advanced features, etc.)
       - Include at least 5-8 tasks per sprint, covering different components or features
       - Tasks must be EXTREMELY detailed with specific technical instructions
       - Include file names, component structures, database schemas, and API endpoints
       - Provide clear implementation steps for developers to follow
       - Include dependencies, time estimates (in hours), and acceptance criteria
       - Clearly separate frontend and backend tasks
       - Include testing and deployment tasks
       - Make sure EVERY feature from the list above is covered in at least one task
    
    2. A "AI Assistant Sprint Plan" optimized for implementation with AI tools:
       - Structure this DIFFERENTLY from the Developer Plan - not just a copy with minor changes
       - Include 3-5 sprints (2 weeks each) that cover ALL features listed above
       - Create at least 5-8 AI-optimized tasks per sprint
       - Instead of separating frontend/backend tasks, create full-stack tasks that AI can implement end-to-end
       - Write detailed AI prompts within each task that could be directly copied into an AI coding assistant
       - Include exact implementation details: file names, component structures, API specifications, data flows
       - Specify expected behaviors, edge cases, and error handling for each task
       - Each AI prompt should be comprehensive enough to generate complete implementation in one go
       - Make sure EVERY feature from the list above is covered in at least one task
    
    CRITICAL JSON FORMATTING REQUIREMENTS:
    - Response must be a VALID JSON object only - NO text before or after the JSON
    - Start with '{' and end with '}'
    - Use DOUBLE quotes for all keys and string values
    - NO trailing commas, NO comments, properly closed brackets and braces
    - Follow this EXACT structure:
    
    {
      "developerSprintPlan": {
        "sprints": [
          {
            "name": "Sprint 1: Project Setup and Foundation",
            "duration": "2 weeks",
            "focus": "Detailed focus description",
            "tasks": [
              {
                "id": "dev-s1-t1",
                "title": "Specific task title",
                "feature": "Which feature this implements",
                "description": "Extremely detailed task description with technical specifics",
                "implementation": "Step-by-step implementation guide with exact file paths and code structure details",
                "type": "frontend/backend/design/database/testing/devops",
                "priority": "high/medium/low",
                "estimatedHours": 4,
                "dependencies": ["task-id-1", "task-id-2"],
                "acceptanceCriteria": ["Detailed criteria 1", "Detailed criteria 2"]
              },
              // MORE TASKS HERE (5-8 per sprint)
            ]
          },
          // MORE SPRINTS HERE (3-5 total)
        ]
      },
      "aiSprintPlan": {
        "sprints": [
          {
            "name": "Sprint 1: Initial Setup and Core Features",
            "duration": "2 weeks",
            "focus": "Detailed focus description",
            "tasks": [
              {
                "id": "ai-s1-t1",
                "title": "AI-optimized task title",
                "feature": "Which feature this implements",
                "description": "Comprehensive task description with end-to-end implementation details",
                "implementation": "Technical details that an AI needs to understand the implementation",
                "type": "full-stack/frontend/backend",
                "priority": "high/medium/low",
                "estimatedHours": 3,
                "dependencies": ["task-id-1", "task-id-2"],
                "aiPrompt": "Extremely detailed prompt that would generate complete implementation when given to an AI coding assistant. Include file paths, component structures, expected behaviors, edge cases, and error handling."
              },
              // MORE TASKS HERE (5-8 per sprint)
            ]
          },
          // MORE SPRINTS HERE (3-5 total)
        ]
      }
    }
    `;

    // Create a promise that rejects after a timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Sprint plan generation timed out')), 240000); // 4 minutes timeout (increased)
    });

    // Race the API call against the timeout
    console.log('Sending comprehensive sprint plan request to Gemini API');
    const result = await Promise.race([
      model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1, // Lower temperature for more consistent, structured output
          maxOutputTokens: 16384, // Increased token limit for more comprehensive output
        }
      }),
      timeoutPromise
    ]) as any;

    const response = await result.response;
    const text = response.text();
    
    console.log('Sprint plan generation completed successfully');
    console.log('Raw response length:', text.length);
    console.log('Raw response excerpt:', text.substring(0, 300) + '...');
    
    try {
      // More robust JSON extraction and sanitization
      let jsonString = text;
      
      // Find the first occurrence of '{' and the last occurrence of '}'
      const firstBrace = jsonString.indexOf('{');
      const lastBrace = jsonString.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        // Extract just the JSON part
        jsonString = jsonString.substring(firstBrace, lastBrace + 1);
      }
      
      // Check if the response is wrapped in markdown code blocks
      const markdownJsonRegex = /```(?:json)?\s*(\{[\s\S]*?\})\s*```/;
      const markdownMatch = text.match(markdownJsonRegex);
      if (markdownMatch && markdownMatch[1]) {
        jsonString = markdownMatch[1];
      }
      
      // Apply our enhanced JSON repair function
      jsonString = repairJson(jsonString);
      
      // Log the processed JSON length for debugging
      console.log('Processed JSON length:', jsonString.length);
      
      // Try to parse the cleaned JSON
      try {
        // Log the first characters for debugging
        console.log('First 100 chars of final JSON:', jsonString.substring(0, 100));
        
        const parsedData = JSON.parse(jsonString);
        
        // Perform a more comprehensive validation to ensure we have multiple sprints and tasks
        // and that all features are covered
        const devSprints = parsedData.developerSprintPlan?.sprints || [];
        const aiSprints = parsedData.aiSprintPlan?.sprints || [];
        
        const isValidSprintPlan = (
          devSprints.length >= 3 && 
          aiSprints.length >= 3 &&
          devSprints.every((sprint: any) => sprint.tasks?.length >= 4) &&
          aiSprints.every((sprint: any) => sprint.tasks?.length >= 4)
        );
        
        // Verify feature coverage
        const devTasks = devSprints.flatMap((sprint: any) => sprint.tasks || []);
        const aiTasks = aiSprints.flatMap((sprint: any) => sprint.tasks || []);
        
        // Extract all feature mentions from task descriptions
        const devFeatureText = devTasks.map((task: any) => 
          `${task.feature || ''} ${task.title || ''} ${task.description || ''}`
        ).join(' ').toLowerCase();
        
        const aiFeatureText = aiTasks.map((task: any) => 
          `${task.feature || ''} ${task.title || ''} ${task.description || ''}`
        ).join(' ').toLowerCase();
        
        // Check if all features are mentioned somewhere in the tasks
        const allFeaturesAreCovered = allFeatures.every(feature => {
          const name = feature.name.toLowerCase();
          return devFeatureText.includes(name) && aiFeatureText.includes(name);
        });
        
        console.log(`Sprint plan validation: Valid structure: ${isValidSprintPlan}, Features covered: ${allFeaturesAreCovered}`);
        
        if (!isValidSprintPlan || !allFeaturesAreCovered) {
          console.warn('Sprint plan is incomplete or missing features, enhancing with additional content');
          
          // Build a more comprehensive plan by merging the AI-generated plan with our supplementary tasks
          const enhancedPlan = enhanceSprintPlan(parsedData, projectData, allFeatures);
          return enhancedPlan;
        }
        
        return parsedData;
      } catch (parsingError) {
        console.error("Error parsing cleaned JSON:", parsingError);
        
        // Create a comprehensive plan from scratch
        return createComprehensiveSprintPlan(projectData, allFeatures);
      }
    } catch (error) {
      console.error("Error extracting JSON from Gemini response:", error);
      console.log("Raw response excerpt:", text.substring(0, 500) + '...');
      
      // Create a comprehensive plan from scratch
      return createComprehensiveSprintPlan(projectData, allFeatures);
    }
  } catch (error) {
    console.error("Error generating sprint plans:", error);
    // Create a comprehensive plan from scratch
    return createComprehensiveSprintPlan(projectData, projectData?.coreFeatures || []);
  }
} 