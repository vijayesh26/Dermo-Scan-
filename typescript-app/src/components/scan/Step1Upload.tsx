import React, { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { Upload, RefreshCw, Trash2, CheckCircle, Info, Image as ImageIcon, ArrowRight, Camera } from 'lucide-react';
import { processImageFile, ProcessedImages } from '../../lib/imageUtils';

interface Step1UploadProps {
  imageData: string | null;
  onImageProcessed: (processed: ProcessedImages) => void;
  onClearImage: () => void;
  onNext: () => void;
  onError: (msg: string) => void;
}

export const Step1Upload: React.FC<Step1UploadProps> = ({
  imageData,
  onImageProcessed,
  onClearImage,
  onNext,
  onError,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    try {
      setIsProcessing(true);
      const result = await processImageFile(file);
      onImageProcessed(result);
    } catch (err: any) {
      onError(err.message || 'Failed to process image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Reset so same file can be re-selected if removed
    e.target.value = '';
  };

  return (
    <div className="w-full max-w-[600px] mx-auto space-y-6 step-enter">
      
      {/* Upload Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !imageData && fileInputRef.current?.click()}
        className={`relative min-h-[320px] rounded-2xl transition-all duration-200 overflow-hidden flex flex-col items-center justify-center text-center p-6 select-none ${
          imageData
            ? 'border-2 border-[#E2E8F0] bg-black/5'
            : isDragging
            ? 'scale-[1.02] border-2 border-solid border-[#0F6FBF] bg-[#DCEBFF]'
            : 'border-2 border-dashed border-[#0F6FBF]/40 bg-[#EBF4FF] hover:border-[#0F6FBF] hover:bg-[#E1EFFF] cursor-pointer'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg"
          className="hidden"
          onChange={handleFileInputChange}
        />

        {isProcessing ? (
          <div className="flex flex-col items-center gap-3 py-12 text-[#0F6FBF]">
            <div className="w-10 h-10 border-3 border-[#0F6FBF] border-t-transparent rounded-full animate-spin" />
            <p className="font-mono text-xs font-semibold uppercase tracking-wider">
              Compressing & Preparing Canvas...
            </p>
          </div>
        ) : imageData ? (
          // After Upload Preview
          <div className="relative w-full h-[320px] rounded-xl overflow-hidden group">
            <img
              src={imageData}
              alt="Uploaded lesion preview"
              className="w-full h-full object-cover rounded-xl"
            />

            {/* Photo Ready Badge */}
            <div className="absolute top-3 right-3 bg-[#059669] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Photo Ready</span>
            </div>

            {/* Overlay Toolbar */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0F172A]/80 hover:bg-[#0F172A] text-white text-xs font-medium backdrop-blur-sm transition-all hover:scale-105"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Change Photo</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClearImage();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#DC2626]/80 hover:bg-[#DC2626] text-white text-xs font-medium backdrop-blur-sm transition-all hover:scale-105"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ) : (
          // Initial Upload State
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="w-16 h-16 rounded-full bg-[#FFFFFF] shadow-sm flex items-center justify-center text-[#0F6FBF] animate-float">
              <Upload className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <p className="font-display font-bold text-base text-[#0F172A]">
                Drag & drop your skin photo here
              </p>
              <p className="text-sm text-[#64748B]">
                or <span className="text-[#0F6FBF] underline font-medium">click to browse</span> from device
              </p>
            </div>
            <span className="text-[11px] font-mono text-[#64748B] pt-2">
              Supports JPG, PNG, WEBP · Max 10MB
            </span>
          </div>
        )}
      </div>

      {/* Photo Tips Callout */}
      <div className="rounded-xl border border-[#BFDBFE] bg-[#EBF4FF] p-4 flex items-start gap-3">
        <span className="text-lg shrink-0">📸</span>
        <div className="text-xs text-[#1E3A8A] leading-relaxed">
          <strong className="font-semibold block mb-0.5">For best clinical visual analysis:</strong>
          Use natural lighting · Capture from 10–20cm distance · Keep the lesion in sharp focal clarity · Avoid reflections, direct flash, or harsh shadows.
        </div>
      </div>

      {/* Next Step Button */}
      <button
        onClick={onNext}
        disabled={!imageData || isProcessing}
        className={`w-full py-3.5 px-6 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-all duration-150 ${
          imageData && !isProcessing
            ? 'bg-[#0F6FBF] hover:bg-[#0A5594] text-white shadow-sm hover:shadow-md cursor-pointer active:scale-[0.99]'
            : 'bg-[#CBD5E1] text-[#94A3B8] cursor-not-allowed'
        }`}
      >
        <span>Next: Add Context</span>
        <ArrowRight className="w-4 h-4" />
      </button>

    </div>
  );
};
