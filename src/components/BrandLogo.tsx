import { StyleSheet, Text, View } from "react-native";
import { agro } from "../theme/agroTheme";

type Props = { compact?: boolean };

export function BrandLogo({ compact }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={[styles.leaf, compact && styles.leafCompact]}>🌿</Text>
      <Text style={[styles.brand, compact && styles.brandCompact]}>AGRO MODERN</Text>
      <Text style={[styles.system, compact && styles.systemCompact]}>SYSTEM</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", gap: 2, marginBottom: 8 },
  leaf: { fontSize: 48, marginBottom: 4 },
  leafCompact: { fontSize: 36, marginBottom: 2 },
  brand: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 4,
    color: agro.green900
  },
  brandCompact: { fontSize: 11, letterSpacing: 3 },
  system: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 4,
    color: agro.green600
  },
  systemCompact: { fontSize: 11, letterSpacing: 3 }
});
