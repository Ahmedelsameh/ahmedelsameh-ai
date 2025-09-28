import React, { useState, useEffect } from 'react';
import { ImageFile } from '../types';
import { Card } from './Card';
import { editImageWithPrompt } from '../services/geminiService';
import { Spinner } from './Spinner';
import { ImageIcon, DownloadIcon } from './Icons';

interface ImageDesignerProps {
  baseImage: ImageFile;
  prompt: string;
}

export const ImageDesigner: React.FC<ImageDesignerProps> = ({ baseImage, prompt }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  useEffect(() => {
    // Reset state when props change, allowing a new design to be generated.
    setGeneratedImage(null);
    setError(null);
    setIsLoading(false);
  }, [baseImage, prompt]);

  const handleDesign = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newImageSrc = await editImageWithPrompt(baseImage, prompt);
      setGeneratedImage(newImageSrc);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-sky-500/20 p-2 rounded-lg text-sky-400"><ImageIcon className="w-6 h-6" /></div>
        <h2 className="text-2xl font-bold text-white">2. Design Your New Image</h2>
      </div>

      <div className="text-center mb-6">
        <p className="text-slate-400">Using your generated prompt and character image, create a new stylized portrait.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-center">
        {/* Original Image */}
        <div className="flex flex-col items-center gap-2">
            <h4 className="font-semibold text-slate-300">Original Character</h4>
            <div className="w-full max-w-sm aspect-square rounded-lg overflow-hidden border-2 border-slate-700">
                <img src={`data:${baseImage.mimeType};base64,${baseImage.base64}`} alt="Base character" className="w-full h-full object-cover" />
            </div>
        </div>

        {/* Generated Image */}
        <div className="flex flex-col items-center gap-2">
            <h4 className="font-semibold text-slate-300">Generated Image</h4>
            <div className="w-full max-w-sm aspect-square bg-slate-700/50 rounded-lg border-2 border-dashed border-slate-600 flex items-center justify-center relative">
              {isLoading ? (
                <div className="text-center">
                  <Spinner className="w-10 h-10 mx-auto mb-2" />
                  <p className="text-slate-400">Designing...</p>
                </div>
              ) : generatedImage ? (
                <>
                  <img src={generatedImage} alt="Generated" className="w-full h-full object-cover" />
                  <a
                    href={generatedImage}
                    download="generated-image.png"
                    className="absolute bottom-4 right-4 p-2 bg-sky-600/80 rounded-full text-white hover:bg-sky-500 transition-colors"
                    aria-label="Download image"
                  >
                    <DownloadIcon className="w-6 h-6" />
                  </a>
                </>
              ) : error ? (
                <p className="text-red-400 p-4 text-center">{error}</p>
              ) : (
                <div className="text-center text-slate-400 p-4">
                  <ImageIcon className="w-10 h-10 mx-auto mb-2"/>
                  <p>Your new image will appear here.</p>
                </div>
              )}
            </div>
        </div>
      </div>
      
      {!generatedImage && (
        <div className="flex justify-center mt-8">
            <button
            onClick={handleDesign}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 bg-sky-600 text-white font-bold rounded-lg shadow-lg hover:bg-sky-500 transition-all disabled:bg-slate-600 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100"
            >
            {isLoading ? <><Spinner /> Designing...</> : <><ImageIcon className="w-5 h-5" /> Design New Image</>}
            </button>
        </div>
      )}
    </Card>
  );
};
