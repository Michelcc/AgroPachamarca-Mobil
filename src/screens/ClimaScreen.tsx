import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { GpsStatusBar } from "../components/GpsStatusBar";
import { SectionCard } from "../components/SectionCard";
import { EmptyState } from "../components/EmptyState";
import { listAlertasClimaticasGlobales } from "../features/alertas/alertasClimaticasRepository";
import { guardarEvaluacionAlerta, listarAlertasRecientes } from "../services/alertasLocal";
import { fetchPronostico7Dias } from "../services/openMeteo";
import { ProgressBar } from "../components/ProgressBar";
import { insertProducto } from "../features/productos/productosRepository";
import { sugeridosPorAlertas } from "../features/productos/productosCatalogo";
import { useGpsAutoFill } from "../hooks/useGpsAutoFill";
import { PronosticoResponse } from "../types/models";
import { agro } from "../theme/agroTheme";

function probLluviaPct(prob: number): number {
  const p = prob <= 1 && prob >= 0 ? prob * 100 : prob;
  return Math.min(100, Math.max(0, p));
}

export function ClimaScreen() {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PronosticoResponse | null>(null);
  const [alertas, setAlertas] = useState<
    Array<{
      ts?: number;
      nivel?: string;
      modelo?: string;
      alertas?: Array<{ mensaje?: string }>;
    }>
  >([]);
  const [alertasPanel, setAlertasPanel] = useState<
    Awaited<ReturnType<typeof listAlertasClimaticasGlobales>>
  >([]);

  const [altitud, setAltitud] = useState("");
  const { loading: gpsLoading, snapshot, refresh } = useGpsAutoFill({ setLat, setLng, setAltitud });

  const fetchAlertas = useCallback(async () => {
    try {
      setAlertas(await listarAlertasRecientes());
    } catch {
      setAlertas([]);
    }
    try {
      setAlertasPanel(await listAlertasClimaticasGlobales());
    } catch {
      setAlertasPanel([]);
    }
  }, []);

  useEffect(() => {
    void fetchAlertas();
  }, [fetchAlertas]);

  const aplicarCoordenadas = async () => {
    const la = parseFloat(lat.replace(",", "."));
    const ln = parseFloat(lng.replace(",", "."));
    if (Number.isNaN(la) || Number.isNaN(ln)) {
      Alert.alert("GPS", "Espera la ubicación automática o pulsa Actualizar.");
      return;
    }
    try {
      setLoading(true);
      setData(await fetchPronostico7Dias(la, ln));
      await fetchAlertas();
    } finally {
      setLoading(false);
    }
  };

  const evaluarConPrimerDia = async () => {
    if (!data?.dias?.length) return;
    const hoy = data.dias[0];
    await guardarEvaluacionAlerta({
      lat: data.lat,
      lng: data.lng,
      altitud_msnm: altitud ? Number(altitud.replace(",", ".")) : snapshot?.altitudMsnm,
      temp_min_proximas_24h: hoy.temp_min_c,
      temp_max_proximas_24h: hoy.temp_max_c,
      prob_precipitacion: hoy.prob_precipitacion
    });
    await fetchAlertas();
    Alert.alert("Listo", "Evaluación registrada.");
  };

  const agregarSugeridosDesdeAlerta = async (mensajes: string[]) => {
    const sugeridos = sugeridosPorAlertas(mensajes);
    for (const p of sugeridos) {
      await insertProducto({
        nombre: p.nombre,
        categoria: p.categoria,
        precio: p.precioReferencial,
        unidad: p.unidad,
        stock: p.stockSugerido
      });
    }
    Alert.alert("Productos", `Se agregaron ${sugeridos.length} sugeridos.`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Clima y alertas</Text>
        <Text style={styles.hint}>
          Pronóstico Open-Meteo y alertas con ML (GPS + temperatura + lluvia).
        </Text>
      </View>

      <GpsStatusBar
        loading={gpsLoading}
        snapshot={snapshot}
        onRefresh={() => void refresh()}
        variant="ubicacion"
      />

      <View style={styles.pad}>
      <SectionCard badge="UBICACIÓN GPS" title="Coordenadas rellenadas automáticamente">
        <View style={styles.coordRow}>
          <View style={styles.coordCell}>
            <Text style={styles.coordLabel}>Latitud</Text>
            <Text style={styles.coordValue}>{lat || "—"}</Text>
          </View>
          <View style={styles.coordCell}>
            <Text style={styles.coordLabel}>Longitud</Text>
            <Text style={styles.coordValue}>{lng || "—"}</Text>
          </View>
        </View>
        <Pressable style={styles.button} onPress={() => void aplicarCoordenadas()}>
          <Text style={styles.buttonText}>Ver pronóstico en mi ubicación</Text>
        </Pressable>
      </SectionCard>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={agro.sky600} style={{ marginVertical: 16 }} />
      ) : null}

      {data ? (
        <View style={styles.pad}>
          <Text style={styles.liveBadge}>DATOS EN TIEMPO REAL</Text>
          <Text style={styles.small}>Fuente: {data.fuente}</Text>
          {data.dias.map((d) => {
            const lluvia = probLluviaPct(d.prob_precipitacion);
            return (
              <View key={d.fecha} style={styles.card}>
                <Text style={styles.bold}>{d.fecha}</Text>
                <ProgressBar
                  label="Probabilidad de lluvia"
                  porcentaje={lluvia}
                  detail={`Mín ${d.temp_min_c} °C · Máx ${d.temp_max_c} °C`}
                  color={agro.sky600}
                />
                <Text style={styles.desc}>{d.descripcion}</Text>
              </View>
            );
          })}
          <Pressable style={styles.warnBtn} onPress={() => void evaluarConPrimerDia()}>
            <Text style={styles.buttonText}>Evaluar alertas ML (primer día)</Text>
          </Pressable>
        </View>
      ) : null}

      {alertasPanel.length > 0 ? (
        <View style={styles.pad}>
          <Text style={styles.subtitle}>Avisos del panel</Text>
          {alertasPanel.map((a) => (
            <View key={a.id} style={[styles.card, styles.cardPanel]}>
              <Text style={styles.bold}>{a.titulo}</Text>
              <Text style={styles.nivelBadge}>{a.nivel}</Text>
              <Text style={styles.desc}>{a.mensaje}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.pad}>
        <Text style={styles.subtitle}>Historial ML (tu cuenta)</Text>
        {alertas.length === 0 ? (
          <EmptyState
            emoji="🌤️"
            title="Aún no hay evaluaciones"
            message="Realiza tu primera consulta para comenzar a guardar el historial del clima."
          />
        ) : (
          alertas.map((m, idx) => {
            const raw = (m.alertas as Array<Record<string, unknown>> | undefined) ?? [];
            const mensajes = raw.map((a) => a.mensaje).filter((x): x is string => typeof x === "string");
            const sugeridos = sugeridosPorAlertas(mensajes);
            return (
              <View key={`${String(m.ts)}-${idx}`} style={styles.card}>
                <Text style={styles.bold}>
                  Nivel: {String(m.nivel ?? "-")} · {String(m.ts ?? "")}
                </Text>
                {"modelo" in m && m.modelo ? (
                  <Text style={styles.modeloHint}>{String(m.modelo)}</Text>
                ) : null}
                <Text style={styles.desc}>{mensajes.join(" | ")}</Text>
                {sugeridos.length > 0 ? (
                  <Pressable
                    style={styles.secondary}
                    onPress={() => void agregarSugeridosDesdeAlerta(mensajes)}
                  >
                    <Text style={styles.buttonText}>Agregar sugeridos</Text>
                  </Pressable>
                ) : null}
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 32, backgroundColor: agro.gray50 },
  header: { padding: 16, paddingBottom: 8, gap: 6 },
  title: { fontSize: 22, fontWeight: "800", color: agro.green900 },
  hint: { color: agro.gray600, fontSize: 14, lineHeight: 20 },
  pad: { paddingHorizontal: 16, gap: 10 },
  coordRow: { flexDirection: "row", gap: 10, marginTop: 8 },
  coordCell: {
    flex: 1,
    backgroundColor: agro.green50,
    padding: 12,
    borderRadius: agro.radiusSm
  },
  coordLabel: { fontSize: 11, fontWeight: "700", color: agro.gray500 },
  coordValue: { fontSize: 15, fontWeight: "800", color: agro.green900, marginTop: 4 },
  button: {
    backgroundColor: agro.sky600,
    padding: 14,
    borderRadius: agro.radiusMd,
    alignItems: "center",
    marginTop: 8
  },
  warnBtn: {
    backgroundColor: agro.amber600,
    padding: 14,
    borderRadius: agro.radiusMd,
    alignItems: "center"
  },
  secondary: {
    marginTop: 8,
    backgroundColor: agro.purple600,
    padding: 12,
    borderRadius: agro.radiusMd,
    alignItems: "center"
  },
  buttonText: { color: agro.white, fontWeight: "700" },
  liveBadge: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    color: agro.sky600
  },
  small: { fontSize: 12, color: agro.gray500 },
  subtitle: { fontWeight: "800", fontSize: 16, color: agro.gray900, marginTop: 8 },
  card: {
    borderWidth: 1,
    borderColor: agro.gray200,
    borderRadius: agro.radiusMd,
    padding: 12,
    backgroundColor: agro.white,
    gap: 6
  },
  bold: { fontWeight: "700", color: agro.gray900 },
  modeloHint: { fontSize: 11, color: agro.purple600, fontWeight: "600", marginTop: 2 },
  desc: { color: agro.gray600, lineHeight: 20 },
  cardPanel: { borderLeftWidth: 4, borderLeftColor: agro.amber600 },
  nivelBadge: {
    fontSize: 11,
    fontWeight: "800",
    color: agro.amber600,
    textTransform: "uppercase"
  }
});
