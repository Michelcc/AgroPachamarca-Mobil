import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SectionCard } from "../components/SectionCard";
import { DIMENSIONES_OPERACIONALIZACION, VARIABLE_DEPENDIENTE } from "../schema/operacionalizacion";
import { useAppNavigation } from "../navigation/useAppNavigation";
import { agro } from "../theme/agroTheme";

export function DimensionHubScreen() {
  const navigation = useAppNavigation();

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.badge}>VARIABLE DEPENDIENTE</Text>
        <Text style={styles.title}>{VARIABLE_DEPENDIENTE}</Text>
        <Text style={styles.hint}>
          Selecciona una dimensión para ver indicadores y módulos de datos.
        </Text>
      </View>

      <View style={styles.listCard}>
        {DIMENSIONES_OPERACIONALIZACION.map((dim, index) => (
          <Pressable
            key={dim.id}
            style={[styles.row, index > 0 && styles.rowBorder]}
            onPress={() => navigation.navigate("DimensionDetail", { dimensionId: dim.id })}
          >
            <Text style={styles.rowLabel}>{dim.nombre}</Text>
            <Text style={styles.rowChevron}>›</Text>
          </Pressable>
        ))}
      </View>

      <SectionCard
        badge="TABLAS DE DATOS"
        title="Productos y sensores"
        subtitle="Acceso directo a catálogos técnicos"
      >
        <Pressable
          style={styles.linkRow}
          onPress={() => navigation.navigate("ModuloProductos")}
        >
          <Text style={styles.linkEmoji}>📦</Text>
          <Text style={styles.linkText}>Productos</Text>
        </Pressable>
        <Pressable
          style={styles.linkRow}
          onPress={() => navigation.navigate("ModuloSensores")}
        >
          <Text style={styles.linkEmoji}>📡</Text>
          <Text style={styles.linkText}>Sensores</Text>
        </Pressable>
      </SectionCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: agro.gray50 },
  container: { padding: 16, paddingBottom: 32, gap: 16 },
  header: { gap: 4 },
  badge: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    color: agro.purple600
  },
  title: { fontSize: 22, fontWeight: "800", color: agro.green900 },
  hint: { fontSize: 13, color: agro.gray600, lineHeight: 20 },
  listCard: {
    backgroundColor: agro.white,
    borderRadius: agro.radiusMd,
    overflow: "hidden",
    ...agro.shadow
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 16
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: agro.gray200
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: agro.gray900
  },
  rowChevron: {
    fontSize: 22,
    color: agro.gray400,
    fontWeight: "300"
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: agro.gray200,
    marginTop: 8
  },
  linkEmoji: { fontSize: 20 },
  linkText: { fontSize: 15, fontWeight: "700", color: agro.green800 }
});
