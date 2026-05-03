import React, { useState } from 'react';
import { Plus, Trash2, Save, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { generateGameContent } from '../../services/geminiService';
import { useAuth } from '../../context/AuthContext';

interface Question {
  question: string;
  options: string[];
  answer: string;
}

export default function QuestionAnswerEditor({ title }: { title: string }) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([
    { question: '', options: ['', '', '', ''], answer: '' }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!user?.isAdmin) {
    return <div className="p-8 text-center text-red-500 font-bold">Pristup odbijen.</div>;
  }

  const handleAiGenerate = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Generate 3 new and interesting ${title} questions in Croatian. 
      Each question should have 4 options and 1 correct answer.
      Format the output as a JSON array of objects with 'question', 'options' (array of strings), and 'answer' (the correct string from options).`;
      
      const gameId = title.toLowerCase().replace(/\s+/g, '-');
      const data = await generateGameContent(gameId, prompt);
      
      if (Array.isArray(data)) {
        setQuestions(prev => [...prev, ...data]);
      }
    } catch (error: any) {
      console.error("AI Generation Error:", error);
      alert(error.message || "Došlo je do pogreške prilikom generiranja.");
    } finally {
      setIsGenerating(false);
    }
  };

  const addQuestion = () => setQuestions([...questions, { question: '', options: ['', '', '', ''], answer: '' }]);
  const removeQuestion = (index: number) => setQuestions(questions.filter((_, i) => i !== index));
  
  const updateQuestion = (qIndex: number, field: string, value: any) => {
    const newQuestions = [...questions];
    if (field === 'question') newQuestions[qIndex].question = value;
    if (field === 'answer') newQuestions[qIndex].answer = value;
    setQuestions(newQuestions);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
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
          <button onClick={addQuestion} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-brand-text text-white rounded-xl font-bold text-sm hover:bg-black transition-all">
            <Plus className="w-4 h-4" /> Dodaj
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 relative">
            <button 
              onClick={() => removeQuestion(qIndex)}
              className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Pitanje/Citat</label>
              <textarea
                value={q.question}
                onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                placeholder="Unesite pitanje..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-brand-text outline-none min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {q.options.map((opt, oIndex) => (
                <div key={oIndex} className="relative">
                  <input
                    type="text"
                    value={opt || ''}
                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                    placeholder={`Opcija ${oIndex + 1}`}
                    className={`w-full px-4 py-3 rounded-xl border-2 outline-none pr-10 ${q.answer === opt && opt !== '' ? 'border-green-500 bg-green-50' : 'border-gray-100 focus:border-brand-text'}`}
                  />
                  <button 
                    onClick={() => updateQuestion(qIndex, 'answer', opt)}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${q.answer === opt && opt !== '' ? 'text-green-600 bg-green-100' : 'text-gray-300 hover:bg-gray-200'}`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
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

