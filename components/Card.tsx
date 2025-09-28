
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`w-full max-w-4xl bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg p-6 md:p-8 ${className}`}>
      {children}
    </div>
  );
};
