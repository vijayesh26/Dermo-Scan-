import React, { useState } from 'react';
import { ShieldCheck, Menu, X, Sparkles, KeyRound } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenApiKeyModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, onOpenApiKeyModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'New Scan', path: '/scan' },
    { label: 'History', path: '/history' },
    { label: 'How It Works', path: '/how-it-works' },
  ];

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E2E8F0] backdrop-blur-[12px] bg-[#F0F4F8]/85 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Left: Brand Logo */}
        <button
          onClick={() => handleNav('/')}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-full bg-[#0F6FBF] flex items-center justify-center text-white shadow-sm shadow-[#0F6FBF]/25 group-hover:scale-105 transition-transform duration-200">
            <svg
              className="w-5 h-5 text-white animate-pulse-subtle"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18" />
              <path d="M12 3v18" />
              <path d="m4.93 4.93 4.24 4.24" />
              <path d="m14.83 14.83 4.24 4.24" />
            </svg>
          </div>
          <div className="flex flex-col text-left">
            <span className="font-display font-extrabold text-xl text-[#0F172A] tracking-tight group-hover:text-[#0F6FBF] transition-colors">
              DermoScan
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#0D9488] font-semibold -mt-1">
              Clinical Intelligence
            </span>
          </div>
        </button>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#FFFFFF]/70 p-1.5 rounded-full border border-[#E2E8F0] shadow-sm">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-[#0F6FBF] text-white shadow-sm'
                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F0F4F8]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-3">
          {onOpenApiKeyModal && (
            <button
              onClick={onOpenApiKeyModal}
              title="API Configuration (Optional)"
              className="p-2 text-[#64748B] hover:text-[#0F6FBF] hover:bg-[#EBF4FF] rounded-full transition-colors border border-transparent hover:border-[#BFDBFE]"
            >
              <KeyRound className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => handleNav('/scan')}
            className="inline-flex items-center gap-2 bg-[#0F6FBF] hover:bg-[#0A5594] text-white px-5 py-2.5 rounded-full font-medium text-sm shadow-sm hover:shadow-md active:scale-95 transition-all duration-150"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start Scanning</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          {onOpenApiKeyModal && (
            <button
              onClick={onOpenApiKeyModal}
              className="p-2 text-[#64748B] hover:text-[#0F6FBF] rounded-full"
            >
              <KeyRound className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#0F172A] hover:bg-[#E2E8F0]/50 rounded-lg focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E2E8F0] bg-[#FFFFFF] px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-[#EBF4FF] text-[#0F6FBF] font-semibold'
                    : 'text-[#0F172A] hover:bg-[#F0F4F8]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
          <div className="pt-2">
            <button
              onClick={() => handleNav('/scan')}
              className="w-full flex items-center justify-center gap-2 bg-[#0F6FBF] hover:bg-[#0A5594] text-white py-3 rounded-full font-semibold shadow"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Scanning</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
