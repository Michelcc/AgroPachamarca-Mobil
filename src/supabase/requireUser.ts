import { getSupabase } from "./client";

export async function requireUserId(): Promise<string> {
  const { data, error } = await getSupabase().auth.getUser();
  if (error || !data.user?.id) throw new Error("Inicia sesion para continuar.");
  return data.user.id;
}
