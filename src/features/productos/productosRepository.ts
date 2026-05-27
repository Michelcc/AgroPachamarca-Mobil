import { getSupabase } from "../../supabase/client";
import { requireUserId } from "../../supabase/requireUser";
import { Producto } from "../../types/models";

function mapRow(x: Record<string, unknown>, userId: string): Producto {
  return {
    id: String(x.id),
    nombre: String(x.nombre),
    categoria: String(x.categoria),
    precio: Number(x.precio),
    unidad: String(x.unidad),
    stock: Number(x.stock),
    disponible: x.disponible === false ? 0 : 1,
    imagen_url: x.imagen_url ? String(x.imagen_url) : null,
    destacado: x.destacado === true,
    esPropio: String(x.user_id) === userId,
    created_at: new Date(String(x.created_at)).getTime()
  };
}

/** Catálogo disponible (panel + propios). RLS: disponible=true o user_id propio. */
export async function listProductos(): Promise<Producto[]> {
  const userId = await requireUserId();
  const { data, error } = await getSupabase()
    .from("productos")
    .select("*")
    .order("destacado", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((x) => mapRow(x as Record<string, unknown>, userId));
}

export async function insertProducto(input: {
  nombre: string;
  categoria: string;
  precio: number;
  unidad: string;
  stock: number;
  imagen_url?: string | null;
}) {
  const userId = await requireUserId();
  const { error } = await getSupabase().from("productos").insert({
    user_id: userId,
    nombre: input.nombre,
    categoria: input.categoria,
    precio: input.precio,
    unidad: input.unidad,
    stock: input.stock,
    imagen_url: input.imagen_url ?? null,
    disponible: true
  });
  if (error) throw error;
}

export async function toggleDisponible(id: string, disponible: boolean) {
  const userId = await requireUserId();
  const { error } = await getSupabase()
    .from("productos")
    .update({ disponible })
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw error;
}
