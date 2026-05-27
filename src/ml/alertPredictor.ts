import type { AlertMlInput, AlertMlResult, AlertModelWeights, AlertScenario } from "./alertModel";
import modelJson from "./alertModelWeights.json";

const model = modelJson as AlertModelWeights;

const MENSAJES: Record<AlertScenario, { mensaje: string; tipo: string }> = {
  normal: { mensaje: "Condiciones normales.", tipo: "ok" },
  lluvia: { mensaje: "Alta probabilidad de lluvia.", tipo: "lluvia" },
  lluvia_fuerte: { mensaje: "Lluvia muy probable.", tipo: "lluvia_fuerte" },
  helada: { mensaje: "Riesgo de helada ligera.", tipo: "helada" },
  critico: {
    mensaje: "Riesgo crítico: helada y lluvia intensa. Protege cultivos sensibles.",
    tipo: "critico"
  }
};

function nivelFromEscenario(e: AlertScenario): AlertMlResult["nivel"] {
  if (e === "normal") return "bajo";
  if (e === "lluvia") return "medio";
  if (e === "critico") return "critico";
  return "alto";
}

function softmax(logits: number[]): number[] {
  const m = Math.max(...logits);
  const ex = logits.map((z) => Math.exp(z - m));
  const s = ex.reduce((a, b) => a + b, 0);
  return ex.map((v) => v / s);
}

export function buildAlertFeatureVector(input: AlertMlInput): number[] {
  const { lat, lng, altitud_msnm: alt, mes, temp_min_c, temp_max_c, prob_precipitacion: p } =
    input;
  const mesSin = Math.sin((2 * Math.PI * mes) / 12);
  const mesCos = Math.cos((2 * Math.PI * mes) / 12);
  return [
    (lat + 12) / 3,
    (lng + 76) / 3,
    alt / 4500,
    temp_min_c / 30,
    temp_max_c / 30,
    p,
    (temp_max_c - temp_min_c) / 25,
    mesSin,
    mesCos,
    temp_min_c < 2 ? 1 : 0,
    p >= 0.85 ? 1 : 0,
    alt > 3500 ? 1 : 0
  ];
}

export function predictAlertasMl(input: AlertMlInput): AlertMlResult {
  const x = buildAlertFeatureVector(input);
  const logits = model.weights.map((row, c) =>
    row.reduce((sum, w, j) => sum + w * x[j], 0) + model.biases[c]
  );
  const probs = softmax(logits);
  let best = 0;
  for (let i = 1; i < probs.length; i++) {
    if (probs[i] > probs[best]) best = i;
  }
  const escenario = model.classes[best] as AlertScenario;
  const acc = model.metrics?.accuracyTest;
  const modelo = `ML ${model.version} (${model.algorithm}${acc != null ? ` · ${(acc * 100).toFixed(0)}% test` : ""})`;

  const alertas: AlertMlResult["alertas"] = [MENSAJES[escenario]];
  const secundarias = probs
    .map((p, i) => ({ p, escenario: model.classes[i] as AlertScenario }))
    .filter((x) => x.escenario !== escenario && x.p >= 0.2)
    .sort((a, b) => b.p - a.p)
    .slice(0, 1);
  for (const s of secundarias) {
    alertas.push({
      ...MENSAJES[s.escenario],
      mensaje: `${MENSAJES[s.escenario].mensaje} (${(s.p * 100).toFixed(0)}% ML)`
    });
  }

  return {
    escenario,
    probabilidad: probs[best],
    nivel: nivelFromEscenario(escenario),
    alertas,
    modelo
  };
}

export function getAlertModelLabel(): string {
  const acc = model.metrics?.accuracyTest;
  return `ML ${model.version}${acc != null ? ` (${(acc * 100).toFixed(0)}% test)` : ""}`;
}
