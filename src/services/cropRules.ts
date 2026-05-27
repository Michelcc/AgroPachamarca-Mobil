import type { PrediccionCultivoResponse } from "../types/models";

export function recomendarCultivos(input: {
  lat: number;
  lng: number;
  altitud_msnm?: number;
  mes?: number;
  precipitacion_mm_semana?: number;
  temp_min_c?: number;
  temp_max_c?: number;
}): PrediccionCultivoResponse {
  const alt = input.altitud_msnm ?? 3200;
  const m = input.mes ?? new Date().getMonth() + 1;

  let papa = 0.45;
  let maiz = 0.28;
  let quinua = 0.15;
  let cebada = 0.12;

  if (alt > 3800) [papa, maiz, quinua, cebada] = [0.35, 0.12, 0.38, 0.15];
  else if (alt < 2800) [papa, maiz, quinua, cebada] = [0.25, 0.45, 0.18, 0.12];

  if (input.temp_min_c != null && input.temp_min_c < 2) {
    papa += 0.08;
    cebada += 0.05;
  }
  if (input.precipitacion_mm_semana != null && input.precipitacion_mm_semana > 25) {
    maiz += 0.06;
    quinua += 0.04;
  }
  if ([12, 1, 2].includes(m)) {
    cebada += 0.05;
    papa += 0.03;
  }

  const raw: Array<[string, number]> = [
    ["Papa", papa],
    ["Maíz amiláceo", maiz],
    ["Quinua", quinua],
    ["Cebada", cebada]
  ];
  raw.sort((a, b) => b[1] - a[1]);
  const top3 = raw.slice(0, 3);
  const s = top3.reduce((acc, [, p]) => acc + p, 0) || 1;

  return {
    modelo: "reglas-heuristicas-v1 (respaldo sin ML)",
    top3: top3.map(([cultivo, prob], i) => ({
      rank: i + 1,
      cultivo,
      probabilidad: Math.round((prob / s) * 10000) / 10000
    }))
  };
}
