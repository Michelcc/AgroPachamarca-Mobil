import { useCallback, useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { GpsStatusBar } from "../components/GpsStatusBar";
import { SectionCard } from "../components/SectionCard";
import { listRecomendacionesCultivo } from "../features/recomendaciones/recomendacionesRepository";
import { predecirCultivosMl } from "../services/cropMlService";
import { ProgressBar } from "../components/ProgressBar";
import { insertProducto } from "../features/productos/productosRepository";
import { sugeridosPorCultivo } from "../features/productos/productosCatalogo";
import { useGpsAutoFill } from "../hooks/useGpsAutoFill";
import { fetchPronostico7Dias } from "../services/openMeteo";
import { PrediccionCultivoResponse } from "../types/models";
import { agro, MESES_ES } from "../theme/agroTheme";
import { AgroInput } from "../components/AgroInput";

function formatConvivencia(prob: number): number {
  if (prob <= 1 && prob >= 0) return prob * 100;
  return prob;
}

export function RecomendacionScreen() {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [altitud, setAltitud] = useState("");
  const [mes, setMes] = useState(String(new Date().getMonth() + 1));
  const [precip, setPrecip] = useState("");
  const [tmin, setTmin] = useState("");
  const [tmax, setTmax] = useState("");
  const [resultado, setResultado] = useState<PrediccionCultivoResponse | null>(null);
  const [climaResumen, setClimaResumen] = useState<string | null>(null);
  const [predicting, setPredicting] = useState(false);
  const [reglasPanel, setReglasPanel] = useState<
    Awaited<ReturnType<typeof listRecomendacionesCultivo>>
  >([]);

  const { loading, snapshot, refresh } = useGpsAutoFill({ setLat, setLng, setAltitud });

  const mesNombre = MESES_ES[Math.max(0, Math.min(11, Number(mes) - 1))] ?? "—";

  const cargarClima = useCallback(async () => {
    const la = parseFloat(lat.replace(",", "."));
    const ln = parseFloat(lng.replace(",", "."));
    if (Number.isNaN(la) || Number.isNaN(ln)) return;
    try {
      const data = await fetchPronostico7Dias(la, ln);
      const lluvioso = data.dias.find((d) => d.prob_precipitacion > 0.4);
      if (lluvioso) {
        const dia = new Date(lluvioso.fecha).toLocaleDateString("es-PE", { weekday: "long" });
        setClimaResumen(`Se esperan lluvias ligeras el ${dia}.`);
      } else {
        setClimaResumen("Condiciones estables en los próximos 7 días.");
      }
    } catch {
      setClimaResumen(null);
    }
  }, [lat, lng]);

  useEffect(() => {
    if (lat && lng) void cargarClima();
  }, [lat, lng, cargarClima]);

  useEffect(() => {
    void listRecomendacionesCultivo()
      .then(setReglasPanel)
      .catch(() => setReglasPanel([]));
  }, []);

  const consultar = async () => {
    const la = Number(lat.replace(",", "."));
    const ln = Number(lng.replace(",", "."));
    if (Number.isNaN(la) || Number.isNaN(ln)) {
      Alert.alert("GPS", "Espera la ubicación o actualiza el GPS antes de predecir.");
      return;
    }
    setPredicting(true);
    try {
      const pred = await predecirCultivosMl({
        lat: la,
        lng: ln,
        altitud_msnm: altitud ? Number(altitud.replace(",", ".")) : undefined,
        mes: mes.trim() ? Number(mes) : undefined,
        precipitacion_mm_semana: precip.trim()
          ? Number(precip.replace(",", "."))
          : undefined,
        temp_min_c: tmin.trim() ? Number(tmin.replace(",", ".")) : undefined,
        temp_max_c: tmax.trim() ? Number(tmax.replace(",", ".")) : undefined
      });
      setResultado(pred);
      void cargarClima();
    } catch {
      Alert.alert("Predicción", "No se pudo calcular. Revisa internet y vuelve a intentar.");
    } finally {
      setPredicting(false);
    }
  };

  const cargarSugeridos = async () => {
    const cultivo = resultado?.top3?.[0]?.cultivo;
    if (!cultivo) return;
    const sugeridos = sugeridosPorCultivo(cultivo);
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
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <GpsStatusBar
        loading={loading}
        snapshot={snapshot}
        onRefresh={() => void refresh()}
        variant="ubicacion"
      />

      <View style={styles.header}>
        <Text style={styles.title}>Recomendación de cultivo</Text>
        <Text style={styles.hint}>
          ML con GPS + clima (Open-Meteo) · altitud y mes para tu parcela
        </Text>
      </View>

      <View style={styles.pad}>
        <SectionCard badge="UBICACIÓN ACTUAL" title="Localizado vía GPS">
          <View style={styles.coordRow}>
            <View style={styles.coordCell}>
              <Text style={styles.coordLabel}>Latitud</Text>
              <Text style={styles.coordValue}>{lat || "0.0000"}</Text>
            </View>
            <View style={styles.coordCell}>
              <Text style={styles.coordLabel}>Longitud</Text>
              <Text style={styles.coordValue}>{lng || "0.0000"}</Text>
            </View>
          </View>
          <AgroInput
            label="Altitud m s.n.m. (GPS)"
            value={altitud}
            onChangeText={setAltitud}
            placeholder="Ej: 2600"
            keyboardType="decimal-pad"
          />
          <View style={styles.mesBox}>
            <Text style={styles.coordLabel}>Mes de referencia</Text>
            <Text style={styles.mesValue}>{mesNombre}</Text>
            <Text style={styles.mesHint}>Mes {mes} (editable en parámetros)</Text>
          </View>
        </SectionCard>

        <SectionCard badge="PARÁMETROS OPCIONALES" title="Condiciones adicionales">
          <AgroInput
            value={mes}
            onChangeText={setMes}
            label="Mes (número 1-12)"
            keyboardType="number-pad"
            placeholder="5"
          />
          <AgroInput
            value={precip}
            onChangeText={setPrecip}
            label="Precipitación mm/semana"
            placeholder="Opcional"
            keyboardType="decimal-pad"
          />
          <View style={styles.row2}>
            <View style={styles.flex}>
              <AgroInput
                value={tmin}
                onChangeText={setTmin}
                label="Temp mín °C"
                placeholder="Opcional"
                keyboardType="decimal-pad"
              />
            </View>
            <View style={styles.flex}>
              <AgroInput
                value={tmax}
                onChangeText={setTmax}
                label="Temp máx °C"
                placeholder="Opcional"
                keyboardType="decimal-pad"
              />
            </View>
          </View>
        </SectionCard>

        <Pressable
          style={[styles.button, predicting && styles.buttonDisabled]}
          onPress={() => void consultar()}
          disabled={predicting}
        >
          <Text style={styles.buttonText}>
            {predicting ? "Calculando predicción ML…" : "Predecir cultivos (ML + GPS)"}
          </Text>
        </Pressable>

        {resultado?.top3?.length ? (
          <>
            <Text style={styles.modeloLabel}>{resultado.modelo}</Text>
            <Text style={styles.sectionTitle}>Mejores opciones de siembra</Text>
            {resultado.top3.map((t) => {
              const pct = formatConvivencia(t.probabilidad);
              return (
                <View key={`${t.rank}-${t.cultivo}`} style={styles.card}>
                  <Text style={styles.bold}>
                    #{t.rank} {t.cultivo}
                  </Text>
                  <ProgressBar
                    label="Convivencia con tu terreno"
                    porcentaje={pct}
                    detail={`${pct.toFixed(1)} % de compatibilidad`}
                    color={agro.green600}
                  />
                </View>
              );
            })}
            <Pressable style={styles.secondary} onPress={() => void cargarSugeridos()}>
              <Text style={styles.buttonText}>Agregar productos sugeridos</Text>
            </Pressable>
          </>
        ) : null}

        {resultado?.climaUsado ? (
          <SectionCard badge="DATOS DEL MODELO" title="Variables usadas en la predicción">
            <Text style={styles.climaText}>
              Altitud {resultado.ubicacion?.altitud_msnm?.toFixed(0) ?? "—"} m · Mes{" "}
              {resultado.climaUsado.mes}
              {"\n"}
              T° {resultado.climaUsado.temp_min_c.toFixed(1)}–
              {resultado.climaUsado.temp_max_c.toFixed(1)} °C · Lluvia est.{" "}
              {resultado.climaUsado.precipitacion_mm_semana.toFixed(1)} mm/sem
            </Text>
          </SectionCard>
        ) : null}

        {reglasPanel.length > 0 ? (
          <SectionCard badge="PANEL WEB" title="Recomendaciones registradas">
            {reglasPanel.slice(0, 8).map((r) => (
              <View key={r.id} style={styles.reglaRow}>
                <Text style={styles.bold}>{r.cultivo}</Text>
                <Text style={styles.reglaMeta}>
                  {r.altitud_min_m}–{r.altitud_max_m} m · Mes {r.mes_inicio}–{r.mes_fin} ·{" "}
                  {Number(r.probabilidad).toFixed(0)}%
                </Text>
                {r.notas ? <Text style={styles.reglaNotas}>{r.notas}</Text> : null}
              </View>
            ))}
          </SectionCard>
        ) : null}

        {climaResumen ? (
          <SectionCard badge="CLIMA PRÓXIMOS 7 DÍAS" title="Pronóstico local">
            <Text style={styles.climaText}>{climaResumen}</Text>
          </SectionCard>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 32, backgroundColor: agro.gray50 },
  header: { paddingHorizontal: 16, marginTop: 8, gap: 4 },
  title: { fontSize: 22, fontWeight: "800", color: agro.green900 },
  hint: { fontSize: 13, color: agro.gray500, fontWeight: "600" },
  pad: { paddingHorizontal: 16, gap: 12, marginTop: 8 },
  coordRow: { flexDirection: "row", gap: 12 },
  coordCell: { flex: 1, backgroundColor: agro.green50, padding: 12, borderRadius: agro.radiusSm },
  coordLabel: { fontSize: 11, fontWeight: "700", color: agro.gray500, textTransform: "uppercase" },
  coordValue: { fontSize: 16, fontWeight: "800", color: agro.green900, marginTop: 4 },
  mesBox: {
    backgroundColor: agro.gray50,
    padding: 12,
    borderRadius: agro.radiusSm,
    gap: 2
  },
  mesValue: { fontSize: 20, fontWeight: "800", color: agro.green800 },
  mesHint: { fontSize: 11, color: agro.gray500 },
  row2: { flexDirection: "row", gap: 8 },
  flex: { flex: 1 },
  button: {
    backgroundColor: agro.green600,
    padding: 14,
    borderRadius: agro.radiusMd,
    alignItems: "center"
  },
  buttonDisabled: { opacity: 0.65 },
  modeloLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: agro.purple600,
    marginTop: 4
  },
  secondary: {
    backgroundColor: agro.purple600,
    padding: 14,
    borderRadius: agro.radiusMd,
    alignItems: "center"
  },
  buttonText: { color: agro.white, fontWeight: "700" },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: agro.green900, marginTop: 4 },
  card: {
    borderWidth: 1,
    borderColor: agro.gray200,
    borderRadius: agro.radiusMd,
    padding: 12,
    backgroundColor: agro.white,
    gap: 6
  },
  bold: { fontWeight: "700" },
  climaText: { color: agro.gray700, lineHeight: 22, fontSize: 14 },
  reglaRow: {
    borderTopWidth: 1,
    borderTopColor: agro.gray200,
    paddingTop: 10,
    marginTop: 10,
    gap: 4
  },
  reglaMeta: { fontSize: 12, color: agro.gray600 },
  reglaNotas: { fontSize: 12, color: agro.gray500, fontStyle: "italic" }
});
