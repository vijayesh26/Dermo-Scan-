import React from 'react';
import { ResultsDashboard } from '../components/results/ResultsDashboard';
import { SkinAnalysisResult, ScanSubmission } from '../types/dermascan';
import { SAMPLE_REPORT_PRESET } from '../services/claudeApi';
import { Sparkles, ArrowLeft } from 'lucide-react';

interface ResultsPageProps {
  result: SkinAnalysisResult | null;
  submission: ScanSubmission | null;
  onNewScan: () => void;
  onToast: (type: 'success' | 'error' | 'info', msg: string) => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  result,
  submission,
  onNewScan,
  onToast,
}) => {
  // If no scan results exist in current state, show empty state or sample preview
  if (!result) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center p-6 text-center space-y-5 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-[#EBF4FF] text-[#0F6FBF] flex items-center justify-center mx-auto shadow-sm">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display font-extrabold text-2xl text-[#0F172A]">
            No Active Scan Results
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
            You haven't performed a skin scan yet, or your previous session was reset.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full justify-center">
          <button
            onClick={onNewScan}
            className="px-6 py-3 bg-[#0F6FBF] hover:bg-[#0A5594] text-white font-display font-bold text-xs rounded-xl shadow-sm transition-all"
          >
            Start New Scan Wizard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-140px)]">
      <ResultsDashboard
        result={result}
        submission={submission || undefined}
        onNewScan={onNewScan}
        onToast={onToast}
      />
    </div>
  );
};
