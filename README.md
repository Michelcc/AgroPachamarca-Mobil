# Agro Pachamarca

Sistema agrícola **mobile-first** para productores de campo: registro GPS, clima, cultivos, sensores IoT, productos e indicadores de investigación. La arquitectura es **BaaS** (Backend as a Service): no hay servidor de base de datos propio; todo persiste en **Supabase** y los clientes se conectan directamente.

| Repositorio | Contenido | Stack |
|-------------|-----------|-------|
| [AgroPachamarca-Mobil](https://github.com/Michelcc/AgroPachamarca-Mobil) | App móvil Android | Expo 52 · React Native · TypeScript |
| [AgroPachamarca-Web](https://github.com/Michelcc/AgroPachamarca-Web) | Panel administrativo | Next.js 15 · Vercel |

---

## Arquitectura general (BaaS)

El sistema sigue un patrón **cliente → Supabase** con dos tipos de cliente y un backend compartido:

```
                    ┌─────────────────────────────────────────┐
                    │           CAPA DE CLIENTES                │
                    └─────────────────────────────────────────┘
         ┌────────────────────────┐    ┌────────────────────────┐
         │      APP MÓVIL           │    │      PANEL WEB         │
         │  Expo / React Native     │    │  Next.js (App Router)  │
         │  Android APK             │    │  Vercel                │
         │                          │    │                        │
         │  Auth: Supabase JWT      │    │  Auth: sesión propia     │
         │  Clave: anon (eyJ…)       │    │  Clave: service_role   │
         │  RLS: solo datos propios │    │  RLS: bypass admin     │
         └────────────┬─────────────┘    └────────────┬───────────┘
                      │                               │
                      │    PostgREST + Realtime       │
                      └───────────────┬───────────────┘
                                      ▼
                    ┌─────────────────────────────────────────┐
                    │              SUPABASE BaaS                │
                    │  ┌─────────┐ ┌──────────┐ ┌───────────┐  │
                    │  │  Auth   │ │PostgreSQL│ │  Storage  │  │
                    │  │ (JWT)   │ │ + RLS    │ │ productos │  │
                    │  └─────────┘ └──────────┘ └───────────┘  │
                    └─────────────────────────────────────────┘
                                      ▲
                    ┌─────────────────┴───────────────────────┐
                    │         SERVICIOS EXTERNOS (sin BD)      │
                    │  Open-Meteo · Google Gemini · ML local   │
                    └─────────────────────────────────────────┘
```

### Principios de diseño

| Principio | Implementación |
|-----------|----------------|
| **Sin backend propio de datos** | PostgreSQL vive en Supabase; Vercel solo hospeda el panel y APIs ligeras (ML, cron). |
| **Seguridad por RLS** | La app móvil usa clave anónima; cada fila se filtra por `user_id = auth.uid()`. |
| **Admin global** | El panel web usa `SUPABASE_SERVICE_ROLE_KEY` para ver y editar todos los registros. |
| **Offline-first parcial** | Banner de conexión; registros de campo se envían cuando hay red. |
| **GPS automático** | Clima, cultivo e indicadores capturan coordenadas al guardar. |
| **Investigación integrada** | Matriz de operacionalización de tesis embebida en código y pantallas. |

### Flujo de datos típico

1. **Productor** abre la app → login Supabase Auth → JWT en memoria.
2. **Registro de campo** → insert en tabla PostgreSQL → RLS valida `user_id`.
3. **Sensores de suelo** → lectura IoT → `lecturas_sensor_suelo` + interpretación local (seco/óptimo/saturado).
4. **Indicador de tesis** → pestaña Dimensiones → dimensión → valor numérico → `indicadores_operacionalizacion`.
5. **Administrador** entra al panel → service role → ve todos los registros agrupados por dimensión o tabla.

---

## Modelo conceptual: dimensiones y tablas

La navegación **no es plana**. Sigue la estructura de la tesis:

**Variable dependiente:** *Cultivos agrícolas*

```
Cultivos agrícolas (variable dependiente)
│
├── Tablas de datos          ← catálogos técnicos (datos crudos)
│   ├── Productos            → tabla `productos`
│   └── Sensores             → `lecturas_sensor_suelo`, `sensores_iot_registry`
│
└── 4 Dimensiones            ← marco de investigación (indicadores + módulos)
    ├── Productividad
    │   └── Productos
    ├── Gestión de recursos
    │   ├── Productos / insumos
    │   └── Sensores de suelo
    ├── Predicción agrícola
    │   ├── Recomendaciones ML
    │   ├── Alertas climáticas
    │   └── Diagnósticos IA
    └── Toma de decisiones
        └── Indicadores de encuesta (escala 1–5)
```

### Matriz de operacionalización (12 indicadores)

| Dimensión | Indicador | Instrumento | Fuente en app |
|-----------|-----------|-------------|---------------|
| **Productividad** | Rendimiento de cultivos | Ficha de observación | Registro manual en parcela |
| | Incremento de producción | Registro | Comparación vs. línea base |
| | Calidad del cultivo | Observación | Evaluación visual |
| **Gestión de recursos** | Uso eficiente del agua | Medición | Sensores IoT |
| | Uso de fertilizantes | Medición | Productos / insumos |
| | Optimización de insumos | Análisis | Consumo vs. recomendación |
| **Predicción agrícola** | Precisión de predicción | Prueba | ML cultivos |
| | Anticipación climática | Registro | Clima y alertas |
| | Reducción de riesgos | Comparación | Alertas vs. histórico |
| **Toma de decisiones** | Rapidez de decisión | Encuesta | Autoevaluación 1–5 |
| | Precisión en decisiones | Encuesta | Autoevaluación 1–5 |
| | Confianza en decisiones | Encuesta | Autoevaluación 1–5 |

Definición en código (fuente única de verdad):

- App: `src/schema/operacionalizacion.ts`
- Web: `web-admin/src/lib/operacionalizacion.ts`
- Mapeo módulos ↔ dimensiones: `src/schema/dimensionModulos.ts` / `web-admin/src/lib/dimensionModulos.ts`

---

## Módulos del sistema

| Módulo | App móvil | Panel web | Tabla(s) Supabase |
|--------|-----------|-----------|-------------------|
| **Datos de campo** | Tab *Datos* | `/admin/tablas` (catálogo) | 109 tablas (`schema-tablas-campo.sql`) |
| **Productos** | Dimensión → Productos | `/admin/tablas/productos` | `productos` |
| **Sensores suelo** | Dimensión → Sensores | `/admin/tablas/sensores` | `lecturas_sensor_suelo`, `sensores_iot_registry` |
| **Dimensiones / tesis** | Tab *Dimensiones* | `/admin/dimension/[slug]` | `indicadores_operacionalizacion` |
| **Alertas clima** | Predicción → Clima | `/admin/alertas` | `alertas_climaticas` |
| **Recomendaciones ML** | Predicción → Cultivo | `/admin/recomendaciones` | `recomendaciones_cultivo` |
| **Diagnóstico planta** | Predicción → Planta IA | `/admin/diagnosticos` | `diagnosticos_ia` |
| **Usuarios app** | Perfil | `/admin/usuarios` | `profiles` + Supabase Auth |

### Navegación app móvil (tabs)

| Tab | Contenido |
|-----|-----------|
| **Inicio** | GPS, accesos rápidos a dimensiones, avance de campo |
| **Datos** | Registros GPS en tablas de campo dinámicas |
| **Dimensiones** | Hub con 4 dimensiones + acceso a Productos/Sensores |
| **Perfil** | Cuenta, estadísticas, diagnósticos IA |

Pantallas secundarias (stack): detalle de dimensión, productos, sensores, clima, cultivo, planta.

### Navegación panel web (sidebar)

```
Dashboard
Usuarios
Tablas de datos          ← padre
  ├── Productos
  └── Sensores
Productividad            ← dimensión
Gestión de recursos
Predicción agrícola
Toma de decisiones
Diagnósticos IA
```

---

## Stack tecnológico

| Capa | Tecnología |
|------|------------|
| App móvil | Expo 52, React Native, React Navigation, TypeScript |
| Panel web | Next.js 15 App Router, React Server Components, Bootstrap CSS custom |
| Base de datos | PostgreSQL 15 (Supabase) |
| Autenticación app | Supabase Auth (email/password) |
| Autenticación panel | JWT en cookie (`SESSION_SECRET`) |
| Storage | Supabase Storage (imágenes de productos) |
| Clima | Open-Meteo API |
| Visión / IA | Google Gemini (diagnóstico de planta) |
| ML cultivos | Modelo JSON local + reglas por altitud/mes |
| Deploy web | Vercel |
| Deploy móvil | APK release (`android/instalar-app.ps1`) |

---

## Configuración Supabase (orden SQL)

Ejecutar en **SQL Editor** de Supabase, en este orden:

1. `android/supabase/schema.sql` — esquema base (auth, profiles, productos)
2. `android/supabase/schema-tablas-campo.sql` — 109 tablas de campo
3. `android/supabase/schema-sensores-suelo.sql` — columnas IoT (humedad, pH, temperatura)
4. `android/supabase/schema-operacionalizacion.sql` — indicadores de tesis
5. `android/supabase/patch-productos-catalog-rls.sql` — catálogo visible para todos los usuarios

Los mismos scripts están en `web-admin/sql/` para el panel.

---

## App móvil (Android)

```powershell
copy android\.env.example android\.env
# EXPO_PUBLIC_SUPABASE_URL + EXPO_PUBLIC_SUPABASE_ANON_KEY (clave eyJ…, NO sb_publishable_…)

npm install
npm start          # Expo + emulador
# APK sin Metro (recomendado):
cd android
.\instalar-app.ps1
```

Detalle de compilación en **`android/README.md`**.

---

## Panel web

```powershell
cd web-admin
copy .env.example .env.local
# SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SESSION_SECRET, CRON_SECRET

npm install
npm run dev        # http://localhost:3000
npm run build
```

Deploy: Vercel → repo **AgroPachamarca-Web**. Detalle en **`web-admin/README.md`**.

---

## Estructura de carpetas

```
mobile/
├── App.tsx                 # Entry Expo
├── src/
│   ├── auth/               # AuthContext + Supabase session
│   ├── navigation/         # MainTabs, RootNavigator, types
│   ├── schema/
│   │   ├── operacionalizacion.ts   # Matriz tesis (12 indicadores)
│   │   └── dimensionModulos.ts     # Módulos por dimensión
│   ├── features/
│   │   ├── campo/          # Progreso y registros GPS
│   │   ├── sensores/       # Repositorio sensores IoT
│   │   └── operacionalizacion/
│   ├── screens/            # DimensionHub, DimensionDetail, Sensores, etc.
│   ├── services/           # sensoresSueloService, GPS, ML
│   └── types/
├── android/
│   ├── supabase/           # Scripts SQL (fuente de verdad BD)
│   ├── app/                # Proyecto Gradle/Kotlin
│   └── instalar-app.ps1    # Build + install APK
└── web-admin/              # Panel Next.js (repo Git separado)
    ├── src/app/admin/      # Rutas del panel
    ├── src/lib/            # operacionalizacion, dimensionModulos, queries
    └── sql/                # Copia de scripts Supabase
```

---

## Verificación

```powershell
# App móvil
npm run typecheck

# Panel web
cd web-admin
npm run build
```

---

## Repositorios y despliegue

| Artefacto | Repo | Deploy |
|-----------|------|--------|
| App Android | [AgroPachamarca-Mobil](https://github.com/Michelcc/AgroPachamarca-Mobil) | APK local / Play Store |
| Panel admin | [AgroPachamarca-Web](https://github.com/Michelcc/AgroPachamarca-Web) | Vercel |
| Base de datos | Supabase (proyecto único compartido) | supabase.com |
