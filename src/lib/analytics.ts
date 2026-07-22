import { AnalyticsEventType } from "@shared/types";
import { v4 as uuidv4 } from 'uuid';
const SESSION_KEY = 'wbw_session_id';
const getSessionId = (): string => {
  if (typeof window === 'undefined') return 'server';
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = uuidv4();
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch (err) {
    // Fallback for private browsing or restricted environments
    return 'anon-' + Math.random().toString(36).substring(2, 10);
  }
};
export const trackEvent = async (
  type: AnalyticsEventType,
  target: string,
  metadata?: Record<string, any>
) => {
  try {
    if (typeof window === 'undefined') return;
    const response = await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        target,
        metadata,
        sessionId: getSessionId(),
      }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Analytics status: ${response.status} - ${errorText}`);
    }
  } catch (err: any) {
    // Silent fail in production but with descriptive warning for developers
    const errorMessage = err?.message || String(err);
    if (import.meta.env?.DEV) {
      console.warn(`[Analytics] Failed to track event [${type}:${target}]:`, errorMessage);
    }
  }
};
/**
 * Initialize a page view track
 */
export const initPageView = (pageName: string) => {
  trackEvent('page_view', pageName);
};