export type DiaPronostico = {
  fecha: string;
  temp_min_c: number;
  temp_max_c: number;
  prob_precipitacion: number;
  descripcion: string;
};

export type PronosticoResponse = {
  fuente: string;
  lat: number;
  lng: number;
  dias: DiaPronostico[];
};

export type TopCultivo = {
  rank: number;
  cultivo: string;
  probabilidad: number;
};

export type PrediccionCultivoResponse = {
  modelo: string;
  top3: TopCultivo[];
  ubicacion?: { lat: number; lng: number; altitud_msnm: number };
  climaUsado?: {
    temp_min_c: number;
    temp_max_c: number;
    precipitacion_mm_semana: number;
    mes: number;
  };
};

export type Producto = {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  unidad: string;
  stock: number;
  disponible: number;
  imagen_url?: string | null;
  destacado?: boolean;
  /** false = creado por otro usuario / panel (solo lectura en app) */
  esPropio?: boolean;
  created_at: number;
};
