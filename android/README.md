# Agro — Android

App móvil **Agro Pachamarca** para productores de campo. Parte del monorepo en la raíz (`../src/`). Arquitectura **BaaS**: la app habla directo con Supabase (Auth + PostgreSQL + RLS), sin servidor intermedio.

Abre **`C:\m\android`** en Android Studio (ruta corta). No uses `subst P:`: rompe Gradle/Expo en Windows.

---

## Arquitectura de la app

```
┌─────────────────────────────────────────────────────────┐
│                    APP MÓVIL (Expo)                      │
├─────────────────────────────────────────────────────────┤
│  MainTabs (bottom bar)                                   │
│    Inicio │ Datos │ Dimensiones │ Perfil                │
├─────────────────────────────────────────────────────────┤
│  Root Stack (pantallas modales / detalle)                │
│    DimensionDetail · Productos · Sensores · Clima      │
│    Cultivo · Planta IA · RegistroTabla                   │
├─────────────────────────────────────────────────────────┤
│  Capa de datos (src/features/)                           │
│    campo · sensores · operacionalizacion · perfil        │
├─────────────────────────────────────────────────────────┤
│  Supabase JS Client (anon key + JWT del usuario)         │
└──────────────────────────┬──────────────────────────────┘
                           ▼
                  Supabase PostgreSQL + RLS
```

### Navegación por dimensiones

La pestaña **Dimensiones** muestra las 4 dimensiones de la tesis (*Cultivos agrícolas*):

| Dimensión | Módulos accesibles desde la app |
|-----------|--------------------------------|
| Productividad | Productos |
| Gestión de recursos | Productos, Sensores de suelo |
| Predicción agrícola | Cultivo (ML), Clima (alertas), Diagnósticos IA |
| Toma de decisiones | Solo indicadores (encuesta 1–5) |

Cada dimensión permite **registrar indicadores** en `indicadores_operacionalizacion` con GPS automático.

Definición en código: `../src/schema/operacionalizacion.ts` y `../src/schema/dimensionModulos.ts`.

---

## Qué hay en cada sitio

| Ubicación | Qué es |
|-----------|--------|
| `android/.env` | `EXPO_PUBLIC_SUPABASE_URL` + `EXPO_PUBLIC_SUPABASE_ANON_KEY` (clave `eyJ…`) |
| `android/supabase/*.sql` | Scripts SQL — ejecutar en Supabase en orden |
| `android/app/` | Proyecto nativo Gradle/Kotlin |
| `../src/` | Pantallas, navegación, features Expo (JS/TS) |

---

## 1. Supabase (una vez)

1. [supabase.com](https://supabase.com) → nuevo proyecto.
2. **Authentication** → Email activado.
3. **SQL Editor** → ejecutar en orden:
   - `supabase/schema.sql`
   - `supabase/schema-tablas-campo.sql` (109 tablas de campo)
   - `supabase/schema-sensores-suelo.sql` (humedad, pH, temperatura IoT)
   - `supabase/schema-operacionalizacion.sql` (12 indicadores — variable *Cultivos agrícolas*)
   - `supabase/patch-productos-catalog-rls.sql` (catálogo productos visible en app + panel)
4. `copy .env.example .env` y pegar URL + **anon key** (`eyJ…`, no `sb_publishable_…`).

---

## 2. Android Studio (recomendado)

```powershell
cd android
.\abrir-studio.ps1
```

O manualmente:

```powershell
mklink /J C:\m "C:\Users\USER\Documents\App Mobil\mobile"
```

Luego **File → Open** → `C:\m\android`.

**No uses Run ▶ en Android Studio** si quieres evitar Metro y la pantalla roja. Usa el APK (abajo).

**Gradle JDK:** Settings → Build → Gradle → JDK de Android Studio.

Si falta el SDK, copia `local.properties.example` a `local.properties` y ajusta `sdk.dir`.

---

## 3. Compilar por terminal

```powershell
cd android
.\limpiar.ps1    # si falló antes o cambiaste de carpeta
.\iniciar.ps1
```

`iniciar.ps1` crea `C:\m`, limpia cachés `.cxx`/`build` y ejecuta `npx expo run:android`.

**Paquete Android:** `com.agro`

---

## 4. Instalar app (sin Metro — recomendado)

**No uses Run en Android Studio** para probar. Esa versión pide Metro en localhost.

Teléfono por USB con depuración activada:

```powershell
cd android
.\instalar-app.ps1
```

Compila APK con JS embebido + Supabase, desinstala la app vieja e instala **Agro**.

Archivo generado: `agro-release.apk` en la carpeta `mobile\`.

> Si ves "Unable to load script", desinstala Agro del teléfono y vuelve a ejecutar `.\instalar-app.ps1`.

---

## Verificación

Desde la raíz del monorepo:

```powershell
npm run typecheck
```
