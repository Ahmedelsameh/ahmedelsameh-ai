import React from 'react';
import { SparklesIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/70 backdrop-blur-lg sticky top-0 z-10 border-b border-slate-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <SparklesIcon className="w-8 h-8 text-sky-400" />
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Ahmedelsameh <span className="text-sky-400">Ai Studio</span>
          </h1>
        </div>
      </div>
    </header>
  );
};