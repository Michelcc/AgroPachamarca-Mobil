import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { CompositeNavigationProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProgressBar } from "../components/ProgressBar";
import { SectionCard } from "../components/SectionCard";
import { calcularProgreso } from "../features/campo/campoRepository";
import type { ProgresoCampo } from "../features/campo/campoRepository";
import type { MainTabParamList, RootStackParamList } from "../navigation/types";
import { DIMENSIONES_OPERACIONALIZACION } from "../schema/operacionalizacion";
import { useAuth } from "../auth/AuthContext";
import { captureGpsSnapshot } from "../utils/gpsService";
import { agro } from "../theme/agroTheme";

type HomeNav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

type AccesoRapido =
  | { kind: "tab"; tab: keyof MainTabParamList; emoji: string; titulo: string; color: string }
  | { kind: "dimension"; dimensionId: string; emoji: string; titulo: string; color: string };

const ACCESOS: AccesoRapido[] = [
  { kind: "tab", tab: "Datos", emoji: "📋", titulo: "Datos", color: agro.purple600 },
  { kind: "tab", tab: "Dimensiones", emoji: "📊", titulo: "Dimensiones", color: agro.green700 },
  ...DIMENSIONES_OPERACIONALIZACION.map((d, i) => ({
    kind: "dimension" as const,
    dimensionId: d.id,
    emoji: ["📈", "💧", "🌤️", "✅"][i] ?? "📊",
    titulo: d.nombre,
    color: [agro.green600, "#7c3aed", agro.sky600, agro.amber600][i] ?? agro.green600
  }))
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
  const navigation = useNavigation<HomeNav>();
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
            key={item.kind === "tab" ? item.tab : item.dimensionId}
            style={[styles.tile, { borderLeftColor: item.color }]}
            onPress={() => {
              if (item.kind === "tab") {
                navigation.navigate(item.tab);
              } else {
                navigation.navigate("DimensionDetail", { dimensionId: item.dimensionId });
              }
            }}
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

      <SectionCard badge="ESTADO DEL SUELO" title="Medición con sensores IoT">
        <Text style={styles.soilBody}>
          Registra humedad, pH, temperatura y conductividad del suelo con sensores en la parcela.
          Los datos se guardan en Supabase para seguimiento técnico.
        </Text>
        <Pressable
          style={styles.soilBtn}
          onPress={() => navigation.navigate("ModuloSensores")}
        >
          <Text style={styles.soilBtnText}>Ir a sensores de suelo →</Text>
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
