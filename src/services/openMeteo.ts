import type { PronosticoResponse } from "../types/models";

type OpenMeteoDaily = {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: number[];
  weathercode: number[];
};

const WMO: Record<number, string> = {
  0: "Despejado",
  1: "Mayormente despejado",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Niebla",
  48: "Niebla con escarcha",
  51: "Llovizna ligera",
  61: "Lluvia ligera",
  63: "Lluvia moderada",
  65: "Lluvia fuerte",
  71: "Nieve ligera",
  80: "Chubascos"
};

function wmoLabel(code: number): string {
  return WMO[code] ?? "Condicion variable";
}

export async function fetchPronostico7Dias(lat: number, lng: number): Promise<PronosticoResponse> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode` +
    `&timezone=auto&forecast_days=7`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("No se pudo obtener el pronostico (revisa internet).");
  const json = (await res.json()) as { daily?: OpenMeteoDaily };
  const d = json.daily;
  if (!d?.time?.length) throw new Error("Respuesta de clima incompleta.");

  const dias = d.time.map((fecha, i) => ({
    fecha,
    temp_min_c: d.temperature_2m_min[i] ?? 0,
    temp_max_c: d.temperature_2m_max[i] ?? 0,
    prob_precipitacion: (d.precipitation_probability_max[i] ?? 0) / 100,
    descripcion: wmoLabel(d.weathercode[i] ?? 0)
  }));

  return { fuente: "Open-Meteo (internet)", lat, lng, dias };
}
