-- Ejecutar en Supabase si ya creaste profiles antes (sin columna nombre)
alter table public.profiles add column if not exists nombre text;

update public.profiles
set nombre = coalesce(nullif(trim(nombre), ''), username)
where nombre is null or trim(nombre) = '';

alter table public.profiles alter column nombre set not null;
