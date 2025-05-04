import { model } from './client';
import { extractJsonFromText } from './json-utils';

/**
 * Generates a feature implementation plan based on a feature description
 */
export async function generateFeatureImplementation(feature: string) {
  try {
    const prompt = `
    I need a detailed implementation plan for the following feature:
    "${feature}"
    
    Please provide:
    1. A clear, concise feature description that expands on the given feature
    2. Two different implementation plans:
       - One for human developers with separate frontend and backend tasks
       - One for AI implementation (like Cursor) with comprehensive instructions
    
    IMPORTANT REQUIREMENTS:
    - You MUST respond with ONLY a valid JSON object, with no explanations or other text before or after 
    - DO NOT include any text outside the JSON response
    - Your response MUST start with { and end with }
    - Ensure arrays have proper closing brackets
    - DO NOT use trailing commas in arrays or objects
    - Make sure all property names are in quotes
    - DO NOT include code blocks, markdown formatting, or other non-JSON text
    
    The JSON structure must be EXACTLY:
    {
      "feature": {
        "title": "Feature title",
        "description": "Expanded feature description"
      },
      "developerPlan": {
        "tasks": [
          {
            "id": "task1",
            "title": "Task title",
            "description": "Detailed task description",
            "type": "frontend/backend/design/etc",
            "priority": "high/medium/low",
            "estimatedHours": 4
          }
        ]
      },
      "aiPlan": {
        "tasks": [
          {
            "id": "task1",
            "title": "Task title",
            "description": "Detailed AI prompt instructions",
            "priority": "high/medium/low"
          }
        ]
      }
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Extract and clean the JSON from the response
      let jsonString = extractJsonFromText(text);
      
      // Try to parse the cleaned JSON
      try {
        const parsedData = JSON.parse(jsonString);
        
        // Check if the structure matches what we expect
        if (!parsedData.feature || !parsedData.developerPlan || !parsedData.aiPlan) {
          throw new Error('Parsed JSON is missing required feature plan structures');
        }
        
        return parsedData;
      } catch (parsingError) {
        console.error("Error parsing cleaned JSON:", parsingError);
        
        // Fall back to a more direct extraction as a last resort
        try {
          const strictJsonRegex = /{(?:[^{}]|{(?:[^{}]|{[^{}]*})*})*}/g;
          const matches = jsonString.match(strictJsonRegex);
          if (matches && matches.length > 0) {
            // Try the largest match first (most likely the full response)
            const largestMatch = matches.reduce((a: string, b: string) => a.length > b.length ? a : b);
            const lastResortData = JSON.parse(largestMatch);
            return lastResortData;
          }
        } catch (lastResortError) {
          console.error("Last resort parsing failed:", lastResortError);
        }
        
        // If all else fails, return a fallback structure
        console.warn("Using fallback feature plan structure due to parsing failures");
        return {
          feature: {
            title: feature.split(' ').slice(0, 5).join(' '), // Use first few words as title
            description: `Implementation of ${feature}`
          },
          developerPlan: {
            tasks: [
              {
                id: "task1",
                title: "Implement basic functionality",
                description: "Create the core implementation for this feature",
                type: "frontend",
                priority: "high",
                estimatedHours: 4
              }
            ]
          },
          aiPlan: {
            tasks: [
              {
                id: "task1",
                title: "Create feature implementation",
                description: `Implement the feature: ${feature}`,
                priority: "high"
              }
            ]
          }
        };
      }
    } catch (error) {
      console.error("Error extracting JSON from Gemini response:", error);
      console.log("Raw response:", text);
      throw new Error("Failed to parse feature implementation from AI response");
    }
  } catch (error) {
    console.error("Error generating feature implementation:", error);
    throw error;
  }
} 