import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSupabaseUrl } from "../config/env";
import { getSupabase } from "../supabase/client";

/** Cierra sesion en el telefono aunque no haya internet. */
export async function clearLocalAuthSession(): Promise<void> {
  try {
    await getSupabase().auth.signOut({ scope: "local" });
  } catch {
    /* signOut puede fallar sin red; seguimos limpiando almacenamiento local */
  }

  try {
    const keys = await AsyncStorage.getAllKeys();
    const authKeys = keys.filter(
      (k) => k.includes("auth-token") || (k.startsWith("sb-") && k.includes("auth"))
    );
    if (authKeys.length > 0) {
      await AsyncStorage.multiRemove(authKeys);
    } else {
      const url = getSupabaseUrl();
      if (url) {
        const ref = new URL(url).hostname.split(".")[0];
        if (ref) await AsyncStorage.removeItem(`sb-${ref}-auth-token`);
      }
    }
  } catch {
    /* ignorar errores de almacenamiento */
  }
}
