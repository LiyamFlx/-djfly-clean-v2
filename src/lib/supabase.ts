import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase'; // We will create this type file later

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and anonymous key are required.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
