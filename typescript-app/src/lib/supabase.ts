import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ScanHistoryItem } from '../types/dermascan';

const LOCAL_STORAGE_HISTORY_KEY = 'dermoscan_local_history';

// Environment variables or localStorage overrides
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.warn('Supabase client init failed, falling back to local storage:', e);
  }
}

/**
 * Saves a completed scan to history.
 * Attempts Supabase first if available; falls back or mirrors to localStorage.
 */
export async function saveScanToHistory(item: ScanHistoryItem): Promise<{ success: boolean; source: 'supabase' | 'local'; error?: string }> {
  // Always mirror to localStorage for instant offline access
  try {
    const localHistory = getLocalHistory(item.session_id);
    const updated = [item, ...localHistory.filter(h => h.id !== item.id)];
    saveLocalHistory(item.session_id, updated);
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }

  // Attempt Supabase if available
  if (supabase) {
    try {
      const { error } = await supabase.from('scan_history').insert([
        {
          id: item.id,
          session_id: item.session_id,
          image_thumbnail: item.image_thumbnail,
          body_location: item.body_location,
          duration: item.duration,
          symptoms: item.symptoms,
          classification: item.classification,
          icd_code: item.icd_code,
          confidence: item.confidence,
          risk_level: item.risk_level,
          full_result: item.full_result,
          created_at: item.created_at,
        }
      ]);

      if (error) {
        console.warn('Supabase insert error, saved locally:', error.message);
        return { success: true, source: 'local', error: error.message };
      }
      return { success: true, source: 'supabase' };
    } catch (err: any) {
      console.warn('Supabase request failed, saved locally:', err);
      return { success: true, source: 'local', error: err?.message || 'Network error' };
    }
  }

  return { success: true, source: 'local' };
}

/**
 * Fetches scan history for a specific session.
 */
export async function fetchScanHistory(sessionId: string): Promise<{ items: ScanHistoryItem[]; source: 'supabase' | 'local' }> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('scan_history')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return { items: data as ScanHistoryItem[], source: 'supabase' };
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local history:', err);
    }
  }

  // Fallback to local storage
  const localItems = getLocalHistory(sessionId);
  return { items: localItems, source: 'local' };
}

/**
 * Delete a scan by ID.
 */
export async function deleteScanHistoryItem(id: string, sessionId: string): Promise<boolean> {
  // Update local storage
  const localItems = getLocalHistory(sessionId).filter(item => item.id !== id);
  saveLocalHistory(sessionId, localItems);

  if (supabase) {
    try {
      await supabase.from('scan_history').delete().eq('id', id).eq('session_id', sessionId);
    } catch (e) {
      console.warn('Supabase delete failed:', e);
    }
  }
  return true;
}

// Local storage helpers
function getLocalHistory(sessionId: string): ScanHistoryItem[] {
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_HISTORY_KEY}_${sessionId}`);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveLocalHistory(sessionId: string, items: ScanHistoryItem[]) {
  try {
    localStorage.setItem(`${LOCAL_STORAGE_HISTORY_KEY}_${sessionId}`, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving local history:', e);
  }
}
