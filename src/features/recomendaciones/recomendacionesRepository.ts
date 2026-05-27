import { getSupabase } from "../../supabase/client";

export type RecomendacionCultivoRow = {
  id: string;
  cultivo: string;
  altitud_min_m: number;
  altitud_max_m: number;
  mes_inicio: number;
  mes_fin: number;
  probabilidad: number;
  notas: string | null;
};

/** Reglas del panel web (tabla recomendaciones_cultivo). */
export async function listRecomendacionesCultivo(): Promise<RecomendacionCultivoRow[]> {
  const { data, error } = await getSupabase()
    .from("recomendaciones_cultivo")
    .select("id,cultivo,altitud_min_m,altitud_max_m,mes_inicio,mes_fin,probabilidad,notas")
    .eq("activo", true)
    .order("probabilidad", { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: String(r.id),
    cultivo: String(r.cultivo),
    altitud_min_m: Number(r.altitud_min_m),
    altitud_max_m: Number(r.altitud_max_m),
    mes_inicio: Number(r.mes_inicio),
    mes_fin: Number(r.mes_fin),
    probabilidad: Number(r.probabilidad),
    notas: r.notas ? String(r.notas) : null
  }));
}
