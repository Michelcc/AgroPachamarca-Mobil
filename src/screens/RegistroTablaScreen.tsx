import { useCallback, useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { GpsStatusBar } from "../components/GpsStatusBar";
import { insertRegistroCampo, listRegistrosPorTabla } from "../features/campo/campoRepository";
import type { RegistroCampo } from "../features/campo/campoRepository";
import { useGpsAutoFill } from "../hooks/useGpsAutoFill";
import { RootStackParamList } from "../navigation/types";
import { tableCategory, tableLabel } from "../schema/agroPostgresTables";

type Props = NativeStackScreenProps<RootStackParamList, "RegistroTabla">;

function tituloAutomatico(tabla: string, lat: string, lng: string): string {
  const fecha = new Date().toLocaleString("es-PE", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
  return `${tableLabel(tabla)} · ${fecha} · ${lat}, ${lng}`;
}

export function RegistroTablaScreen({ navigation, route }: Props) {
  const { tabla } = route.params;
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [altitud, setAltitud] = useState("");
  const [notas, setNotas] = useState("");
  const [historial, setHistorial] = useState<RegistroCampo[]>([]);
  const [guardando, setGuardando] = useState(false);

  const { loading, snapshot, refresh } = useGpsAutoFill({ setLat, setLng, setAltitud });

  const cargarHistorial = useCallback(async () => {
    const rows = await listRegistrosPorTabla(tabla, 5);
    setHistorial(rows);
  }, [tabla]);

  useEffect(() => {
    void cargarHistorial();
  }, [cargarHistorial]);

  const guardar = async () => {
    const latNum = Number(lat.replace(",", "."));
    const lngNum = Number(lng.replace(",", "."));
    if (Number.isNaN(latNum) || Number.isNaN(lngNum)) {
      Alert.alert("GPS", "Espera a que el GPS cargue o pulsa Actualizar.");
      return;
    }
    setGuardando(true);
    try {
      const titulo = tituloAutomatico(tabla, lat, lng);
      await insertRegistroCampo({
        tabla,
        lat: latNum,
        lng: lngNum,
        altitudMsnm: altitud ? Number(altitud.replace(",", ".")) : undefined,
        precisionM: snapshot?.accuracyM,
        titulo,
        notas: notas.trim() || undefined
      });
      await cargarHistorial();
      Alert.alert("Guardado", "Registro guardado en Supabase con GPS.");
      navigation.goBack();
    } finally {
      setGuardando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <GpsStatusBar loading={loading} snapshot={snapshot} onRefresh={() => void refresh()} />
      <Text style={styles.title}>{tableLabel(tabla)}</Text>
      <Text style={styles.meta}>
        {tableCategory(tabla)} · {tabla}
      </Text>
      <Text style={styles.hint}>
        El GPS rellena ubicación y altitud. Solo agrega notas si hace falta (opcional).
      </Text>

      <Text style={styles.label}>Ubicación (automático)</Text>
      <TextInput style={styles.input} value={lat} editable={false} placeholder="Latitud" />
      <TextInput style={styles.input} value={lng} editable={false} placeholder="Longitud" />
      <TextInput
        style={styles.input}
        value={altitud}
        onChangeText={setAltitud}
        placeholder="Altitud m s.n.m. (GPS)"
        keyboardType="decimal-pad"
      />

      <Text style={styles.label}>Notas (opcional)</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={notas}
        onChangeText={setNotas}
        placeholder="Ej. trampa #3 revisada, sin capturas…"
        multiline
      />

      <Pressable
        style={[styles.button, guardando && styles.buttonDisabled]}
        onPress={() => void guardar()}
        disabled={guardando}
      >
        <Text style={styles.buttonText}>
          {guardando ? "Guardando…" : "Guardar con GPS"}
        </Text>
      </Pressable>

      {historial.length > 0 ? (
        <>
          <Text style={styles.section}>Últimos en esta tabla</Text>
          {historial.map((h) => (
            <View key={h.id} style={styles.card}>
              <Text style={styles.cardTitle}>{h.titulo}</Text>
              <Text style={styles.cardMeta}>
                {h.lat.toFixed(5)}, {h.lng.toFixed(5)} ·{" "}
                {new Date(h.created_at).toLocaleString("es-PE")}
              </Text>
            </View>
          ))}
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 40 },
  title: { fontSize: 20, fontWeight: "800", color: "#14532d", paddingHorizontal: 16, marginTop: 12 },
  meta: { color: "#6b7280", fontSize: 12, paddingHorizontal: 16 },
  hint: { color: "#4b5563", paddingHorizontal: 16, marginTop: 8, lineHeight: 20 },
  label: { fontWeight: "700", paddingHorizontal: 16, marginTop: 12, color: "#374151" },
  input: {
    marginHorizontal: 16,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff"
  },
  multiline: { minHeight: 72, textAlignVertical: "top" },
  button: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#059669",
    padding: 14,
    borderRadius: 10,
    alignItems: "center"
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  section: { fontWeight: "800", paddingHorizontal: 16, marginTop: 20, color: "#111827" },
  card: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb"
  },
  cardTitle: { fontWeight: "600", fontSize: 13 },
  cardMeta: { fontSize: 11, color: "#6b7280", marginTop: 4 }
});
