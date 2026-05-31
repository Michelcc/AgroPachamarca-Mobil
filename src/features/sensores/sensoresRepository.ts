import { getSupabase } from "../../supabase/client";
import { requireUserId } from "../../supabase/requireUser";
import { interpretarLecturaSuelo } from "../../services/sensoresSueloService";
import type { LecturaSensorSuelo, LecturaSueloInput, SensorIoT } from "../../types/sensores";

function mapSensor(x: Record<string, unknown>): SensorIoT {
  return {
    id: String(x.id),
    sensor_codigo: String(x.sensor_codigo ?? x.titulo ?? "SENSOR"),
    sensor_tipo: String(x.sensor_tipo ?? "suelo"),
    modelo: x.modelo ? String(x.modelo) : null,
    parcela: x.parcela ? String(x.parcela) : null,
    activo: x.activo !== false,
    lat: Number(x.lat),
    lng: Number(x.lng),
    titulo: String(x.titulo),
    created_at: new Date(String(x.created_at)).getTime()
  };
}

function mapLectura(x: Record<string, unknown>): LecturaSensorSuelo {
  return {
    id: String(x.id),
    sensor_codigo: x.sensor_codigo ? String(x.sensor_codigo) : null,
    lat: Number(x.lat),
    lng: Number(x.lng),
    altitud_msnm: x.altitud_msnm != null ? Number(x.altitud_msnm) : null,
    humedad_pct: x.humedad_pct != null ? Number(x.humedad_pct) : null,
    ph: x.ph != null ? Number(x.ph) : null,
    temperatura_c: x.temperatura_c != null ? Number(x.temperatura_c) : null,
    conductividad_ms_cm:
      x.conductividad_ms_cm != null ? Number(x.conductividad_ms_cm) : null,
    profundidad_cm: x.profundidad_cm != null ? Number(x.profundidad_cm) : null,
    nitrogeno_ppm: x.nitrogeno_ppm != null ? Number(x.nitrogeno_ppm) : null,
    fosforo_ppm: x.fosforo_ppm != null ? Number(x.fosforo_ppm) : null,
    potasio_ppm: x.potasio_ppm != null ? Number(x.potasio_ppm) : null,
    estado_suelo: x.estado_suelo ? (String(x.estado_suelo) as LecturaSensorSuelo["estado_suelo"]) : null,
    titulo: String(x.titulo),
    notas: x.notas ? String(x.notas) : null,
    created_at: new Date(String(x.created_at)).getTime()
  };
}

export async function listSensoresActivos(): Promise<SensorIoT[]> {
  const userId = await requireUserId();
  const { data, error } = await getSupabase()
    .from("sensores_iot_registry")
    .select("*")
    .eq("user_id", userId)
    .eq("activo", true)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data ?? []).map((x) => mapSensor(x as Record<string, unknown>));
}

export async function registrarSensor(input: {
  sensor_codigo: string;
  modelo?: string;
  parcela?: string;
  lat: number;
  lng: number;
  altitudMsnm?: number;
}) {
  const userId = await requireUserId();
  const titulo = `Sensor ${input.sensor_codigo}${input.parcela ? ` · ${input.parcela}` : ""}`;
  const { error } = await getSupabase().from("sensores_iot_registry").insert({
    user_id: userId,
    categoria: "IA y sensores",
    sensor_codigo: input.sensor_codigo,
    sensor_tipo: "suelo",
    modelo: input.modelo ?? null,
    parcela: input.parcela ?? null,
    activo: true,
    lat: input.lat,
    lng: input.lng,
    altitud_msnm: input.altitudMsnm ?? null,
    titulo,
    notas: null
  });
  if (error) throw error;
}

export async function insertLecturaSuelo(input: LecturaSueloInput) {
  const userId = await requireUserId();
  const interp = interpretarLecturaSuelo({
    humedad_pct: input.humedad_pct,
    ph: input.ph,
    temperatura_c: input.temperatura_c,
    conductividad_ms_cm: input.conductividad_ms_cm
  });

  const fecha = new Date().toLocaleString("es-PE", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
  const titulo = `Suelo ${interp.etiqueta} · ${fecha}`;

  const payload: Record<string, unknown> = {
    user_id: userId,
    categoria: "Terreno",
    lat: input.lat,
    lng: input.lng,
    altitud_msnm: input.altitudMsnm ?? null,
    precision_m: input.precisionM ?? null,
    titulo,
    notas: input.notas ?? null,
    sensor_codigo: input.sensor_codigo ?? null,
    humedad_pct: input.humedad_pct,
    ph: input.ph,
    temperatura_c: input.temperatura_c,
    conductividad_ms_cm: input.conductividad_ms_cm ?? null,
    profundidad_cm: input.profundidad_cm ?? 15,
    nitrogeno_ppm: input.nitrogeno_ppm ?? null,
    fosforo_ppm: input.fosforo_ppm ?? null,
    potasio_ppm: input.potasio_ppm ?? null,
    estado_suelo: interp.estado
  };

  const { error } = await getSupabase().from("lecturas_sensor_suelo").insert(payload);
  if (error?.message?.includes("column") || error?.code === "PGRST204") {
    const fallbackNotas = JSON.stringify({
      sensor_codigo: input.sensor_codigo,
      humedad_pct: input.humedad_pct,
      ph: input.ph,
      temperatura_c: input.temperatura_c,
      conductividad_ms_cm: input.conductividad_ms_cm,
      profundidad_cm: input.profundidad_cm,
      estado_suelo: interp.estado,
      ...(input.notas ? { notas_usuario: input.notas } : {})
    });
    const { error: err2 } = await getSupabase().from("lecturas_sensor_suelo").insert({
      user_id: userId,
      categoria: "Terreno",
      lat: input.lat,
      lng: input.lng,
      altitud_msnm: input.altitudMsnm ?? null,
      precision_m: input.precisionM ?? null,
      titulo,
      notas: fallbackNotas
    });
    if (err2) throw err2;
    return interp;
  }
  if (error) throw error;
  return interp;
}

export async function listLecturasSuelo(lim = 20): Promise<LecturaSensorSuelo[]> {
  const userId = await requireUserId();
  const { data, error } = await getSupabase()
    .from("lecturas_sensor_suelo")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(lim);
  if (error) throw error;
  return (data ?? []).map((x) => mapLectura(x as Record<string, unknown>));
}

export async function getUltimaLecturaSuelo(): Promise<LecturaSensorSuelo | null> {
  const rows = await listLecturasSuelo(1);
  return rows[0] ?? null;
}
