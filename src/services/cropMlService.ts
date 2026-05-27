import {
  imputeClimateFromAltitude,
  predictCrops,
  getModelLabel
} from "../ml/cropPredictor";
import type { PrediccionCultivoResponse } from "../types/models";
import { fetchPronostico7Dias } from "./openMeteo";
import { recomendarCultivos } from "./cropRules";

export type PredecirCultivosParams = {
  lat: number;
  lng: number;
  altitud_msnm?: number;
  mes?: number;
  precipitacion_mm_semana?: number;
  temp_min_c?: number;
  temp_max_c?: number;
};

async function climaDesdeOpenMeteo(lat: number, lng: number) {
  const pronostico = await fetchPronostico7Dias(lat, lng);
  const dias = pronostico.dias;
  if (!dias.length) return null;
  const temp_min_c = dias.reduce((s, d) => s + d.temp_min_c, 0) / dias.length;
  const temp_max_c = dias.reduce((s, d) => s + d.temp_max_c, 0) / dias.length;
  const precipitacion_mm_semana =
    dias.reduce((s, d) => s + d.prob_precipitacion * 12, 0) / dias.length;
  return { temp_min_c, temp_max_c, precipitacion_mm_semana };
}

/**
 * Predicción de cultivos con regresión logística entrenada (GPS + clima + altitud).
 */
export async function predecirCultivosMl(
  input: PredecirCultivosParams
): Promise<PrediccionCultivoResponse> {
  const altitud_msnm = input.altitud_msnm ?? 3200;
  const mes = input.mes ?? new Date().getMonth() + 1;

  let temp_min_c = input.temp_min_c;
  let temp_max_c = input.temp_max_c;
  let precipitacion_mm_semana = input.precipitacion_mm_semana;

  if (
    temp_min_c == null ||
    temp_max_c == null ||
    precipitacion_mm_semana == null
  ) {
    try {
      const clima = await climaDesdeOpenMeteo(input.lat, input.lng);
      if (clima) {
        temp_min_c = temp_min_c ?? clima.temp_min_c;
        temp_max_c = temp_max_c ?? clima.temp_max_c;
        precipitacion_mm_semana =
          precipitacion_mm_semana ?? clima.precipitacion_mm_semana;
      }
    } catch {
      /* sin internet: imputar por altitud */
    }
  }

  if (
    temp_min_c == null ||
    temp_max_c == null ||
    precipitacion_mm_semana == null
  ) {
    const imp = imputeClimateFromAltitude(altitud_msnm);
    temp_min_c = temp_min_c ?? imp.temp_min_c;
    temp_max_c = temp_max_c ?? imp.temp_max_c;
    precipitacion_mm_semana = precipitacion_mm_semana ?? imp.precipitacion_mm_semana;
  }

  try {
    const top = predictCrops({
      lat: input.lat,
      lng: input.lng,
      altitud_msnm,
      mes,
      temp_min_c,
      temp_max_c,
      precipitacion_mm_semana
    });

    return {
      modelo: getModelLabel(),
      top3: top.map((t, i) => ({
        rank: i + 1,
        cultivo: t.cultivo,
        probabilidad: Math.round(t.probabilidad * 10000) / 10000
      })),
      ubicacion: { lat: input.lat, lng: input.lng, altitud_msnm },
      climaUsado: { temp_min_c, temp_max_c, precipitacion_mm_semana, mes }
    };
  } catch {
    return recomendarCultivos({
      lat: input.lat,
      lng: input.lng,
      altitud_msnm,
      mes,
      precipitacion_mm_semana,
      temp_min_c,
      temp_max_c
    });
  }
}
