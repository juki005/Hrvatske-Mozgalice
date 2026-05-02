import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function ConnectionsEditor() {
  const [categories, setCategories] = useState([
    { id: 1, title: '', words: ['', '', '', ''], color: 'bg-yellow-200' },
    { id: 2, title: '', words: ['', '', '', ''], color: 'bg-green-200' },
    { id: 3, title: '', words: ['', '', '', ''], color: 'bg-blue-200' },
    { id: 4, title: '', words: ['', '', '', ''], color: 'bg-purple-200' },
  ]);

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
      <h2 className="text-2xl font-serif font-bold text-brand-text mb-6">Poveznice Editor</h2>
      
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
