import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseUrl } from "../config/env";

let client: SupabaseClient | null = null;

/** Fetch compatible con Android/Hermes (Supabase a veces falla con el fetch por defecto). */
async function supabaseFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(input, init);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (/network request failed/i.test(msg)) {
      throw new TypeError(
        "Network request failed: no se pudo conectar a Supabase. Revisa internet del emulador y la clave anon (eyJ…) en android/.env"
      );
    }
    throw error;
  }
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

export function getSupabaseConfigWarning(): string | null {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key) return null;
  if (key.startsWith("sb_publishable_")) {
    return "En android/.env usa la clave anon (eyJ…) de Supabase → Settings → API, no la publishable.";
  }
  return null;
}

export function getSupabase(): SupabaseClient {
  if (client) return client;
  const url = getSupabaseUrl().replace(/\/$/, "");
  const key = getSupabaseAnonKey();
  if (!url || !key) {
    throw new Error(
      "Configura EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_ANON_KEY en android/.env"
    );
  }
  client = createClient(url, key, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false
    },
    global: {
      fetch: supabaseFetch
    }
  });
  return client;
}
