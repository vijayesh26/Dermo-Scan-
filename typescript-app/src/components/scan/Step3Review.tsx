import React, { useState } from 'react';
import { ArrowLeft, Sparkles, AlertTriangle, Edit2, ShieldAlert } from 'lucide-react';
import { ScanSubmission } from '../../types/dermascan';

interface Step3ReviewProps {
  submission: ScanSubmission;
  onEditStep: (stepNumber: number) => void;
  onBack: () => void;
  onStartAnalysis: () => void;
}

export const Step3Review: React.FC<Step3ReviewProps> = ({
  submission,
  onEditStep,
  onBack,
  onStartAnalysis,
}) => {
  const [consentGiven, setConsentGiven] = useState(false);

  return (
    <div className="w-full max-w-[560px] mx-auto space-y-6 step-enter">
      
      {/* Summary Card */}
      <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-clinical space-y-6">
        
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
          <h3 className="font-display font-bold text-xl text-[#0F172A]">
            Review Your Submission
          </h3>
          <span className="text-[11px] font-mono text-[#0D9488] bg-[#CCFBF1] px-2.5 py-0.5 rounded-full font-semibold">
            Ready to Analyze
          </span>
        </div>

        {/* Photo + Details */}
        <div className="flex items-start gap-4 p-4 rounded-xl bg-[#F7FAFC] border border-[#E2E8F0]">
          <div className="relative shrink-0">
            <img
              src={submission.thumbnailData || submission.imageData}
              alt="Scan specimen"
              className="w-20 h-20 rounded-lg object-cover border border-[#E2E8F0] shadow-sm"
            />
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase text-[#64748B]">
                Captured Specimen
              </span>
              <button
                type="button"
                onClick={() => onEditStep(1)}
                className="text-xs text-[#0F6FBF] hover:underline flex items-center gap-1 font-medium"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit Photo</span>
              </button>
            </div>
            <p className="text-xs text-[#0F172A] truncate">
              Optimized & Encoded in Browser
            </p>
            <p className="text-[11px] font-mono text-[#64748B]">
              Ready for Vision Processing
            </p>
          </div>
        </div>

        {/* Breakdown List */}
        <div className="divide-y divide-[#E2E8F0] text-xs">
          
          {/* Body Location */}
          <div className="py-3 flex items-center justify-between">
            <div>
              <span className="font-mono text-[#64748B] block">Body Location</span>
              <span className="font-semibold text-sm text-[#0F172A]">
                {submission.bodyLocation || 'Not specified'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="text-[#0F6FBF] hover:underline font-medium"
            >
              Edit
            </button>
          </div>

          {/* Duration */}
          <div className="py-3 flex items-center justify-between">
            <div>
              <span className="font-mono text-[#64748B] block">Duration</span>
              <span className="font-semibold text-sm text-[#0F172A]">
                {submission.duration || 'Not specified'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="text-[#0F6FBF] hover:underline font-medium"
            >
              Edit
            </button>
          </div>

          {/* Symptoms */}
          <div className="py-3 flex items-start justify-between">
            <div className="space-y-1">
              <span className="font-mono text-[#64748B] block">Sensations & Symptoms</span>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {submission.symptoms.length > 0 ? (
                  submission.symptoms.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-md bg-[#EBF4FF] text-[#0F6FBF] font-mono text-[11px] font-medium"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-[#64748B] italic">None specified</span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="text-[#0F6FBF] hover:underline font-medium"
            >
              Edit
            </button>
          </div>

          {/* Notes */}
          <div className="py-3 flex items-start justify-between">
            <div className="pr-4">
              <span className="font-mono text-[#64748B] block">Clinical Notes</span>
              <p className="text-[#0F172A] mt-0.5 line-clamp-2">
                {submission.notes ? submission.notes.substring(0, 100) : 'None provided'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="text-[#0F6FBF] hover:underline font-medium shrink-0"
            >
              Edit
            </button>
          </div>

        </div>

        {/* Simulated Analysis Callout Badge */}
        <div className="p-4 rounded-xl border border-[#FDE68A] bg-[#FEF3C7] space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#B45309]">
            <AlertTriangle className="w-4 h-4 text-[#D97706]" />
            <span>Simulated Analysis Mode</span>
          </div>
          <p className="text-xs text-[#92400E] leading-relaxed">
            This analysis is generated by AI for educational purposes only. Results are not a medical diagnosis and should not replace professional dermatological consultation.
          </p>
        </div>

        {/* Consent Checkbox */}
        <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F7FAFC]">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-[#0F6FBF] rounded border-[#CBD5E1] focus:ring-[#0F6FBF] cursor-pointer"
            />
            <span className="text-xs text-[#334155] leading-relaxed">
              I understand this is an <strong>educational tool</strong> and will consult a licensed dermatologist for any clinical questions or medical concerns.
            </span>
          </label>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0]/60 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          onClick={onStartAnalysis}
          disabled={!consentGiven}
          className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-display font-bold text-sm shadow-sm transition-all duration-150 ${
            consentGiven
              ? 'bg-[#0F6FBF] hover:bg-[#0A5594] text-white shadow-md hover:shadow-lg cursor-pointer active:scale-[0.99]'
              : 'bg-[#CBD5E1] text-[#94A3B8] cursor-not-allowed'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Analyze My Skin →</span>
        </button>
      </div>

    </div>
  );
};
