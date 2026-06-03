const fs = require("fs");
const path = require("path");

function loadEnv() {
  const envPath = path.join(__dirname, "android", ".env");
  const env = {};
  if (!fs.existsSync(envPath)) return env;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([^#][^=]+)=(.*)$/);
    if (!m) continue;
    const key = m[1].trim();
    const value = m[2].trim();
    env[key] = value;
    if (key.startsWith("EXPO_PUBLIC_")) {
      process.env[key] = value;
    }
  }
  return env;
}

const env = loadEnv();

module.exports = {
  expo: {
    name: "Agro",
    slug: "agro",
    version: "0.1.0",
    orientation: "portrait",
    scheme: "agro",
    userInterfaceStyle: "light",
    newArchEnabled: false,
    splash: {
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    android: {
      package: "com.agro"
    },
    plugins: [
      [
        "expo-location",
        {
          locationWhenInUsePermission:
            "Usamos tu ubicación para clima, cultivos y registros de campo con GPS."
        }
      ],
      [
        "expo-image-picker",
        {
          photosPermission:
            "La app accede a tus fotos para analizar la planta y mostrarte consejos.",
          cameraPermission:
            "La app usa la cámara para fotografiar la planta y orientarte."
        }
      ]
    ],
    extra: {
      supabaseUrl: env.EXPO_PUBLIC_SUPABASE_URL ?? "",
      supabaseAnonKey: env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "",
      geminiApiKey: env.EXPO_PUBLIC_GEMINI_API_KEY ?? ""
    }
  }
};
