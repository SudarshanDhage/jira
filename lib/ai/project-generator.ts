import { model } from './client';
import { extractJsonFromText } from './json-utils';

/**
 * Generate project structure based on user idea
 */
export async function generateProjectStructure(idea: string) {
  try {
    const prompt = `
    I need to create a well-structured project plan based on the following idea:
    "${idea}"
    
    Please analyze this idea and provide:
    1. A comprehensive list of core features that would be required
    2. A list of potential additional features that would enhance the project
    3. A well-structured outline of the project scope
    
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
      "title": "Project Title",
      "description": "Concise project description",
      "coreFeatures": [
        {"id": "feature1", "name": "Feature Name", "description": "Detailed description of this feature"}
      ],
      "suggestedFeatures": [
        {"id": "suggestion1", "name": "Suggested Feature", "description": "Why this feature would be beneficial"}
      ]
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
        if (!parsedData.title || !parsedData.description || !parsedData.coreFeatures) {
          throw new Error('Parsed JSON is missing required project structure fields');
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
        console.warn("Using fallback project structure due to parsing failures");
        return {
          title: idea.split(' ').slice(0, 5).join(' '), // Use first few words as title
          description: idea,
          coreFeatures: [
            {
              id: "feature1", 
              name: "Basic Functionality", 
              description: "Implement core functionality for the project"
            }
          ],
          suggestedFeatures: [
            {
              id: "suggestion1", 
              name: "Enhanced User Experience", 
              description: "Improve the user interface and experience"
            }
          ]
        };
      }
    } catch (error) {
      console.error("Error extracting JSON from Gemini response:", error);
      console.log("Raw response:", text);
      throw new Error("Failed to parse project structure from AI response");
    }
  } catch (error) {
    console.error("Error generating project structure:", error);
    throw error;
  }
} 