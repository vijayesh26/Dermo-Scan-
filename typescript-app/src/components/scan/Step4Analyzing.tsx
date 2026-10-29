import React, { useState, useEffect } from 'react';
import { Activity, Sparkles } from 'lucide-react';

interface Step4AnalyzingProps {
  imageThumbnail: string;
}

const ANALYSIS_STAGES = [
  'Identifying visual patterns...',
  'Mapping lesion characteristics...',
  'Cross-referencing classification database...',
  'Calculating risk indicators...',
  'Generating your report...',
];

export const Step4Analyzing: React.FC<Step4AnalyzingProps> = ({ imageThumbnail }) => {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % ANALYSIS_STAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-[600px] mx-auto min-h-[460px] flex flex-col items-center justify-center text-center p-8 space-y-8 step-enter">
      
      {/* Signature Sonar Scan Animation Container */}
      <div className="relative w-[160px] h-[160px] flex items-center justify-center my-4">
        
        {/* Sonar Ring 1 */}
        <div className="absolute inset-0 rounded-[16px] border-2 border-[#0F6FBF]/40 pointer-events-none sonar-ring-1" />

        {/* Sonar Ring 2 */}
        <div className="absolute inset-0 rounded-[16px] border-2 border-[#0F6FBF]/40 pointer-events-none sonar-ring-2" />

        {/* Sonar Ring 3 */}
        <div className="absolute inset-0 rounded-[16px] border-2 border-[#0F6FBF]/40 pointer-events-none sonar-ring-3" />

        {/* Center Uploaded Image Specimen */}
        <div className="relative w-[150px] h-[150px] rounded-[14px] overflow-hidden border-2 border-[#0F6FBF] shadow-clinical bg-white z-10">
          <img
            src={imageThumbnail}
            alt="Specimen under scan"
            className="w-full h-full object-cover"
          />
          {/* Subtle scanning laser line effect */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent animate-pulse" />
        </div>

      </div>

      {/* Headline & Dynamic Status Cycle */}
      <div className="space-y-3 max-w-sm">
        <h3 className="font-display font-extrabold text-xl text-[#0F172A] flex items-center justify-center gap-2">
          <span>DermoScan AI is analyzing your image...</span>
        </h3>
        
        {/* Cycling Status Message with transition */}
        <div className="h-6 flex items-center justify-center">
          <p
            key={stageIndex}
            className="font-mono text-xs sm:text-sm font-medium text-[#0F6FBF] animate-in fade-in slide-in-from-bottom-1 duration-300"
          >
            → {ANALYSIS_STAGES[stageIndex]}
          </p>
        </div>
      </div>

      {/* Indeterminate Teal Progress Bar */}
      <div className="w-full max-w-xs space-y-2">
        <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
          <div className="h-full bg-[#0D9488] rounded-full w-1/2 animate-[pulse_1.5s_ease-in-out_infinite] translate-x-0" />
        </div>
        <p className="text-[11px] font-mono text-[#64748B]">
          This typically takes 5–10 seconds
        </p>
      </div>

    </div>
  );
};
