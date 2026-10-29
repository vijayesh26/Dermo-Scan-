import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Microscope,
  MapPin,
  ClipboardList,
  Upload,
  CheckCircle2,
  FileSearch,
  ExternalLink,
  ChevronRight,
  Eye,
  Activity,
  Layers,
} from 'lucide-react';
import { SampleReportModal } from '../components/common/SampleReportModal';

interface LandingPageProps {
  onStartScan: () => void;
  onNavigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartScan, onNavigate }) => {
  const [sampleModalOpen, setSampleModalOpen] = useState(false);

  return (
    <div className="w-full relative overflow-hidden space-y-20 pb-16">
      
      {/* Decorative SVG Skin Cell Organic Pattern in the background */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden opacity-40">
        <svg
          className="absolute -top-24 -right-24 w-[700px] h-[700px] text-[#E2E8F0]"
          viewBox="0 0 500 500"
          fill="none"
        >
          <circle cx="250" cy="250" r="220" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 6" />
          <circle cx="250" cy="250" r="170" stroke="currentColor" strokeWidth="1" />
          <circle cx="250" cy="250" r="110" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 8" />
          <circle cx="160" cy="180" r="24" fill="currentColor" fillOpacity="0.3" />
          <circle cx="310" cy="200" r="32" fill="currentColor" fillOpacity="0.2" />
          <circle cx="220" cy="310" r="40" fill="currentColor" fillOpacity="0.25" />
          <circle cx="340" cy="320" r="20" fill="currentColor" fillOpacity="0.3" />
        </svg>

        <svg
          className="absolute top-1/2 -left-32 w-[550px] h-[550px] text-[#E2E8F0]"
          viewBox="0 0 500 500"
          fill="none"
        >
          <circle cx="250" cy="250" r="200" stroke="currentColor" strokeWidth="1" strokeDasharray="3 5" />
          <circle cx="250" cy="250" r="130" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="200" cy="220" r="28" fill="currentColor" fillOpacity="0.2" />
          <circle cx="280" cy="280" r="36" fill="currentColor" fillOpacity="0.15" />
        </svg>
      </div>

      {/* 1. HERO SECTION */}
      <section className="min-h-[85vh] flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero Left Copy (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#BFDBFE] text-xs font-mono font-bold uppercase tracking-widest text-[#0F6FBF] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#0F6FBF] animate-ping" />
              <span>AI-Powered Dermatology Analysis</span>
            </div>

            {/* Headline */}
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-[72px] text-[#0F172A] tracking-tight leading-[1.05]">
              Know Your Skin.<br />
              <span className="text-[#0F6FBF]">Act with Clarity.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-xl text-[#64748B] font-normal max-w-xl leading-relaxed">
              Upload a photo, provide context, and receive a detailed AI-generated classification of skin lesions and rashes — in under 10 seconds.
            </p>

            {/* Two CTAs Side by Side */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onStartScan}
                className="h-[52px] px-8 bg-[#0F6FBF] hover:bg-[#0A5594] text-white font-display font-bold text-base rounded-full shadow-md hover:shadow-lg active:scale-95 transition-all duration-150 inline-flex items-center justify-center gap-2.5"
              >
                <Sparkles className="w-5 h-5" />
                <span>Analyze My Skin</span>
              </button>

              <button
                onClick={() => setSampleModalOpen(true)}
                className="h-[52px] px-7 bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[#0F172A] border border-[#CBD5E1] hover:border-[#94A3B8] font-display font-semibold text-sm rounded-full shadow-xs transition-all duration-150 inline-flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4 text-[#64748B]" />
                <span>See a Sample Report</span>
              </button>
            </div>

            {/* Trust Strip Below CTAs */}
            <div className="pt-6 border-t border-[#E2E8F0] max-w-lg">
              <div className="grid grid-cols-3 gap-2 text-center sm:text-left text-xs sm:text-sm font-medium text-[#475569]">
                <div className="pr-2 border-r border-[#E2E8F0]">
                  <span className="font-mono font-bold text-[#0F172A] block text-sm sm:text-base">
                    12+
                  </span>
                  <span className="text-[11px] text-[#64748B] block">Lesion Types</span>
                </div>
                <div className="px-2 border-r border-[#E2E8F0]">
                  <span className="font-mono font-bold text-[#0D9488] block text-sm sm:text-base">
                    &lt; 10s
                  </span>
                  <span className="text-[11px] text-[#64748B] block">Fast Analysis</span>
                </div>
                <div className="pl-2">
                  <span className="font-mono font-bold text-[#0F6FBF] block text-sm sm:text-base">
                    100% Private
                  </span>
                  <span className="text-[11px] text-[#64748B] block">No Account Needed</span>
                </div>
              </div>
            </div>

          </div>

          {/* Hero Right Visual Mockup (5 cols) */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Ambient blur glow behind mockup */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0F6FBF]/15 via-[#0D9488]/10 to-transparent rounded-3xl filter blur-2xl -z-10 transform rotate-3 scale-95" />

            {/* Stylized Mockup Card */}
            <div className="w-full max-w-md bg-[#FFFFFF]/95 backdrop-blur-xl border border-[#E2E8F0] rounded-3xl p-6 shadow-clinical-lg space-y-5 transform hover:-translate-y-1 transition-transform duration-300">
              
              {/* Mockup Header */}
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#0F6FBF] flex items-center justify-center text-white text-xs font-mono font-bold">
                    DS
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xs text-[#0F172A]">
                      Live Classifier Interface
                    </h3>
                    <span className="text-[10px] font-mono text-[#0D9488]">
                      ● Autonomous Vision Engine
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] font-mono text-[10px] font-bold">
                  Simulated Mode
                </span>
              </div>

              {/* Specimen and classification row */}
              <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#F7FAFC] border border-[#E2E8F0]">
                <div className="relative w-16 h-16 rounded-xl bg-[#E2E8F0] overflow-hidden shrink-0 border border-[#CBD5E1]">
                  {/* Stylized Skin lesion vector illustration */}
                  <svg className="w-full h-full text-[#0F6FBF]" viewBox="0 0 100 100" fill="none">
                    <rect width="100" height="100" fill="#F0F4F8" />
                    <circle cx="50" cy="50" r="28" fill="#FCA5A5" fillOpacity="0.4" />
                    <circle cx="48" cy="46" r="18" fill="#EF4444" fillOpacity="0.6" />
                    <circle cx="52" cy="52" r="8" fill="#B91C1C" fillOpacity="0.8" />
                  </svg>
                  <div className="absolute inset-0 border border-[#0F6FBF]/40 rounded-xl" />
                </div>

                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] font-mono uppercase text-[#64748B] block">
                    Classification Match
                  </span>
                  <h4 className="font-display font-extrabold text-sm text-[#0F172A] truncate">
                    Contact Dermatitis
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#475569]">
                      ICD-10: L23.9
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#059669] bg-[#ECFDF5] px-2 py-0.2 rounded">
                      Low Risk
                    </span>
                  </div>
                </div>
              </div>

              {/* Confidence bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#64748B]">Confidence Score</span>
                  <span className="font-bold text-[#0D9488]">88%</span>
                </div>
                <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                  <div className="h-full bg-[#0D9488] rounded-full w-[88%]" />
                </div>
              </div>

              {/* Micro actions preview */}
              <div className="space-y-2 pt-1 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534]">
                  <span className="font-medium text-[11px]">Apply thick ceramide barrier cream</span>
                  <span className="text-[9px] font-mono uppercase font-bold bg-[#DCFCE7] px-1.5 py-0.5 rounded">Immediate</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#334155]">
                  <span className="font-medium text-[11px]">Avoid recent allergen exposures</span>
                  <span className="text-[9px] font-mono uppercase font-bold bg-[#E2E8F0] px-1.5 py-0.5 rounded">Soon</span>
                </div>
              </div>

              {/* Card Footer CTA */}
              <button
                onClick={onStartScan}
                className="w-full py-2.5 bg-[#0F6FBF] hover:bg-[#0A5594] text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Try This Workflow Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

            </div>

          </div>

        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION (Horizontal 4-Step Process) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#E2E8F0]">
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#0D9488]">
            Sequential Methodology
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#0F172A] tracking-tight">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] max-w-lg mx-auto">
            A calibrated 4-step sequence engineered to capture visual and clinical context.
          </p>
        </div>

        {/* 4 Steps Row with Connecting Dashed Line on Desktop */}
        <div className="relative">
          {/* Desktop Dashed Connector Line */}
          <div className="hidden lg:block absolute top-7 left-[12%] right-[12%] h-0.5 border-t-2 border-dashed border-[#CBD5E1] -z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            
            {/* Step 1 */}
            <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E2E8F0] shadow-clinical flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#0F6FBF] text-white font-display font-extrabold text-lg flex items-center justify-center shadow-md">
                1
              </div>
              <h3 className="font-display font-bold text-base text-[#0F172A]">
                Upload Photo
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Take a close-up photo of the affected skin zone with natural ambient lighting.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E2E8F0] shadow-clinical flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#0F6FBF] text-white font-display font-extrabold text-lg flex items-center justify-center shadow-md">
                2
              </div>
              <h3 className="font-display font-bold text-base text-[#0F172A]">
                Add Context
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Pinpoint anatomical location on the interactive body map, duration, and itch sensations.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E2E8F0] shadow-clinical flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#0F6FBF] text-white font-display font-extrabold text-lg flex items-center justify-center shadow-md">
                3
              </div>
              <h3 className="font-display font-bold text-base text-[#0F172A]">
                AI Analysis
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Watch the sonar radar evaluate morphology, margins, and erythema against clinical patterns.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E2E8F0] shadow-clinical flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#0F6FBF] text-white font-display font-extrabold text-lg flex items-center justify-center shadow-md">
                4
              </div>
              <h3 className="font-display font-bold text-base text-[#0F172A]">
                Get Results
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Receive risk grading, ICD-10 code, differential diagnoses, and prioritized self-care tips.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. FEATURE CARDS SECTION (3 Cards in a Row) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#0F6FBF]">
            Capabilities & Architecture
          </span>
          <h2 className="font-display font-extrabold text-3xl text-[#0F172A] tracking-tight">
            Designed for Clinical Rigor
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-[#FFFFFF] rounded-2xl p-7 border border-[#E2E8F0] shadow-clinical border-l-4 border-l-[#0D9488] hover:-translate-y-1 transition-transform duration-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#CCFBF1] text-[#0D9488] flex items-center justify-center">
              <Microscope className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#0F172A]">
              Lesion Classification
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Identifies 12+ common conditions including Eczema, Psoriasis, Tinea, Cellulitis, and more.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#FFFFFF] rounded-2xl p-7 border border-[#E2E8F0] shadow-clinical border-l-4 border-l-[#0D9488] hover:-translate-y-1 transition-transform duration-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#CCFBF1] text-[#0D9488] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#0F172A]">
              Body Location Context
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Specify the exact affected area for higher-accuracy classification tailored to skin zone characteristics.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#FFFFFF] rounded-2xl p-7 border border-[#E2E8F0] shadow-clinical border-l-4 border-l-[#0D9488] hover:-translate-y-1 transition-transform duration-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#CCFBF1] text-[#0D9488] flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#0F172A]">
              Structured Report
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Receive risk level, confidence score, differential diagnoses, and actionable care guidance.
            </p>
          </div>

        </div>
      </section>

      {/* Sample Report Modal */}
      <SampleReportModal
        isOpen={sampleModalOpen}
        onClose={() => setSampleModalOpen(false)}
        onStartOwnScan={() => {
          setSampleModalOpen(false);
          onStartScan();
        }}
      />

    </div>
  );
};
