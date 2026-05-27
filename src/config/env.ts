import Constants from "expo-constants";

type AppExtra = {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  geminiApiKey?: string;
};

function extra(): AppExtra {
  return (Constants.expoConfig?.extra ?? {}) as AppExtra;
}

export function getSupabaseUrl(): string {
  return (
    process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() ||
    extra().supabaseUrl?.trim() ||
    ""
  );
}

export function getSupabaseAnonKey(): string {
  return (
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    extra().supabaseAnonKey?.trim() ||
    ""
  );
}

export function getGeminiApiKey(): string | undefined {
  const key =
    process.env.EXPO_PUBLIC_GEMINI_API_KEY?.trim() ||
    extra().geminiApiKey?.trim();
  return key || undefined;
}
