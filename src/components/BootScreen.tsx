import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { BrandLogo } from "./BrandLogo";
import { agro } from "../theme/agroTheme";

export function BootScreen({ label = "Cargando Agro…" }: { label?: string }) {
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowSkip(true), 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.wrap}>
      <BrandLogo />
      <ActivityIndicator size="large" color={agro.green600} style={styles.spinner} />
      <Text style={styles.label}>{label}</Text>
      {showSkip ? (
        <Text style={styles.hint}>
          Si se queda aquí, revisa internet y la clave anon (eyJ…) en android/.env
        </Text>
      ) : null}
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
  label: { marginTop: 12, color: agro.gray600, fontWeight: "600" },
  hint: {
    marginTop: 16,
    color: agro.gray500,
    textAlign: "center",
    lineHeight: 20,
    fontSize: 13,
    maxWidth: 280
  }
});
