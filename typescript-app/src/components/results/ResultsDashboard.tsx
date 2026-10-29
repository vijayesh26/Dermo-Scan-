import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Microscope,
  CheckCircle2,
  XCircle,
  Bookmark,
  Info,
  ArrowRight,
  Stethoscope,
  Sparkles,
} from 'lucide-react';
import { SkinAnalysisResult, ScanSubmission } from '../../types/dermascan';

interface ResultsDashboardProps {
  result: SkinAnalysisResult;
  submission?: ScanSubmission;
  onNewScan: () => void;
  onSaveToHistory?: () => void;
  onToast: (type: 'success' | 'error' | 'info', msg: string) => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  result,
  submission,
  onNewScan,
  onSaveToHistory,
}) => {
  const [animatedConfidence, setAnimatedConfidence] = useState(0);

  // Mount animation for confidence meter
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedConfidence(result.confidence || 75);
    }, 150);
    return () => clearTimeout(timer);
  }, [result.confidence]);

  // Unified single-color brand blue styling across all results
  const unifiedBrandBlue = '#0F6FBF';
  const unifiedBadgeStyle = 'bg-[#EBF4FF] text-[#0F6FBF] border-[#BFDBFE]';

  return (
    <div className="w-full max-w-[800px] mx-auto py-8 px-4 sm:px-6 space-y-8 animate-in fade-in duration-300">
      
      {/* SECTION A: Classification Header (Hero Card - Unified Single Color) */}
      <section
        className="bg-[#FFFFFF] p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-clinical relative overflow-hidden"
        style={{ borderLeftWidth: '6px', borderLeftColor: unifiedBrandBlue }}
      >
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          
          {/* Left: Specimen Thumbnail */}
          <div className="relative shrink-0 w-[120px] h-[120px] rounded-xl overflow-hidden border-2 border-[#E2E8F0] shadow-sm bg-[#F0F4F8]">
            {submission?.thumbnailData || submission?.imageData ? (
              <img
                src={submission.thumbnailData || submission.imageData}
                alt="Analyzed lesion"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#64748B]">
                <Microscope className="w-8 h-8" />
              </div>
            )}
            <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-xs text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
              Specimen
            </div>
          </div>

          {/* Right of Image: Classification details */}
          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#64748B] block mb-0.5">
                Primary Pattern Classification
              </span>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#0F172A] tracking-tight leading-tight">
                {result.classification}
              </h1>
            </div>

            {/* Badges row - all in unified brand blue */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-full border border-[#E2E8F0] bg-[#F7FAFC] text-[#0F172A]">
                ICD-10: {result.icd_code}
              </span>
              
              <span
                className={`font-mono text-xs font-bold px-3 py-1 rounded-full border ${unifiedBadgeStyle}`}
              >
                {(result.risk_level || 'standard').toUpperCase()} RISK
              </span>

              {result.see_doctor_urgency && (
                <span className={`font-mono text-xs font-medium px-2.5 py-1 rounded-full border ${unifiedBadgeStyle}`}>
                  Urgency: {result.see_doctor_urgency}
                </span>
              )}
            </div>
          </div>

        </div>

        {/* Confidence Meter - Unified Single Color */}
        <div className="mt-6 pt-5 border-t border-[#E2E8F0] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#64748B] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#0F6FBF]" />
              AI Pattern Confidence Score
            </span>
            <span className="font-mono font-extrabold text-lg text-[#0F6FBF]">
              {animatedConfidence}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-[#E2E8F0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0F6FBF] rounded-full transition-all duration-800 ease-out"
              style={{ width: `${animatedConfidence}%` }}
            />
          </div>
          <p className="text-xs text-[#64748B] italic pt-1">
            "{result.risk_summary}"
          </p>
        </div>

      </section>

      {/* SECTION B: Clinical Details (2-Column Grid - Unified Single Color) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Card: Clinical Observation & Morphology */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E2E8F0] shadow-clinical space-y-4">
          <div className="flex items-center gap-2 text-[#0F6FBF]">
            <Microscope className="w-5 h-5" />
            <h3 className="font-display font-bold text-base text-[#0F172A]">
              Clinical Observation
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
            {result.clinical_description}
          </p>

          {/* Morphology 2x2 Subgrid */}
          <div className="pt-3 border-t border-[#E2E8F0]">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] block mb-2 font-semibold">
              Morphological Attributes
            </span>
            <div className="grid grid-cols-2 gap-3 bg-[#F7FAFC] p-3 rounded-xl border border-[#E2E8F0] text-xs">
              <div>
                <span className="text-[#64748B] font-mono block text-[10px]">Primary Lesion</span>
                <span className="font-semibold text-[#0F172A] capitalize">
                  {result.morphology.primary_lesion}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] font-mono block text-[10px]">Border</span>
                <span className="font-semibold text-[#0F172A] capitalize">
                  {result.morphology.border}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] font-mono block text-[10px]">Coloration</span>
                <span className="font-semibold text-[#0F172A] capitalize">
                  {result.morphology.color}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] font-mono block text-[10px]">Distribution</span>
                <span className="font-semibold text-[#0F172A] capitalize">
                  {result.morphology.distribution}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Causes & Triggers */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E2E8F0] shadow-clinical space-y-4">
          <div className="flex items-center gap-2 text-[#0F6FBF]">
            <Stethoscope className="w-5 h-5" />
            <h3 className="font-display font-bold text-base text-[#0F172A]">
              Common Causes & Triggers
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="font-mono text-[#64748B] block mb-1.5 font-semibold text-[11px] uppercase">
                Potential Etiological Factors:
              </span>
              <ul className="space-y-1.5">
                {result.common_causes.map((cause, i) => (
                  <li key={i} className="flex items-start gap-2 text-[#334155]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0F6FBF] shrink-0 mt-1.5" />
                    <span>{cause}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0]">
              <span className="font-mono text-[#64748B] block mb-2 font-semibold text-[11px] uppercase">
                Associated Triggers:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {result.triggers.map((trigger, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full bg-[#EBF4FF] border border-[#BFDBFE] text-[#0F6FBF] font-medium text-[11px]"
                  >
                    {trigger}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* SECTION C: Differential Diagnoses (Unified Single Color) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-[#0F172A]">
            Other Possible Conditions (Differential Diagnoses)
          </h3>
          <span className="text-xs text-[#64748B]">
            Sharing visual characteristics
          </span>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 pt-1 scrollbar-none">
          {result.differential_diagnoses.map((diff, i) => (
            <div
              key={i}
              className="w-[200px] shrink-0 p-4 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm space-y-2 hover:border-[#0F6FBF] transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-[#64748B]">
                  Differential #{i + 1}
                </span>
                <div title="This condition shares similar visual characteristics" className="text-[#94A3B8] hover:text-[#0F6FBF]">
                  <Info className="w-3.5 h-3.5" />
                </div>
              </div>
              <h4 className="font-mono font-semibold text-xs text-[#0F172A] line-clamp-2">
                {diff.name}
              </h4>
              <div className="pt-1">
                <span className={`inline-block text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border ${unifiedBadgeStyle}`}>
                  {diff.likelihood} Likelihood
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION D: Self-Care & Avoidance (Unified Single Color) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Self-Care Tips */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E2E8F0] shadow-clinical space-y-3">
          <div className="flex items-center gap-2 text-[#0F6FBF]">
            <CheckCircle2 className="w-5 h-5" />
            <h4 className="font-display font-bold text-base text-[#0F172A]">
              Self-Care Measures
            </h4>
          </div>
          <ul className="space-y-2.5 text-xs text-[#334155]">
            {result.self_care_tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                <span className="font-bold text-[#0F6FBF] shrink-0">✓</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: What to Avoid */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E2E8F0] shadow-clinical space-y-3">
          <div className="flex items-center gap-2 text-[#0F6FBF]">
            <XCircle className="w-5 h-5" />
            <h4 className="font-display font-bold text-base text-[#0F172A]">
              What to Avoid
            </h4>
          </div>
          <ul className="space-y-2.5 text-xs text-[#334155]">
            {result.avoid.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                <span className="font-bold text-[#0F6FBF] shrink-0">✗</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </section>

      {/* SECTION E: Educational Disclaimer */}
      <section className="p-5 rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] space-y-2 text-[#475569]">
        <div className="flex items-center gap-2 font-display font-bold text-xs uppercase tracking-wider text-[#0F6FBF]">
          <AlertTriangle className="w-4 h-4 text-[#0F6FBF]" />
          <span>Simulated Analysis — Educational Use Only</span>
        </div>
        <p className="text-xs leading-relaxed">
          This report was generated by AI pattern recognition based on visual cutaneous morphology. It is not a clinical diagnosis and does not replace evaluation by a board-certified dermatologist. Never make medical decisions based solely on this automated output.
        </p>
      </section>

      {/* Action Bar (Sticky on mobile, inline on desktop) */}
      <div className="sticky bottom-4 z-40 bg-[#FFFFFF]/90 backdrop-blur-md p-4 rounded-2xl border border-[#E2E8F0] shadow-clinical-lg flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-mono text-[#64748B]">
          <span>Session Scoped</span>
          <span>•</span>
          <span>Anonymous Storage</span>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {onSaveToHistory && (
            <button
              onClick={onSaveToHistory}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#0F6FBF] hover:bg-[#0A5594] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              <Bookmark className="w-4 h-4" />
              <span>Save to History</span>
            </button>
          )}

          <button
            onClick={onNewScan}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 border-2 border-[#0F6FBF] text-[#0F6FBF] hover:bg-[#EBF4FF] text-xs font-bold rounded-xl transition-all"
          >
            <span>New Scan</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>
      </div>

    </div>
  );
};
