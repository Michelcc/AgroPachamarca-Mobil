import { StyleSheet, Text, View } from "react-native";
import { agro } from "../theme/agroTheme";

export type StatItem = {
  value: number | string;
  label: string;
  sublabel?: string;
};

type Props = { items: StatItem[] };

export function StatGrid({ items }: Props) {
  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <View key={item.label} style={styles.cell}>
          <Text style={styles.value}>{item.value}</Text>
          <Text style={styles.label}>{item.label}</Text>
          {item.sublabel ? <Text style={styles.sublabel}>{item.sublabel}</Text> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  cell: {
    width: "47%",
    backgroundColor: agro.green50,
    borderRadius: agro.radiusMd,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#bbf7d0",
    gap: 2
  },
  value: { fontSize: 28, fontWeight: "800", color: agro.green800 },
  label: { fontSize: 12, fontWeight: "700", color: agro.gray700, textAlign: "center" },
  sublabel: { fontSize: 10, color: agro.gray500, textAlign: "center" }
});
