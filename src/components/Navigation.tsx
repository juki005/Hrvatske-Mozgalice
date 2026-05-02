import React from 'react';
import { Menu, User, Flame } from 'lucide-react';

export default function Navigation() {
  return (
    <div className="sticky top-0 z-50 w-full bg-nyt-card border-b border-nyt-border shadow-sm">
      {/* Primary Navigation */}
      <div className="flex items-center justify-between px-4 md:px-8 py-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 flex-1">
          <button className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Izbornik">
            <Menu className="w-6 h-6 text-nyt-midnight" />
          </button>
        </div>
        
        <div className="flex-1 text-center">
          <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-nyt-midnight cursor-pointer">
            Hrvatske Igre
          </h1>
        </div>
        
        <div className="flex items-center justify-end gap-3 flex-1">
          <div className="hidden sm:flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
            <Flame className="w-4 h-4 text-nyt-gold fill-nyt-gold" />
            <span className="text-sm font-semibold">5</span>
          </div>
          <button className="hidden sm:block text-sm font-semibold border border-nyt-midnight text-nyt-midnight px-4 py-1.5 rounded-full hover:bg-gray-50 transition-colors">
            Prijavi se
          </button>
          <button className="sm:hidden p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors">
            <User className="w-6 h-6 text-nyt-midnight" />
          </button>
        </div>
      </div>

      {/* Secondary Navigation */}
      <div className="border-t border-nyt-border overflow-x-auto hide-scrollbar">
        <div className="flex items-center justify-center gap-6 px-4 py-2 min-w-max max-w-7xl mx-auto">
          {['Riječi', 'Logika', 'Sport', 'Arhiva'].map((item) => (
            <button 
              key={item}
              className="text-sm font-medium text-gray-600 hover:text-nyt-midnight transition-colors whitespace-nowrap"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
