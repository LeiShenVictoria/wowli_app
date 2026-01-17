
import React from 'react';

interface Props {
  mood?: 'happy' | 'sad' | 'thinking' | 'hungry';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const WowliPet: React.FC<Props> = ({ mood = 'happy', size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-56 h-56'
  };

  return (
    <div className={`relative ${sizeMap[size]} ${className} animate-wowli-float`}>
      {/* Abstract Bird-like Shape */}
      <div className="w-full h-full bg-primary rounded-full relative overflow-hidden shadow-lg border-4 border-white/20">
        {/* Inner Belly */}
        <div className="absolute bottom-[-10%] left-[10%] w-[80%] h-[70%] bg-soft-peach rounded-full opacity-40"></div>
        
        {/* Eyes Area */}
        <div className="absolute top-[35%] left-0 w-full flex justify-around px-4">
          <div className="w-4 h-4 bg-background-dark rounded-full animate-wowli-blink"></div>
          <div className="w-4 h-4 bg-background-dark rounded-full animate-wowli-blink"></div>
        </div>

        {/* Blush */}
        <div className="absolute top-[45%] left-0 w-full flex justify-between px-2">
          <div className="w-3 h-2 bg-red-400/30 rounded-full blur-[1px]"></div>
          <div className="w-3 h-2 bg-red-400/30 rounded-full blur-[1px]"></div>
        </div>

        {/* Beak */}
        <div className="absolute top-[48%] left-1/2 -translate-x-1/2 w-4 h-3 bg-orange-400 rounded-b-full"></div>

        {/* Mood-specific indicators */}
        {mood === 'thinking' && (
          <div className="absolute -top-4 -right-2 space-y-1">
             <div className="w-2 h-2 bg-white rounded-full"></div>
             <div className="w-1 h-1 bg-white/60 rounded-full ml-3"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WowliPet;
