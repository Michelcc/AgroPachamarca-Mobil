import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { clearLocalAuthSession } from "./clearLocalSession";
import { getSupabase, isSupabaseConfigured } from "../supabase/client";

type AuthContextType = {
  loading: boolean;
  isAuthenticated: boolean;
  currentUser: string | null;
  isAdmin: boolean;
  supabaseReady: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, nombre: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

async function loadDisplayName(userId: string, email?: string | null): Promise<string> {
  const { data } = await getSupabase()
    .from("profiles")
    .select("nombre, username")
    .eq("id", userId)
    .maybeSingle();
  if (data?.nombre && String(data.nombre).trim()) return String(data.nombre).trim();
  if (data?.username) return String(data.username);
  return email?.split("@")[0] ?? "Usuario";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const supabaseReady = isSupabaseConfigured();

  useEffect(() => {
    if (!supabaseReady) {
      setLoading(false);
      return;
    }
    const sb = getSupabase();
    let cancelled = false;
    const timeout = setTimeout(() => {
      if (!cancelled) setLoading(false);
    }, 8000);

    void sb.auth
      .getSession()
      .then(({ data }) => {
        if (!cancelled) setSession(data.session);
      })
      .catch(() => {
        /* clave inválida o sin red — mostrar login */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
        clearTimeout(timeout);
      });

    const { data: sub } = sb.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => {
      cancelled = true;
      clearTimeout(timeout);
      sub.subscription.unsubscribe();
    };
  }, [supabaseReady]);

  useEffect(() => {
    void (async () => {
      if (!session?.user) {
        setCurrentUser(null);
        return;
      }
      setCurrentUser(await loadDisplayName(session.user.id, session.user.email));
    })();
  }, [session]);

  const value = useMemo<AuthContextType>(
    () => ({
      loading,
      isAuthenticated: Boolean(session),
      currentUser,
      isAdmin: currentUser === "admin",
      supabaseReady,
      signIn: async (email: string, password: string) => {
        const { error } = await getSupabase().auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password
        });
        if (error) throw error;
      },
      signUp: async (email: string, password: string, nombre: string) => {
        const mail = email.trim().toLowerCase();
        const fullName = nombre.trim();
        const user = mail.split("@")[0]?.replace(/[^a-z0-9_]/g, "") || "usuario";
        const { data, error } = await getSupabase().auth.signUp({ email: mail, password });
        if (error) throw error;
        if (data.user) {
          const { error: profileError } = await getSupabase().from("profiles").upsert({
            id: data.user.id,
            nombre: fullName,
            username: user
          });
          if (profileError) {
            throw new Error(
              `Cuenta creada pero el perfil no se guardó: ${profileError.message}. Contacta al administrador.`
            );
          }
        }
      },
      signOut: async () => {
        await clearLocalAuthSession();
        setSession(null);
        setCurrentUser(null);
      }
    }),
    [currentUser, loading, session, supabaseReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
