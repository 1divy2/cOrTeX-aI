import { createClient } from "@supabase/supabase-js";

let _supabase: any = null;

export const supabase = new Proxy({}, {
  get: (target, prop) => {
    if (!_supabase) {
      _supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co",
        import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder"
      );
    }
    return _supabase[prop];
  }
}) as any;