import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase credentials missing. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your secrets."
  );
}

// Lazy initialization is preferred for SDKs that require API keys
// to avoid crashing on startup if the keys are missing.
export const supabase = createClient(
  supabaseUrl || "https://placeholder-url.supabase.co",
  supabaseAnonKey || "placeholder-key"
);
