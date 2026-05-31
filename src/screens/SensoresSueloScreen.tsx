import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { AgroButton } from "../components/AgroButton";
import { AgroInput } from "../components/AgroInput";
import { GpsStatusBar } from "../components/GpsStatusBar";
import { ProgressBar } from "../components/ProgressBar";
import { SectionCard } from "../components/SectionCard";
import {
  getUltimaLecturaSuelo,
  insertLecturaSuelo,
  listLecturasSuelo,
  listSensoresActivos,
  registrarSensor
} from "../features/sensores/sensoresRepository";
import { useGpsAutoFill } from "../hooks/useGpsAutoFill";
import {
  interpretarLecturaSuelo,
  simularLecturaSensor
} from "../services/sensoresSueloService";
import type { InterpretacionSuelo } from "../services/sensoresSueloService";
import type { LecturaSensorSuelo, SensorIoT } from "../types/sensores";
import { agro } from "../theme/agroTheme";

const ESTADO_COLORS = {
  green: agro.green600,
  amber: agro.amber600,
  red: "#dc2626",
  sky: agro.sky600
};

export function SensoresSueloScreen() {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [altitud, setAltitud] = useState("");
  const [sensorCodigo, setSensorCodigo] = useState("SUELO-01");
  const [parcela, setParcela] = useState("");
  const [modelo, setModelo] = useState("Capacitivo IoT");
  const [humedad, setHumedad] = useState("");
  const [ph, setPh] = useState("");
  const [temperatura, setTemperatura] = useState("");
  const [conductividad, setConductividad] = useState("");
  const [profundidad, setProfundidad] = useState("15");
  const [sensores, setSensores] = useState<SensorIoT[]>([]);
  const [historial, setHistorial] = useState<LecturaSensorSuelo[]>([]);
  const [ultima, setUltima] = useState<LecturaSensorSuelo | null>(null);
  const [preview, setPreview] = useState<InterpretacionSuelo | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [leyendo, setLeyendo] = useState(false);

  const { loading: gpsLoading, snapshot, refresh } = useGpsAutoFill({
    setLat,
    setLng,
    setAltitud
  });

  const recargar = useCallback(async () => {
    try {
      const [s, h, u] = await Promise.all([
        listSensoresActivos(),
        listLecturasSuelo(10),
        getUltimaLecturaSuelo()
      ]);
      setSensores(s);
      setHistorial(h);
      setUltima(u);
    } catch {
      setSensores([]);
      setHistorial([]);
      setUltima(null);
    }
  }, []);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  const aplicarPreview = (h: number, p: number, t: number, c?: number) => {
    setPreview(
      interpretarLecturaSuelo({
        humedad_pct: h,
        ph: p,
        temperatura_c: t,
        conductividad_ms_cm: c
      })
    );
  };

  const leerSensor = async () => {
    setLeyendo(true);
    try {
      const sim = simularLecturaSensor({
        altitudMsnm: altitud ? Number(altitud.replace(",", ".")) : snapshot?.altitudMsnm,
        mes: new Date().getMonth() + 1
      });
      setHumedad(String(sim.humedad_pct));
      setPh(String(sim.ph));
      setTemperatura(String(sim.temperatura_c));
      setConductividad(String(sim.conductividad_ms_cm ?? ""));
      setProfundidad(String(sim.profundidad_cm ?? 15));
      if (sim.sensor_codigo) setSensorCodigo(sim.sensor_codigo);
      aplicarPreview(sim.humedad_pct, sim.ph, sim.temperatura_c, sim.conductividad_ms_cm);
      Alert.alert("Sensor IoT", "Lectura recibida del sensor de suelo (modo demo).");
    } finally {
      setLeyendo(false);
    }
  };

  const registrarSensorLocal = async () => {
    const la = Number(lat.replace(",", "."));
    const ln = Number(lng.replace(",", "."));
    if (Number.isNaN(la) || Number.isNaN(ln)) {
      Alert.alert("GPS", "Espera la ubicación del sensor.");
      return;
    }
    if (!sensorCodigo.trim()) {
      Alert.alert("Sensor", "Indica un código de sensor.");
      return;
    }
    try {
      await registrarSensor({
        sensor_codigo: sensorCodigo.trim(),
        modelo: modelo.trim() || undefined,
        parcela: parcela.trim() || undefined,
        lat: la,
        lng: ln,
        altitudMsnm: altitud ? Number(altitud.replace(",", ".")) : undefined
      });
      await recargar();
      Alert.alert("Registrado", "Sensor IoT vinculado a esta parcela.");
    } catch (e) {
      Alert.alert("Error", e instanceof Error ? e.message : "No se pudo registrar");
    }
  };

  const guardarLectura = async () => {
    const la = Number(lat.replace(",", "."));
    const ln = Number(lng.replace(",", "."));
    const h = Number(humedad.replace(",", "."));
    const p = Number(ph.replace(",", "."));
    const t = Number(temperatura.replace(",", "."));
    const c = conductividad.trim() ? Number(conductividad.replace(",", ".")) : undefined;
    const prof = profundidad.trim() ? Number(profundidad.replace(",", ".")) : 15;

    if (Number.isNaN(la) || Number.isNaN(ln)) {
      Alert.alert("GPS", "Ubicación requerida.");
      return;
    }
    if (Number.isNaN(h) || Number.isNaN(p) || Number.isNaN(t)) {
      Alert.alert("Medición", "Completa humedad, pH y temperatura.");
      return;
    }

    setGuardando(true);
    try {
      const interp = await insertLecturaSuelo({
        sensor_codigo: sensorCodigo.trim() || undefined,
        lat: la,
        lng: ln,
        altitudMsnm: altitud ? Number(altitud.replace(",", ".")) : undefined,
        precisionM: snapshot?.accuracyM,
        humedad_pct: h,
        ph: p,
        temperatura_c: t,
        conductividad_ms_cm: c,
        profundidad_cm: prof
      });
      setPreview(interp);
      await recargar();
      Alert.alert("Guardado", `Medición registrada: ${interp.etiqueta}`);
    } catch (e) {
      Alert.alert("Error", e instanceof Error ? e.message : "No se pudo guardar");
    } finally {
      setGuardando(false);
    }
  };

  const ultimaInterp =
    ultima?.humedad_pct != null && ultima.ph != null && ultima.temperatura_c != null
      ? interpretarLecturaSuelo({
          humedad_pct: ultima.humedad_pct,
          ph: ultima.ph,
          temperatura_c: ultima.temperatura_c,
          conductividad_ms_cm: ultima.conductividad_ms_cm ?? undefined
        })
      : null;

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <GpsStatusBar
        loading={gpsLoading}
        snapshot={snapshot}
        onRefresh={() => void refresh()}
        variant="ubicacion"
      />

      <View style={styles.header}>
        <Text style={styles.title}>Sensores de suelo</Text>
        <Text style={styles.hint}>
          Medición de tierra con sensores IoT: humedad, pH, temperatura y conductividad.
        </Text>
      </View>

      {ultima && ultimaInterp ? (
        <SectionCard badge="ÚLTIMA MEDICIÓN" title={ultimaInterp.etiqueta}>
          <ProgressBar
            label="Humedad del suelo"
            porcentaje={ultima.humedad_pct ?? 0}
            detail={`pH ${ultima.ph?.toFixed(1)} · ${ultima.temperatura_c?.toFixed(1)} °C · ${ultima.profundidad_cm ?? 15} cm prof.`}
            color={ESTADO_COLORS[ultimaInterp.color]}
          />
          <Text style={styles.metaSmall}>
            {ultima.sensor_codigo ? `Sensor ${ultima.sensor_codigo} · ` : ""}
            {new Date(ultima.created_at).toLocaleString("es-PE")}
          </Text>
        </SectionCard>
      ) : null}

      <View style={styles.pad}>
        <SectionCard badge="SENSOR IoT" title="Registrar sensor en parcela">
          <AgroInput
            label="Código del sensor"
            value={sensorCodigo}
            onChangeText={setSensorCodigo}
            placeholder="SUELO-01"
          />
          <AgroInput
            label="Modelo"
            value={modelo}
            onChangeText={setModelo}
            placeholder="Capacitivo / NPK / multiparamétrico"
          />
          <AgroInput
            label="Parcela / lote"
            value={parcela}
            onChangeText={setParcela}
            placeholder="Sector A-12"
          />
          <AgroButton label="Vincular sensor aquí (GPS)" onPress={() => void registrarSensorLocal()} />
          {sensores.length > 0 ? (
            <Text style={styles.countHint}>{sensores.length} sensor(es) activo(s)</Text>
          ) : null}
        </SectionCard>

        <SectionCard badge="LECTURA" title="Medir suelo con sensor">
          <Pressable
            style={[styles.readBtn, leyendo && styles.readBtnDisabled]}
            onPress={() => void leerSensor()}
            disabled={leyendo}
          >
            <Text style={styles.readBtnText}>
              {leyendo ? "Leyendo sensor…" : "📡 Leer sensor IoT (automático)"}
            </Text>
          </Pressable>
          <Text style={styles.demoHint}>
            Sin hardware físico usa modo demo. Con sensor real, ingresa los valores manualmente abajo.
          </Text>

          <View style={styles.row2}>
            <View style={styles.flex}>
              <AgroInput
                label="Humedad %"
                value={humedad}
                onChangeText={(v) => {
                  setHumedad(v);
                  const n = Number(v.replace(",", "."));
                  if (!Number.isNaN(n) && ph && temperatura) {
                    aplicarPreview(n, Number(ph.replace(",", ".")), Number(temperatura.replace(",", ".")));
                  }
                }}
                keyboardType="decimal-pad"
                placeholder="45"
              />
            </View>
            <View style={styles.flex}>
              <AgroInput
                label="pH"
                value={ph}
                onChangeText={setPh}
                keyboardType="decimal-pad"
                placeholder="6.5"
              />
            </View>
          </View>
          <View style={styles.row2}>
            <View style={styles.flex}>
              <AgroInput
                label="Temp. suelo °C"
                value={temperatura}
                onChangeText={setTemperatura}
                keyboardType="decimal-pad"
                placeholder="16"
              />
            </View>
            <View style={styles.flex}>
              <AgroInput
                label="CE mS/cm"
                value={conductividad}
                onChangeText={setConductividad}
                keyboardType="decimal-pad"
                placeholder="1.2"
              />
            </View>
          </View>
          <AgroInput
            label="Profundidad cm"
            value={profundidad}
            onChangeText={setProfundidad}
            keyboardType="decimal-pad"
            placeholder="15"
          />

          {preview ? (
            <View style={[styles.previewBox, { borderColor: ESTADO_COLORS[preview.color] }]}>
              <Text style={[styles.previewTitle, { color: ESTADO_COLORS[preview.color] }]}>
                {preview.etiqueta}
              </Text>
              {preview.recomendaciones.map((r) => (
                <Text key={r} style={styles.previewRec}>
                  • {r}
                </Text>
              ))}
            </View>
          ) : null}

          <AgroButton
            label={guardando ? "Guardando…" : "Guardar medición en Supabase"}
            onPress={() => void guardarLectura()}
            loading={guardando}
          />
        </SectionCard>

        {historial.length > 0 ? (
          <SectionCard badge="HISTORIAL" title="Lecturas recientes">
            {historial.map((h) => (
              <View key={h.id} style={styles.histRow}>
                <Text style={styles.histTitle}>{h.titulo}</Text>
                <Text style={styles.histMeta}>
                  💧 {h.humedad_pct?.toFixed(1) ?? "—"}% · pH {h.ph?.toFixed(1) ?? "—"} ·{" "}
                  {h.temperatura_c?.toFixed(1) ?? "—"} °C
                </Text>
                <Text style={styles.histDate}>
                  {new Date(h.created_at).toLocaleString("es-PE")}
                </Text>
              </View>
            ))}
          </SectionCard>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 32, backgroundColor: agro.gray50 },
  header: { paddingHorizontal: 16, paddingTop: 8, gap: 4 },
  title: { fontSize: 22, fontWeight: "800", color: agro.green900 },
  hint: { fontSize: 13, color: agro.gray600, lineHeight: 20 },
  pad: { paddingHorizontal: 16, gap: 12, marginTop: 8 },
  metaSmall: { fontSize: 11, color: agro.gray500, marginTop: 4 },
  readBtn: {
    backgroundColor: agro.purple600,
    padding: 14,
    borderRadius: agro.radiusMd,
    alignItems: "center",
    marginBottom: 8
  },
  readBtnDisabled: { opacity: 0.65 },
  readBtnText: { color: agro.white, fontWeight: "800", fontSize: 15 },
  demoHint: { fontSize: 12, color: agro.gray500, marginBottom: 8, lineHeight: 18 },
  row2: { flexDirection: "row", gap: 8 },
  flex: { flex: 1 },
  previewBox: {
    borderWidth: 2,
    borderRadius: agro.radiusMd,
    padding: 12,
    backgroundColor: agro.white,
    marginVertical: 8,
    gap: 4
  },
  previewTitle: { fontWeight: "800", fontSize: 15, marginBottom: 4 },
  previewRec: { fontSize: 13, color: agro.gray700, lineHeight: 20 },
  countHint: { fontSize: 12, color: agro.green700, fontWeight: "600", marginTop: 4 },
  histRow: {
    borderTopWidth: 1,
    borderTopColor: agro.gray200,
    paddingTop: 10,
    marginTop: 10,
    gap: 2
  },
  histTitle: { fontWeight: "700", color: agro.gray900, fontSize: 13 },
  histMeta: { fontSize: 12, color: agro.gray600 },
  histDate: { fontSize: 11, color: agro.gray400 }
});
