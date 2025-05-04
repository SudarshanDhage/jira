import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

// Create a model instance with the specific model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export { model, genAI }; 