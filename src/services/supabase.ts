import { createClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const rawKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = Boolean(
  rawUrl && 
  rawKey && 
  rawUrl !== 'https://your-project.supabase.co' &&
  !rawUrl.includes('your-project')
);

export const getSupabaseDebugInfo = () => {
  return {
    hasUrl: Boolean(rawUrl),
    urlPreview: rawUrl ? `${rawUrl.slice(0, 18)}...` : 'EMPTY',
    hasKey: Boolean(rawKey),
    keyLength: rawKey ? rawKey.length : 0,
    isConfigured: isSupabaseConfigured
  };
};

export const supabase = isSupabaseConfigured
  ? createClient(rawUrl, rawKey)
  : null;
