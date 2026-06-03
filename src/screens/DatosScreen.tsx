import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProgressBar } from "../components/ProgressBar";
import { SectionCard } from "../components/SectionCard";
import { calcularProgreso, tablasConRegistro } from "../features/campo/campoRepository";
import type { ProgresoCampo } from "../features/campo/campoRepository";
import type { AppStackParamList } from "../navigation/types";
import {
  AGRO_POSTGRES_TABLES,
  TABLE_COUNT,
  assertThesisMinimum,
  tableCategory,
  tableLabel,
  type TableCategory
} from "../schema/agroPostgresTables";
import { agro } from "../theme/agroTheme";

const CATEGORIAS_FILTRO: Array<TableCategory | "Todas"> = [
  "Todas",
  "Terreno",
  "Clima",
  "Cultivo"
];

export function DatosScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState<TableCategory | "Todas">("Todas");
  const [progreso, setProgreso] = useState<ProgresoCampo | null>(null);
  const [conRegistro, setConRegistro] = useState<Set<string>>(new Set());
  const [loadError, setLoadError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    try {
      setLoadError(null);
      const [p, t] = await Promise.all([calcularProgreso(), tablasConRegistro()]);
      setProgreso(p);
      setConRegistro(t);
    } catch (e) {
      setProgreso(null);
      setConRegistro(new Set());
      setLoadError(e instanceof Error ? e.message : "No se pudieron cargar los datos");
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void recargar();
    }, [recargar])
  );

  const tablasFiltradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return AGRO_POSTGRES_TABLES.filter((t) => {
      if (categoria !== "Todas" && tableCategory(t) !== categoria) return false;
      if (!q) return true;
      return t.includes(q) || tableLabel(t).toLowerCase().includes(q);
    });
  }, [busqueda, categoria]);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Datos de campo</Text>
        <Text style={styles.sub}>
          {TABLE_COUNT} tablas PostgreSQL · tesis {assertThesisMinimum() ? "≥110 ✓" : "<110"}
        </Text>

        <SectionCard badge="MAPA DE LOTES" title="Visualización en tiempo real">
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapIcon}>🗺️</Text>
            <Text style={styles.mapHint}>Estado de sanidad por sector</Text>
          </View>
          <View style={styles.loteRow}>
            <View style={styles.loteDot} />
            <Text style={styles.loteName}>Sector A-12</Text>
            <View style={styles.loteBadge}>
              <Text style={styles.loteBadgeText}>Saludable</Text>
            </View>
          </View>
        </SectionCard>

        {progreso ? (
          <ProgressBar
            label="Cobertura del catálogo"
            porcentaje={progreso.porcentajeGlobal}
            detail={`${progreso.tablasConRegistro} de ${progreso.totalTablas} tablas · ${progreso.totalRegistros} registros`}
            color={agro.purple600}
          />
        ) : loadError ? (
          <Text style={styles.loadError}>{loadError}</Text>
        ) : null}

        <TextInput
          style={styles.search}
          placeholder="Buscar tabla..."
          placeholderTextColor={agro.gray400}
          value={busqueda}
          onChangeText={setBusqueda}
        />
        <FlatList
          horizontal
          data={CATEGORIAS_FILTRO}
          keyExtractor={(c) => c}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.chip, categoria === item && styles.chipActive]}
              onPress={() => setCategoria(item)}
            >
              <Text style={[styles.chipText, categoria === item && styles.chipTextActive]}>
                {item}
              </Text>
            </Pressable>
          )}
        />
      </View>
      <FlatList
        data={tablasFiltradas}
        keyExtractor={(t) => t}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const ok = conRegistro.has(item);
          return (
            <Pressable
              style={styles.row}
              onPress={() => navigation.navigate("RegistroTabla", { tabla: item })}
            >
              <View style={styles.rowMain}>
                <Text style={styles.rowTitle}>{tableLabel(item)}</Text>
                <Text style={styles.rowMeta}>
                  {tableCategory(item)} · {item}
                </Text>
              </View>
              <View style={[styles.badge, ok ? styles.badgeOk : styles.badgePending]}>
                <Text style={styles.badgeText}>{ok ? "✓" : "+"}</Text>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>Sin coincidencias</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: agro.gray50 },
  header: { padding: 16, gap: 10, backgroundColor: agro.white, borderBottomWidth: 1, borderColor: agro.gray200 },
  title: { fontSize: 22, fontWeight: "800", color: agro.green900 },
  sub: { color: agro.gray500, fontSize: 13 },
  loadError: { color: "#b91c1c", fontSize: 13, lineHeight: 18 },
  mapPlaceholder: {
    height: 80,
    backgroundColor: agro.green50,
    borderRadius: agro.radiusSm,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#bbf7d0"
  },
  mapIcon: { fontSize: 28 },
  mapHint: { fontSize: 11, color: agro.gray500, fontWeight: "600" },
  loteRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4
  },
  loteDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: agro.green500
  },
  loteName: { flex: 1, fontWeight: "700", color: agro.gray900 },
  loteBadge: {
    backgroundColor: agro.green100,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  loteBadgeText: { fontSize: 12, fontWeight: "700", color: agro.green800 },
  search: {
    borderWidth: 1,
    borderColor: agro.gray200,
    borderRadius: agro.radiusMd,
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: agro.white,
    fontSize: 15
  },
  chips: { gap: 8, paddingVertical: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: agro.gray100,
    marginRight: 8
  },
  chipActive: { backgroundColor: agro.green600 },
  chipText: { fontSize: 12, fontWeight: "700", color: agro.gray700 },
  chipTextActive: { color: agro.white },
  list: { padding: 12, paddingBottom: 40 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: agro.white,
    borderRadius: agro.radiusMd,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: agro.gray200
  },
  rowMain: { flex: 1, gap: 2 },
  rowTitle: { fontWeight: "700", color: agro.gray900, fontSize: 15 },
  rowMeta: { fontSize: 11, color: agro.gray500 },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center"
  },
  badgeOk: { backgroundColor: agro.green100 },
  badgePending: { backgroundColor: "#ede9fe" },
  badgeText: { fontWeight: "800", fontSize: 16 },
  empty: { textAlign: "center", color: agro.gray400, marginTop: 24 }
});
