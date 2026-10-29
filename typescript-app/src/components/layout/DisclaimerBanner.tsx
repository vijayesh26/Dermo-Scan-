import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <aside aria-label="Medical Disclaimer" className="w-full bg-[#FEF3C7] border-y border-[#FDE68A] py-3 px-4 sm:px-6 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2.5 text-center text-xs sm:text-sm font-medium text-[#92400E]">
        <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0" />
        <span>
          <strong className="font-semibold">Educational AI Tool:</strong> DermoScan is designed for educational pattern recognition — not a medical device. Always consult a licensed dermatologist or healthcare professional for medical diagnosis and treatment advice.
        </span>
      </div>
    </aside>
  );
};
