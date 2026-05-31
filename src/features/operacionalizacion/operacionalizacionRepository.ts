import { getSupabase } from "../../supabase/client";
import { requireUserId } from "../../supabase/requireUser";
import {
  DIMENSIONES_OPERACIONALIZACION,
  VARIABLE_DEPENDIENTE,
  findIndicador
} from "../../schema/operacionalizacion";

export type RegistroOperacional = {
  id: string;
  dimension_id: string;
  dimension_label: string;
  indicador_id: string;
  indicador_label: string;
  instrumento: string;
  tipo_instrumento: string;
  valor_numerico: number | null;
  valor_texto: string | null;
  unidad: string | null;
  created_at: number;
};

function mapRow(x: Record<string, unknown>): RegistroOperacional {
  return {
    id: String(x.id),
    dimension_id: String(x.dimension_id),
    dimension_label: String(x.dimension_label),
    indicador_id: String(x.indicador_id),
    indicador_label: String(x.indicador_label),
    instrumento: String(x.instrumento),
    tipo_instrumento: String(x.tipo_instrumento),
    valor_numerico: x.valor_numerico != null ? Number(x.valor_numerico) : null,
    valor_texto: x.valor_texto ? String(x.valor_texto) : null,
    unidad: x.unidad ? String(x.unidad) : null,
    created_at: new Date(String(x.created_at)).getTime()
  };
}

export async function insertIndicadorOperacional(input: {
  indicadorId: string;
  valorNumerico?: number;
  valorTexto?: string;
  lat?: number;
  lng?: number;
  notas?: string;
}) {
  const found = findIndicador(input.indicadorId);
  if (!found) throw new Error("Indicador no válido");
  const { dimension, indicador } = found;
  const userId = await requireUserId();

  const { error } = await getSupabase().from("indicadores_operacionalizacion").insert({
    user_id: userId,
    variable_dependiente: VARIABLE_DEPENDIENTE,
    dimension_id: dimension.id,
    dimension_label: dimension.nombre,
    indicador_id: indicador.id,
    indicador_label: indicador.nombre,
    instrumento: indicador.instrumento,
    tipo_instrumento: indicador.tipoInstrumento,
    valor_numerico: input.valorNumerico ?? null,
    valor_texto: input.valorTexto ?? null,
    unidad: indicador.unidad ?? null,
    lat: input.lat ?? null,
    lng: input.lng ?? null,
    notas: input.notas ?? null
  });
  if (error) throw error;
}

export async function listIndicadoresOperacionales(lim = 50): Promise<RegistroOperacional[]> {
  const userId = await requireUserId();
  const { data, error } = await getSupabase()
    .from("indicadores_operacionalizacion")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(lim);
  if (error) throw error;
  return (data ?? []).map((x) => mapRow(x as Record<string, unknown>));
}

export type CoberturaOperacional = {
  total: number;
  conRegistro: number;
  porcentaje: number;
  porDimension: Array<{ dimension: string; total: number; conRegistro: number }>;
};

export async function calcularCoberturaOperacional(): Promise<CoberturaOperacional> {
  const rows = await listIndicadoresOperacionales(200);
  const indicadoresConRegistro = new Set(rows.map((r) => r.indicador_id));

  const porDimension = DIMENSIONES_OPERACIONALIZACION.map((d) => ({
    dimension: d.nombre,
    total: d.indicadores.length,
    conRegistro: d.indicadores.filter((i) => indicadoresConRegistro.has(i.id)).length
  }));

  const total = DIMENSIONES_OPERACIONALIZACION.reduce((n, d) => n + d.indicadores.length, 0);
  const conRegistro = indicadoresConRegistro.size;

  return {
    total,
    conRegistro,
    porcentaje: total > 0 ? (conRegistro / total) * 100 : 0,
    porDimension
  };
}

/** Último valor registrado por indicador */
export async function ultimosPorIndicador(): Promise<Map<string, RegistroOperacional>> {
  const rows = await listIndicadoresOperacionales(100);
  const map = new Map<string, RegistroOperacional>();
  for (const r of rows) {
    if (!map.has(r.indicador_id)) map.set(r.indicador_id, r);
  }
  return map;
}
