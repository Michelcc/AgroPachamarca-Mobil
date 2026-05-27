import { calcularProgreso } from "../campo/campoRepository";
import { getSupabase } from "../../supabase/client";
import { requireUserId } from "../../supabase/requireUser";

export type UserProfile = {
  id: string;
  email: string;
  nombre: string;
  username: string;
  cuentaDesde: string | null;
  registrosCampo: number;
  modulosConDatos: number;
  productos: number;
  diagnosticosIa: number;
  alertasClima: number;
};

async function countForUser(table: string, userId: string): Promise<number> {
  const { count, error } = await getSupabase()
    .from(table)
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);
  if (error) return 0;
  return count ?? 0;
}

export async function loadUserProfile(): Promise<UserProfile> {
  const userId = await requireUserId();
  const sb = getSupabase();

  const [{ data: authUser }, { data: profile }, progreso, productos, diagnosticos, alertas] =
    await Promise.all([
      sb.auth.getUser(),
      sb.from("profiles").select("nombre, username, created_at").eq("id", userId).maybeSingle(),
      calcularProgreso(),
      countForUser("productos", userId),
      countForUser("diagnosticos_ia", userId),
      countForUser("alertas_clima", userId)
    ]);

  const email = authUser.user?.email ?? "—";
  const username = profile?.username ?? email.split("@")[0]?.toLowerCase() ?? "usuario";
  const nombre =
    (profile?.nombre && String(profile.nombre).trim()) ||
    username;

  return {
    id: userId,
    email,
    nombre,
    username,
    cuentaDesde: profile?.created_at ? String(profile.created_at) : null,
    registrosCampo: progreso.totalRegistros,
    modulosConDatos: progreso.tablasConRegistro,
    productos,
    diagnosticosIa: diagnosticos,
    alertasClima: alertas
  };
}
