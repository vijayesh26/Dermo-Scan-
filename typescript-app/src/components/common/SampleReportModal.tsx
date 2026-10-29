import React from 'react';
import { X, AlertTriangle, ArrowRight } from 'lucide-react';
import { SAMPLE_REPORT_PRESET } from '../../services/claudeApi';

interface SampleReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartOwnScan: () => void;
}

export const SampleReportModal: React.FC<SampleReportModalProps> = ({
  isOpen,
  onClose,
  onStartOwnScan,
}) => {
  if (!isOpen) return null;

  const { result } = SAMPLE_REPORT_PRESET;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0F172A]/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-clinical-lg max-w-3xl w-full my-8 overflow-hidden">
        
        {/* Header bar */}
        <div className="bg-[#0F172A] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0F6FBF] animate-pulse" />
            <span className="font-display font-bold text-sm tracking-wide uppercase text-[#38BDF8]">
              Sample Clinical Report Preview
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#94A3B8] hover:text-white rounded-lg transition-colors"
            aria-label="Close sample report"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Disclaimer warning */}
        <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] px-6 py-2.5 text-xs text-[#475569] font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#0F6FBF] shrink-0" />
          <span>SIMULATED CLINICAL DATA · Generated for educational review purposes only.</span>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Classification Header (Unified Single Color) */}
          <div className="p-5 rounded-xl border border-[#E2E8F0] bg-[#F7FAFC] border-l-6 border-l-[#0F6FBF] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono uppercase text-[#64748B] tracking-wider">
                  Primary Classification
                </span>
                <h3 className="font-display font-extrabold text-2xl text-[#0F172A]">
                  {result.classification}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full border border-[#E2E8F0] bg-white font-mono text-xs font-semibold text-[#0F172A]">
                  ICD-10: {result.icd_code}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#EBF4FF] text-[#0F6FBF] border border-[#BFDBFE] font-mono text-xs font-bold uppercase">
                  ● Low Risk
                </span>
              </div>
            </div>

            {/* Confidence meter */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-[#64748B]">Confidence Score</span>
                <span className="font-bold text-[#0F6FBF]">{result.confidence}%</span>
              </div>
              <div className="w-full h-2.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0F6FBF] rounded-full transition-all duration-1000"
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#64748B] italic">
              "{result.risk_summary}"
            </p>
          </div>

          {/* Morphology & Clinical Observation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white space-y-2.5">
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#0F172A]">
                Clinical Observation
              </h4>
              <p className="text-xs text-[#475569] leading-relaxed">
                {result.clinical_description}
              </p>
              <div className="pt-2 border-t border-[#E2E8F0] grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-[#64748B] font-mono block">Primary Lesion:</span>
                  <span className="font-semibold capitalize text-[#0F172A]">{result.morphology.primary_lesion}</span>
                </div>
                <div>
                  <span className="text-[#64748B] font-mono block">Border:</span>
                  <span className="font-semibold capitalize text-[#0F172A]">{result.morphology.border}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white space-y-2.5">
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#0F172A]">
                Identified Triggers & Causes
              </h4>
              <ul className="space-y-1 text-xs text-[#475569]">
                {result.common_causes.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#0F6FBF] font-bold">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="bg-[#F7FAFC] border-t border-[#E2E8F0] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-[#64748B]">
            Ready to classify your own skin condition?
          </span>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2 border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] rounded-lg text-xs font-semibold hover:bg-white transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onStartOwnScan();
              }}
              className="w-1/2 sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2 bg-[#0F6FBF] hover:bg-[#0A5594] text-white text-xs font-bold rounded-lg shadow-sm transition-all"
            >
              <span>Start My Scan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
