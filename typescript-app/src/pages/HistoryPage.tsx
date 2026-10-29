import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  Calendar,
  MapPin,
  Clock,
  Copy,
  Check,
  Activity,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { ScanHistoryItem, SkinAnalysisResult, ScanSubmission } from '../types/dermascan';
import { fetchScanHistory, deleteScanHistoryItem } from '../lib/supabase';
import { getOrCreateSessionId, formatShortSessionId } from '../lib/session';

interface HistoryPageProps {
  onSelectScan: (result: SkinAnalysisResult, submission: ScanSubmission) => void;
  onNewScan: () => void;
  onToast: (type: 'success' | 'error' | 'info', msg: string) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  onSelectScan,
  onNewScan,
  onToast,
}) => {
  const [items, setItems] = useState<ScanHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState('');
  const [copiedSession, setCopiedSession] = useState(false);

  // Filters
  const [riskFilter, setRiskFilter] = useState<'all' | 'low' | 'moderate' | 'high'>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | '7days' | '30days'>('all');

  useEffect(() => {
    const currentSession = getOrCreateSessionId();
    setSessionId(currentSession);
    loadHistory(currentSession);
  }, []);

  const loadHistory = async (sid: string) => {
    setIsLoading(true);
    try {
      const { items: fetchedItems } = await fetchScanHistory(sid);
      setItems(fetchedItems);
    } catch (e) {
      console.error('Failed to load history:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Delete this scan from your history?')) return;

    try {
      await deleteScanHistoryItem(id, sessionId);
      setItems((prev) => prev.filter((item) => item.id !== id));
      onToast('info', 'Scan removed from history.');
    } catch (e) {
      onToast('error', 'Failed to delete item.');
    }
  };

  const handleCopySession = () => {
    navigator.clipboard.writeText(sessionId);
    setCopiedSession(true);
    onToast('info', 'Session ID copied. You can resume this session anytime.');
    setTimeout(() => setCopiedSession(false), 2000);
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    // Risk filter
    if (riskFilter !== 'all' && item.risk_level !== riskFilter) {
      return false;
    }

    // Location filter
    if (locationFilter !== 'all' && item.body_location !== locationFilter) {
      return false;
    }

    // Date range filter
    if (dateFilter !== 'all') {
      const itemDate = new Date(item.created_at).getTime();
      const now = Date.now();
      const days = dateFilter === '7days' ? 7 : 30;
      if (now - itemDate > days * 24 * 60 * 60 * 1000) {
        return false;
      }
    }

    return true;
  });

  // Extract unique locations from history for dropdown
  const uniqueLocations = Array.from(new Set(items.map((i) => i.body_location).filter(Boolean)));

  return (
    <div className="min-h-[calc(100vh-140px)] max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#0F172A] tracking-tight">
            Your Scan History
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-mono text-[#64748B]">
              Session ID: <strong className="text-[#0F6FBF]">{formatShortSessionId(sessionId)}...</strong>
            </span>
            <button
              onClick={handleCopySession}
              className="p-1 text-[#64748B] hover:text-[#0F172A] transition-colors"
              title="Copy Full Session ID"
            >
              {copiedSession ? <Check className="w-3.5 h-3.5 text-[#059669]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <button
          onClick={onNewScan}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F6FBF] hover:bg-[#0A5594] text-white font-display font-bold text-xs sm:text-sm rounded-full shadow-sm transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>New Scan</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#FFFFFF] p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] shadow-clinical flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Risk Level Segmented */}
          <div className="flex items-center p-1 bg-[#F0F4F8] rounded-xl border border-[#E2E8F0] text-xs">
            {(['all', 'low', 'moderate', 'high'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setRiskFilter(lvl)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                  riskFilter === lvl
                    ? 'bg-[#FFFFFF] text-[#0F172A] shadow-xs font-semibold'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Body Location Dropdown */}
          <div className="relative">
            <select
              aria-label="Filter by body location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="text-xs bg-[#F7FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 font-medium text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0F6FBF]"
            >
              <option value="all">All Body Zones</option>
              {uniqueLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Segmented */}
          <div className="flex items-center p-1 bg-[#F0F4F8] rounded-xl border border-[#E2E8F0] text-xs">
            <button
              onClick={() => setDateFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                dateFilter === 'all'
                  ? 'bg-[#FFFFFF] text-[#0F172A] shadow-xs font-semibold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setDateFilter('30days')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                dateFilter === '30days'
                  ? 'bg-[#FFFFFF] text-[#0F172A] shadow-xs font-semibold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setDateFilter('7days')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                dateFilter === '7days'
                  ? 'bg-[#FFFFFF] text-[#0F172A] shadow-xs font-semibold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              7 Days
            </button>
          </div>

        </div>

        {/* Results count */}
        <div className="text-xs font-mono text-[#64748B] self-end md:self-auto">
          Showing <strong className="text-[#0F172A]">{filteredItems.length}</strong> {filteredItems.length === 1 ? 'scan' : 'scans'}
        </div>

      </div>

      {/* Main Content Area */}
      {isLoading ? (
        // Skeleton Loaders
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-clinical overflow-hidden animate-pulse"
            >
              <div className="h-[160px] bg-[#E2E8F0]" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-[#E2E8F0] rounded w-3/4" />
                <div className="h-4 bg-[#E2E8F0] rounded w-1/2" />
                <div className="h-2 bg-[#E2E8F0] rounded w-full mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        // Empty State
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-clinical p-12 text-center max-w-md mx-auto space-y-6 my-12">
          {/* Stylized SVG Magnifying Glass over skin cells */}
          <div className="w-20 h-20 rounded-full bg-[#EBF4FF] text-[#0F6FBF] flex items-center justify-center mx-auto shadow-inner">
            <svg
              className="w-10 h-10 text-[#0F6FBF]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <circle cx="9" cy="9" r="1.5" strokeDasharray="1 1" />
              <circle cx="13" cy="12" r="2" strokeDasharray="1 1" />
            </svg>
          </div>

          <div className="space-y-2">
            <h3 className="font-display font-bold text-xl text-[#0F172A]">
              No scans yet
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Upload a photo to classify skin lesions, assess risks, and maintain an anonymous session record.
            </p>
          </div>

          <button
            onClick={onNewScan}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F6FBF] hover:bg-[#0A5594] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analyze My Skin</span>
          </button>
        </div>
      ) : (
        // Scan Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => {
            const riskBadge = {
              text: `${(item.risk_level || 'standard').toUpperCase()} RISK`,
              bg: 'bg-[#EBF4FF] text-[#0F6FBF] border-[#BFDBFE]',
            };

            const submissionData: ScanSubmission = {
              imageData: item.image_thumbnail,
              thumbnailData: item.image_thumbnail,
              bodyLocation: item.body_location,
              duration: item.duration,
              symptoms: item.symptoms,
              notes: item.full_result?.clinical_description || '',
            };

            return (
              <div
                key={item.id}
                onClick={() => onSelectScan(item.full_result, submissionData)}
                style={{ animationDelay: `${index * 80}ms` }}
                className="group bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-clinical hover:shadow-clinical-hover transition-all duration-200 overflow-hidden cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Card Image Thumbnail */}
                  <div className="relative w-full h-[160px] bg-[#F0F4F8] overflow-hidden">
                    <img
                      src={item.image_thumbnail}
                      alt={item.classification}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Risk Badge Overlaid Top-Right */}
                    <div className="absolute top-3 right-3">
                      <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-full border shadow-xs ${riskBadge.bg}`}>
                        {riskBadge.text}
                      </span>
                    </div>

                    {/* ICD Code badge top-left */}
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-md">
                      {item.icd_code}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3">
                    <h3 className="font-display font-bold text-base text-[#0F172A] line-clamp-1 group-hover:text-[#0F6FBF] transition-colors">
                      {item.classification}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-[#64748B]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#0F6FBF]" />
                        {item.body_location || 'Unspecified'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#64748B]" />
                        {item.duration || 'N/A'}
                      </span>
                    </div>

                    {/* Confidence Meter */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-[#64748B]">Confidence</span>
                        <span className="font-bold text-[#0F6FBF]">{item.confidence}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0F6FBF] rounded-full"
                          style={{ width: `${item.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-5 py-3 bg-[#F7FAFC] border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] text-[#64748B]">
                    {new Date(item.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => handleDelete(item.id, e)}
                      className="text-[#94A3B8] hover:text-[#DC2626] transition-colors p-1"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-semibold text-[#0F6FBF] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      View Report
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
