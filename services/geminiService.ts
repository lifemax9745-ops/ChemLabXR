import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelId = "gemini-2.5-flash";

export const getGeminiExplanation = async (topic: string, context: string): Promise<string> => {
  if (!process.env.API_KEY) return "API Key missing. Please configure your environment.";

  try {
    const prompt = `
      You are a world-class chemistry tutor for ChemLabXR.
      Explain the concept of "${topic}" in the context of: ${context}.
      Keep it concise (under 100 words), engaging, and scientifically accurate.
      Use simple language suitable for high school students.
      Format with markdown if needed.
    `;
    
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    return response.text || "I couldn't generate an explanation at this moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI tutor. Please check your connection.";
  }
};

export const generateQuizQuestion = async (topic: string): Promise<{question: string, options: string[], correct: number, explanation: string}> => {
  if (!process.env.API_KEY) {
    return {
      question: "API Key Missing",
      options: ["Configure API Key", "Retry", "Contact Admin", "Ignore"],
      correct: 0,
      explanation: "The API key must be set in the environment variables."
    };
  }

  try {
    const prompt = `Generate a single multiple-choice chemistry quiz question about: ${topic}.`;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: { 
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            correct: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "correct", "explanation"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text from Gemini");
    }
    return JSON.parse(text);
  } catch (error) {
    console.error("Quiz Gen Error:", error);
    return {
      question: "Which element has atomic number 1?",
      options: ["Hydrogen", "Helium", "Lithium", "Carbon"],
      correct: 0,
      explanation: "Hydrogen is the first element in the periodic table."
    };
  }
};

export const analyzeReaction = async (reactants: string[]): Promise<string> => {
  if (reactants.length < 2) return "Add more chemicals to see a reaction.";
  if (!process.env.API_KEY) return "API Key missing. Cannot analyze.";
  
  try {
    const prompt = `
      Predict the chemical reaction between: ${reactants.join(' and ')}.
      Describe the visual result (color change, gas, precipitate) and the balanced equation.
      If no reaction occurs, explain why.
      Keep it brief.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    return response.text || "Analysis failed.";
  } catch (error) {
    return "Could not analyze reaction.";
  }
};