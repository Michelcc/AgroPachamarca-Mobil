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

### ¿Cómo funciona por dentro?

La app no es solo una pantalla: está organizada en **capas** para separar la interfaz, la lógica de negocio y el acceso a datos.

**Capa de navegación (`src/navigation/`)**  
La barra inferior (*MainTabs*) tiene cuatro entradas: Inicio, Datos, Dimensiones y Perfil. Es la navegación que el productor usa todos los días. Encima corre un **Stack** (*RootNavigator*) para pantallas que se abren “encima”: el detalle de una dimensión, el módulo de productos, sensores, clima, cultivo o el registro GPS de una tabla de campo. Así evitamos saturar la barra con diez íconos y mantenemos la estructura de la tesis (dimensiones) como eje central.

**Capa de pantallas (`src/screens/`)**  
Cada pantalla muestra UI y reacciona a toques del usuario. Por ejemplo, `DimensionHubScreen` lista las cuatro dimensiones literales de la investigación; al elegir una, `DimensionDetailScreen` muestra los indicadores medibles y los accesos a módulos (productos, sensores, etc.). Las pantallas **no escriben SQL directo**: delegan en repositorios.

**Capa de features (`src/features/`)**  
Aquí vive la lógica reutilizable: `campo/` calcula progreso de registros GPS, `sensores/` inserta lecturas IoT e interpreta estado del suelo (seco, óptimo, saturado), `operacionalizacion/` guarda valores de indicadores de tesis. Cada feature usa el cliente Supabase configurado con la sesión del usuario logueado.

**Capa de servicios (`src/services/`)**  
Funciones puras o integraciones externas: captura GPS, interpretación de sensores, llamadas a APIs de clima. No conocen React; pueden testearse y reutilizarse desde varias pantallas.

**Conexión con Supabase**  
Al abrir la app, `AuthContext` restaura la sesión (email/contraseña vía Supabase Auth). El archivo `android/.env` aporta `EXPO_PUBLIC_SUPABASE_URL` y la **anon key** (formato `eyJ…`). Esa clave es pública en el APK, pero **no da acceso libre a los datos**: RLS en PostgreSQL exige que `user_id` coincida con `auth.uid()` en casi todas las tablas sensibles. El catálogo de productos usa políticas especiales (`patch-productos-catalog-rls.sql`) para que todos vean ítems marcados `disponible = true`.

**Build Android**  
El JavaScript de `../src/` se empaqueta dentro del APK con `instalar-app.ps1`. Por eso el productor **no necesita Metro ni PC encendido** en el campo: la app lleva el bundle JS y habla con Supabase por internet. Si cambias pantallas o lógica, hay que **volver a generar el APK** e instalarlo.

**Relación con el panel web**  
Todo lo que guarda la app (sensores, indicadores, alertas, etc.) aparece en el panel admin porque ambos escriben en las mismas tablas. La app es el **instrumento de captura**; el panel es la **vista agregada** para investigación y gestión.

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
