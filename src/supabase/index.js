import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const s = import.meta.env.VITE_SUPABASE_ANON_KEYY

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabasee = createClient(supabaseUrl, s);

export {supabase, supabasee };