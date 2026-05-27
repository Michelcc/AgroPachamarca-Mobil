import { predictAlertasMl } from "../ml/alertPredictor";
import type { AlertaEvaluacion } from "./alertasLocal";
import { evaluarReglasLegacy } from "./alertasLocal";

export type EvaluarAlertasMlInput = {
  lat: number;
  lng: number;
  altitud_msnm?: number;
  mes?: number;
  temp_min_proximas_24h: number;
  temp_max_proximas_24h?: number;
  prob_precipitacion: number;
};

export function evaluarAlertasMl(input: EvaluarAlertasMlInput): AlertaEvaluacion & {
  modelo: string;
  escenario: string;
} {
  const altitud_msnm = input.altitud_msnm ?? 3200;
  const mes = input.mes ?? new Date().getMonth() + 1;
  const temp_max =
    input.temp_max_proximas_24h ?? input.temp_min_proximas_24h + 12;

  try {
    const pred = predictAlertasMl({
      lat: input.lat,
      lng: input.lng,
      altitud_msnm,
      mes,
      temp_min_c: input.temp_min_proximas_24h,
      temp_max_c: temp_max,
      prob_precipitacion: input.prob_precipitacion
    });

    return {
      ts: Date.now(),
      nivel: pred.nivel === "critico" ? "alto" : pred.nivel,
      alertas: pred.alertas,
      lat: input.lat,
      lng: input.lng,
      modelo: pred.modelo,
      escenario: pred.escenario
    };
  } catch {
    const legacy = evaluarReglasLegacy({
      temp_min_proximas_24h: input.temp_min_proximas_24h,
      prob_precipitacion: input.prob_precipitacion
    });
    return {
      ...legacy,
      lat: input.lat,
      lng: input.lng,
      modelo: "reglas-legacy (respaldo)",
      escenario: "legacy"
    };
  }
}
