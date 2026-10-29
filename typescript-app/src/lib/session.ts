// Session Management for DermoScan
const SESSION_STORAGE_KEY = 'dermoscan_session_id';

export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'server-session';
  
  let sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessionId) {
    // Generate UUID v4
    sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  }
  return sessionId;
}

export function setCustomSessionId(customId: string): void {
  if (typeof window !== 'undefined' && customId.trim()) {
    localStorage.setItem(SESSION_STORAGE_KEY, customId.trim());
  }
}

export function formatShortSessionId(id: string): string {
  if (!id) return '';
  return id.substring(0, 8);
}
