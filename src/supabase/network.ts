import { Platform } from "react-native";
import { getSupabaseAnonKey, getSupabaseUrl } from "../config/env";

/** Mensaje claro cuando fetch falla antes de llegar a Supabase. */
export function mapNetworkError(error: unknown): string {
  const msg = error instanceof Error ? error.message : String(error);
  if (/network request failed/i.test(msg)) {
    return [
      "No hay conexión con Supabase desde el móvil.",
      "",
      "• Emulador: abre Chrome y prueba google.com",
      "• Clave: usa la anon key eyJ… (Settings → API en Supabase)",
      "• Reinicia: npm start y vuelve a abrir la app",
      "• APK: vuelve a compilar con android\\instalar-app.ps1"
    ].join("\n");
  }
  return msg || "Error de red";
}

export function validateSupabaseEnv(): string | null {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key) {
    return "Faltan EXPO_PUBLIC_SUPABASE_URL o EXPO_PUBLIC_SUPABASE_ANON_KEY en android/.env";
  }
  if (!/^https:\/\/.+\.supabase\.co\/?$/i.test(url.replace(/\/$/, ""))) {
    return "EXPO_PUBLIC_SUPABASE_URL debe ser https://TU_PROYECTO.supabase.co (sin localhost)";
  }
  if (key.startsWith("sb_publishable_")) {
    return "Usa la clave anon (eyJ…) en android/.env. La publishable a veces falla en Android.";
  }
  if (!key.startsWith("eyJ")) {
    return "EXPO_PUBLIC_SUPABASE_ANON_KEY debe ser la anon public key (empieza con eyJ).";
  }
  return null;
}

/** Prueba rápida de red hacia el proyecto Supabase. */
export async function pingSupabase(): Promise<{ ok: boolean; detail: string }> {
  const url = getSupabaseUrl().replace(/\/$/, "");
  const key = getSupabaseAnonKey();
  if (!url || !key) {
    return { ok: false, detail: "Sin URL o clave en .env" };
  }
  try {
    const res = await fetch(`${url}/auth/v1/health`, {
      method: "GET",
      headers: { apikey: key, Authorization: `Bearer ${key}` }
    });
    if (res.ok || res.status === 401) {
      return { ok: true, detail: "Supabase responde correctamente" };
    }
    return { ok: false, detail: `Supabase respondió HTTP ${res.status}` };
  } catch (e) {
    return { ok: false, detail: mapNetworkError(e) };
  }
}

export const supabasePlatformHint =
  Platform.OS === "android"
    ? "En emulador Android usa la URL pública de Supabase (https://xxx.supabase.co), no localhost."
    : "Usa la URL pública de Supabase en .env";
