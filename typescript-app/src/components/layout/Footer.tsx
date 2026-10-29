import React from 'react';
import { ShieldCheck, ExternalLink, Activity, Info } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0F172A] text-[#94A3B8] border-t border-[#1E293B] pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-[#1E293B]">
          
          {/* Col 1: Brand & Clinical Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#0F6FBF] flex items-center justify-center text-white">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12h18" />
                  <path d="M12 3v18" />
                </svg>
              </div>
              <span className="font-display font-extrabold text-xl text-white tracking-tight">
                DermoScan
              </span>
            </div>
            <p className="text-sm text-[#94A3B8] leading-relaxed pr-4">
              A clinical-grade localized skin lesion and rash pattern classification system. Delivering instant diagnostic-style insights for patient empowerment and education.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E293B] border border-[#334155] text-xs font-mono text-[#38BDF8]">
              <span className="w-2 h-2 rounded-full bg-[#0D9488] animate-ping" />
              <span>Autonomous Cutaneous Vision Engine</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-display text-white text-sm font-bold uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('/')}
                  className="hover:text-white transition-colors"
                >
                  Home / Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/scan')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-[#38BDF8]"
                >
                  <Activity className="w-3.5 h-3.5" />
                  Start New Scan Wizard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/history')}
                  className="hover:text-white transition-colors"
                >
                  Session Scan History
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/how-it-works')}
                  className="hover:text-white transition-colors"
                >
                  How It Works & Limitations
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal, Ethics & Version */}
          <div className="space-y-3">
            <h4 className="font-display text-white text-sm font-bold uppercase tracking-wider">
              Clinical Governance
            </h4>
            <p className="text-xs text-[#64748B] leading-relaxed">
              DermoScan adheres strictly to educational AI standards. It is not approved by the FDA or CE as a diagnostic device. Any abnormal cutaneous evolution mandates in-person evaluation.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-[#1E293B] border border-[#334155] text-[11px] font-mono text-[#F59E0B]">
                Academic Portfolio Project
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#1E293B] border border-[#334155] text-[11px] font-mono text-[#94A3B8]">
                v1.0.0 Stable
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#64748B]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0D9488]" />
            <span>100% Private Client Sessions · Local & Supabase Encrypted</span>
          </div>
          <div className="text-center sm:text-right text-[#94A3B8]">
            DermoScan v1.0 · For Educational Use Only
          </div>
        </div>
      </div>
    </footer>
  );
};
