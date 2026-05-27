import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProgressBar } from "../components/ProgressBar";
import { SectionCard } from "../components/SectionCard";
import { calcularProgreso } from "../features/campo/campoRepository";
import type { ProgresoCampo } from "../features/campo/campoRepository";
import type { MainTabParamList } from "../navigation/types";
import { useAuth } from "../auth/AuthContext";
import { captureGpsSnapshot } from "../utils/gpsService";
import { agro } from "../theme/agroTheme";

type AccesoRapido = {
  tab: keyof MainTabParamList;
  emoji: string;
  titulo: string;
  color: string;
};

const ACCESOS: AccesoRapido[] = [
  { tab: "Datos", emoji: "📋", titulo: "Datos", color: agro.purple600 },
  { tab: "Clima", emoji: "☁️", titulo: "Clima", color: agro.sky600 },
  { tab: "Cultivo", emoji: "🌾", titulo: "Cultivo", color: agro.green600 },
  { tab: "Planta", emoji: "🔬", titulo: "Mi planta", color: agro.amber600 },
  { tab: "Productos", emoji: "📦", titulo: "Productos", color: agro.red600 }
];

const CATEGORIA_COLORS: Record<string, string> = {
  Sistema: agro.purple600,
  "Calidad ISO": agro.sky600,
  Comercial: agro.amber600,
  Terreno: agro.green600,
  Clima: agro.blue500,
  Cultivo: agro.green700
};

export function HomeScreen() {
  const { currentUser } = useAuth();
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const insets = useSafeAreaInsets();
  const [progreso, setProgreso] = useState<ProgresoCampo | null>(null);
  const [gpsLine, setGpsLine] = useState("Obteniendo GPS…");
  const [gpsOk, setGpsOk] = useState(false);

  const recargar = useCallback(async () => {
    try {
      const p = await calcularProgreso();
      setProgreso(p);
    } catch {
      setProgreso(null);
    }
    const snap = await captureGpsSnapshot(true);
    if (snap) {
      setGpsLine(`${snap.lat.toFixed(4)}, ${snap.lng.toFixed(4)}`);
      setGpsOk(true);
    } else {
      setGpsLine("GPS no disponible (revisa permisos)");
      setGpsOk(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void recargar();
    }, [recargar])
  );

  const categoriasAvance = progreso?.porCategoria
    .filter((c) => ["Sistema", "Calidad ISO", "Comercial", "Terreno"].includes(c.categoria))
    .slice(0, 4) ?? [];

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 12 }]}
    >
      <View style={styles.hero}>
        <Text style={styles.brand}>Agro</Text>
        <Text style={styles.tagline}>Campo, clima y cultivo con GPS automático</Text>
        {currentUser ? (
          <Text style={styles.greeting}>Hola, {currentUser}</Text>
        ) : null}
      </View>

      <SectionCard badge="TU UBICACIÓN AHORA" title={gpsOk ? "Localizado vía GPS" : "Obteniendo GPS…"}>
        <Text style={styles.gpsCoords}>{gpsLine}</Text>
        <Text style={styles.gpsHint}>Se usa en Clima, Cultivo y registros de campo</Text>
        <Pressable style={styles.refreshBtn} onPress={() => void recargar()}>
          <Text style={styles.refreshBtnText}>Actualizar</Text>
        </Pressable>
      </SectionCard>

      <Text style={styles.sectionTitle}>Accesos rápidos</Text>
      <View style={styles.grid}>
        {ACCESOS.map((item) => (
          <Pressable
            key={item.tab}
            style={[styles.tile, { borderLeftColor: item.color }]}
            onPress={() => navigation.navigate(item.tab)}
          >
            <Text style={styles.tileEmoji}>{item.emoji}</Text>
            <Text style={[styles.tileLabel, { color: item.color }]}>{item.titulo}</Text>
          </Pressable>
        ))}
      </View>

      {progreso ? (
        <SectionCard
          badge="TU AVANCE EN CAMPO"
          title="Detalle mensual"
          subtitle={`${progreso.tablasConRegistro} módulos · ${progreso.totalRegistros} registros`}
        >
          <ProgressBar
            label="Registros GPS"
            porcentaje={progreso.porcentajeGlobal}
            detail={`${progreso.tablasConRegistro} MÓDULOS · ${progreso.totalRegistros} REGISTROS`}
            color={agro.purple600}
          />
          {categoriasAvance.map((c) => (
            <ProgressBar
              key={c.categoria}
              label={c.categoria}
              porcentaje={c.porcentaje}
              detail={`${c.conRegistro}/${c.total} VERIFICADOS`}
              color={CATEGORIA_COLORS[c.categoria] ?? agro.green600}
            />
          ))}
          <Pressable
            style={styles.detalleLink}
            onPress={() => navigation.navigate("Datos")}
          >
            <Text style={styles.detalleLinkText}>Ver detalle mensual →</Text>
          </Pressable>
        </SectionCard>
      ) : null}

      <SectionCard badge="ESTADO DEL SUELO" title="Humedad óptima para siembra">
        <Text style={styles.soilBody}>
          Condiciones favorables según tu ubicación GPS y el mes actual. Consulta Cultivo para
          recomendaciones detalladas.
        </Text>
        <Pressable
          style={styles.soilBtn}
          onPress={() => navigation.navigate("Cultivo")}
        >
          <Text style={styles.soilBtnText}>Ver recomendación de cultivo</Text>
        </Pressable>
      </SectionCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: agro.gray50 },
  container: { padding: 16, gap: 14, paddingBottom: 40 },
  hero: { gap: 4, marginBottom: 4 },
  brand: { fontSize: 30, fontWeight: "800", color: agro.green900 },
  tagline: { color: agro.gray600, lineHeight: 20, fontSize: 14 },
  greeting: { color: agro.green700, fontWeight: "800", fontSize: 16, marginTop: 4 },
  sectionTitle: { fontSize: 15, fontWeight: "800", color: agro.gray700, marginTop: 4 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tile: {
    width: "31%",
    minWidth: 100,
    backgroundColor: agro.white,
    borderRadius: agro.radiusMd,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: "center",
    borderLeftWidth: 4,
    gap: 6,
    ...agro.shadow
  },
  tileEmoji: { fontSize: 28 },
  tileLabel: { fontSize: 12, fontWeight: "800", textAlign: "center" },
  gpsCoords: { fontSize: 15, fontWeight: "700", color: agro.green900 },
  gpsHint: { fontSize: 12, color: agro.gray500 },
  refreshBtn: {
    alignSelf: "flex-start",
    backgroundColor: agro.green600,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: agro.radiusSm,
    marginTop: 4
  },
  refreshBtnText: { color: agro.white, fontWeight: "700", fontSize: 13 },
  detalleLink: { marginTop: 4 },
  detalleLinkText: { color: agro.green700, fontWeight: "700", fontSize: 13 },
  soilBody: { color: agro.gray600, lineHeight: 20, fontSize: 14 },
  soilBtn: {
    backgroundColor: agro.green50,
    borderWidth: 1,
    borderColor: "#bbf7d0",
    padding: 12,
    borderRadius: agro.radiusSm,
    alignItems: "center"
  },
  soilBtnText: { color: agro.green800, fontWeight: "700" }
});
