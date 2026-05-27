-- Agro · schema base Supabase
-- 1) Ejecuta este archivo.  2) Luego schema-tablas-campo.sql
-- Tablas base: 5 + catalogo | Tablas de campo: 109 (archivo aparte)

create table if not exists public.catalogo_tablas (
  codigo text primary key,
  categoria text not null,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.catalogo_tablas (codigo, categoria) values
  ('acciones_correctivas', 'Sistema'),
  ('actas_revision_calidad', 'Calidad ISO'),
  ('alertas_comunidad', 'Sistema'),
  ('alertas_historial', 'Sistema'),
  ('almacenes_granel', 'Comercial'),
  ('analisis_laboratorio_externo', 'Trazabilidad'),
  ('aplicaciones_fitosanitarias', 'Sanidad'),
  ('aportes_capital_social', 'Cooperativa'),
  ('auditoria_cambios', 'Calidad ISO'),
  ('auditorias_internas_sgsi', 'Calidad ISO'),
  ('avistamientos_fauna_benefica', 'Sanidad'),
  ('balance_nutricion', 'Cultivo'),
  ('biodiversidad_shannon_parcela', 'Terreno'),
  ('campanias_agricolas', 'Cultivo'),
  ('capas_suelo_geologia', 'Terreno'),
  ('capturas_trampa', 'Sanidad'),
  ('casos_fitotoxicidad', 'Sanidad'),
  ('catalogo_cultivos', 'Cultivo'),
  ('catalogo_insumo_quimico', 'Comercial'),
  ('certificados_origen', 'Comercial'),
  ('configuracion_usuario', 'Sistema'),
  ('consentimientos_usuario_pd', 'Sistema'),
  ('consultas_ia_log', 'IA y sensores'),
  ('consumo_combustible', 'Comercial'),
  ('contratos_compra', 'Comercial'),
  ('controles_cumplimiento_iso', 'Calidad ISO'),
  ('cooperativas_agrarias', 'Cooperativa'),
  ('cosecha', 'Cultivo'),
  ('creditos_agricolas', 'Finanzas'),
  ('cursos_capacitacion', 'Capacitación'),
  ('diagnosticos_ia_planta', 'IA y sensores'),
  ('documentos_adjuntos', 'Sistema'),
  ('encuestas_satisfaccion', 'Sistema'),
  ('ensayos_campo', 'Cultivo'),
  ('etiquetas_procesos_normalizados', 'Sistema'),
  ('evaluaciones_curso', 'Capacitación'),
  ('eventos_clima_extremo', 'Clima'),
  ('evidencias_cumplimiento_iso', 'Calidad ISO'),
  ('evidencias_foto_auditoria', 'Calidad ISO'),
  ('fcm_tokens', 'Sistema'),
  ('fichas_seguridad_hoja', 'Sistema'),
  ('fincas', 'Terreno'),
  ('firmas_digitales_registro', 'Sistema'),
  ('floracion_reclutamiento', 'Cultivo'),
  ('flujos_caja', 'Finanzas'),
  ('gastos', 'Finanzas'),
  ('grupos_productores', 'Sistema'),
  ('guias_remision_electronica', 'Comercial'),
  ('historial_suelo', 'Terreno'),
  ('indicadores_agregados', 'Sistema'),
  ('indicadores_iso_25010', 'Calidad ISO'),
  ('indices_ndvi_parcela', 'Terreno'),
  ('inscripciones_curso', 'Capacitación'),
  ('inspecciones_bpa', 'Calidad ISO'),
  ('insumos', 'Comercial'),
  ('labores_campo', 'Cultivo'),
  ('lecturas_estacion_meteo', 'Clima'),
  ('lecturas_sensor_suelo', 'Terreno'),
  ('liquidaciones_pagos_productor', 'Cooperativa'),
  ('lotes', 'Terreno'),
  ('lotes_semilla_trazabilidad', 'Terreno'),
  ('mantenimiento_maquinaria', 'Comercial'),
  ('maquinaria_agricola', 'Comercial'),
  ('matrices_requisito_funcional', 'Sistema'),
  ('matriz_riesgos', 'Calidad ISO'),
  ('mediciones_caudal', 'Clima'),
  ('mensajes_comunidad_chat', 'Sistema'),
  ('mensajes_ticket_interaccion', 'Sistema'),
  ('mermas_cosecha_registro', 'Cultivo'),
  ('monitoreo_aereo_drones', 'IA y sensores'),
  ('muestreos_agua_canal', 'Clima'),
  ('muestreos_calidad', 'Trazabilidad'),
  ('no_conformidades', 'Calidad ISO'),
  ('normas_iso_referencia', 'Calidad ISO'),
  ('notificaciones_usuario', 'Sistema'),
  ('orden_compra_detalle', 'Comercial'),
  ('ortofotos_parcela', 'Terreno'),
  ('paneles_solares_finca', 'Terreno'),
  ('parcelas', 'Terreno'),
  ('pedidos_mercado_mayorista', 'Comercial'),
  ('plagas', 'Sanidad'),
  ('planes_contingencia', 'Sistema'),
  ('politicas_retencion_datos', 'Sistema'),
  ('polizas_seguro_campo', 'Finanzas'),
  ('pozos_agua', 'Clima'),
  ('precios_mercado', 'Comercial'),
  ('presupuestos_campania', 'Cultivo'),
  ('proveedores', 'Comercial'),
  ('qrcode_trazabilidad_lote', 'Terreno'),
  ('recepciones_mercancia', 'Comercial'),
  ('recomendaciones_ia_cultivo_cache', 'Cultivo'),
  ('registros_lluvia', 'Clima'),
  ('respuestas_encuesta_linea', 'Sistema'),
  ('riego', 'Cultivo'),
  ('rotacion_cultivos', 'Cultivo'),
  ('seleccion_calibres', 'Cultivo'),
  ('sensores_iot_registry', 'IA y sensores'),
  ('socios_cooperativa', 'Cooperativa'),
  ('stock_carbono_parcela', 'Terreno'),
  ('tickets_soporte', 'Sistema'),
  ('trampas_monitoreo', 'Sanidad'),
  ('transportes_cosecha', 'Cultivo'),
  ('tratamientos_poscosecha', 'Cultivo'),
  ('trazabilidad_muestra_laboratorio', 'Trazabilidad'),
  ('umbrales_monitores_plaga', 'Sanidad'),
  ('variables_ambientales_diarias', 'Clima'),
  ('visitas_extension_rural', 'Capacitación'),
  ('visitas_tecnico', 'Capacitación'),
  ('vuelos_drone_agendados', 'IA y sensores')
on conflict (codigo) do update set categoria = excluded.categoria;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre text not null,
  username text not null,
  created_at timestamptz not null default now()
);

-- Si ya tenias profiles sin nombre, ejecuta en SQL Editor:
-- alter table public.profiles add column if not exists nombre text;
-- update public.profiles set nombre = username where nombre is null or nombre = '';

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
drop policy if exists "productos_select_catalog" on public.productos;
drop policy if exists "productos_insert_own" on public.productos;
drop policy if exists "productos_update_own" on public.productos;
drop policy if exists "productos_delete_own" on public.productos;

create policy "productos_select_catalog" on public.productos
  for select using (auth.uid() = user_id or disponible = true);

create policy "productos_insert_own" on public.productos
  for insert with check (auth.uid() = user_id);

create policy "productos_update_own" on public.productos
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "productos_delete_own" on public.productos
  for delete using (auth.uid() = user_id);

drop policy if exists "diagnosticos_own" on public.diagnosticos_ia;
create policy "diagnosticos_own" on public.diagnosticos_ia for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "alertas_own" on public.alertas_clima;
create policy "alertas_own" on public.alertas_clima for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
