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
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
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
import { getDimensionById, MODULOS_POR_DIMENSION } from "../schema/dimensionModulos";
import type { IndicadorOperacional } from "../schema/operacionalizacion";
import type { RootStackParamList } from "../navigation/types";
import { agro } from "../theme/agroTheme";

type Props = NativeStackScreenProps<RootStackParamList, "DimensionDetail">;

function formatValor(r: RegistroOperacional | undefined): string {
  if (!r) return "Sin registro";
  if (r.valor_numerico != null) return `${r.valor_numerico}${r.unidad ? ` ${r.unidad}` : ""}`;
  return r.valor_texto ?? "—";
}

export function DimensionDetailScreen({ navigation, route }: Props) {
  const dimension = getDimensionById(route.params.dimensionId);
  const modulos = MODULOS_POR_DIMENSION[route.params.dimensionId] ?? [];

  const [ultimos, setUltimos] = useState<Map<string, RegistroOperacional>>(new Map());
  const [coberturaDim, setCoberturaDim] = useState(0);
  const [modalInd, setModalInd] = useState<IndicadorOperacional | null>(null);
  const [valor, setValor] = useState("");
  const [notas, setNotas] = useState("");
  const [guardando, setGuardando] = useState(false);

  const recargar = useCallback(async () => {
    if (!dimension) return;
    try {
      const u = await ultimosPorIndicador();
      setUltimos(u);
      const ids = new Set(dimension.indicadores.map((i) => i.id));
      const conRegistro = dimension.indicadores.filter((i) => u.has(i.id)).length;
      setCoberturaDim(
        dimension.indicadores.length
          ? Math.round((conRegistro / dimension.indicadores.length) * 100)
          : 0
      );
    } catch {
      setUltimos(new Map());
      setCoberturaDim(0);
    }
  }, [dimension]);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  useEffect(() => {
    if (dimension) {
      navigation.setOptions({ title: dimension.nombre });
    }
  }, [dimension, navigation]);

  if (!dimension) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Dimensión no encontrada.</Text>
      </View>
    );
  }

  const abrirRegistro = (ind: IndicadorOperacional) => {
    setModalInd(ind);
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
      Alert.alert("Guardado", `${modalInd.nombre} registrado.`);
    } catch (e) {
      Alert.alert("Error", e instanceof Error ? e.message : "No se pudo guardar");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <ProgressBar
          label="Cobertura en esta dimensión"
          porcentaje={coberturaDim}
          detail={`${dimension.indicadores.filter((i) => ultimos.has(i.id)).length} de ${dimension.indicadores.length} indicadores`}
          color={agro.green600}
        />

        {modulos.length > 0 ? (
          <SectionCard badge="MÓDULOS" title="Tablas y herramientas">
            {modulos.map((mod) => (
              <Pressable
                key={mod.id}
                style={styles.modRow}
                onPress={() => {
                  if (mod.mobileScreen) navigation.navigate(mod.mobileScreen);
                }}
              >
                <Text style={styles.modEmoji}>{mod.emoji}</Text>
                <View style={styles.modMain}>
                  <Text style={styles.modLabel}>{mod.label}</Text>
                  <Text style={styles.modDesc}>{mod.descripcion}</Text>
                </View>
                <Text style={styles.modChevron}>›</Text>
              </Pressable>
            ))}
          </SectionCard>
        ) : null}

        <SectionCard badge="INDICADORES" title={dimension.nombre}>
          {dimension.indicadores.map((ind) => {
            const reg = ultimos.get(ind.id);
            return (
              <Pressable key={ind.id} style={styles.indRow} onPress={() => abrirRegistro(ind)}>
                <View style={styles.indMain}>
                  <Text style={styles.indNombre}>{ind.nombre}</Text>
                  <Text style={styles.indInst}>
                    {ind.instrumento}
                    {ind.unidad ? ` · ${ind.unidad}` : ""}
                  </Text>
                  {ind.fuenteApp ? <Text style={styles.indFuente}>{ind.fuenteApp}</Text> : null}
                  <Text style={[styles.indValor, reg ? styles.indValorOk : undefined]}>
                    {formatValor(reg)}
                  </Text>
                </View>
                <Text style={styles.indAction}>+</Text>
              </Pressable>
            );
          })}
        </SectionCard>
      </ScrollView>

      <Modal visible={!!modalInd} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalDim}>{dimension.nombre}</Text>
            <Text style={styles.modalTitle}>{modalInd?.nombre}</Text>
            <Text style={styles.modalInst}>Instrumento: {modalInd?.instrumento}</Text>
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
              placeholder={modalInd?.tipoInstrumento === "encuesta" ? "1 a 5" : "Ej. 45"}
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
  container: { padding: 16, paddingBottom: 32, gap: 12, backgroundColor: agro.gray50 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { color: agro.gray600 },
  modRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: agro.gray200,
    paddingTop: 12,
    marginTop: 12
  },
  modEmoji: { fontSize: 24 },
  modMain: { flex: 1, gap: 2 },
  modLabel: { fontWeight: "800", color: agro.green900, fontSize: 15 },
  modDesc: { fontSize: 12, color: agro.gray600 },
  modChevron: { fontSize: 22, color: agro.gray400 },
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
  indAction: { fontSize: 22, fontWeight: "800", color: agro.green600, width: 36, textAlign: "center" },
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
