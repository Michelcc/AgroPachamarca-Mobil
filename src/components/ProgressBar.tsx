import { StyleSheet, Text, View } from "react-native";

type Props = {
  label: string;
  porcentaje: number;
  detail?: string;
  color?: string;
};

export function ProgressBar({ label, porcentaje, detail, color = "#059669" }: Props) {
  const pct = Math.min(100, Math.max(0, porcentaje));
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.pct}>{pct.toFixed(1)} %</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
      {detail ? <Text style={styles.detail}>{detail}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label: { fontWeight: "700", color: "#111827", flex: 1 },
  pct: { fontWeight: "800", color: "#059669", fontSize: 15 },
  track: {
    height: 10,
    backgroundColor: "#e5e7eb",
    borderRadius: 6,
    overflow: "hidden"
  },
  fill: { height: "100%", borderRadius: 6 },
  detail: { fontSize: 12, color: "#6b7280" }
});
