
import React, { useState } from 'react';
import { Card } from './Card';
import { ImageUploader } from './ImageUploader';
import { ImageFile } from '../types';
import { generatePromptFromImages } from '../services/geminiService';
import { Spinner } from './Spinner';
import { WandSparklesIcon, ClipboardIcon } from './Icons';

interface PromptGeneratorProps {
  onPromptGenerated: (prompt: string) => void;
  characterImage: ImageFile | null;
  setCharacterImage: (image: ImageFile | null) => void;
  styleImage: ImageFile | null;
  setStyleImage: (image: ImageFile | null) => void;
}

export const PromptGenerator: React.FC<PromptGeneratorProps> = ({ 
    onPromptGenerated, 
    characterImage,
    setCharacterImage,
    styleImage,
    setStyleImage
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!characterImage || !styleImage) {
      setError("Please upload both a character and a style image.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const generatedPrompt = await generatePromptFromImages(characterImage, styleImage);
      setPrompt(generatedPrompt);
      onPromptGenerated(generatedPrompt);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
        <div className="flex items-center gap-3 mb-4">
            <div className="bg-sky-500/20 p-2 rounded-lg text-sky-400"><WandSparklesIcon className="w-6 h-6"/></div>
            <h2 className="text-2xl font-bold text-white">1. Generate Your Prompt</h2>
        </div>
      
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <ImageUploader 
          title="Character Image"
          description="Upload a photo with clear facial details."
          image={characterImage}
          onImageUpload={setCharacterImage}
        />
        <ImageUploader 
          title="Style Reference Image"
          description="Upload an image whose style you want to mimic."
          image={styleImage}
          onImageUpload={setStyleImage}
        />
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={handleGenerate}
          disabled={!characterImage || !styleImage || isLoading}
          className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 bg-sky-600 text-white font-bold rounded-lg shadow-lg hover:bg-sky-500 transition-all disabled:bg-slate-600 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100"
        >
          {isLoading ? <><Spinner /> Generating...</> : <><WandSparklesIcon className="w-5 h-5"/> Generate Prompt</>}
        </button>
      </div>

      {error && <p className="text-center text-red-400 mb-4">{error}</p>}

      {prompt && (
        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 relative">
            <h4 className="font-semibold mb-2 text-slate-300">Generated Prompt:</h4>
            <p className="text-slate-300 text-sm leading-relaxed">{prompt}</p>
            <button onClick={handleCopy} className="absolute top-3 right-3 p-1.5 bg-slate-700 rounded-md hover:bg-slate-600 text-slate-300">
                <ClipboardIcon className="w-5 h-5"/>
                {copied && <span className="absolute -top-7 right-0 text-xs bg-green-500 text-white px-2 py-0.5 rounded">Copied!</span>}
            </button>
        </div>
      )}
    </Card>
  );
};
