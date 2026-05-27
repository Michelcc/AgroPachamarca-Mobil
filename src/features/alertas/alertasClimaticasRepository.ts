import { getSupabase } from "../../supabase/client";

export type AlertaClimaticaGlobal = {
  id: string;
  titulo: string;
  mensaje: string;
  nivel: string;
  lat: number | null;
  lng: number | null;
  created_at: string;
};

/** Alertas publicadas desde el panel web (tabla alertas_climaticas). */
export async function listAlertasClimaticasGlobales(): Promise<AlertaClimaticaGlobal[]> {
  const { data, error } = await getSupabase()
    .from("alertas_climaticas")
    .select("id,titulo,mensaje,nivel,lat,lng,created_at")
    .eq("activo", true)
    .order("created_at", { ascending: false })
    .limit(30);
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: String(r.id),
    titulo: String(r.titulo),
    mensaje: String(r.mensaje),
    nivel: String(r.nivel),
    lat: r.lat != null ? Number(r.lat) : null,
    lng: r.lng != null ? Number(r.lng) : null,
    created_at: String(r.created_at)
  }));
}
