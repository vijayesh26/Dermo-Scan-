import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Activity,
  Archive,
  MapPin,
  Clock,
  HeartHandshake,
  FileText,
  Upload,
  RefreshCw,
  Trash2,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Check,
  Eye,
  KeyRound,
  Copy,
  Microscope,
  Stethoscope,
  ClipboardList,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Bookmark,
} from 'lucide-react';
import { SkinAnalysisResult, ScanSubmission, ScanHistoryItem } from '../types/dermascan';
import { processImageFile, ProcessedImages } from '../lib/imageUtils';
import { analyzeSkinLesion, SAMPLE_REPORT_PRESET } from '../services/claudeApi';
import { saveScanToHistory, fetchScanHistory, deleteScanHistoryItem } from '../lib/supabase';
import { getOrCreateSessionId, formatShortSessionId } from '../lib/session';
import { ResultsDashboard } from '../components/results/ResultsDashboard';
import { HistoryPage } from './HistoryPage';

interface UnifiedDashboardProps {
  onOpenApiKeyModal: () => void;
  onToast: (type: 'success' | 'error' | 'info', msg: string) => void;
}

const BODY_REGIONS = [
  'Head / Face',
  'Neck',
  'Chest',
  'Abdomen',
  'Upper Back',
  'Lower Back',
  'Left Arm',
  'Right Arm',
  'Left Hand',
  'Right Hand',
  'Left Leg',
  'Right Leg',
  'Left Foot',
  'Right Foot',
];

const DURATION_OPTIONS = ['< 1 Week', '1–4 Weeks', '1–3 Months', '3+ Months'];
const SENSATION_OPTIONS = ['Itchy', 'Painful', 'Burning', 'Tender', 'Numb', 'No sensation'];

const ANALYSIS_STAGES = [
  'Identifying visual patterns & erythema...',
  'Mapping lesion morphology & borders...',
  'Cross-referencing dermatological database...',
  'Calculating risk indicators & ICD-10...',
  'Generating clinical triage dossier...',
];

export const UnifiedDashboard: React.FC<UnifiedDashboardProps> = ({
  onOpenApiKeyModal,
  onToast,
}) => {
  // Navigation tabs in single dashboard
  const [activeTab, setActiveTab] = useState<'workstation' | 'history'>('workstation');

  // Intake State
  const [submission, setSubmission] = useState<ScanSubmission>({
    imageData: '',
    thumbnailData: '',
    bodyLocation: 'Left Forearm',
    duration: '1–4 Weeks',
    symptoms: ['Itchy'],
    notes: '',
  });

  const [consentGiven, setConsentGiven] = useState(true);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStageIndex, setAnalysisStageIndex] = useState(0);

  // Results State
  const [currentResult, setCurrentResult] = useState<SkinAnalysisResult | null>(null);

  // History State
  const [historyItems, setHistoryItems] = useState<ScanHistoryItem[]>([]);
  const [sessionId, setSessionId] = useState('');
  const [copiedSession, setCopiedSession] = useState(false);

  // Error State
  const [scanError, setScanError] = useState<string | null>(null);

  // Hovered Body Region for SVG Map
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Initialize Session & History
  useEffect(() => {
    const sid = getOrCreateSessionId();
    setSessionId(sid);
    loadRecentHistory(sid);
  }, []);

  // Cycling status messages during analysis
  useEffect(() => {
    let interval: any;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setAnalysisStageIndex((prev) => (prev + 1) % ANALYSIS_STAGES.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const loadRecentHistory = async (sid: string) => {
    try {
      const { items } = await fetchScanHistory(sid);
      setHistoryItems(items);
    } catch (e) {
      console.warn('History load error:', e);
    }
  };

  // Image Upload Handlers
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    try {
      setIsProcessingImage(true);
      setScanError(null);
      const processed = await processImageFile(files[0]);
      setSubmission((prev) => ({
        ...prev,
        imageData: processed.originalOrCompressedBase64,
        thumbnailData: processed.thumbnailBase64,
      }));
      onToast('success', 'Photo processed and compressed via Canvas.');
    } catch (err: any) {
      onToast('error', err.message || 'Image processing failed');
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleClearImage = () => {
    setSubmission((prev) => ({
      ...prev,
      imageData: '',
      thumbnailData: '',
    }));
  };

  const toggleSymptom = (sym: string) => {
    setSubmission((prev) => {
      if (prev.symptoms.includes(sym)) {
        return { ...prev, symptoms: prev.symptoms.filter((s) => s !== sym) };
      } else {
        if (sym === 'No sensation') {
          return { ...prev, symptoms: ['No sensation'] };
        } else {
          return { ...prev, symptoms: [...prev.symptoms.filter((s) => s !== 'No sensation'), sym] };
        }
      }
    });
  };

  // Run Analysis
  const handleAnalyze = async () => {
    if (!submission.imageData) {
      onToast('error', 'Please upload a photo of the skin lesion.');
      return;
    }
    if (!consentGiven) {
      onToast('error', 'Please accept the educational consent to proceed.');
      return;
    }

    setIsAnalyzing(true);
    setScanError(null);
    setActiveTab('workstation');

    try {
      const result = await analyzeSkinLesion(submission);

      if (result.is_skin_image === false) {
        setScanError("We couldn't detect a clear skin area in this photo. Please upload a clear close-up image of the affected skin.");
        setIsAnalyzing(false);
        return;
      }

      setCurrentResult(result);

      // Save to history automatically
      const historyItem: ScanHistoryItem = {
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

      await saveScanToHistory(historyItem);
      loadRecentHistory(sessionId);
      onToast('success', 'Analysis complete. Diagnostic report generated.');
    } catch (err: any) {
      setScanError(err.message || 'An error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Quick Load Sample Case
  const handleLoadSample = () => {
    setSubmission(SAMPLE_REPORT_PRESET.submission);
    setCurrentResult(SAMPLE_REPORT_PRESET.result);
    setScanError(null);
    setActiveTab('workstation');
    onToast('info', 'Sample clinical case loaded into workstation.');
  };

  const handleCopySession = () => {
    navigator.clipboard.writeText(sessionId);
    setCopiedSession(true);
    onToast('info', 'Session UUID copied to clipboard.');
    setTimeout(() => setCopiedSession(false), 2000);
  };

  const handleSelectHistoricalScan = (res: SkinAnalysisResult, sub: ScanSubmission) => {
    setCurrentResult(res);
    setSubmission(sub);
    setActiveTab('workstation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // SVG Body Map helpers
  const isSelectedRegion = (region: string) => submission.bodyLocation.toLowerCase() === region.toLowerCase();
  const isHoveredRegion = (region: string) => hoveredRegion?.toLowerCase() === region.toLowerCase();
  const getRegionFill = (region: string) => {
    if (isSelectedRegion(region)) return '#0F6FBF';
    if (isHoveredRegion(region)) return '#BFDBFE';
    return '#E2E8F0';
  };
  const getRegionStroke = (region: string) => (isSelectedRegion(region) ? '#0A5594' : '#CBD5E1');

  return (
    <div className="w-full min-h-screen bg-[#F0F4F8] flex flex-col font-sans">
      
      {/* 1. TOP DASHBOARD CONTROL BAR */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#E2E8F0] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-full bg-[#0F6FBF] flex items-center justify-center text-white shadow-sm">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18" />
                <path d="M12 3v18" />
                <path d="m4.93 4.93 4.24 4.24" />
                <path d="m14.83 14.83 4.24 4.24" />
              </svg>
            </div>
            <div>
              <span className="font-display font-extrabold text-lg text-[#0F172A] tracking-tight block leading-tight">
                DermoScan
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#0D9488] font-bold block -mt-0.5">
                Clinical Workstation
              </span>
            </div>
          </div>

          {/* View Switcher Tabs (Unified Single Dashboard) */}
          <nav className="flex items-center gap-1 bg-[#F0F4F8] p-1 rounded-xl border border-[#E2E8F0]">
            <button
              onClick={() => setActiveTab('workstation')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'workstation'
                  ? 'bg-[#FFFFFF] text-[#0F6FBF] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Diagnostic Workstation</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-[#FFFFFF] text-[#0F6FBF] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Scan Records</span>
              {historyItems.length > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 bg-[#0F6FBF] text-white rounded-full text-[10px] font-mono">
                  {historyItems.length}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2.5">
            {/* Quick Sample Trigger */}
            <button
              onClick={handleLoadSample}
              className="hidden lg:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#EBF4FF] hover:bg-[#DCEBFF] text-[#0F6FBF] text-xs font-semibold border border-[#BFDBFE] transition-colors"
              title="Load Pre-configured Clinical Sample"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0F6FBF]" />
              <span>Load Sample Case</span>
            </button>

            {/* Session Indicator */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F7FAFC] border border-[#E2E8F0] text-[11px] font-mono text-[#64748B]">
              <span>ID: {formatShortSessionId(sessionId)}</span>
              <button
                onClick={handleCopySession}
                className="hover:text-[#0F172A] p-0.5"
                title="Copy Session ID"
              >
                {copiedSession ? <Check className="w-3 h-3 text-[#059669]" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>

            {/* Settings */}
            <button
              onClick={onOpenApiKeyModal}
              className="p-2 text-[#64748B] hover:text-[#0F6FBF] hover:bg-[#F0F4F8] rounded-lg transition-colors border border-transparent hover:border-[#E2E8F0]"
              title="AI Engine Configuration"
            >
              <KeyRound className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* 2. MAIN DASHBOARD CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* TAB 1: UNIFIED DIAGNOSTIC WORKSTATION */}
        {activeTab === 'workstation' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: INTAKE & SCAN CONSOLE (5 COLS) */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E2E8F0] shadow-clinical space-y-5">
                
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#EBF4FF] text-[#0F6FBF] flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <h2 className="font-display font-bold text-base text-[#0F172A]">
                      Specimen Intake Console
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono text-[#0D9488] bg-[#CCFBF1] px-2 py-0.5 rounded-full font-bold">
                    Interactive
                  </span>
                </div>

                {/* Dropzone Upload */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    handleFileUpload(e.dataTransfer.files);
                  }}
                  onClick={() => !submission.imageData && fileInputRef.current?.click()}
                  className={`relative min-h-[170px] rounded-xl border-2 transition-all flex flex-col items-center justify-center text-center p-3 select-none ${
                    submission.imageData
                      ? 'border-[#E2E8F0] bg-black/5'
                      : isDragging
                      ? 'border-solid border-[#0F6FBF] bg-[#DCEBFF]'
                      : 'border-dashed border-[#0F6FBF]/40 bg-[#EBF4FF]/60 hover:bg-[#EBF4FF] hover:border-[#0F6FBF] cursor-pointer'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    className="hidden"
                    onChange={(e) => {
                      handleFileUpload(e.target.files);
                      e.target.value = '';
                    }}
                  />

                  {isProcessingImage ? (
                    <div className="flex flex-col items-center gap-2 text-[#0F6FBF] py-4">
                      <div className="w-7 h-7 border-2 border-[#0F6FBF] border-t-transparent rounded-full animate-spin" />
                      <span className="text-[11px] font-mono font-semibold">Resizing on Canvas...</span>
                    </div>
                  ) : submission.imageData ? (
                    <div className="relative w-full h-[160px] rounded-lg overflow-hidden group">
                      <img
                        src={submission.imageData}
                        alt="Specimen preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-[#059669] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <CheckCircle className="w-3 h-3" />
                        <span>Ready</span>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                          className="px-3 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-xs text-white text-[11px] rounded-md font-medium"
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClearImage();
                          }}
                          className="px-3 py-1 bg-[#DC2626]/80 hover:bg-[#DC2626] text-white text-[11px] rounded-md font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 py-4">
                      <Upload className="w-7 h-7 text-[#0F6FBF]" />
                      <p className="font-display font-bold text-xs text-[#0F172A]">
                        Drop skin photo or browse
                      </p>
                      <span className="text-[10px] font-mono text-[#64748B]">
                        JPG, PNG, WEBP &bull; Max 10MB
                      </span>
                    </div>
                  )}
                </div>

                {/* Anatomical Location Selection (No body image) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono uppercase font-bold text-[#0F172A] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#0F6FBF]" />
                      <span>Anatomical Region</span>
                    </label>
                    <span className="text-[11px] font-mono text-[#0F6FBF] font-semibold bg-[#EBF4FF] px-2 py-0.5 rounded">
                      {submission.bodyLocation}
                    </span>
                  </div>

                  <div className="bg-[#F7FAFC] p-3 rounded-xl border border-[#E2E8F0] space-y-2.5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                      {BODY_REGIONS.map((r) => {
                        const active = isSelectedRegion(r);
                        return (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setSubmission((p) => ({ ...p, bodyLocation: r }))}
                            className={`px-2.5 py-1.5 text-[11px] font-medium rounded-lg text-left truncate border transition-all ${
                              active
                                ? 'bg-[#0F6FBF] text-white border-[#0F6FBF] font-semibold shadow-xs'
                                : 'bg-white text-[#334155] border-[#E2E8F0] hover:border-[#BFDBFE] hover:bg-[#F0F4F8]'
                            }`}
                          >
                            {r}
                          </button>
                        );
                      })}
                    </div>
                    <div className="pt-2 border-t border-[#E2E8F0] flex items-center gap-2">
                      <span className="text-[11px] text-[#64748B] shrink-0">Quick select:</span>
                      <select
                        aria-label="Select body location"
                        value={submission.bodyLocation}
                        onChange={(e) => setSubmission((p) => ({ ...p, bodyLocation: e.target.value }))}
                        className="flex-1 text-xs bg-white border border-[#CBD5E1] rounded-lg px-2.5 py-1.5 font-medium text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0F6FBF]"
                      >
                        {BODY_REGIONS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Duration Segmented Control */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase font-bold text-[#0F172A] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#0F6FBF]" />
                    <span>Chronicity / Duration</span>
                  </label>
                  <div className="grid grid-cols-4 gap-1 p-1 bg-[#F0F4F8] rounded-xl border border-[#E2E8F0] text-xs">
                    {DURATION_OPTIONS.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setSubmission((p) => ({ ...p, duration: d }))}
                        className={`py-1.5 px-1 rounded-lg text-center transition-all ${
                          submission.duration === d
                            ? 'bg-[#0F6FBF] text-white font-semibold shadow-xs'
                            : 'text-[#64748B] hover:text-[#0F172A]'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sensation Multi-Select Chips */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono uppercase font-bold text-[#0F172A] flex items-center gap-1.5">
                      <HeartHandshake className="w-3.5 h-3.5 text-[#0F6FBF]" />
                      <span>Reported Sensations</span>
                    </label>
                    <span className="text-[10px] text-[#64748B]">Select all</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {SENSATION_OPTIONS.map((s) => {
                      const active = submission.symptoms.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleSymptom(s)}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all flex items-center gap-1 ${
                            active
                              ? 'bg-[#0F6FBF] border-[#0F6FBF] text-white shadow-xs'
                              : 'bg-white border-[#CBD5E1] text-[#475569] hover:bg-[#F8FAFC]'
                          }`}
                        >
                          {active && <Check className="w-3 h-3 text-white" />}
                          <span>{s}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Clinical Notes */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-mono uppercase font-bold text-[#0F172A] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#0F6FBF]" />
                      <span>Context / Exposures</span>
                    </label>
                    <span className="text-[10px] font-mono text-[#64748B]">
                      {submission.notes.length}/300
                    </span>
                  </div>
                  <textarea
                    maxLength={300}
                    rows={2}
                    value={submission.notes}
                    onChange={(e) => setSubmission((p) => ({ ...p, notes: e.target.value }))}
                    placeholder="Recent exposures (soaps, plants, animals, detergents, travel)..."
                    className="w-full p-2.5 text-xs bg-[#F7FAFC] border border-[#E2E8F0] rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0F6FBF] resize-none"
                  />
                </div>

                {/* Consent & Analyze CTA */}
                <div className="pt-2 space-y-3">
                  <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-[#475569] leading-tight select-none">
                    <input
                      type="checkbox"
                      checked={consentGiven}
                      onChange={(e) => setConsentGiven(e.target.checked)}
                      className="mt-0.5 w-3.5 h-3.5 text-[#0F6FBF] rounded border-[#CBD5E1] focus:ring-[#0F6FBF]"
                    />
                    <span>
                      I understand this is an <strong>educational AI tool</strong> &mdash; not a definitive clinical diagnosis.
                    </span>
                  </label>

                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || isProcessingImage}
                    className={`w-full py-3.5 px-6 rounded-xl font-display font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
                      isAnalyzing
                        ? 'bg-[#0D9488] text-white cursor-wait'
                        : 'bg-[#0F6FBF] hover:bg-[#0A5594] text-white hover:shadow-md active:scale-[0.99] cursor-pointer'
                    }`}
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Analyzing Cutaneous Patterns...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Run Diagnostic Scan &rarr;</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

              {/* Quick Session History Cards preview */}
              {historyItems.length > 0 && (
                <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] shadow-clinical space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                    <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#64748B]">
                      Recent Session Scans
                    </h3>
                    <button
                      onClick={() => setActiveTab('history')}
                      className="text-xs text-[#0F6FBF] font-semibold hover:underline flex items-center gap-0.5"
                    >
                      View all ({historyItems.length})
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {historyItems.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        onClick={() =>
                          handleSelectHistoricalScan(item.full_result, {
                            imageData: item.image_thumbnail,
                            thumbnailData: item.image_thumbnail,
                            bodyLocation: item.body_location,
                            duration: item.duration,
                            symptoms: item.symptoms,
                            notes: item.full_result?.clinical_description || '',
                          })
                        }
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#BFDBFE] cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={item.image_thumbnail}
                            alt=""
                            className="w-9 h-9 rounded-lg object-cover border border-[#E2E8F0]"
                          />
                          <div>
                            <span className="font-semibold text-xs text-[#0F172A] block leading-tight">
                              {item.classification}
                            </span>
                            <span className="text-[10px] font-mono text-[#64748B]">
                              {item.body_location} &bull; {item.confidence}%
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-[#0F6FBF]">
                          Load &rarr;
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT COLUMN: MAIN DIAGNOSTIC WORKSPACE (7 COLS) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Error Callout */}
              {scanError && (
                <div className="bg-[#FEF2F2] border-2 border-[#DC2626] rounded-2xl p-5 flex items-start gap-3.5 shadow-sm">
                  <AlertCircle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-sm text-[#991B1B]">
                      Analysis Interrupted
                    </h4>
                    <p className="text-xs text-[#7F1D1D] leading-relaxed">
                      {scanError}
                    </p>
                  </div>
                </div>
              )}

              {/* STATE A: ACTIVE SONAR SCANNING LOADING STATE */}
              {isAnalyzing && (
                <div className="bg-[#FFFFFF] p-8 sm:p-12 rounded-2xl border border-[#E2E8F0] shadow-clinical flex flex-col items-center justify-center text-center space-y-8 min-h-[480px]">
                  
                  {/* Signature Multi-Ring Sonar Animation */}
                  <div className="relative w-[160px] h-[160px] flex items-center justify-center my-4">
                    <div className="absolute inset-0 rounded-[18px] border-2 border-[#0F6FBF]/40 pointer-events-none sonar-ring-1" />
                    <div className="absolute inset-0 rounded-[18px] border-2 border-[#0F6FBF]/40 pointer-events-none sonar-ring-2" />
                    <div className="absolute inset-0 rounded-[18px] border-2 border-[#0F6FBF]/40 pointer-events-none sonar-ring-3" />
                    
                    <div className="relative w-[145px] h-[145px] rounded-[16px] overflow-hidden border-2 border-[#0F6FBF] shadow-clinical bg-white z-10">
                      <img
                        src={submission.imageData}
                        alt="Specimen"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent animate-pulse" />
                    </div>
                  </div>

                  <div className="space-y-2 max-w-sm">
                    <h3 className="font-display font-extrabold text-xl text-[#0F172A]">
                      DermoScan Vision Engine
                    </h3>
                    <p className="font-mono text-xs sm:text-sm font-semibold text-[#0F6FBF] h-6 flex items-center justify-center">
                      &rarr; {ANALYSIS_STAGES[analysisStageIndex]}
                    </p>
                  </div>

                  <div className="w-full max-w-xs space-y-2">
                    <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                      <div className="h-full bg-[#0D9488] rounded-full w-1/2 animate-pulse" />
                    </div>
                    <span className="text-[11px] font-mono text-[#64748B]">
                      Harmonizing with ICD-10 cutaneous standards
                    </span>
                  </div>

                </div>
              )}

              {/* STATE B: ACTIVE DIAGNOSTIC REPORT RESULTS */}
              {!isAnalyzing && currentResult && (
                <div className="space-y-6">
                  <ResultsDashboard
                    result={currentResult}
                    submission={submission}
                    onNewScan={() => {
                      setCurrentResult(null);
                      handleClearImage();
                    }}
                    onToast={onToast}
                  />
                </div>
              )}

              {/* STATE C: STANDBY / AWAITING INTAKE */}
              {!isAnalyzing && !currentResult && (
                <div className="space-y-6">
                  
                  {/* Standby Status Bar */}
                  <div className="bg-[#FFFFFF] p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] shadow-clinical flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#EBF4FF] text-[#0F6FBF] flex items-center justify-center shrink-0">
                        <Microscope className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#0F6FBF] animate-pulse" />
                          <span className="font-display font-bold text-xs uppercase tracking-wider text-[#0F6FBF]">
                            Diagnostic Console Ready
                          </span>
                        </div>
                        <span className="text-[11px] text-[#64748B] block mt-0.5">
                          Intake console active &bull; Awaiting specimen photograph on the left
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleLoadSample}
                      className="px-3.5 py-2 bg-[#EBF4FF] hover:bg-[#DBEAFE] text-[#0F6FBF] text-xs font-bold rounded-xl border border-[#BFDBFE] transition-all inline-flex items-center gap-1.5 self-end sm:self-auto shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Load Sample Case</span>
                    </button>
                  </div>

                  {/* Capability Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E2E8F0] border-l-4 border-l-[#0F6FBF] shadow-xs space-y-2">
                      <Microscope className="w-5 h-5 text-[#0F6FBF]" />
                      <h4 className="font-display font-bold text-xs text-[#0F172A]">
                        Lesion Classification
                      </h4>
                      <p className="text-[11px] text-[#64748B] leading-relaxed">
                        Evaluates contact dermatitis, plaque psoriasis, tinea, rosacea, urticaria, and cellulitis.
                      </p>
                    </div>

                    <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E2E8F0] border-l-4 border-l-[#0F6FBF] shadow-xs space-y-2">
                      <MapPin className="w-5 h-5 text-[#0F6FBF]" />
                      <h4 className="font-display font-bold text-xs text-[#0F172A]">
                        Anatomical Context
                      </h4>
                      <p className="text-[11px] text-[#64748B] leading-relaxed">
                        Extensor vs flexor distribution drastically shifts differential probabilities.
                      </p>
                    </div>

                    <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E2E8F0] border-l-4 border-l-[#0F6FBF] shadow-xs space-y-2">
                      <ClipboardList className="w-5 h-5 text-[#0F6FBF]" />
                      <h4 className="font-display font-bold text-xs text-[#0F172A]">
                        Clinical Diagnostic Dossier
                      </h4>
                      <p className="text-[11px] text-[#64748B] leading-relaxed">
                        Structured morphological biomarkers, differential diagnoses, and prioritized triage actions.
                      </p>
                    </div>
                  </div>

                </div>
              )}

            </div>

          </div>
        )}

        {/* TAB 2: SCAN RECORDS ARCHIVE (Integrated in Dashboard) */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <div>
                <h2 className="font-display font-extrabold text-2xl text-[#0F172A]">
                  Session Scan History &amp; Records
                </h2>
                <p className="text-xs text-[#64748B]">
                  Click any past scan record to instantly load its full triage breakdown into the workstation.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('workstation')}
                className="px-4 py-2 bg-[#0F6FBF] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                &larr; Back to Workstation
              </button>
            </div>

            <HistoryPage
              onSelectScan={handleSelectHistoricalScan}
              onNewScan={() => {
                setCurrentResult(null);
                handleClearImage();
                setActiveTab('workstation');
              }}
              onToast={onToast}
            />
          </div>
        )}

      </main>

      {/* 3. PERSISTENT CLINICAL GOVERNANCE BANNER */}
      <aside aria-label="Medical Disclaimer" className="w-full bg-[#FEF3C7] border-y border-[#FDE68A] py-2.5 px-4 text-center text-xs font-medium text-[#92400E]">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0" />
          <span>
            <strong>Educational AI Screening Tool:</strong> DermoScan does not diagnose cancer, replace biopsy or dermoscopy, or prescribe treatments. Always consult a licensed dermatologist.
          </span>
        </div>
      </aside>

      {/* 4. FOOTER */}
      <footer className="bg-[#0F172A] text-[#94A3B8] text-xs py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0D9488]" />
            <span>DermoScan Clinical Workstation &bull; Anonymous UUID Security</span>
          </div>
          <div>DermoScan Clinical Intelligence &bull; For Educational Use Only</div>
        </div>
      </footer>

    </div>
  );
};
