import React, { useState } from 'react';
import { Check, AlertTriangle, RefreshCw, UploadCloud, AlertCircle } from 'lucide-react';
import { Step1Upload } from '../components/scan/Step1Upload';
import { Step2Context } from '../components/scan/Step2Context';
import { Step3Review } from '../components/scan/Step3Review';
import { Step4Analyzing } from '../components/scan/Step4Analyzing';
import { ScanSubmission, SkinAnalysisResult } from '../types/dermascan';
import { ProcessedImages } from '../lib/imageUtils';
import { analyzeSkinLesion } from '../services/claudeApi';
import { saveScanToHistory } from '../lib/supabase';
import { getOrCreateSessionId } from '../lib/session';

interface ScanPageProps {
  onScanComplete: (result: SkinAnalysisResult, submission: ScanSubmission) => void;
  onToast: (type: 'success' | 'error' | 'info', msg: string) => void;
}

const STEP_TITLES = [
  'Upload Photo',
  'Add Clinical Context',
  'Review & Confirm',
  'AI Analysis',
];

export const ScanPage: React.FC<ScanPageProps> = ({ onScanComplete, onToast }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [submission, setSubmission] = useState<ScanSubmission>({
    imageData: '',
    thumbnailData: '',
    bodyLocation: '',
    duration: '< 1 Week',
    symptoms: [],
    notes: '',
  });

  const [errorState, setErrorState] = useState<{
    hasError: boolean;
    title: string;
    message: string;
    isNonSkin?: boolean;
  }>({
    hasError: false,
    title: '',
    message: '',
  });

  const handleImageProcessed = (processed: ProcessedImages) => {
    setSubmission((prev) => ({
      ...prev,
      imageData: processed.originalOrCompressedBase64,
      thumbnailData: processed.thumbnailBase64,
    }));
    setErrorState({ hasError: false, title: '', message: '' });
  };

  const handleClearImage = () => {
    setSubmission((prev) => ({
      ...prev,
      imageData: '',
      thumbnailData: '',
    }));
  };

  const handleContextChange = (field: string, value: any) => {
    setSubmission((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStartAnalysis = async () => {
    setCurrentStep(4);
    setErrorState({ hasError: false, title: '', message: '' });

    try {
      const result = await analyzeSkinLesion(submission);

      // Check for non-skin detection edge case
      if (result.is_skin_image === false) {
        setErrorState({
          hasError: true,
          title: 'Non-Skin Image Detected',
          message: "We couldn't detect a clear skin area in this photo. Please upload a clear close-up image of the affected skin area.",
          isNonSkin: true,
        });
        return;
      }

      // Auto-save to Supabase & localStorage history
      const sessionId = getOrCreateSessionId();
      const historyItem = {
        id: 'scan-' + Date.now(),
        session_id: sessionId,
        image_thumbnail: submission.thumbnailData || submission.imageData,
        body_location: submission.bodyLocation,
        duration: submission.duration,
        symptoms: submission.symptoms,
        classification: result.classification,
        icd_code: result.icd_code,
        confidence: result.confidence,
        risk_level: result.risk_level,
        full_result: result,
        created_at: new Date().toISOString(),
      };

      const saveResult = await saveScanToHistory(historyItem);
      if (saveResult.error) {
        onToast('info', 'Saved to local history. Supabase sync pending.');
      } else {
        onToast('success', 'Scan classified and recorded.');
      }

      // Notify parent to display Results Dashboard
      onScanComplete(result, submission);
    } catch (err: any) {
      console.error('Scan analysis failed:', err);
      setErrorState({
        hasError: true,
        title: 'Analysis Failed',
        message: err?.message || 'A network timeout or parsing issue occurred while analyzing the image. Please try again.',
      });
    }
  };

  const handleRetry = () => {
    setErrorState({ hasError: false, title: '', message: '' });
    handleStartAnalysis();
  };

  const handleResetToUpload = () => {
    setErrorState({ hasError: false, title: '', message: '' });
    setCurrentStep(1);
  };

  // Calculate progress percentage
  const progressPercent = ((currentStep - 1) / 3) * 100;

  return (
    <div className="min-h-[calc(100vh-140px)] py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      
      {/* Progress Bar Container */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[#64748B] font-semibold">
            Step {currentStep} of 4: <strong className="text-[#0F172A]">{STEP_TITLES[currentStep - 1]}</strong>
          </span>
          <span className="text-[#0D9488] font-bold">
            {Math.round(progressPercent)}% Completed
          </span>
        </div>

        {/* 4px Progress Bar */}
        <div className="w-full h-1 bg-[#E2E8F0] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0F6FBF] transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step Dots Connected by Line */}
        <div className="relative flex items-center justify-between max-w-lg mx-auto pt-1">
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-0.5 bg-[#E2E8F0] -z-0" />
          
          {[1, 2, 3, 4].map((stepNum) => {
            const isCompleted = currentStep > stepNum;
            const isActive = currentStep === stepNum;

            return (
              <button
                key={stepNum}
                disabled={stepNum > currentStep}
                onClick={() => !errorState.hasError && currentStep !== 4 && setCurrentStep(stepNum)}
                className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                  isCompleted
                    ? 'bg-[#0F6FBF] text-white'
                    : isActive
                    ? 'bg-[#FFFFFF] text-[#0F6FBF] border-2 border-[#0F6FBF] ring-4 ring-[#EBF4FF]'
                    : 'bg-[#F0F4F8] text-[#94A3B8] border border-[#CBD5E1]'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : stepNum}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Wizard Content Area */}
      <div className="pt-2">
        {errorState.hasError ? (
          // Error Card (replaces wizard content on error)
          <div className="max-w-lg mx-auto bg-[#FEF2F2] border-2 border-[#DC2626] rounded-2xl p-6 sm:p-8 text-center space-y-5 shadow-clinical animate-in fade-in duration-200">
            <div className="w-14 h-14 rounded-full bg-[#FEE2E2] text-[#DC2626] mx-auto flex items-center justify-center">
              <AlertCircle className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-display font-bold text-xl text-[#991B1B]">
                {errorState.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#7F1D1D] leading-relaxed">
                {errorState.message}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {!errorState.isNonSkin && (
                <button
                  onClick={handleRetry}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
              )}
              <button
                onClick={handleResetToUpload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white hover:bg-[#FEE2E2] text-[#991B1B] border border-[#FCA5A5] text-xs font-bold rounded-xl transition-all"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload Different Photo</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {currentStep === 1 && (
              <Step1Upload
                imageData={submission.imageData}
                onImageProcessed={handleImageProcessed}
                onClearImage={handleClearImage}
                onNext={() => setCurrentStep(2)}
                onError={(msg) => onToast('error', msg)}
              />
            )}

            {currentStep === 2 && (
              <Step2Context
                bodyLocation={submission.bodyLocation}
                duration={submission.duration}
                symptoms={submission.symptoms}
                notes={submission.notes}
                onChange={handleContextChange}
                onBack={() => setCurrentStep(1)}
                onNext={() => setCurrentStep(3)}
              />
            )}

            {currentStep === 3 && (
              <Step3Review
                submission={submission}
                onEditStep={(step) => setCurrentStep(step)}
                onBack={() => setCurrentStep(2)}
                onStartAnalysis={handleStartAnalysis}
              />
            )}

            {currentStep === 4 && (
              <Step4Analyzing
                imageThumbnail={submission.thumbnailData || submission.imageData}
              />
            )}
          </>
        )}
      </div>

    </div>
  );
};
