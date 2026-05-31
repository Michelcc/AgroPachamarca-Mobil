import type { EstadoSuelo, LecturaSueloInput } from "../types/sensores";

export type InterpretacionSuelo = {
  estado: EstadoSuelo;
  etiqueta: string;
  color: "green" | "amber" | "red" | "sky";
  recomendaciones: string[];
};

/** Rangos orientativos para suelos agrícolas andinos (papa, maíz, quinua). */
export function interpretarLecturaSuelo(input: {
  humedad_pct: number;
  ph: number;
  temperatura_c: number;
  conductividad_ms_cm?: number;
}): InterpretacionSuelo {
  const rec: string[] = [];
  let estado: EstadoSuelo = "optimo";

  if (input.humedad_pct < 25) {
    estado = "seco";
    rec.push("Riego ligero recomendado; evitar labranza en suelo muy seco.");
  } else if (input.humedad_pct > 75) {
    estado = "saturado";
    rec.push("Revisar drenaje; posponer siembra si hay encharcamiento.");
  } else if (input.humedad_pct > 55) {
    estado = "humedo";
    rec.push("Monitorear; condiciones aceptables para la mayoría de cultivos.");
  } else {
    estado = "optimo";
    rec.push("Humedad en rango favorable para siembra y desarrollo radicular.");
  }

  if (input.ph < 5.5) {
    estado = estado === "optimo" ? "critico" : estado;
    rec.push("pH ácido: considerar encalado según análisis de suelo.");
  } else if (input.ph > 7.8) {
    rec.push("pH alcalino: evaluar fertilización y materia orgánica.");
  }

  if (input.conductividad_ms_cm != null && input.conductividad_ms_cm > 2.5) {
    rec.push("Alta conductividad (salinidad): revisar riego y lavado de sales.");
  }

  if (input.temperatura_c < 5) {
    rec.push("Suelo frío: retrasar siembra o usar variedades tolerantes a helada.");
  } else if (input.temperatura_c > 35) {
    rec.push("Suelo muy caliente: preferir riego en horas frescas.");
  }

  const etiquetas: Record<EstadoSuelo, string> = {
    seco: "Suelo seco",
    optimo: "Condiciones óptimas",
    humedo: "Suelo húmedo",
    saturado: "Exceso de humedad",
    critico: "Atención requerida"
  };

  const colores: Record<EstadoSuelo, InterpretacionSuelo["color"]> = {
    seco: "amber",
    optimo: "green",
    humedo: "sky",
    saturado: "amber",
    critico: "red"
  };

  return {
    estado,
    etiqueta: etiquetas[estado],
    color: colores[estado],
    recomendaciones: rec.slice(0, 4)
  };
}

/**
 * Simula lectura de sensor IoT de suelo cuando no hay hardware conectado.
 * Valores realistas según altitud, mes y variación aleatoria controlada.
 */
export function simularLecturaSensor(input?: {
  altitudMsnm?: number;
  mes?: number;
}): Omit<LecturaSueloInput, "lat" | "lng"> {
  const mes = input?.mes ?? new Date().getMonth() + 1;
  const alt = input?.altitudMsnm ?? 3200;
  const estacionSeca = mes >= 5 && mes <= 9;

  const baseHumedad = estacionSeca ? 38 : 52;
  const humedad_pct = Math.round((baseHumedad + (Math.random() * 16 - 8)) * 10) / 10;

  const ph = Math.round((6.2 + (Math.random() * 0.8 - 0.4)) * 100) / 100;

  const tempBase = alt > 3500 ? 12 : alt > 2800 ? 16 : 20;
  const temperatura_c = Math.round((tempBase + (Math.random() * 4 - 2)) * 10) / 10;

  const conductividad_ms_cm = Math.round((0.8 + Math.random() * 0.9) * 100) / 100;
  const profundidad_cm = 15;

  return {
    sensor_codigo: `SIM-${Date.now().toString(36).slice(-4).toUpperCase()}`,
    humedad_pct,
    ph,
    temperatura_c,
    conductividad_ms_cm,
    profundidad_cm,
    nitrogeno_ppm: Math.round(40 + Math.random() * 30),
    fosforo_ppm: Math.round(15 + Math.random() * 20),
    potasio_ppm: Math.round(120 + Math.random() * 80),
    notas: "Lectura simulada (modo demo sin sensor físico conectado)"
  };
}
