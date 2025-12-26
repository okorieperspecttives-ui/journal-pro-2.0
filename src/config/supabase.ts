import { createClient } from "@supabase/supabase-js";

// src/config.ts
export const supabaseUrl = import.meta.env.VITE_API_URL as string;
export const supabaseAnonKey = import.meta.env
  .VITE_VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
