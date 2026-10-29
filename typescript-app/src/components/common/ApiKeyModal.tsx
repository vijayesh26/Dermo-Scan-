import React, { useState, useEffect } from 'react';
import { X, Key, Shield, Copy, Check, Info, Server, Cpu } from 'lucide-react';
import { getSavedApiKey, setSavedApiKey } from '../../services/claudeApi';
import { getOrCreateSessionId, setCustomSessionId } from '../../lib/session';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast: (type: 'success' | 'error' | 'info', msg: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onToast }) => {
  const [apiKey, setApiKey] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [copiedSession, setCopiedSession] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(getSavedApiKey());
      setSessionId(getOrCreateSessionId());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    setSavedApiKey(apiKey);
    onToast('success', apiKey ? 'API Key configured successfully.' : 'API Key cleared. Using Clinical Simulation Engine.');
    onClose();
  };

  const handleCopySession = () => {
    navigator.clipboard.writeText(sessionId);
    setCopiedSession(true);
    onToast('info', 'Session ID copied to clipboard.');
    setTimeout(() => setCopiedSession(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-clinical-lg max-w-lg w-full p-6 space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF4FF] text-[#0F6FBF] flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#0F172A]">
                System & AI Configuration
              </h3>
              <p className="text-xs text-[#64748B]">
                Engine options, API keys, and session management
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-lg hover:bg-[#F0F4F8]"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-5">
          
          {/* Engine Mode Banner */}
          <div className="p-3.5 rounded-xl bg-[#F7FAFC] border border-[#E2E8F0] flex items-start gap-3">
            <Server className="w-5 h-5 text-[#0D9488] shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-semibold text-[#0F172A]">
                Dual-Mode AI Engine Architecture
              </p>
              <p className="text-[#64748B] leading-relaxed">
                By default, DermoScan includes an intelligent <strong>Clinical Simulation Engine</strong> calibrated for 12+ dermatologic conditions with zero setup required. You can also provide an API key to enable live multi-modal vision inference.
              </p>
            </div>
          </div>

          {/* Vision API Key */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-semibold text-[#0F172A] uppercase">
              Vision AI API Key (Optional)
            </label>
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-api03-..."
                className="w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-[#0F6FBF] focus:border-transparent transition-all"
              />
            </div>
            <p className="text-[11px] text-[#64748B]">
              Never sent to third parties. Stored locally in your browser session.
            </p>
          </div>

          {/* Anonymous Session ID */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-semibold text-[#0F172A] uppercase">
              Your Anonymous Session ID
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={sessionId}
                className="w-full px-3.5 py-2 text-xs bg-[#F7FAFC] border border-[#E2E8F0] rounded-lg font-mono text-[#475569] select-all"
              />
              <button
                onClick={handleCopySession}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#F0F4F8] hover:bg-[#E2E8F0] text-[#0F172A] text-xs font-medium rounded-lg transition-colors shrink-0"
              >
                {copiedSession ? <Check className="w-3.5 h-3.5 text-[#059669]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSession ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-[#64748B]">
              Scan history is anonymously bound to this key via Supabase RLS.
            </p>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#64748B] hover:text-[#0F172A] rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-[#0F6FBF] hover:bg-[#0A5594] text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            Save Settings
          </button>
        </div>

      </div>
    </div>
  );
};
