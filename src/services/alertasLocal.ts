import { getSupabase } from "../supabase/client";
import { requireUserId } from "../supabase/requireUser";
import { evaluarAlertasMl } from "./alertasMlService";

export type AlertaEvaluacion = {
  ts: number;
  nivel: string;
  alertas: Array<{ mensaje: string; tipo?: string }>;
  lat: number;
  lng: number;
  modelo?: string;
  escenario?: string;
};

/** Respaldo si falla el modelo ML */
export function evaluarReglasLegacy(input: {
  temp_min_proximas_24h: number;
  prob_precipitacion: number;
}): Omit<AlertaEvaluacion, "lat" | "lng"> {
  const alertas: AlertaEvaluacion["alertas"] = [];
  if (input.temp_min_proximas_24h < 2) {
    alertas.push({ mensaje: "Riesgo de helada ligera.", tipo: "helada" });
  }
  if (input.prob_precipitacion >= 0.7) {
    alertas.push({ mensaje: "Alta probabilidad de lluvia.", tipo: "lluvia" });
  }
  if (input.prob_precipitacion >= 0.85) {
    alertas.push({ mensaje: "Lluvia muy probable.", tipo: "lluvia_fuerte" });
  }
  if (!alertas.length) {
    alertas.push({ mensaje: "Condiciones normales.", tipo: "ok" });
  }
  const nivel = alertas.some((a) => a.tipo === "helada" || a.tipo === "lluvia_fuerte")
    ? "alto"
    : alertas.some((a) => a.tipo === "lluvia")
      ? "medio"
      : "bajo";
  return { ts: Date.now(), nivel, alertas };
}

export async function guardarEvaluacionAlerta(input: {
  lat: number;
  lng: number;
  temp_min_proximas_24h: number;
  temp_max_proximas_24h?: number;
  prob_precipitacion: number;
  altitud_msnm?: number;
}): Promise<AlertaEvaluacion> {
  const userId = await requireUserId();
  const evaluacion = evaluarAlertasMl({
    lat: input.lat,
    lng: input.lng,
    altitud_msnm: input.altitud_msnm,
    temp_min_proximas_24h: input.temp_min_proximas_24h,
    temp_max_proximas_24h: input.temp_max_proximas_24h,
    prob_precipitacion: input.prob_precipitacion
  });

  const row = {
    user_id: userId,
    nivel: evaluacion.nivel,
    alertas: [
      ...evaluacion.alertas,
      { mensaje: evaluacion.modelo ?? "ML", tipo: "ml_meta" }
    ],
    lat: input.lat,
    lng: input.lng
  };
  const { error } = await getSupabase().from("alertas_clima").insert(row);
  if (error) throw error;
  return evaluacion;
}

export async function listarAlertasRecientes(lim = 10): Promise<AlertaEvaluacion[]> {
  const userId = await requireUserId();
  const { data, error } = await getSupabase()
    .from("alertas_clima")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(lim);
  if (error) throw error;
  return (data ?? []).map((r) => {
    const raw = (r.alertas as AlertaEvaluacion["alertas"]) ?? [];
    const meta = raw.find((a) => a.tipo === "ml_meta");
    const alertas = raw.filter((a) => a.tipo !== "ml_meta");
    return {
      ts: new Date(String(r.created_at)).getTime(),
      nivel: String(r.nivel),
      alertas,
      lat: Number(r.lat),
      lng: Number(r.lng),
      modelo: meta?.mensaje
    };
  });
}
