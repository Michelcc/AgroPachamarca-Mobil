-- =============================================================================
-- Sensores IoT de suelo — columnas para medición de tierra
-- Ejecutar en Supabase SQL Editor (después de schema-tablas-campo.sql)
-- =============================================================================

alter table public.sensores_iot_registry
  add column if not exists sensor_codigo text,
  add column if not exists sensor_tipo text not null default 'suelo',
  add column if not exists modelo text,
  add column if not exists parcela text,
  add column if not exists activo boolean not null default true;

alter table public.lecturas_sensor_suelo
  add column if not exists sensor_codigo text,
  add column if not exists humedad_pct numeric(5,2),
  add column if not exists ph numeric(4,2),
  add column if not exists temperatura_c numeric(5,2),
  add column if not exists conductividad_ms_cm numeric(8,2),
  add column if not exists profundidad_cm numeric(6,1) default 15,
  add column if not exists nitrogeno_ppm numeric(8,2),
  add column if not exists fosforo_ppm numeric(8,2),
  add column if not exists potasio_ppm numeric(8,2),
  add column if not exists estado_suelo text;

create index if not exists idx_lecturas_sensor_suelo_sensor
  on public.lecturas_sensor_suelo (user_id, sensor_codigo, created_at desc);

comment on column public.lecturas_sensor_suelo.humedad_pct is 'Humedad del suelo % volumétrica';
comment on column public.lecturas_sensor_suelo.ph is 'pH del suelo';
comment on column public.lecturas_sensor_suelo.conductividad_ms_cm is 'Conductividad eléctrica mS/cm';
comment on column public.lecturas_sensor_suelo.estado_suelo is 'seco | optimo | humedo | saturado | critico';
