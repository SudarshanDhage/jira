import { model } from './client';
import { extractJsonFromText } from './json-utils';

/**
 * Generates tech stack recommendations based on project data
 */
export async function generateTechStack(projectData: any) {
  try {
    console.log('Starting tech stack generation with Gemini API');
    
    const prompt = `
    Based on the following project requirements:
    ${JSON.stringify(projectData, null, 2)}
    
    Please recommend the most suitable technology stack including:
    1. Frontend framework/library
    2. Backend technology
    3. Database solution
    4. Authentication method
    5. Additional tools and services
    
    For each recommendation, provide a primary recommendation marked as "recommended" and 2-3 alternatives.
    Also include a brief explanation of why each technology would be suitable for this project.
    
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
      "frontend": [
        {"name": "React", "recommended": true, "reason": "Explanation for why this is recommended"},
        {"name": "Vue.js", "recommended": false, "reason": "Explanation for this alternative"}
      ],
      "backend": [...],
      "database": [...],
      "authentication": [...],
      "additionalTools": [...]
    }
    `;

    // Create a promise that rejects after a timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Tech stack generation timed out')), 60000); // 60 seconds timeout
    });

    // Race the API call against the timeout
    const result = await Promise.race([
      model.generateContent(prompt),
      timeoutPromise
    ]) as any;

    const response = await result.response;
    const text = response.text();
    
    console.log('Tech stack generation completed successfully');
    
    try {
      // Extract and clean the JSON from the response
      let jsonString = extractJsonFromText(text);
      
      // Try to parse the cleaned JSON
      try {
        const parsedData = JSON.parse(jsonString);
        
        // Check if the structure matches what we expect
        if (!parsedData.frontend || !parsedData.backend || !parsedData.database) {
          throw new Error('Parsed JSON is missing required tech stack fields');
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
        console.warn("Using fallback tech stack structure due to parsing failures");
        return {
          frontend: [
            {name: "React", recommended: true, reason: "Popular and versatile UI library"},
            {name: "Vue.js", recommended: false, reason: "Alternative with gentle learning curve"}
          ],
          backend: [
            {name: "Node.js", recommended: true, reason: "JavaScript runtime for server-side applications"},
            {name: "Express", recommended: true, reason: "Minimal web framework for Node.js"}
          ],
          database: [
            {name: "MongoDB", recommended: true, reason: "NoSQL database with flexible schema"},
            {name: "PostgreSQL", recommended: false, reason: "Robust relational database"}
          ],
          authentication: [
            {name: "Firebase Auth", recommended: true, reason: "Quick implementation with multiple providers"},
            {name: "JWT", recommended: false, reason: "Standards-based authentication tokens"}
          ],
          additionalTools: [
            {name: "Docker", recommended: true, reason: "Containerization for consistent environments"}
          ]
        };
      }
    } catch (error) {
      console.error("Error extracting JSON from Gemini response:", error);
      console.log("Raw response:", text);
      throw new Error("Failed to parse tech stack recommendations from AI response");
    }
  } catch (error) {
    console.error("Error generating tech stack recommendations:", error);
    throw error;
  }
} 