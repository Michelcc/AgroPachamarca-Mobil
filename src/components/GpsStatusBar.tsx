import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import type { GpsSnapshot } from "../utils/gpsService";
import { agro } from "../theme/agroTheme";

type Props = {
  loading?: boolean;
  snapshot: GpsSnapshot | null;
  onRefresh: () => void;
  variant?: "default" | "ubicacion";
};

export function GpsStatusBar({ loading, snapshot, onRefresh, variant = "default" }: Props) {
  const isUbicacion = variant === "ubicacion";

  return (
    <View style={[styles.bar, isUbicacion && styles.barUbicacion]}>
      <Text style={styles.icon}>📍</Text>
      <View style={styles.textWrap}>
        {isUbicacion ? (
          <Text style={styles.badge}>UBICACIÓN ACTUAL</Text>
        ) : null}
        {loading ? (
          <ActivityIndicator size="small" color={agro.green800} />
        ) : snapshot ? (
          <Text style={styles.coords} numberOfLines={2}>
            {isUbicacion ? "Localizado vía GPS" : "GPS listo"} · {snapshot.lat.toFixed(5)},{" "}
            {snapshot.lng.toFixed(5)}
            {snapshot.altitudMsnm != null ? ` · ${Math.round(snapshot.altitudMsnm)} m` : ""}
          </Text>
        ) : (
          <Text style={styles.coords}>Sin GPS — pulsa actualizar</Text>
        )}
      </View>
      <Pressable style={styles.btn} onPress={onRefresh} disabled={loading}>
        <Text style={styles.btnText}>Actualizar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: agro.green50,
    borderBottomWidth: 1,
    borderBottomColor: "#bbf7d0",
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  barUbicacion: { backgroundColor: agro.white, borderBottomColor: agro.gray200 },
  icon: { fontSize: 20 },
  textWrap: { flex: 1, gap: 2 },
  badge: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    color: agro.green700
  },
  coords: { fontSize: 12, color: agro.green900, fontWeight: "600" },
  btn: {
    backgroundColor: agro.green600,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: agro.radiusSm
  },
  btnText: { color: agro.white, fontWeight: "700", fontSize: 12 }
});
