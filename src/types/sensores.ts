export type EstadoSuelo = "seco" | "optimo" | "humedo" | "saturado" | "critico";

export type SensorIoT = {
  id: string;
  sensor_codigo: string;
  sensor_tipo: string;
  modelo: string | null;
  parcela: string | null;
  activo: boolean;
  lat: number;
  lng: number;
  titulo: string;
  created_at: number;
};

export type LecturaSensorSuelo = {
  id: string;
  sensor_codigo: string | null;
  lat: number;
  lng: number;
  altitud_msnm: number | null;
  humedad_pct: number | null;
  ph: number | null;
  temperatura_c: number | null;
  conductividad_ms_cm: number | null;
  profundidad_cm: number | null;
  nitrogeno_ppm: number | null;
  fosforo_ppm: number | null;
  potasio_ppm: number | null;
  estado_suelo: EstadoSuelo | null;
  titulo: string;
  notas: string | null;
  created_at: number;
};

export type LecturaSueloInput = {
  sensor_codigo?: string;
  lat: number;
  lng: number;
  altitudMsnm?: number;
  precisionM?: number;
  humedad_pct: number;
  ph: number;
  temperatura_c: number;
  conductividad_ms_cm?: number;
  profundidad_cm?: number;
  nitrogeno_ppm?: number;
  fosforo_ppm?: number;
  potasio_ppm?: number;
  notas?: string;
};
