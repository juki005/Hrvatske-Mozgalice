import React from 'react';
import { motion } from 'motion/react';
import GameHeader from './GameHeader';

interface GameWrapperProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  timer?: string;
  points?: number;
  children: React.ReactNode;
  bgClass?: string;
  maxWidthClass?: string;
}

export default function GameWrapper({ 
  title, 
  subtitle, 
  onBack, 
  timer, 
  points, 
  children,
  bgClass = "bg-[#FBF9F4]",
  maxWidthClass = "max-w-2xl"
}: GameWrapperProps) {
  return (
    <div className={`flex flex-col h-screen w-full overflow-hidden ${bgClass}`}>
      <GameHeader 
        title={title} 
        subtitle={subtitle} 
        onBack={onBack} 
        timer={timer} 
        points={points} 
      />
      <div className={`flex-1 overflow-y-auto p-4 flex flex-col items-center mx-auto w-full ${maxWidthClass} pb-20`}>
        {children}
      </div>
    </div>
  );
}
