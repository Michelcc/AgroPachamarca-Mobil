# Agro — Android

Abre **`C:\m\android`** en Android Studio (ruta corta). No uses `subst P:`: rompe Gradle/Expo en Windows.

## Qué hay en cada sitio

| Ubicación | Qué es |
|-----------|--------|
| `android/.env` | Claves Supabase |
| `android/supabase/schema.sql` | SQL para la base de datos |
| `android/app/` | Código nativo (Kotlin) |
| `../src/` | Pantallas Expo |

## 1. Supabase (una vez)

1. [supabase.com](https://supabase.com) → nuevo proyecto.
2. **Authentication** → Email activado.
3. **SQL Editor** → ejecutar en orden:
   - `supabase/schema.sql`
   - `supabase/schema-tablas-campo.sql` (crea las **109 tablas** visibles en Table Editor)
4. `copy .env.example .env` y pegar URL + anon key.

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

## 3. Compilar por terminal

```powershell
cd android
.\limpiar.ps1    # si falló antes o cambiaste de carpeta
.\iniciar.ps1
```

`iniciar.ps1` crea `C:\m`, limpia cachés `.cxx`/`build` y ejecuta `npx expo run:android`.

**Paquete Android:** `com.agro` (nombre corto para rutas de compilación).

## 4. Instalar app (sin Metro — obligatorio para evitar pantalla roja)

**No uses Run en Android Studio** para probar la app. Esa version pide Metro.

Telefono por USB con depuracion activada:

```powershell
cd android
.\instalar-app.ps1
```

Hace todo: compila APK con JS + Supabase dentro, desinstala la app vieja e instala **Agro**.

Archivo generado: `agro-release.apk` en la carpeta `mobile\`.

> Si ves "Unable to load script", desinstala Agro del telefono y vuelve a ejecutar `.\instalar-app.ps1`.
