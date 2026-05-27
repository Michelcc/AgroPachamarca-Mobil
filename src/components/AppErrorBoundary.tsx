import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { agro } from "../theme/agroTheme";

type Props = { error: Error; reset: () => void };

export class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorPanel
          error={this.state.error}
          reset={() => this.setState({ error: null })}
        />
      );
    }
    return this.props.children;
  }
}

function ErrorPanel({ error, reset }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.emoji}>⚠️</Text>
      <Text style={styles.title}>La app no pudo iniciar</Text>
      <Text style={styles.msg}>{error.message || "Error desconocido"}</Text>
      <Text style={styles.hint}>
        Si usas el emulador con Android Studio, ejecuta primero{" "}
        <Text style={styles.code}>npm start</Text> en la carpeta del proyecto y luego abre la app.
      </Text>
      <Pressable style={styles.btn} onPress={reset}>
        <Text style={styles.btnText}>Reintentar</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: agro.gray50
  },
  emoji: { fontSize: 40, textAlign: "center", marginBottom: 12 },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: agro.green900,
    textAlign: "center",
    marginBottom: 8
  },
  msg: {
    color: "#b91c1c",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 22
  },
  hint: { color: agro.gray600, textAlign: "center", lineHeight: 22, marginBottom: 20 },
  code: { fontWeight: "800", color: agro.green800 },
  btn: {
    backgroundColor: agro.green600,
    padding: 14,
    borderRadius: agro.radiusMd,
    alignItems: "center"
  },
  btnText: { color: agro.white, fontWeight: "700" }
});
