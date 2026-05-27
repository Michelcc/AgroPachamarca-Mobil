-- 109 tablas de campo (visibles en Supabase Table Editor)
-- Ejecutar DESPUES de schema.sql en SQL Editor.


create table if not exists public.acciones_correctivas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Sistema',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_acciones_correctivas_user on public.acciones_correctivas (user_id, created_at desc);

alter table public.acciones_correctivas enable row level security;

drop policy if exists "acciones_correctivas_own" on public.acciones_correctivas;
create policy "acciones_correctivas_own" on public.acciones_correctivas
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.actas_revision_calidad (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Calidad ISO',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_actas_revision_calidad_user on public.actas_revision_calidad (user_id, created_at desc);

alter table public.actas_revision_calidad enable row level security;

drop policy if exists "actas_revision_calidad_own" on public.actas_revision_calidad;
create policy "actas_revision_calidad_own" on public.actas_revision_calidad
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.alertas_comunidad (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Sistema',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_alertas_comunidad_user on public.alertas_comunidad (user_id, created_at desc);

alter table public.alertas_comunidad enable row level security;

drop policy if exists "alertas_comunidad_own" on public.alertas_comunidad;
create policy "alertas_comunidad_own" on public.alertas_comunidad
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.alertas_historial (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Sistema',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_alertas_historial_user on public.alertas_historial (user_id, created_at desc);

alter table public.alertas_historial enable row level security;

drop policy if exists "alertas_historial_own" on public.alertas_historial;
create policy "alertas_historial_own" on public.alertas_historial
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.almacenes_granel (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Comercial',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_almacenes_granel_user on public.almacenes_granel (user_id, created_at desc);

alter table public.almacenes_granel enable row level security;

drop policy if exists "almacenes_granel_own" on public.almacenes_granel;
create policy "almacenes_granel_own" on public.almacenes_granel
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.analisis_laboratorio_externo (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Trazabilidad',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_analisis_laboratorio_externo_user on public.analisis_laboratorio_externo (user_id, created_at desc);

alter table public.analisis_laboratorio_externo enable row level security;

drop policy if exists "analisis_laboratorio_externo_own" on public.analisis_laboratorio_externo;
create policy "analisis_laboratorio_externo_own" on public.analisis_laboratorio_externo
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.aplicaciones_fitosanitarias (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Sanidad',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_aplicaciones_fitosanitarias_user on public.aplicaciones_fitosanitarias (user_id, created_at desc);

alter table public.aplicaciones_fitosanitarias enable row level security;

drop policy if exists "aplicaciones_fitosanitarias_own" on public.aplicaciones_fitosanitarias;
create policy "aplicaciones_fitosanitarias_own" on public.aplicaciones_fitosanitarias
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.aportes_capital_social (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Cooperativa',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_aportes_capital_social_user on public.aportes_capital_social (user_id, created_at desc);

alter table public.aportes_capital_social enable row level security;

drop policy if exists "aportes_capital_social_own" on public.aportes_capital_social;
create policy "aportes_capital_social_own" on public.aportes_capital_social
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.auditoria_cambios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Calidad ISO',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_auditoria_cambios_user on public.auditoria_cambios (user_id, created_at desc);

alter table public.auditoria_cambios enable row level security;

drop policy if exists "auditoria_cambios_own" on public.auditoria_cambios;
create policy "auditoria_cambios_own" on public.auditoria_cambios
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.auditorias_internas_sgsi (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Calidad ISO',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_auditorias_internas_sgsi_user on public.auditorias_internas_sgsi (user_id, created_at desc);

alter table public.auditorias_internas_sgsi enable row level security;

drop policy if exists "auditorias_internas_sgsi_own" on public.auditorias_internas_sgsi;
create policy "auditorias_internas_sgsi_own" on public.auditorias_internas_sgsi
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.avistamientos_fauna_benefica (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Sanidad',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_avistamientos_fauna_benefica_user on public.avistamientos_fauna_benefica (user_id, created_at desc);

alter table public.avistamientos_fauna_benefica enable row level security;

drop policy if exists "avistamientos_fauna_benefica_own" on public.avistamientos_fauna_benefica;
create policy "avistamientos_fauna_benefica_own" on public.avistamientos_fauna_benefica
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.balance_nutricion (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Cultivo',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_balance_nutricion_user on public.balance_nutricion (user_id, created_at desc);

alter table public.balance_nutricion enable row level security;

drop policy if exists "balance_nutricion_own" on public.balance_nutricion;
create policy "balance_nutricion_own" on public.balance_nutricion
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.biodiversidad_shannon_parcela (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Terreno',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_biodiversidad_shannon_parcela_user on public.biodiversidad_shannon_parcela (user_id, created_at desc);

alter table public.biodiversidad_shannon_parcela enable row level security;

drop policy if exists "biodiversidad_shannon_parcela_own" on public.biodiversidad_shannon_parcela;
create policy "biodiversidad_shannon_parcela_own" on public.biodiversidad_shannon_parcela
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.campanias_agricolas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Cultivo',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_campanias_agricolas_user on public.campanias_agricolas (user_id, created_at desc);

alter table public.campanias_agricolas enable row level security;

drop policy if exists "campanias_agricolas_own" on public.campanias_agricolas;
create policy "campanias_agricolas_own" on public.campanias_agricolas
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.capas_suelo_geologia (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Terreno',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_capas_suelo_geologia_user on public.capas_suelo_geologia (user_id, created_at desc);

alter table public.capas_suelo_geologia enable row level security;

drop policy if exists "capas_suelo_geologia_own" on public.capas_suelo_geologia;
create policy "capas_suelo_geologia_own" on public.capas_suelo_geologia
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.capturas_trampa (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Sanidad',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_capturas_trampa_user on public.capturas_trampa (user_id, created_at desc);

alter table public.capturas_trampa enable row level security;

drop policy if exists "capturas_trampa_own" on public.capturas_trampa;
create policy "capturas_trampa_own" on public.capturas_trampa
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.casos_fitotoxicidad (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Sanidad',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_casos_fitotoxicidad_user on public.casos_fitotoxicidad (user_id, created_at desc);

alter table public.casos_fitotoxicidad enable row level security;

drop policy if exists "casos_fitotoxicidad_own" on public.casos_fitotoxicidad;
create policy "casos_fitotoxicidad_own" on public.casos_fitotoxicidad
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.catalogo_cultivos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Cultivo',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_catalogo_cultivos_user on public.catalogo_cultivos (user_id, created_at desc);

alter table public.catalogo_cultivos enable row level security;

drop policy if exists "catalogo_cultivos_own" on public.catalogo_cultivos;
create policy "catalogo_cultivos_own" on public.catalogo_cultivos
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.catalogo_insumo_quimico (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Comercial',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_catalogo_insumo_quimico_user on public.catalogo_insumo_quimico (user_id, created_at desc);

alter table public.catalogo_insumo_quimico enable row level security;

drop policy if exists "catalogo_insumo_quimico_own" on public.catalogo_insumo_quimico;
create policy "catalogo_insumo_quimico_own" on public.catalogo_insumo_quimico
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.certificados_origen (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Comercial',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_certificados_origen_user on public.certificados_origen (user_id, created_at desc);

alter table public.certificados_origen enable row level security;

drop policy if exists "certificados_origen_own" on public.certificados_origen;
create policy "certificados_origen_own" on public.certificados_origen
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.configuracion_usuario (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Sistema',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_configuracion_usuario_user on public.configuracion_usuario (user_id, created_at desc);

alter table public.configuracion_usuario enable row level security;

drop policy if exists "configuracion_usuario_own" on public.configuracion_usuario;
create policy "configuracion_usuario_own" on public.configuracion_usuario
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.consentimientos_usuario_pd (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Sistema',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_consentimientos_usuario_pd_user on public.consentimientos_usuario_pd (user_id, created_at desc);

alter table public.consentimientos_usuario_pd enable row level security;

drop policy if exists "consentimientos_usuario_pd_own" on public.consentimientos_usuario_pd;
create policy "consentimientos_usuario_pd_own" on public.consentimientos_usuario_pd
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.consultas_ia_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'IA y sensores',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_consultas_ia_log_user on public.consultas_ia_log (user_id, created_at desc);

alter table public.consultas_ia_log enable row level security;

drop policy if exists "consultas_ia_log_own" on public.consultas_ia_log;
create policy "consultas_ia_log_own" on public.consultas_ia_log
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.consumo_combustible (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Comercial',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_consumo_combustible_user on public.consumo_combustible (user_id, created_at desc);

alter table public.consumo_combustible enable row level security;

drop policy if exists "consumo_combustible_own" on public.consumo_combustible;
create policy "consumo_combustible_own" on public.consumo_combustible
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.contratos_compra (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Comercial',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_contratos_compra_user on public.contratos_compra (user_id, created_at desc);

alter table public.contratos_compra enable row level security;

drop policy if exists "contratos_compra_own" on public.contratos_compra;
create policy "contratos_compra_own" on public.contratos_compra
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.controles_cumplimiento_iso (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Calidad ISO',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_controles_cumplimiento_iso_user on public.controles_cumplimiento_iso (user_id, created_at desc);

alter table public.controles_cumplimiento_iso enable row level security;

drop policy if exists "controles_cumplimiento_iso_own" on public.controles_cumplimiento_iso;
create policy "controles_cumplimiento_iso_own" on public.controles_cumplimiento_iso
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.cooperativas_agrarias (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Cooperativa',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_cooperativas_agrarias_user on public.cooperativas_agrarias (user_id, created_at desc);

alter table public.cooperativas_agrarias enable row level security;

drop policy if exists "cooperativas_agrarias_own" on public.cooperativas_agrarias;
create policy "cooperativas_agrarias_own" on public.cooperativas_agrarias
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.cosecha (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Cultivo',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_cosecha_user on public.cosecha (user_id, created_at desc);

alter table public.cosecha enable row level security;

drop policy if exists "cosecha_own" on public.cosecha;
create policy "cosecha_own" on public.cosecha
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.creditos_agricolas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Finanzas',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_creditos_agricolas_user on public.creditos_agricolas (user_id, created_at desc);

alter table public.creditos_agricolas enable row level security;

drop policy if exists "creditos_agricolas_own" on public.creditos_agricolas;
create policy "creditos_agricolas_own" on public.creditos_agricolas
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.cursos_capacitacion (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Capacitación',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_cursos_capacitacion_user on public.cursos_capacitacion (user_id, created_at desc);

alter table public.cursos_capacitacion enable row level security;

drop policy if exists "cursos_capacitacion_own" on public.cursos_capacitacion;
create policy "cursos_capacitacion_own" on public.cursos_capacitacion
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.diagnosticos_ia_planta (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'IA y sensores',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_diagnosticos_ia_planta_user on public.diagnosticos_ia_planta (user_id, created_at desc);

alter table public.diagnosticos_ia_planta enable row level security;

drop policy if exists "diagnosticos_ia_planta_own" on public.diagnosticos_ia_planta;
create policy "diagnosticos_ia_planta_own" on public.diagnosticos_ia_planta
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.documentos_adjuntos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Sistema',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_documentos_adjuntos_user on public.documentos_adjuntos (user_id, created_at desc);

alter table public.documentos_adjuntos enable row level security;

drop policy if exists "documentos_adjuntos_own" on public.documentos_adjuntos;
create policy "documentos_adjuntos_own" on public.documentos_adjuntos
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.encuestas_satisfaccion (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Sistema',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_encuestas_satisfaccion_user on public.encuestas_satisfaccion (user_id, created_at desc);

alter table public.encuestas_satisfaccion enable row level security;

drop policy if exists "encuestas_satisfaccion_own" on public.encuestas_satisfaccion;
create policy "encuestas_satisfaccion_own" on public.encuestas_satisfaccion
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.ensayos_campo (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Cultivo',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_ensayos_campo_user on public.ensayos_campo (user_id, created_at desc);

alter table public.ensayos_campo enable row level security;

drop policy if exists "ensayos_campo_own" on public.ensayos_campo;
create policy "ensayos_campo_own" on public.ensayos_campo
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.etiquetas_procesos_normalizados (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Sistema',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_etiquetas_procesos_normalizados_user on public.etiquetas_procesos_normalizados (user_id, created_at desc);

alter table public.etiquetas_procesos_normalizados enable row level security;

drop policy if exists "etiquetas_procesos_normalizados_own" on public.etiquetas_procesos_normalizados;
create policy "etiquetas_procesos_normalizados_own" on public.etiquetas_procesos_normalizados
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.evaluaciones_curso (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Capacitación',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_evaluaciones_curso_user on public.evaluaciones_curso (user_id, created_at desc);

alter table public.evaluaciones_curso enable row level security;

drop policy if exists "evaluaciones_curso_own" on public.evaluaciones_curso;
create policy "evaluaciones_curso_own" on public.evaluaciones_curso
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.eventos_clima_extremo (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Clima',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_eventos_clima_extremo_user on public.eventos_clima_extremo (user_id, created_at desc);

alter table public.eventos_clima_extremo enable row level security;

drop policy if exists "eventos_clima_extremo_own" on public.eventos_clima_extremo;
create policy "eventos_clima_extremo_own" on public.eventos_clima_extremo
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.evidencias_cumplimiento_iso (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Calidad ISO',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_evidencias_cumplimiento_iso_user on public.evidencias_cumplimiento_iso (user_id, created_at desc);

alter table public.evidencias_cumplimiento_iso enable row level security;

drop policy if exists "evidencias_cumplimiento_iso_own" on public.evidencias_cumplimiento_iso;
create policy "evidencias_cumplimiento_iso_own" on public.evidencias_cumplimiento_iso
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.evidencias_foto_auditoria (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Calidad ISO',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_evidencias_foto_auditoria_user on public.evidencias_foto_auditoria (user_id, created_at desc);

alter table public.evidencias_foto_auditoria enable row level security;

drop policy if exists "evidencias_foto_auditoria_own" on public.evidencias_foto_auditoria;
create policy "evidencias_foto_auditoria_own" on public.evidencias_foto_auditoria
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.fcm_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Sistema',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_fcm_tokens_user on public.fcm_tokens (user_id, created_at desc);

alter table public.fcm_tokens enable row level security;

drop policy if exists "fcm_tokens_own" on public.fcm_tokens;
create policy "fcm_tokens_own" on public.fcm_tokens
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.fichas_seguridad_hoja (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Sistema',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_fichas_seguridad_hoja_user on public.fichas_seguridad_hoja (user_id, created_at desc);

alter table public.fichas_seguridad_hoja enable row level security;

drop policy if exists "fichas_seguridad_hoja_own" on public.fichas_seguridad_hoja;
create policy "fichas_seguridad_hoja_own" on public.fichas_seguridad_hoja
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.fincas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Terreno',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_fincas_user on public.fincas (user_id, created_at desc);

alter table public.fincas enable row level security;

drop policy if exists "fincas_own" on public.fincas;
create policy "fincas_own" on public.fincas
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.firmas_digitales_registro (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Sistema',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_firmas_digitales_registro_user on public.firmas_digitales_registro (user_id, created_at desc);

alter table public.firmas_digitales_registro enable row level security;

drop policy if exists "firmas_digitales_registro_own" on public.firmas_digitales_registro;
create policy "firmas_digitales_registro_own" on public.firmas_digitales_registro
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.floracion_reclutamiento (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Cultivo',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_floracion_reclutamiento_user on public.floracion_reclutamiento (user_id, created_at desc);

alter table public.floracion_reclutamiento enable row level security;

drop policy if exists "floracion_reclutamiento_own" on public.floracion_reclutamiento;
create policy "floracion_reclutamiento_own" on public.floracion_reclutamiento
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.flujos_caja (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Finanzas',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_flujos_caja_user on public.flujos_caja (user_id, created_at desc);

alter table public.flujos_caja enable row level security;

drop policy if exists "flujos_caja_own" on public.flujos_caja;
create policy "flujos_caja_own" on public.flujos_caja
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.gastos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Finanzas',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_gastos_user on public.gastos (user_id, created_at desc);

alter table public.gastos enable row level security;

drop policy if exists "gastos_own" on public.gastos;
create policy "gastos_own" on public.gastos
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.grupos_productores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Sistema',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_grupos_productores_user on public.grupos_productores (user_id, created_at desc);

alter table public.grupos_productores enable row level security;

drop policy if exists "grupos_productores_own" on public.grupos_productores;
create policy "grupos_productores_own" on public.grupos_productores
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.guias_remision_electronica (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Comercial',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_guias_remision_electronica_user on public.guias_remision_electronica (user_id, created_at desc);

alter table public.guias_remision_electronica enable row level security;

drop policy if exists "guias_remision_electronica_own" on public.guias_remision_electronica;
create policy "guias_remision_electronica_own" on public.guias_remision_electronica
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.historial_suelo (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Terreno',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_historial_suelo_user on public.historial_suelo (user_id, created_at desc);

alter table public.historial_suelo enable row level security;

drop policy if exists "historial_suelo_own" on public.historial_suelo;
create policy "historial_suelo_own" on public.historial_suelo
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.indicadores_agregados (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Sistema',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_indicadores_agregados_user on public.indicadores_agregados (user_id, created_at desc);

alter table public.indicadores_agregados enable row level security;

drop policy if exists "indicadores_agregados_own" on public.indicadores_agregados;
create policy "indicadores_agregados_own" on public.indicadores_agregados
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.indicadores_iso_25010 (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Calidad ISO',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_indicadores_iso_25010_user on public.indicadores_iso_25010 (user_id, created_at desc);

alter table public.indicadores_iso_25010 enable row level security;

drop policy if exists "indicadores_iso_25010_own" on public.indicadores_iso_25010;
create policy "indicadores_iso_25010_own" on public.indicadores_iso_25010
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.indices_ndvi_parcela (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Terreno',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_indices_ndvi_parcela_user on public.indices_ndvi_parcela (user_id, created_at desc);

alter table public.indices_ndvi_parcela enable row level security;

drop policy if exists "indices_ndvi_parcela_own" on public.indices_ndvi_parcela;
create policy "indices_ndvi_parcela_own" on public.indices_ndvi_parcela
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.inscripciones_curso (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Capacitación',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_inscripciones_curso_user on public.inscripciones_curso (user_id, created_at desc);

alter table public.inscripciones_curso enable row level security;

drop policy if exists "inscripciones_curso_own" on public.inscripciones_curso;
create policy "inscripciones_curso_own" on public.inscripciones_curso
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.inspecciones_bpa (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Calidad ISO',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_inspecciones_bpa_user on public.inspecciones_bpa (user_id, created_at desc);

alter table public.inspecciones_bpa enable row level security;

drop policy if exists "inspecciones_bpa_own" on public.inspecciones_bpa;
create policy "inspecciones_bpa_own" on public.inspecciones_bpa
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.insumos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Comercial',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_insumos_user on public.insumos (user_id, created_at desc);

alter table public.insumos enable row level security;

drop policy if exists "insumos_own" on public.insumos;
create policy "insumos_own" on public.insumos
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.labores_campo (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Cultivo',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_labores_campo_user on public.labores_campo (user_id, created_at desc);

alter table public.labores_campo enable row level security;

drop policy if exists "labores_campo_own" on public.labores_campo;
create policy "labores_campo_own" on public.labores_campo
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.lecturas_estacion_meteo (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Clima',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_lecturas_estacion_meteo_user on public.lecturas_estacion_meteo (user_id, created_at desc);

alter table public.lecturas_estacion_meteo enable row level security;

drop policy if exists "lecturas_estacion_meteo_own" on public.lecturas_estacion_meteo;
create policy "lecturas_estacion_meteo_own" on public.lecturas_estacion_meteo
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.lecturas_sensor_suelo (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Terreno',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_lecturas_sensor_suelo_user on public.lecturas_sensor_suelo (user_id, created_at desc);

alter table public.lecturas_sensor_suelo enable row level security;

drop policy if exists "lecturas_sensor_suelo_own" on public.lecturas_sensor_suelo;
create policy "lecturas_sensor_suelo_own" on public.lecturas_sensor_suelo
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.liquidaciones_pagos_productor (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Cooperativa',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_liquidaciones_pagos_productor_user on public.liquidaciones_pagos_productor (user_id, created_at desc);

alter table public.liquidaciones_pagos_productor enable row level security;

drop policy if exists "liquidaciones_pagos_productor_own" on public.liquidaciones_pagos_productor;
create policy "liquidaciones_pagos_productor_own" on public.liquidaciones_pagos_productor
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.lotes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Terreno',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_lotes_user on public.lotes (user_id, created_at desc);

alter table public.lotes enable row level security;

drop policy if exists "lotes_own" on public.lotes;
create policy "lotes_own" on public.lotes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.lotes_semilla_trazabilidad (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Terreno',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_lotes_semilla_trazabilidad_user on public.lotes_semilla_trazabilidad (user_id, created_at desc);

alter table public.lotes_semilla_trazabilidad enable row level security;

drop policy if exists "lotes_semilla_trazabilidad_own" on public.lotes_semilla_trazabilidad;
create policy "lotes_semilla_trazabilidad_own" on public.lotes_semilla_trazabilidad
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.mantenimiento_maquinaria (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Comercial',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_mantenimiento_maquinaria_user on public.mantenimiento_maquinaria (user_id, created_at desc);

alter table public.mantenimiento_maquinaria enable row level security;

drop policy if exists "mantenimiento_maquinaria_own" on public.mantenimiento_maquinaria;
create policy "mantenimiento_maquinaria_own" on public.mantenimiento_maquinaria
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.maquinaria_agricola (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Comercial',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_maquinaria_agricola_user on public.maquinaria_agricola (user_id, created_at desc);

alter table public.maquinaria_agricola enable row level security;

drop policy if exists "maquinaria_agricola_own" on public.maquinaria_agricola;
create policy "maquinaria_agricola_own" on public.maquinaria_agricola
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.matrices_requisito_funcional (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Sistema',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_matrices_requisito_funcional_user on public.matrices_requisito_funcional (user_id, created_at desc);

alter table public.matrices_requisito_funcional enable row level security;

drop policy if exists "matrices_requisito_funcional_own" on public.matrices_requisito_funcional;
create policy "matrices_requisito_funcional_own" on public.matrices_requisito_funcional
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.matriz_riesgos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Calidad ISO',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_matriz_riesgos_user on public.matriz_riesgos (user_id, created_at desc);

alter table public.matriz_riesgos enable row level security;

drop policy if exists "matriz_riesgos_own" on public.matriz_riesgos;
create policy "matriz_riesgos_own" on public.matriz_riesgos
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.mediciones_caudal (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Clima',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_mediciones_caudal_user on public.mediciones_caudal (user_id, created_at desc);

alter table public.mediciones_caudal enable row level security;

drop policy if exists "mediciones_caudal_own" on public.mediciones_caudal;
create policy "mediciones_caudal_own" on public.mediciones_caudal
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.mensajes_comunidad_chat (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Sistema',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_mensajes_comunidad_chat_user on public.mensajes_comunidad_chat (user_id, created_at desc);

alter table public.mensajes_comunidad_chat enable row level security;

drop policy if exists "mensajes_comunidad_chat_own" on public.mensajes_comunidad_chat;
create policy "mensajes_comunidad_chat_own" on public.mensajes_comunidad_chat
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.mensajes_ticket_interaccion (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Sistema',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_mensajes_ticket_interaccion_user on public.mensajes_ticket_interaccion (user_id, created_at desc);

alter table public.mensajes_ticket_interaccion enable row level security;

drop policy if exists "mensajes_ticket_interaccion_own" on public.mensajes_ticket_interaccion;
create policy "mensajes_ticket_interaccion_own" on public.mensajes_ticket_interaccion
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.mermas_cosecha_registro (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Cultivo',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_mermas_cosecha_registro_user on public.mermas_cosecha_registro (user_id, created_at desc);

alter table public.mermas_cosecha_registro enable row level security;

drop policy if exists "mermas_cosecha_registro_own" on public.mermas_cosecha_registro;
create policy "mermas_cosecha_registro_own" on public.mermas_cosecha_registro
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.monitoreo_aereo_drones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'IA y sensores',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_monitoreo_aereo_drones_user on public.monitoreo_aereo_drones (user_id, created_at desc);

alter table public.monitoreo_aereo_drones enable row level security;

drop policy if exists "monitoreo_aereo_drones_own" on public.monitoreo_aereo_drones;
create policy "monitoreo_aereo_drones_own" on public.monitoreo_aereo_drones
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.muestreos_agua_canal (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Clima',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_muestreos_agua_canal_user on public.muestreos_agua_canal (user_id, created_at desc);

alter table public.muestreos_agua_canal enable row level security;

drop policy if exists "muestreos_agua_canal_own" on public.muestreos_agua_canal;
create policy "muestreos_agua_canal_own" on public.muestreos_agua_canal
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.muestreos_calidad (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Trazabilidad',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_muestreos_calidad_user on public.muestreos_calidad (user_id, created_at desc);

alter table public.muestreos_calidad enable row level security;

drop policy if exists "muestreos_calidad_own" on public.muestreos_calidad;
create policy "muestreos_calidad_own" on public.muestreos_calidad
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.no_conformidades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Calidad ISO',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_no_conformidades_user on public.no_conformidades (user_id, created_at desc);

alter table public.no_conformidades enable row level security;

drop policy if exists "no_conformidades_own" on public.no_conformidades;
create policy "no_conformidades_own" on public.no_conformidades
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.normas_iso_referencia (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Calidad ISO',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_normas_iso_referencia_user on public.normas_iso_referencia (user_id, created_at desc);

alter table public.normas_iso_referencia enable row level security;

drop policy if exists "normas_iso_referencia_own" on public.normas_iso_referencia;
create policy "normas_iso_referencia_own" on public.normas_iso_referencia
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.notificaciones_usuario (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Sistema',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_notificaciones_usuario_user on public.notificaciones_usuario (user_id, created_at desc);

alter table public.notificaciones_usuario enable row level security;

drop policy if exists "notificaciones_usuario_own" on public.notificaciones_usuario;
create policy "notificaciones_usuario_own" on public.notificaciones_usuario
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.orden_compra_detalle (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Comercial',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_orden_compra_detalle_user on public.orden_compra_detalle (user_id, created_at desc);

alter table public.orden_compra_detalle enable row level security;

drop policy if exists "orden_compra_detalle_own" on public.orden_compra_detalle;
create policy "orden_compra_detalle_own" on public.orden_compra_detalle
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.ortofotos_parcela (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Terreno',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_ortofotos_parcela_user on public.ortofotos_parcela (user_id, created_at desc);

alter table public.ortofotos_parcela enable row level security;

drop policy if exists "ortofotos_parcela_own" on public.ortofotos_parcela;
create policy "ortofotos_parcela_own" on public.ortofotos_parcela
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.paneles_solares_finca (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Terreno',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_paneles_solares_finca_user on public.paneles_solares_finca (user_id, created_at desc);

alter table public.paneles_solares_finca enable row level security;

drop policy if exists "paneles_solares_finca_own" on public.paneles_solares_finca;
create policy "paneles_solares_finca_own" on public.paneles_solares_finca
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.parcelas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Terreno',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_parcelas_user on public.parcelas (user_id, created_at desc);

alter table public.parcelas enable row level security;

drop policy if exists "parcelas_own" on public.parcelas;
create policy "parcelas_own" on public.parcelas
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.pedidos_mercado_mayorista (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Comercial',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_pedidos_mercado_mayorista_user on public.pedidos_mercado_mayorista (user_id, created_at desc);

alter table public.pedidos_mercado_mayorista enable row level security;

drop policy if exists "pedidos_mercado_mayorista_own" on public.pedidos_mercado_mayorista;
create policy "pedidos_mercado_mayorista_own" on public.pedidos_mercado_mayorista
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.plagas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Sanidad',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_plagas_user on public.plagas (user_id, created_at desc);

alter table public.plagas enable row level security;

drop policy if exists "plagas_own" on public.plagas;
create policy "plagas_own" on public.plagas
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.planes_contingencia (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Sistema',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_planes_contingencia_user on public.planes_contingencia (user_id, created_at desc);

alter table public.planes_contingencia enable row level security;

drop policy if exists "planes_contingencia_own" on public.planes_contingencia;
create policy "planes_contingencia_own" on public.planes_contingencia
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.politicas_retencion_datos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Sistema',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_politicas_retencion_datos_user on public.politicas_retencion_datos (user_id, created_at desc);

alter table public.politicas_retencion_datos enable row level security;

drop policy if exists "politicas_retencion_datos_own" on public.politicas_retencion_datos;
create policy "politicas_retencion_datos_own" on public.politicas_retencion_datos
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.polizas_seguro_campo (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Finanzas',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_polizas_seguro_campo_user on public.polizas_seguro_campo (user_id, created_at desc);

alter table public.polizas_seguro_campo enable row level security;

drop policy if exists "polizas_seguro_campo_own" on public.polizas_seguro_campo;
create policy "polizas_seguro_campo_own" on public.polizas_seguro_campo
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.pozos_agua (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Clima',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_pozos_agua_user on public.pozos_agua (user_id, created_at desc);

alter table public.pozos_agua enable row level security;

drop policy if exists "pozos_agua_own" on public.pozos_agua;
create policy "pozos_agua_own" on public.pozos_agua
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.precios_mercado (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Comercial',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_precios_mercado_user on public.precios_mercado (user_id, created_at desc);

alter table public.precios_mercado enable row level security;

drop policy if exists "precios_mercado_own" on public.precios_mercado;
create policy "precios_mercado_own" on public.precios_mercado
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.presupuestos_campania (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Cultivo',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_presupuestos_campania_user on public.presupuestos_campania (user_id, created_at desc);

alter table public.presupuestos_campania enable row level security;

drop policy if exists "presupuestos_campania_own" on public.presupuestos_campania;
create policy "presupuestos_campania_own" on public.presupuestos_campania
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.proveedores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Comercial',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_proveedores_user on public.proveedores (user_id, created_at desc);

alter table public.proveedores enable row level security;

drop policy if exists "proveedores_own" on public.proveedores;
create policy "proveedores_own" on public.proveedores
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.qrcode_trazabilidad_lote (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Terreno',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_qrcode_trazabilidad_lote_user on public.qrcode_trazabilidad_lote (user_id, created_at desc);

alter table public.qrcode_trazabilidad_lote enable row level security;

drop policy if exists "qrcode_trazabilidad_lote_own" on public.qrcode_trazabilidad_lote;
create policy "qrcode_trazabilidad_lote_own" on public.qrcode_trazabilidad_lote
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.recepciones_mercancia (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Comercial',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_recepciones_mercancia_user on public.recepciones_mercancia (user_id, created_at desc);

alter table public.recepciones_mercancia enable row level security;

drop policy if exists "recepciones_mercancia_own" on public.recepciones_mercancia;
create policy "recepciones_mercancia_own" on public.recepciones_mercancia
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.recomendaciones_ia_cultivo_cache (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Cultivo',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_recomendaciones_ia_cultivo_cache_user on public.recomendaciones_ia_cultivo_cache (user_id, created_at desc);

alter table public.recomendaciones_ia_cultivo_cache enable row level security;

drop policy if exists "recomendaciones_ia_cultivo_cache_own" on public.recomendaciones_ia_cultivo_cache;
create policy "recomendaciones_ia_cultivo_cache_own" on public.recomendaciones_ia_cultivo_cache
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.registros_lluvia (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Clima',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_registros_lluvia_user on public.registros_lluvia (user_id, created_at desc);

alter table public.registros_lluvia enable row level security;

drop policy if exists "registros_lluvia_own" on public.registros_lluvia;
create policy "registros_lluvia_own" on public.registros_lluvia
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.respuestas_encuesta_linea (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Sistema',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_respuestas_encuesta_linea_user on public.respuestas_encuesta_linea (user_id, created_at desc);

alter table public.respuestas_encuesta_linea enable row level security;

drop policy if exists "respuestas_encuesta_linea_own" on public.respuestas_encuesta_linea;
create policy "respuestas_encuesta_linea_own" on public.respuestas_encuesta_linea
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.riego (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Cultivo',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_riego_user on public.riego (user_id, created_at desc);

alter table public.riego enable row level security;

drop policy if exists "riego_own" on public.riego;
create policy "riego_own" on public.riego
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.rotacion_cultivos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Cultivo',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_rotacion_cultivos_user on public.rotacion_cultivos (user_id, created_at desc);

alter table public.rotacion_cultivos enable row level security;

drop policy if exists "rotacion_cultivos_own" on public.rotacion_cultivos;
create policy "rotacion_cultivos_own" on public.rotacion_cultivos
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.seleccion_calibres (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Cultivo',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_seleccion_calibres_user on public.seleccion_calibres (user_id, created_at desc);

alter table public.seleccion_calibres enable row level security;

drop policy if exists "seleccion_calibres_own" on public.seleccion_calibres;
create policy "seleccion_calibres_own" on public.seleccion_calibres
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.sensores_iot_registry (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'IA y sensores',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_sensores_iot_registry_user on public.sensores_iot_registry (user_id, created_at desc);

alter table public.sensores_iot_registry enable row level security;

drop policy if exists "sensores_iot_registry_own" on public.sensores_iot_registry;
create policy "sensores_iot_registry_own" on public.sensores_iot_registry
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.socios_cooperativa (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Cooperativa',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_socios_cooperativa_user on public.socios_cooperativa (user_id, created_at desc);

alter table public.socios_cooperativa enable row level security;

drop policy if exists "socios_cooperativa_own" on public.socios_cooperativa;
create policy "socios_cooperativa_own" on public.socios_cooperativa
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.stock_carbono_parcela (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Terreno',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_stock_carbono_parcela_user on public.stock_carbono_parcela (user_id, created_at desc);

alter table public.stock_carbono_parcela enable row level security;

drop policy if exists "stock_carbono_parcela_own" on public.stock_carbono_parcela;
create policy "stock_carbono_parcela_own" on public.stock_carbono_parcela
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.tickets_soporte (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Sistema',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_tickets_soporte_user on public.tickets_soporte (user_id, created_at desc);

alter table public.tickets_soporte enable row level security;

drop policy if exists "tickets_soporte_own" on public.tickets_soporte;
create policy "tickets_soporte_own" on public.tickets_soporte
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.trampas_monitoreo (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Sanidad',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_trampas_monitoreo_user on public.trampas_monitoreo (user_id, created_at desc);

alter table public.trampas_monitoreo enable row level security;

drop policy if exists "trampas_monitoreo_own" on public.trampas_monitoreo;
create policy "trampas_monitoreo_own" on public.trampas_monitoreo
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.transportes_cosecha (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Cultivo',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_transportes_cosecha_user on public.transportes_cosecha (user_id, created_at desc);

alter table public.transportes_cosecha enable row level security;

drop policy if exists "transportes_cosecha_own" on public.transportes_cosecha;
create policy "transportes_cosecha_own" on public.transportes_cosecha
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.tratamientos_poscosecha (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Cultivo',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_tratamientos_poscosecha_user on public.tratamientos_poscosecha (user_id, created_at desc);

alter table public.tratamientos_poscosecha enable row level security;

drop policy if exists "tratamientos_poscosecha_own" on public.tratamientos_poscosecha;
create policy "tratamientos_poscosecha_own" on public.tratamientos_poscosecha
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.trazabilidad_muestra_laboratorio (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Trazabilidad',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_trazabilidad_muestra_laboratorio_user on public.trazabilidad_muestra_laboratorio (user_id, created_at desc);

alter table public.trazabilidad_muestra_laboratorio enable row level security;

drop policy if exists "trazabilidad_muestra_laboratorio_own" on public.trazabilidad_muestra_laboratorio;
create policy "trazabilidad_muestra_laboratorio_own" on public.trazabilidad_muestra_laboratorio
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.umbrales_monitores_plaga (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Sanidad',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_umbrales_monitores_plaga_user on public.umbrales_monitores_plaga (user_id, created_at desc);

alter table public.umbrales_monitores_plaga enable row level security;

drop policy if exists "umbrales_monitores_plaga_own" on public.umbrales_monitores_plaga;
create policy "umbrales_monitores_plaga_own" on public.umbrales_monitores_plaga
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.variables_ambientales_diarias (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Clima',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_variables_ambientales_diarias_user on public.variables_ambientales_diarias (user_id, created_at desc);

alter table public.variables_ambientales_diarias enable row level security;

drop policy if exists "variables_ambientales_diarias_own" on public.variables_ambientales_diarias;
create policy "variables_ambientales_diarias_own" on public.variables_ambientales_diarias
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.visitas_extension_rural (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Capacitación',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_visitas_extension_rural_user on public.visitas_extension_rural (user_id, created_at desc);

alter table public.visitas_extension_rural enable row level security;

drop policy if exists "visitas_extension_rural_own" on public.visitas_extension_rural;
create policy "visitas_extension_rural_own" on public.visitas_extension_rural
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.visitas_tecnico (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'Capacitación',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_visitas_tecnico_user on public.visitas_tecnico (user_id, created_at desc);

alter table public.visitas_tecnico enable row level security;

drop policy if exists "visitas_tecnico_own" on public.visitas_tecnico;
create policy "visitas_tecnico_own" on public.visitas_tecnico
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


create table if not exists public.vuelos_drone_agendados (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  categoria text not null default 'IA y sensores',
  lat double precision not null,
  lng double precision not null,
  altitud_msnm double precision,
  precision_m double precision,
  titulo text not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_vuelos_drone_agendados_user on public.vuelos_drone_agendados (user_id, created_at desc);

alter table public.vuelos_drone_agendados enable row level security;

drop policy if exists "vuelos_drone_agendados_own" on public.vuelos_drone_agendados;
create policy "vuelos_drone_agendados_own" on public.vuelos_drone_agendados
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


-- Vista resumen sobre todas las tablas de campo
create or replace view public.v_progreso_campo as
select 'acciones_correctivas'::text as tabla, 'Sistema'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.acciones_correctivas r
union all
select 'actas_revision_calidad'::text as tabla, 'Calidad ISO'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.actas_revision_calidad r
union all
select 'alertas_comunidad'::text as tabla, 'Sistema'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.alertas_comunidad r
union all
select 'alertas_historial'::text as tabla, 'Sistema'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.alertas_historial r
union all
select 'almacenes_granel'::text as tabla, 'Comercial'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.almacenes_granel r
union all
select 'analisis_laboratorio_externo'::text as tabla, 'Trazabilidad'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.analisis_laboratorio_externo r
union all
select 'aplicaciones_fitosanitarias'::text as tabla, 'Sanidad'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.aplicaciones_fitosanitarias r
union all
select 'aportes_capital_social'::text as tabla, 'Cooperativa'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.aportes_capital_social r
union all
select 'auditoria_cambios'::text as tabla, 'Calidad ISO'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.auditoria_cambios r
union all
select 'auditorias_internas_sgsi'::text as tabla, 'Calidad ISO'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.auditorias_internas_sgsi r
union all
select 'avistamientos_fauna_benefica'::text as tabla, 'Sanidad'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.avistamientos_fauna_benefica r
union all
select 'balance_nutricion'::text as tabla, 'Cultivo'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.balance_nutricion r
union all
select 'biodiversidad_shannon_parcela'::text as tabla, 'Terreno'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.biodiversidad_shannon_parcela r
union all
select 'campanias_agricolas'::text as tabla, 'Cultivo'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.campanias_agricolas r
union all
select 'capas_suelo_geologia'::text as tabla, 'Terreno'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.capas_suelo_geologia r
union all
select 'capturas_trampa'::text as tabla, 'Sanidad'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.capturas_trampa r
union all
select 'casos_fitotoxicidad'::text as tabla, 'Sanidad'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.casos_fitotoxicidad r
union all
select 'catalogo_cultivos'::text as tabla, 'Cultivo'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.catalogo_cultivos r
union all
select 'catalogo_insumo_quimico'::text as tabla, 'Comercial'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.catalogo_insumo_quimico r
union all
select 'certificados_origen'::text as tabla, 'Comercial'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.certificados_origen r
union all
select 'configuracion_usuario'::text as tabla, 'Sistema'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.configuracion_usuario r
union all
select 'consentimientos_usuario_pd'::text as tabla, 'Sistema'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.consentimientos_usuario_pd r
union all
select 'consultas_ia_log'::text as tabla, 'IA y sensores'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.consultas_ia_log r
union all
select 'consumo_combustible'::text as tabla, 'Comercial'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.consumo_combustible r
union all
select 'contratos_compra'::text as tabla, 'Comercial'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.contratos_compra r
union all
select 'controles_cumplimiento_iso'::text as tabla, 'Calidad ISO'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.controles_cumplimiento_iso r
union all
select 'cooperativas_agrarias'::text as tabla, 'Cooperativa'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.cooperativas_agrarias r
union all
select 'cosecha'::text as tabla, 'Cultivo'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.cosecha r
union all
select 'creditos_agricolas'::text as tabla, 'Finanzas'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.creditos_agricolas r
union all
select 'cursos_capacitacion'::text as tabla, 'Capacitación'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.cursos_capacitacion r
union all
select 'diagnosticos_ia_planta'::text as tabla, 'IA y sensores'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.diagnosticos_ia_planta r
union all
select 'documentos_adjuntos'::text as tabla, 'Sistema'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.documentos_adjuntos r
union all
select 'encuestas_satisfaccion'::text as tabla, 'Sistema'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.encuestas_satisfaccion r
union all
select 'ensayos_campo'::text as tabla, 'Cultivo'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.ensayos_campo r
union all
select 'etiquetas_procesos_normalizados'::text as tabla, 'Sistema'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.etiquetas_procesos_normalizados r
union all
select 'evaluaciones_curso'::text as tabla, 'Capacitación'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.evaluaciones_curso r
union all
select 'eventos_clima_extremo'::text as tabla, 'Clima'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.eventos_clima_extremo r
union all
select 'evidencias_cumplimiento_iso'::text as tabla, 'Calidad ISO'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.evidencias_cumplimiento_iso r
union all
select 'evidencias_foto_auditoria'::text as tabla, 'Calidad ISO'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.evidencias_foto_auditoria r
union all
select 'fcm_tokens'::text as tabla, 'Sistema'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.fcm_tokens r
union all
select 'fichas_seguridad_hoja'::text as tabla, 'Sistema'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.fichas_seguridad_hoja r
union all
select 'fincas'::text as tabla, 'Terreno'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.fincas r
union all
select 'firmas_digitales_registro'::text as tabla, 'Sistema'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.firmas_digitales_registro r
union all
select 'floracion_reclutamiento'::text as tabla, 'Cultivo'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.floracion_reclutamiento r
union all
select 'flujos_caja'::text as tabla, 'Finanzas'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.flujos_caja r
union all
select 'gastos'::text as tabla, 'Finanzas'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.gastos r
union all
select 'grupos_productores'::text as tabla, 'Sistema'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.grupos_productores r
union all
select 'guias_remision_electronica'::text as tabla, 'Comercial'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.guias_remision_electronica r
union all
select 'historial_suelo'::text as tabla, 'Terreno'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.historial_suelo r
union all
select 'indicadores_agregados'::text as tabla, 'Sistema'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.indicadores_agregados r
union all
select 'indicadores_iso_25010'::text as tabla, 'Calidad ISO'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.indicadores_iso_25010 r
union all
select 'indices_ndvi_parcela'::text as tabla, 'Terreno'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.indices_ndvi_parcela r
union all
select 'inscripciones_curso'::text as tabla, 'Capacitación'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.inscripciones_curso r
union all
select 'inspecciones_bpa'::text as tabla, 'Calidad ISO'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.inspecciones_bpa r
union all
select 'insumos'::text as tabla, 'Comercial'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.insumos r
union all
select 'labores_campo'::text as tabla, 'Cultivo'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.labores_campo r
union all
select 'lecturas_estacion_meteo'::text as tabla, 'Clima'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.lecturas_estacion_meteo r
union all
select 'lecturas_sensor_suelo'::text as tabla, 'Terreno'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.lecturas_sensor_suelo r
union all
select 'liquidaciones_pagos_productor'::text as tabla, 'Cooperativa'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.liquidaciones_pagos_productor r
union all
select 'lotes'::text as tabla, 'Terreno'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.lotes r
union all
select 'lotes_semilla_trazabilidad'::text as tabla, 'Terreno'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.lotes_semilla_trazabilidad r
union all
select 'mantenimiento_maquinaria'::text as tabla, 'Comercial'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.mantenimiento_maquinaria r
union all
select 'maquinaria_agricola'::text as tabla, 'Comercial'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.maquinaria_agricola r
union all
select 'matrices_requisito_funcional'::text as tabla, 'Sistema'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.matrices_requisito_funcional r
union all
select 'matriz_riesgos'::text as tabla, 'Calidad ISO'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.matriz_riesgos r
union all
select 'mediciones_caudal'::text as tabla, 'Clima'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.mediciones_caudal r
union all
select 'mensajes_comunidad_chat'::text as tabla, 'Sistema'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.mensajes_comunidad_chat r
union all
select 'mensajes_ticket_interaccion'::text as tabla, 'Sistema'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.mensajes_ticket_interaccion r
union all
select 'mermas_cosecha_registro'::text as tabla, 'Cultivo'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.mermas_cosecha_registro r
union all
select 'monitoreo_aereo_drones'::text as tabla, 'IA y sensores'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.monitoreo_aereo_drones r
union all
select 'muestreos_agua_canal'::text as tabla, 'Clima'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.muestreos_agua_canal r
union all
select 'muestreos_calidad'::text as tabla, 'Trazabilidad'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.muestreos_calidad r
union all
select 'no_conformidades'::text as tabla, 'Calidad ISO'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.no_conformidades r
union all
select 'normas_iso_referencia'::text as tabla, 'Calidad ISO'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.normas_iso_referencia r
union all
select 'notificaciones_usuario'::text as tabla, 'Sistema'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.notificaciones_usuario r
union all
select 'orden_compra_detalle'::text as tabla, 'Comercial'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.orden_compra_detalle r
union all
select 'ortofotos_parcela'::text as tabla, 'Terreno'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.ortofotos_parcela r
union all
select 'paneles_solares_finca'::text as tabla, 'Terreno'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.paneles_solares_finca r
union all
select 'parcelas'::text as tabla, 'Terreno'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.parcelas r
union all
select 'pedidos_mercado_mayorista'::text as tabla, 'Comercial'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.pedidos_mercado_mayorista r
union all
select 'plagas'::text as tabla, 'Sanidad'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.plagas r
union all
select 'planes_contingencia'::text as tabla, 'Sistema'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.planes_contingencia r
union all
select 'politicas_retencion_datos'::text as tabla, 'Sistema'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.politicas_retencion_datos r
union all
select 'polizas_seguro_campo'::text as tabla, 'Finanzas'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.polizas_seguro_campo r
union all
select 'pozos_agua'::text as tabla, 'Clima'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.pozos_agua r
union all
select 'precios_mercado'::text as tabla, 'Comercial'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.precios_mercado r
union all
select 'presupuestos_campania'::text as tabla, 'Cultivo'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.presupuestos_campania r
union all
select 'proveedores'::text as tabla, 'Comercial'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.proveedores r
union all
select 'qrcode_trazabilidad_lote'::text as tabla, 'Terreno'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.qrcode_trazabilidad_lote r
union all
select 'recepciones_mercancia'::text as tabla, 'Comercial'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.recepciones_mercancia r
union all
select 'recomendaciones_ia_cultivo_cache'::text as tabla, 'Cultivo'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.recomendaciones_ia_cultivo_cache r
union all
select 'registros_lluvia'::text as tabla, 'Clima'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.registros_lluvia r
union all
select 'respuestas_encuesta_linea'::text as tabla, 'Sistema'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.respuestas_encuesta_linea r
union all
select 'riego'::text as tabla, 'Cultivo'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.riego r
union all
select 'rotacion_cultivos'::text as tabla, 'Cultivo'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.rotacion_cultivos r
union all
select 'seleccion_calibres'::text as tabla, 'Cultivo'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.seleccion_calibres r
union all
select 'sensores_iot_registry'::text as tabla, 'IA y sensores'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.sensores_iot_registry r
union all
select 'socios_cooperativa'::text as tabla, 'Cooperativa'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.socios_cooperativa r
union all
select 'stock_carbono_parcela'::text as tabla, 'Terreno'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.stock_carbono_parcela r
union all
select 'tickets_soporte'::text as tabla, 'Sistema'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.tickets_soporte r
union all
select 'trampas_monitoreo'::text as tabla, 'Sanidad'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.trampas_monitoreo r
union all
select 'transportes_cosecha'::text as tabla, 'Cultivo'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.transportes_cosecha r
union all
select 'tratamientos_poscosecha'::text as tabla, 'Cultivo'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.tratamientos_poscosecha r
union all
select 'trazabilidad_muestra_laboratorio'::text as tabla, 'Trazabilidad'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.trazabilidad_muestra_laboratorio r
union all
select 'umbrales_monitores_plaga'::text as tabla, 'Sanidad'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.umbrales_monitores_plaga r
union all
select 'variables_ambientales_diarias'::text as tabla, 'Clima'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.variables_ambientales_diarias r
union all
select 'visitas_extension_rural'::text as tabla, 'Capacitación'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.visitas_extension_rural r
union all
select 'visitas_tecnico'::text as tabla, 'Capacitación'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.visitas_tecnico r
union all
select 'vuelos_drone_agendados'::text as tabla, 'IA y sensores'::text as categoria, count(r.id)::bigint as total_registros, count(distinct r.user_id)::bigint as usuarios_con_registro from public.vuelos_drone_agendados r
order by categoria, tabla;
