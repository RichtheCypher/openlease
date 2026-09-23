import { createClient } from '@supabase/supabase-js';

// Read from build-time Vite env vars or runtime override stored in browser
const getSavedUrl = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('openlease_supabase_url');
    if (saved) return saved.trim();
  }
  return (import.meta.env.VITE_SUPABASE_URL || '').trim();
};

const getSavedKey = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('openlease_supabase_key');
    if (saved) return saved.trim();
  }
  return (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();
};

export const getSupabaseConfig = () => {
  const url = getSavedUrl();
  const key = getSavedKey();
  const configured = Boolean(
    url && 
    key && 
    url !== 'https://your-project.supabase.co' &&
    !url.includes('your-project')
  );
  return { url, key, configured };
};

export const setRuntimeSupabaseConfig = (url: string, key: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('openlease_supabase_url', url.trim());
    localStorage.setItem('openlease_supabase_key', key.trim());
    window.location.reload();
  }
};

export const clearRuntimeSupabaseConfig = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('openlease_supabase_url');
    localStorage.removeItem('openlease_supabase_key');
    window.location.reload();
  }
};

const initialConfig = getSupabaseConfig();
export const isSupabaseConfigured = initialConfig.configured;

export const getSupabaseDebugInfo = () => {
  const { url, key, configured } = getSupabaseConfig();
  return {
    hasUrl: Boolean(url),
    urlPreview: url ? `${url.slice(0, 18)}...` : 'EMPTY',
    hasKey: Boolean(key),
    keyLength: key ? key.length : 0,
    isConfigured: configured,
    isRuntimeSaved: typeof window !== 'undefined' ? Boolean(localStorage.getItem('openlease_supabase_url')) : false
  };
};

export const supabase = initialConfig.configured
  ? createClient(initialConfig.url, initialConfig.key)
  : null;
