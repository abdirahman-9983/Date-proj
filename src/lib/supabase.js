// src/lib/supabase.js
// ─────────────────────────────────────────────────────────────
//  Supabase client — single instance used across the whole app
//  Credentials are loaded from .env.local (never hard-coded)
// ─────────────────────────────────────────────────────────────
import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '[Supabase] Missing env vars. ' +
    'Create .env.local with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
}

export const supabase = createClient(supabaseUrl ?? '', supabaseKey ?? '');
