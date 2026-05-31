import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { AgroButton } from "../components/AgroButton";
import { AgroInput } from "../components/AgroInput";
import { ProgressBar } from "../components/ProgressBar";
import { SectionCard } from "../components/SectionCard";
import {
  calcularCoberturaOperacional,
  insertIndicadorOperacional,
  ultimosPorIndicador,
  type RegistroOperacional
} from "../features/operacionalizacion/operacionalizacionRepository";
import { captureGpsSnapshot } from "../utils/gpsService";
import {
  DIMENSIONES_OPERACIONALIZACION,
  TOTAL_INDICADORES,
  VARIABLE_DEPENDIENTE,
  type IndicadorOperacional
} from "../schema/operacionalizacion";
import { agro } from "../theme/agroTheme";

function formatValor(r: RegistroOperacional | undefined): string {
  if (!r) return "Sin registro";
  if (r.valor_numerico != null) return `${r.valor_numerico}${r.unidad ? ` ${r.unidad}` : ""}`;
  return r.valor_texto ?? "—";
}

export function OperacionalizacionScreen() {
  const [cobertura, setCobertura] = useState<Awaited<ReturnType<typeof calcularCoberturaOperacional>> | null>(null);
  const [ultimos, setUltimos] = useState<Map<string, RegistroOperacional>>(new Map());
  const [modalInd, setModalInd] = useState<IndicadorOperacional | null>(null);
  const [dimensionLabel, setDimensionLabel] = useState("");
  const [valor, setValor] = useState("");
  const [notas, setNotas] = useState("");
  const [guardando, setGuardando] = useState(false);

  const recargar = useCallback(async () => {
    try {
      const [c, u] = await Promise.all([calcularCoberturaOperacional(), ultimosPorIndicador()]);
      setCobertura(c);
      setUltimos(u);
    } catch {
      setCobertura(null);
      setUltimos(new Map());
    }
  }, []);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  const abrirRegistro = (ind: IndicadorOperacional, dimNombre: string) => {
    setModalInd(ind);
    setDimensionLabel(dimNombre);
    const prev = ultimos.get(ind.id);
    setValor(prev?.valor_numerico != null ? String(prev.valor_numerico) : prev?.valor_texto ?? "");
    setNotas("");
  };

  const guardar = async () => {
    if (!modalInd || !valor.trim()) {
      Alert.alert("Valor", "Ingresa un valor para el indicador.");
      return;
    }
    setGuardando(true);
    try {
      const snap = await captureGpsSnapshot(true);
      const num = Number(valor.replace(",", "."));
      const esEncuesta = modalInd.tipoInstrumento === "encuesta";
      const esObservacion = modalInd.tipoInstrumento === "observacion";

      await insertIndicadorOperacional({
        indicadorId: modalInd.id,
        valorNumerico: !Number.isNaN(num) ? num : undefined,
        valorTexto: Number.isNaN(num) ? valor.trim() : esEncuesta || esObservacion ? valor.trim() : undefined,
        lat: snap?.lat,
        lng: snap?.lng,
        notas: notas.trim() || undefined
      });
      setModalInd(null);
      await recargar();
      Alert.alert("Guardado", `${modalInd.nombre} registrado en Supabase.`);
    } catch (e) {
      Alert.alert("Error", e instanceof Error ? e.message : "No se pudo guardar");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.badge}>VARIABLE DEPENDIENTE</Text>
          <Text style={styles.title}>{VARIABLE_DEPENDIENTE}</Text>
          <Text style={styles.hint}>
            Matriz de operacionalización: {TOTAL_INDICADORES} indicadores en{" "}
            {DIMENSIONES_OPERACIONALIZACION.length} dimensiones.
          </Text>
        </View>

        {cobertura ? (
          <View style={styles.pad}>
            <ProgressBar
              label="Cobertura de indicadores"
              porcentaje={cobertura.porcentaje}
              detail={`${cobertura.conRegistro} de ${cobertura.total} con al menos un registro`}
              color={agro.green600}
            />
          </View>
        ) : null}

        {DIMENSIONES_OPERACIONALIZACION.map((dim) => (
          <View key={dim.id} style={styles.pad}>
            <SectionCard badge="DIMENSIÓN" title={dim.nombre}>
              {dim.indicadores.map((ind) => {
                const reg = ultimos.get(ind.id);
                return (
                  <Pressable
                    key={ind.id}
                    style={styles.indRow}
                    onPress={() => abrirRegistro(ind, dim.nombre)}
                  >
                    <View style={styles.indMain}>
                      <Text style={styles.indNombre}>{ind.nombre}</Text>
                      <Text style={styles.indInst}>
                        Instrumento: {ind.instrumento}
                        {ind.unidad ? ` · ${ind.unidad}` : ""}
                      </Text>
                      {ind.fuenteApp ? (
                        <Text style={styles.indFuente}>Fuente: {ind.fuenteApp}</Text>
                      ) : null}
                      <Text style={[styles.indValor, reg ? styles.indValorOk : undefined]}>
                        {formatValor(reg)}
                      </Text>
                    </View>
                    <Text style={styles.indAction}>+</Text>
                  </Pressable>
                );
              })}
            </SectionCard>
          </View>
        ))}
      </ScrollView>

      <Modal visible={!!modalInd} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalDim}>{dimensionLabel}</Text>
            <Text style={styles.modalTitle}>{modalInd?.nombre}</Text>
            <Text style={styles.modalInst}>
              Instrumento: {modalInd?.instrumento}
            </Text>
            <AgroInput
              label={`Valor${modalInd?.unidad ? ` (${modalInd.unidad})` : ""}`}
              value={valor}
              onChangeText={setValor}
              keyboardType={
                modalInd?.tipoInstrumento === "encuesta" ||
                modalInd?.tipoInstrumento === "observacion"
                  ? "number-pad"
                  : "decimal-pad"
              }
              placeholder={
                modalInd?.tipoInstrumento === "encuesta" ? "1 a 5" : "Ej. 45"
              }
            />
            <AgroInput
              label="Notas (opcional)"
              value={notas}
              onChangeText={setNotas}
              placeholder="Observaciones de campo"
            />
            <AgroButton label="Guardar indicador" loading={guardando} onPress={() => void guardar()} />
            <Pressable style={styles.cancel} onPress={() => setModalInd(null)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 32, backgroundColor: agro.gray50 },
  header: { padding: 16, gap: 4 },
  badge: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    color: agro.purple600
  },
  title: { fontSize: 22, fontWeight: "800", color: agro.green900 },
  hint: { fontSize: 13, color: agro.gray600, lineHeight: 20 },
  pad: { paddingHorizontal: 16, marginBottom: 8 },
  indRow: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: agro.gray200,
    paddingTop: 12,
    marginTop: 12,
    gap: 8
  },
  indMain: { flex: 1, gap: 2 },
  indNombre: { fontWeight: "800", color: agro.gray900, fontSize: 14 },
  indInst: { fontSize: 12, color: agro.gray600 },
  indFuente: { fontSize: 11, color: agro.purple600, fontWeight: "600" },
  indValor: { fontSize: 13, color: agro.gray400, marginTop: 4, fontWeight: "600" },
  indValorOk: { color: agro.green700 },
  indAction: {
    fontSize: 22,
    fontWeight: "800",
    color: agro.green600,
    width: 36,
    textAlign: "center"
  },
  modalBackdrop: { flex: 1, backgroundColor: "#0008", justifyContent: "flex-end" },
  modalCard: {
    backgroundColor: agro.white,
    padding: 20,
    borderTopLeftRadius: agro.radiusLg,
    borderTopRightRadius: agro.radiusLg,
    gap: 4
  },
  modalDim: { fontSize: 11, fontWeight: "800", color: agro.purple600, textTransform: "uppercase" },
  modalTitle: { fontSize: 18, fontWeight: "800", color: agro.green900 },
  modalInst: { fontSize: 13, color: agro.gray600, marginBottom: 8 },
  cancel: { alignItems: "center", padding: 12 },
  cancelText: { color: agro.gray600, fontWeight: "600" }
});
