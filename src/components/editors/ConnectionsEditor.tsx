import React, { useState } from 'react';
import { Plus, Trash2, Sparkles, Loader2 } from 'lucide-react';
import { generateGameContent } from '../../services/geminiService';
import { useAuth } from '../../context/AuthContext';

export default function ConnectionsEditor() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([
    { id: 1, title: '', words: ['', '', '', ''], color: 'bg-yellow-200' },
    { id: 2, title: '', words: ['', '', '', ''], color: 'bg-green-200' },
    { id: 3, title: '', words: ['', '', '', ''], color: 'bg-blue-200' },
    { id: 4, title: '', words: ['', '', '', ''], color: 'bg-purple-200' },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!user?.isAdmin) {
    return <div className="p-8 text-center text-red-500 font-bold">Pristup odbijen.</div>;
  }

  const handleAiGenerate = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Generate a new "Connections" (Poveznice) game for Croatian audience. 
      Create 4 categories of 4 related words each. 
      One should be easy (yellow), one medium (green), one hard (blue), and one tricky (purple).
      Format as a JSON array where each object has 'category', 'items' (array of 4 strings), and 'level' (1-4).`;
      
      const data = await generateGameContent('poveznice', prompt);
      
      if (Array.isArray(data)) {
        const newCats = data.map((d: any, idx: number) => ({
          id: idx + 1,
          title: d.category || '',
          words: d.items || ['', '', '', ''],
          color: idx === 0 ? 'bg-yellow-200' : idx === 1 ? 'bg-green-200' : idx === 2 ? 'bg-blue-200' : 'bg-purple-200'
        }));
        setCategories(newCats);
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      alert("Došlo je do pogreške prilikom generiranja.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTitleChange = (id: number, title: string) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, title } : c));
  };

  const handleWordChange = (catId: number, wordIndex: number, word: string) => {
    setCategories(prev => prev.map(c => {
      if (c.id === catId) {
        const newWords = [...c.words];
        newWords[wordIndex] = word.toUpperCase();
        return { ...c, words: newWords };
      }
      return c;
    }));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-serif font-bold text-brand-text">Poveznice Editor</h2>
        <button 
          onClick={handleAiGenerate}
          disabled={isGenerating}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700 transition-all disabled:opacity-50"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {isGenerating ? 'Generiranje...' : 'Generiraj s AI'}
        </button>
      </div>
      
      <div className="space-y-6">
        {categories.map((cat, i) => (
          <div key={cat.id} className={`p-4 rounded-xl border-2 ${cat.color.replace('bg-', 'border-').replace('200', '300')} ${cat.color} bg-opacity-20`}>
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-1">Kategorija {i + 1} (Naslov)</label>
              <input 
                type="text" 
                value={cat.title}
                onChange={(e) => handleTitleChange(cat.id, e.target.value)}
                placeholder="Npr. VRSTE DRVEĆA"
                className="w-full p-2 rounded-lg border border-gray-300 font-bold uppercase"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Pojmovi (4)</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {cat.words.map((word, wIdx) => (
                  <input 
                    key={wIdx}
                    type="text" 
                    value={word}
                    onChange={(e) => handleWordChange(cat.id, wIdx, e.target.value)}
                    placeholder={`Pojam ${wIdx + 1}`}
                    className="w-full p-2 rounded-lg border border-gray-300 text-center font-bold uppercase"
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

