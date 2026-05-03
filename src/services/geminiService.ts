import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateGameContent(gameId: string, prompt: string) {
  let responseSchema: any;

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
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            clue: { type: Type.STRING },
            answer: { type: Type.STRING },
            direction: { type: Type.STRING },
            row: { type: Type.INTEGER },
            col: { type: Type.INTEGER }
          },
          required: ['clue', 'answer', 'direction', 'row', 'col']
        }
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

  const result = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      systemInstruction: "You are a helpful assistant that generates content for Croatian brain games and puzzles."
    }
  });

  return JSON.parse(result.text);
}
