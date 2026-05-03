import { GoogleGenAI, Type } from "@google/genai";

let genAI: any = null;

function getGenAI() {
  if (!genAI) {
    // Try process.env (AI Studio injects this) or import.meta.env (standard Vite)
    const apiKey = process.env.GEMINI_API_KEY || (import.meta.env && import.meta.env.VITE_GEMINI_API_KEY);
    
    if (!apiKey || apiKey === 'PLACEHOLDER' || apiKey === '') {
      throw new Error("Gemini API ključ nije pronađen. Molimo postavite GEMINI_API_KEY u Secrets postavkama.");
    }
    
    genAI = new GoogleGenAI(apiKey);
  }
  return genAI;
}

export async function generateGameContent(gameId: string, prompt: string) {
  let responseSchema: any;
  const ai = getGenAI();
  const model = ai.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "You are a helpful assistant that generates content for Croatian brain games and puzzles."
  });

  switch (gameId) {
    case 'zagonetna-osoba':
    case 'dijalekt':
    case 'izreke':
      responseSchema = {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            answer: { type: Type.STRING }
          },
          required: ['question', 'options', 'answer']
        }
      };
      break;
    case 'poveznice':
    case 'asocijacije':
      responseSchema = {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            items: { type: Type.ARRAY, items: { type: Type.STRING } },
            level: { type: Type.INTEGER }
          },
          required: ['category', 'items', 'level']
        }
      };
      break;
    case 'krizaljka':
       responseSchema = {
        type: Type.OBJECT,
        properties: {
          grid: { 
            type: Type.ARRAY, 
            items: { type: Type.ARRAY, items: { type: Type.STRING } } 
          }
        },
        required: ['grid']
      };
      break;
    default:
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          content: { type: Type.STRING }
        }
      };
  }

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
    }
  });

  const responseText = result.response.text();
  return JSON.parse(responseText);
}
