const fs = require("fs");
const path = require("path");

const src = fs.readFileSync(
  path.join(__dirname, "../src/schema/agroPostgresTables.ts"),
  "utf8"
);
const m = src.match(/export const AGRO_POSTGRES_TABLES = \[([\s\S]*?)\] as const/);
const tables = [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);

const rules = [
  ["Terreno", /parcela|finca|lote|suelo|ndvi|ortofoto|carbono|biodiversidad|capas_suelo/i],
  ["Clima", /clima|lluvia|meteo|pronostico|agua|caudal|eventos_clima|variables_ambientales/i],
  ["Cultivo", /cultivo|campania|riego|labores|ensayo|floracion|cosecha|merma|calibre|poscosecha|transporte|rotacion|nutricion/i],
  ["Sanidad", /plaga|trampa|fito|fauna|aplicaciones_fito/i],
  ["Comercial", /precio|pedido|contrato|proveedor|guia|certificado|recepcion|orden_compra|insumo|maquinaria|combustible|almacen/i],
  ["Cooperativa", /cooperativa|socio|grupo_productor|aporte|liquidacion/i],
  ["Finanzas", /gasto|flujo|credito|presupuesto|poliza|seguro/i],
  ["Calidad ISO", /iso|bpa|conformidad|auditoria|evidencia|acta|matriz|riesgo|cumplimiento|prueba_iso/i],
  ["IA y sensores", /ia_|iot|sensor|drone|vuelo|pipeline|embedding|consultas_ia|recomendaciones_ia|diagnostico/i],
  ["Capacitación", /curso|capacitacion|inscripcion|evaluacion|visita|extension/i],
  ["Trazabilidad", /trazabilidad|qrcode|semilla|laboratorio|muestreo/i]
];

function cat(t) {
  for (const [c, r] of rules) if (r.test(t)) return c;
  return "Sistema";
}

function esc(s) {
  return s.replace(/'/g, "''");
}

const seedRows = tables.map((t) => `  ('${esc(t)}', '${esc(cat(t))}')`).join(",\n");

function tableDdl(name, categoria) {
  return `
create table if not exists public.${name} (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default '${esc(categoria)}',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_${name}_user on public.${name} (user_id, created_at desc);

alter table public.${name} enable row level security;

drop policy if exists "${name}_own" on public.${name};
create policy "${name}_own" on public.${name}
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
`;
}

const unionParts = tables.map(
  (t) =>
    `select '${esc(t)}'::text as tabla, '${esc(cat(t))}'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.${t} r`
);

const tablasCampoSql = `-- ${tables.length} tablas de campo (visibles en Supabase Table Editor)
-- Ejecutar DESPUES de schema.sql en SQL Editor.

${tables.map((t) => tableDdl(t, cat(t))).join("\n")}

-- Vista resumen sobre todas las tablas de campo
create or replace view public.v_progreso_campo as
${unionParts.join("\nunion all\n")}
order by categoria, tabla;
`;

const coreSql = `-- Agro · schema base Supabase
-- 1) Ejecuta este archivo.  2) Luego schema-tablas-campo.sql
-- Tablas base: 5 + catalogo | Tablas de campo: ${tables.length} (archivo aparte)

create table if not exists public.catalogo_tablas (
  codigo text primary key,
  categoria text not null,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.catalogo_tablas (codigo, categoria) values
${seedRows}
on conflict (codigo) do update set categoria = excluded.categoria;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre text not null,
  username text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.productos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  nombre text not null,
  categoria text not null,
  precio double precision not null default 0,
  unidad text not null default 'kg',
  stock double precision not null default 0,
  disponible boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_productos_user on public.productos (user_id);

create table if not exists public.diagnosticos_ia (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  modelo text not null,
  severidad text not null,
  titulo text,
  resumen text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_diagnosticos_user on public.diagnosticos_ia (user_id, created_at desc);

create table if not exists public.alertas_clima (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  nivel text not null,
  alertas jsonb not null default '[]',
  lat double precision not null,
  lng double precision not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_alertas_user on public.alertas_clima (user_id, created_at desc);

alter table public.catalogo_tablas enable row level security;
alter table public.profiles enable row level security;
alter table public.productos enable row level security;
alter table public.diagnosticos_ia enable row level security;
alter table public.alertas_clima enable row level security;

drop policy if exists "catalogo_read_all" on public.catalogo_tablas;
create policy "catalogo_read_all" on public.catalogo_tablas for select using (true);

drop policy if exists "profiles_own" on public.profiles;
create policy "profiles_own" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "productos_own" on public.productos;
create policy "productos_own" on public.productos for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "diagnosticos_own" on public.diagnosticos_ia;
create policy "diagnosticos_own" on public.diagnosticos_ia for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "alertas_own" on public.alertas_clima;
create policy "alertas_own" on public.alertas_clima for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
`;

const outDir = path.join(__dirname, "../android/supabase");
fs.writeFileSync(path.join(outDir, "schema.sql"), coreSql, "utf8");
fs.writeFileSync(path.join(outDir, "schema-tablas-campo.sql"), tablasCampoSql, "utf8");
console.log(
  "OK | catalogo:",
  tables.length,
  "| archivos: schema.sql + schema-tablas-campo.sql | total tablas en Supabase:",
  tables.length + 5,
  "+ vista"
);
