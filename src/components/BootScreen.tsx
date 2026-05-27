import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { BrandLogo } from "./BrandLogo";
import { agro } from "../theme/agroTheme";

export function BootScreen({ label = "Cargando Agro…" }: { label?: string }) {
  return (
    <View style={styles.wrap}>
      <BrandLogo />
      <ActivityIndicator size="large" color={agro.green600} style={styles.spinner} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: agro.gray50,
    padding: 24
  },
  spinner: { marginTop: 24 },
  label: { marginTop: 12, color: agro.gray600, fontWeight: "600" }
});
