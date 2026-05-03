import React, { useState } from 'react';
import { Plus, Trash2, Save, Sparkles, Loader2 } from 'lucide-react';
import { generateGameContent } from '../../services/geminiService';
import { useAuth } from '../../context/AuthContext';

interface WordClue {
  word: string;
  clue?: string;
}

export default function WordClueEditor({ title, hasClues = false }: { title: string, hasClues?: boolean }) {
  const { user } = useAuth();
  const [items, setItems] = useState<WordClue[]>([{ word: '' }]);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!user?.isAdmin) {
    return <div className="p-8 text-center text-red-500 font-bold">Pristup odbijen.</div>;
  }

  const handleAiGenerate = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Generate 10 interesting Croatian words for a game called "${title}". 
      ${hasClues ? 'Provide a brief clue or description for each word.' : ''}
      Format as a JSON array of objects with 'word' (string)${hasClues ? ", 'clue' (string)" : ""}.`;
      
      const gameId = title.toLowerCase().replace(/\s+/g, '-');
      const data = await generateGameContent(gameId, prompt);
      
      if (Array.isArray(data)) {
        setItems(prev => [...prev.filter(item => item.word !== ''), ...data]);
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      alert("Došlo je do pogreške prilikom generiranja.");
    } finally {
      setIsGenerating(false);
    }
  };

  const addItem = () => setItems([...items, { word: '' }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
  const updateItem = (index: number, field: keyof WordClue, value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-xl font-serif font-bold text-brand-text">{title} Editor</h3>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={handleAiGenerate}
            disabled={isGenerating}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700 transition-all disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {isGenerating ? 'Generiranje...' : 'Generiraj s AI'}
          </button>
          <button onClick={addItem} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-brand-text text-white rounded-xl font-bold text-sm hover:bg-black transition-all">
            <Plus className="w-4 h-4" /> Dodaj
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex gap-4 items-start">
            <div className="flex-1">
              <input
                type="text"
                value={item.word}
                onChange={(e) => updateItem(index, 'word', e.target.value)}
                placeholder="Riječ..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-brand-text outline-none font-bold uppercase"
              />
            </div>
            {hasClues && (
              <div className="flex-[2]">
                <input
                  type="text"
                  value={item.clue}
                  onChange={(e) => updateItem(index, 'clue', e.target.value)}
                  placeholder="Opis/Trag..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-brand-text outline-none"
                />
              </div>
            )}
            <button 
              onClick={() => removeItem(index)}
              className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100">
        <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-green-700 transition-all shadow-lg">
          <Save className="w-5 h-5" /> Spremi promjene
        </button>
      </div>
    </div>
  );
}
