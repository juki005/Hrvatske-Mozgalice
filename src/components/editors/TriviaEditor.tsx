import React, { useState } from 'react';

export default function TriviaEditor() {
  const [person, setPerson] = useState({
    name: '',
    clues: ['', '', '']
  });

  const handleClueChange = (index: number, value: string) => {
    const newClues = [...person.clues];
    newClues[index] = value;
    setPerson({ ...person, clues: newClues });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-serif font-bold text-brand-text mb-6">Zagonetna Osoba Editor</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Ime i Prezime Osobe</label>
          <input 
            type="text" 
            value={person.name}
            onChange={(e) => setPerson({ ...person, name: e.target.value.toUpperCase() })}
            placeholder="Npr. NIKOLA TESLA"
            className="w-full p-3 rounded-xl border-2 border-gray-300 font-bold uppercase text-lg"
          />
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl border-2 border-red-200 bg-red-50">
            <label className="block text-sm font-bold text-red-700 mb-1">Pomoć 1: Teško (5 bodova)</label>
            <textarea 
              value={person.clues[0]}
              onChange={(e) => handleClueChange(0, e.target.value)}
              placeholder="Neki opskurni detalj iz života..."
              className="w-full p-3 rounded-lg border border-red-300 font-serif"
              rows={2}
            />
          </div>

          <div className="p-4 rounded-xl border-2 border-yellow-200 bg-yellow-50">
            <label className="block text-sm font-bold text-yellow-700 mb-1">Pomoć 2: Srednje (3 boda)</label>
            <textarea 
              value={person.clues[1]}
              onChange={(e) => handleClueChange(1, e.target.value)}
              placeholder="Profesionalno postignuće..."
              className="w-full p-3 rounded-lg border border-yellow-300 font-serif"
              rows={2}
            />
          </div>

          <div className="p-4 rounded-xl border-2 border-green-200 bg-green-50">
            <label className="block text-sm font-bold text-green-700 mb-1">Pomoć 3: Lako (1 bod)</label>
            <textarea 
              value={person.clues[2]}
              onChange={(e) => handleClueChange(2, e.target.value)}
              placeholder="Najpoznatija činjenica..."
              className="w-full p-3 rounded-lg border border-green-300 font-serif"
              rows={2}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
