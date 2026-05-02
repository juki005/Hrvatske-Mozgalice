import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Quote, User, CheckCircle2, XCircle } from 'lucide-react';
import GameWrapper from './GameWrapper';
import ResultModal from './ResultModal';
import { quotesData } from '../data/heritage';
import { useDifficulty } from '../context/DifficultyContext';
import { useTimer } from '../hooks/useTimer';
import { markGameCompleted } from '../utils/streakManager';

export default function PoznateIzrekeGame({ onBack }: { onBack: () => void }) {
  const { difficulty, timerSeconds } = useDifficulty();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const questions = quotesData;
  const currentQuestion = questions[currentIndex];

  const handleTimeUp = () => {
    setIsFinished(true);
    setShowResult(true);
  };

  const { formattedTime } = useTimer(hasStarted, isFinished, timerSeconds, handleTimeUp);

  const handleOptionClick = (option: string) => {
    if (isAnswered || isFinished) return;
    if (!hasStarted) setHasStarted(true);
    
    setSelectedOption(option);
    setIsAnswered(true);

    if (option === currentQuestion.answer) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        setIsFinished(true);
        markGameCompleted('izreke');
        setShowResult(true);
      }
    }, 1500);
  };

  return (
    <GameWrapper
      title="Poznate Izreke"
      subtitle="Povijest i kultura"
      onBack={onBack}
      timer={formattedTime}
    >
      <div className="w-full max-w-2xl mx-auto py-8 px-4">
        <div className="mb-12 text-center relative">
          <Quote className="w-12 h-12 text-brand-text/10 absolute -top-6 -left-2 rotate-180" />
          <h2 className="text-sm font-black text-brand-muted uppercase tracking-[0.3em] mb-8">Tko je ovo rekao?</h2>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-brand-text leading-relaxed italic">
            "{currentQuestion.quote}"
          </div>
          <Quote className="w-12 h-12 text-brand-text/10 absolute -bottom-6 -right-2" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentQuestion.options.map((option) => {
            const isCorrect = option === currentQuestion.answer;
            const isSelected = option === selectedOption;
            
            let buttonClass = "bg-white border-gray-100 text-brand-text hover:border-brand-text";
            if (isAnswered) {
              if (isCorrect) buttonClass = "bg-green-50 border-green-500 text-green-700";
              else if (isSelected) buttonClass = "bg-red-50 border-red-500 text-red-700";
              else buttonClass = "bg-white border-gray-100 text-gray-300 opacity-50";
            }

            return (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                disabled={isAnswered}
                className={`
                  w-full p-6 rounded-2xl border-2 text-lg font-bold transition-all flex items-center justify-between group
                  ${buttonClass}
                `}
              >
                <div className="flex items-center gap-3">
                  <User className={`w-5 h-5 ${isAnswered && isCorrect ? 'text-green-500' : 'text-brand-muted'}`} />
                  <span>{option}</span>
                </div>
                {isAnswered && isCorrect && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                {isAnswered && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-500" />}
              </button>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center gap-2">
          {questions.map((_, i) => (
            <div 
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === currentIndex ? 'w-8 bg-brand-text' : 
                i < currentIndex ? 'w-4 bg-green-500' : 'w-4 bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      <ResultModal
        isOpen={showResult}
        onClose={onBack}
        title={score > questions.length / 2 ? 'Odlično!' : 'Zanimljivo!'}
        message={`Poznavanje hrvatskih velikana je važno. Vaš rezultat je ${score}/${questions.length}.`}
        stats={[
          { label: 'Točno', value: `${score}/${questions.length}` },
          { label: 'Vrijeme', value: formattedTime }
        ]}
        shareText={`Hrvatske Igre - POZNATE IZREKE\nRezultat: ${score}/${questions.length}\n⏱️ ${formattedTime}\nLink: ${window.location.origin}`}
      />
    </GameWrapper>
  );
}
