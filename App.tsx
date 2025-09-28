
import React, { useState } from 'react';
import { Header } from './components/Header';
import { PromptGenerator } from './components/PromptGenerator';
import { ImageDesigner } from './components/ImageDesigner';
import { ImageFile } from './types';
import { ArrowDownCircleIcon } from './components/Icons';

const App: React.FC = () => {
  const [characterImage, setCharacterImage] = useState<ImageFile | null>(null);
  const [styleImage, setStyleImage] = useState<ImageFile | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-8">
          
          <PromptGenerator 
            onPromptGenerated={setGeneratedPrompt}
            characterImage={characterImage}
            setCharacterImage={setCharacterImage}
            styleImage={styleImage}
            setStyleImage={setStyleImage}
          />

          {generatedPrompt && characterImage && (
            <>
              <div className="my-4 text-center">
                <ArrowDownCircleIcon className="w-12 h-12 text-sky-400 animate-bounce" />
              </div>

              <ImageDesigner 
                baseImage={characterImage} 
                prompt={generatedPrompt} 
              />
            </>
          )}

        </div>
      </main>
      <footer className="text-center py-6 text-sm text-slate-500">
        <p>Powered by Google Gemini. Built with React & Tailwind CSS.</p>
      </footer>
    </div>
  );
};

export default App;
