
import React, { useRef, useState } from 'react';
import { ImageFile } from '../types';
import { getBase64FromFile } from '../services/geminiService';
import { UploadIcon, XCircleIcon } from './Icons';

interface ImageUploaderProps {
  onImageUpload: (image: ImageFile | null) => void;
  title: string;
  description: string;
  image: ImageFile | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, title, description, image }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const imageFile = await getBase64FromFile(file);
        onImageUpload(imageFile);
      } catch (error) {
        console.error("Error processing file:", error);
        onImageUpload(null);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleClear = () => {
    onImageUpload(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <h3 className="font-semibold text-lg text-white">{title}</h3>
      <p className="text-sm text-slate-400 mb-3">{description}</p>
      <div 
        onClick={() => !image && fileInputRef.current?.click()}
        className="relative w-full aspect-square bg-slate-700/50 rounded-lg border-2 border-dashed border-slate-600 flex items-center justify-center transition-all hover:border-sky-500 hover:bg-slate-700 cursor-pointer overflow-hidden group"
      >
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading || !!image}
        />
        {image ? (
          <>
            <img src={`data:${image.mimeType};base64,${image.base64}`} alt="Uploaded preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                onClick={handleClear}
                className="p-2 bg-red-600/80 rounded-full text-white hover:bg-red-500 transition-colors"
                aria-label="Remove image"
              >
                <XCircleIcon className="w-8 h-8"/>
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-slate-400">
            {isUploading ? (
              <p>Processing...</p>
            ) : (
              <>
                <UploadIcon className="w-10 h-10 mx-auto mb-2" />
                <p className="font-semibold">Click to upload</p>
                <p className="text-xs">PNG, JPG or WEBP</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
