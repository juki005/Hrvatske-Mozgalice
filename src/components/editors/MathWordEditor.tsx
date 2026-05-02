import React, { useState } from 'react';

export default function MathWordEditor() {
  const [targetNumber, setTargetNumber] = useState('');
  const [numbers, setNumbers] = useState(['', '', '', '', '', '']);
  const [letters, setLetters] = useState('');

  const handleNumberChange = (index: number, value: string) => {
    const newNums = [...numbers];
    newNums[index] = value;
    setNumbers(newNums);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Igra Brojeva */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-serif font-bold text-brand-text mb-6">Igra Brojeva Editor</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Traženi Broj (100-999)</label>
            <input 
              type="number" 
              value={targetNumber}
              onChange={(e) => setTargetNumber(e.target.value)}
              placeholder="Npr. 452"
              className="w-32 p-3 rounded-xl border-2 border-gray-300 font-bold text-xl text-center"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Ponuđeni Brojevi (4 mala, 1 srednji, 1 veliki)</label>
            <div className="grid grid-cols-6 gap-2">
              {numbers.map((num, i) => (
                <input 
                  key={i}
                  type="number" 
                  value={num}
                  onChange={(e) => handleNumberChange(i, e.target.value)}
                  placeholder={i < 4 ? "1-9" : i === 4 ? "10/15/20" : "25/50/75/100"}
                  className="w-full p-3 rounded-xl border-2 border-gray-300 font-bold text-center"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slagalica */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-serif font-bold text-brand-text mb-6">Slagalica Editor</h2>
        
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Ponuđena Slova (12 slova)</label>
          <input 
            type="text" 
            value={letters}
            onChange={(e) => setLetters(e.target.value.toUpperCase().replace(/[^A-ZČĆĐŠŽ]/g, '').slice(0, 12))}
            placeholder="Npr. A E I O U K R S T L M N"
            className="w-full p-3 rounded-xl border-2 border-gray-300 font-bold uppercase text-2xl tracking-widest text-center"
          />
          <p className="text-sm text-gray-500 mt-2 text-center">Unesite točno 12 slova bez razmaka.</p>
        </div>
      </div>
    </div>
  );
}
