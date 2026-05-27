import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AgroButton } from "../components/AgroButton";
import { GpsStatusBar } from "../components/GpsStatusBar";
import { SectionCard } from "../components/SectionCard";
import { analizarFotoPlantaDemo, type DiagnosticoPlantaResult } from "../features/planta/diagnosticoLocal";
import {
  diagnosticarPlantaApi,
  listarMisDiagnosticos,
  type HistorialDiagnostico
} from "../features/planta/plantaApi";
import { useGpsAutoFill } from "../hooks/useGpsAutoFill";
import { agro } from "../theme/agroTheme";

async function ensureLibraryPermission(): Promise<boolean> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permiso", "Necesitamos acceso a la galería.");
    return false;
  }
  return true;
}

async function ensureCameraPermission(): Promise<boolean> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permiso", "Necesitamos la cámara.");
    return false;
  }
  return true;
}

export function PlantaDiagnosticoScreen() {
  const [uri, setUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<DiagnosticoPlantaResult | null>(null);
  const [historial, setHistorial] = useState<HistorialDiagnostico[]>([]);
  const [modo, setModo] = useState<"gemini" | "local">("gemini");

  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const { loading: gpsLoading, snapshot, refresh } = useGpsAutoFill({ setLat, setLng });

  const cargarHistorial = useCallback(async () => {
    try {
      const items = await listarMisDiagnosticos(8);
      setHistorial(items);
    } catch {
      setHistorial([]);
    }
  }, []);

  useEffect(() => {
    void cargarHistorial();
  }, [cargarHistorial]);

  const pickFromGallery = useCallback(async () => {
    const ok = await ensureLibraryPermission();
    if (!ok) return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.85,
      aspect: [4, 3]
    });
    if (res.canceled || !res.assets?.[0]?.uri) return;
    setUri(res.assets[0].uri);
    setResultado(null);
  }, []);

  const takePhoto = useCallback(async () => {
    const ok = await ensureCameraPermission();
    if (!ok) return;
    const res = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.85,
      aspect: [4, 3]
    });
    if (res.canceled || !res.assets?.[0]?.uri) return;
    setUri(res.assets[0].uri);
    setResultado(null);
  }, []);

  const analizar = useCallback(() => {
    if (!uri) {
      Alert.alert("Foto", "Elige o toma una foto primero.");
      return;
    }
    setLoading(true);
    setResultado(null);
    const notasGps =
      lat && lng ? `GPS parcela: ${lat}, ${lng}` : snapshot ? `GPS: ${snapshot.lat}, ${snapshot.lng}` : undefined;

    Image.getSize(
      uri,
      (width, height) => {
        void (async () => {
          try {
            const { result } = await diagnosticarPlantaApi({
              ancho: width,
              alto: height,
              imagenUri: uri,
              notas: notasGps
            });
            setResultado(result);
            setModo("gemini");
            await cargarHistorial();
          } catch {
            setResultado(analizarFotoPlantaDemo({ ancho: width, alto: height }));
            setModo("local");
            Alert.alert(
              "Sin conexión",
              "Se usó análisis local. Revisa internet y EXPO_PUBLIC_GEMINI_API_KEY en android/.env"
            );
          } finally {
            setLoading(false);
          }
        })();
      },
      () => {
        void (async () => {
          try {
            const { result } = await diagnosticarPlantaApi({
              ancho: 1200,
              alto: 900,
              imagenUri: uri,
              notas: notasGps
            });
            setResultado(result);
            setModo("gemini");
          } catch {
            setResultado(analizarFotoPlantaDemo({ ancho: 1200, alto: 900 }));
            setModo("local");
          } finally {
            setLoading(false);
          }
        })();
      }
    );
  }, [uri, lat, lng, snapshot, cargarHistorial]);

  const limpiar = () => {
    setUri(null);
    setResultado(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <GpsStatusBar loading={gpsLoading} snapshot={snapshot} onRefresh={() => void refresh()} />

      <View style={styles.header}>
        <Text style={styles.title}>Mi planta — IA</Text>
        <Text style={styles.sub}>
          Potencia tu diagnóstico agrícola con Gemini IA. Sube una foto con metadatos GPS para un
          análisis preciso del cultivo y guarda el historial en tu cuenta.
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.btnGallery} onPress={() => void pickFromGallery()}>
          <Text style={styles.btnGalleryText}>Galería</Text>
        </Pressable>
        <Pressable style={styles.btnCamera} onPress={() => void takePhoto()}>
          <Text style={styles.btnCameraText}>Cámara</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionBadge}>VISOR DE ANÁLISIS</Text>

      {uri ? (
        <View style={styles.previewWrap}>
          <Image source={{ uri }} style={styles.preview} resizeMode="cover" />
          <AgroButton
            label={loading ? "Procesando…" : "Analizar con Gemini IA + GPS"}
            loading={loading}
            onPress={analizar}
            style={styles.analyzeBtn}
          />
          <Pressable style={styles.link} onPress={limpiar}>
            <Text style={styles.linkText}>Quitar foto</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderIcon}>🖼️</Text>
          <Text style={styles.placeholderTitle}>Vista previa de la foto</Text>
          <Text style={styles.placeholderSub}>
            Usa Galería o Cámara para capturar el cultivo
          </Text>
        </View>
      )}

      {!resultado && !uri ? (
        <SectionCard badge="DIAGNÓSTICO INTELIGENTE" title="Gemini IA en acción">
          <Text style={styles.smartBody}>
            Gemini IA identificará automáticamente especies, deficiencias nutricionales o plagas en
            milisegundos una vez procesada la captura.
          </Text>
        </SectionCard>
      ) : null}

      {resultado ? (
        <SectionCard
          badge={modo === "gemini" ? "GEMINI + SUPABASE" : "MODO LOCAL"}
          title={resultado.titulo}
        >
          <View style={[styles.badge, badgeStyle(resultado.severidad)]}>
            <Text style={styles.badgeText}>Gravedad: {severidadLabel(resultado.severidad)}</Text>
          </View>
          <Text style={styles.body}>{resultado.resumen}</Text>
          <Text style={styles.label}>Posible causa</Text>
          <Text style={styles.body}>{resultado.posible_problema}</Text>
          <Text style={styles.label}>Cómo mejorar</Text>
          {resultado.como_mejorar.map((t, i) => (
            <Text key={i} style={styles.bullet}>
              • {t}
            </Text>
          ))}
          <Text style={styles.label}>Prevención</Text>
          {resultado.prevencion.map((t, i) => (
            <Text key={i} style={styles.bullet}>
              • {t}
            </Text>
          ))}
          <View style={styles.avisoBox}>
            <Text style={styles.aviso}>{resultado.aviso}</Text>
          </View>
        </SectionCard>
      ) : null}

      {historial.length > 0 ? (
        <>
          <Text style={styles.histTitle}>Mis diagnósticos guardados</Text>
          {historial.map((h) => (
            <View key={h.id} style={styles.histCard}>
              <Text style={styles.bold}>
                #{h.id} · {h.severidad} · {h.modelo}
              </Text>
              <Text style={styles.body} numberOfLines={3}>
                {h.resumen}
              </Text>
              <Text style={styles.small}>{h.created_at ?? ""}</Text>
            </View>
          ))}
        </>
      ) : null}
    </ScrollView>
  );
}

function severidadLabel(s: DiagnosticoPlantaResult["severidad"]): string {
  if (s === "baja") return "baja";
  if (s === "media") return "media";
  return "alta";
}

function badgeStyle(s: DiagnosticoPlantaResult["severidad"]) {
  if (s === "baja") return { backgroundColor: agro.green100 };
  if (s === "media") return { backgroundColor: "#fef9c3" };
  return { backgroundColor: "#fee2e2" };
}

const styles = StyleSheet.create({
  container: { paddingBottom: 40, backgroundColor: agro.gray50 },
  header: { paddingHorizontal: 16, marginTop: 8, gap: 8 },
  title: { fontSize: 22, fontWeight: "800", color: agro.green900 },
  sub: { color: agro.gray600, lineHeight: 22, fontSize: 14 },
  actions: { flexDirection: "row", gap: 10, paddingHorizontal: 16, marginTop: 12 },
  btnGallery: {
    flex: 1,
    backgroundColor: agro.green600,
    paddingVertical: 12,
    borderRadius: agro.radiusMd,
    alignItems: "center"
  },
  btnGalleryText: { color: agro.white, fontWeight: "700" },
  btnCamera: {
    flex: 1,
    borderWidth: 2,
    borderColor: agro.green600,
    paddingVertical: 10,
    borderRadius: agro.radiusMd,
    alignItems: "center",
    backgroundColor: agro.white
  },
  btnCameraText: { color: agro.green700, fontWeight: "700" },
  sectionBadge: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: agro.green700,
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8
  },
  previewWrap: { gap: 10, paddingHorizontal: 16 },
  preview: { width: "100%", height: 220, borderRadius: agro.radiusMd, backgroundColor: agro.gray200 },
  analyzeBtn: { marginTop: 4 },
  link: { alignSelf: "center", padding: 6 },
  linkText: { color: agro.blue600, fontWeight: "600" },
  placeholder: {
    marginHorizontal: 16,
    height: 180,
    borderRadius: agro.radiusMd,
    borderWidth: 2,
    borderColor: agro.gray200,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: agro.white,
    gap: 6
  },
  placeholderIcon: { fontSize: 40 },
  placeholderTitle: { fontWeight: "700", color: agro.gray700 },
  placeholderSub: { fontSize: 12, color: agro.gray500 },
  smartBody: { color: agro.gray600, lineHeight: 22, fontSize: 14 },
  badge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontWeight: "700", color: agro.gray700, fontSize: 12 },
  label: { fontWeight: "800", color: agro.green800, marginTop: 4 },
  body: { color: agro.gray700, lineHeight: 22 },
  bullet: { color: agro.gray900, lineHeight: 22, paddingLeft: 4 },
  avisoBox: { marginTop: 8, padding: 10, backgroundColor: "#fef3c7", borderRadius: 8 },
  aviso: { color: "#92400e", fontSize: 12, lineHeight: 18 },
  histTitle: { fontWeight: "800", paddingHorizontal: 16, marginTop: 16, fontSize: 16, color: agro.gray900 },
  histCard: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 12,
    backgroundColor: agro.white,
    borderRadius: agro.radiusMd,
    borderWidth: 1,
    borderColor: agro.gray200
  },
  bold: { fontWeight: "700" },
  small: { fontSize: 11, color: agro.gray400, marginTop: 4 }
});
