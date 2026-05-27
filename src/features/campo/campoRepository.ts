import { getSupabase } from "../../supabase/client";
import { requireUserId } from "../../supabase/requireUser";
import {
  AGRO_POSTGRES_TABLES,
  TABLE_COUNT,
  isAgroCampoTable,
  tableCategory,
  type AgroTableName
} from "../../schema/agroPostgresTables";

export type RegistroCampo = {
  id: string;
  tabla: string;
  categoria: string;
  lat: number;
  lng: number;
  altitud_msnm: number | null;
  precision_m: number | null;
  titulo: string;
  notas: string | null;
  pendiente_sincronizar: number;
  created_at: number;
};

export type ProgresoCampo = {
  totalTablas: number;
  tablasConRegistro: number;
  porcentajeGlobal: number;
  porCategoria: Array<{ categoria: string; total: number; conRegistro: number; porcentaje: number }>;
  totalRegistros: number;
  pendientesSync: number;
};

function mapRow(tabla: string, x: Record<string, unknown>): RegistroCampo {
  return {
    id: String(x.id),
    tabla,
    categoria: String(x.categoria ?? tableCategory(tabla)),
    lat: Number(x.lat),
    lng: Number(x.lng),
    altitud_msnm: x.altitud_msnm != null ? Number(x.altitud_msnm) : null,
    precision_m: x.precision_m != null ? Number(x.precision_m) : null,
    titulo: String(x.titulo),
    notas: x.notas != null ? String(x.notas) : null,
    pendiente_sincronizar: 0,
    created_at: new Date(String(x.created_at)).getTime()
  };
}

export async function insertRegistroCampo(input: {
  tabla: string;
  lat: number;
  lng: number;
  altitudMsnm?: number;
  precisionM?: number;
  titulo: string;
  notas?: string;
}) {
  if (!isAgroCampoTable(input.tabla)) {
    throw new Error(`Tabla no valida: ${input.tabla}`);
  }
  const userId = await requireUserId();
  const categoria = tableCategory(input.tabla);
  const { error } = await getSupabase().from(input.tabla).insert({
    user_id: userId,
    categoria,
    lat: input.lat,
    lng: input.lng,
    altitud_msnm: input.altitudMsnm ?? null,
    precision_m: input.precisionM ?? null,
    titulo: input.titulo,
    notas: input.notas ?? null
  });
  if (error) throw error;
}

export async function listRegistrosPorTabla(tabla: string, lim = 20): Promise<RegistroCampo[]> {
  if (!isAgroCampoTable(tabla)) return [];
  const userId = await requireUserId();
  const { data, error } = await getSupabase()
    .from(tabla)
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(lim);
  if (error) throw error;
  return (data ?? []).map((x) => mapRow(tabla, x as Record<string, unknown>));
}

async function tablaTieneRegistros(tabla: string, userId: string): Promise<boolean> {
  const { count, error } = await getSupabase()
    .from(tabla)
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);
  if (error) return false;
  return (count ?? 0) > 0;
}

export async function tablasConRegistro(): Promise<Set<AgroTableName>> {
  const userId = await requireUserId();
  const conRegistro = new Set<AgroTableName>();
  await Promise.all(
    AGRO_POSTGRES_TABLES.map(async (tabla) => {
      if (await tablaTieneRegistros(tabla, userId)) conRegistro.add(tabla);
    })
  );
  return conRegistro;
}

export async function calcularProgreso(): Promise<ProgresoCampo> {
  const userId = await requireUserId();
  const conRegistro = await tablasConRegistro();

  let totalRegistros = 0;
  const counts = await Promise.all(
    AGRO_POSTGRES_TABLES.map(async (tabla) => {
      const { count, error } = await getSupabase()
        .from(tabla)
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);
      if (error) return 0;
      return count ?? 0;
    })
  );
  totalRegistros = counts.reduce((a, b) => a + b, 0);

  const porCategoriaMap = new Map<string, { total: number; conRegistro: number }>();
  for (const tabla of AGRO_POSTGRES_TABLES) {
    const cat = tableCategory(tabla);
    const cur = porCategoriaMap.get(cat) ?? { total: 0, conRegistro: 0 };
    cur.total += 1;
    if (conRegistro.has(tabla)) cur.conRegistro += 1;
    porCategoriaMap.set(cat, cur);
  }

  const tablasConRegistroCount = conRegistro.size;
  const porcentajeGlobal = TABLE_COUNT > 0 ? (tablasConRegistroCount / TABLE_COUNT) * 100 : 0;

  const porCategoria = [...porCategoriaMap.entries()]
    .map(([categoria, v]) => ({
      categoria,
      total: v.total,
      conRegistro: v.conRegistro,
      porcentaje: v.total > 0 ? (v.conRegistro / v.total) * 100 : 0
    }))
    .sort((a, b) => b.porcentaje - a.porcentaje);

  return {
    totalTablas: TABLE_COUNT,
    tablasConRegistro: tablasConRegistroCount,
    porcentajeGlobal,
    porCategoria,
    totalRegistros,
    pendientesSync: 0
  };
}

export async function marcarRegistrosSincronizados(_ids: string[]) {
  /* Supabase en linea */
}
