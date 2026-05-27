import type { CropMlInput, CropMlPrediction, CropModelWeights } from "./cropModel";
import modelJson from "./cropModelWeights.json";

const model = modelJson as CropModelWeights;

function softmax(logits: number[]): number[] {
  const m = Math.max(...logits);
  const ex = logits.map((z) => Math.exp(z - m));
  const s = ex.reduce((a, b) => a + b, 0);
  return ex.map((v) => v / s);
}

export function buildFeatureVector(input: CropMlInput): number[] {
  const { lat, lng, altitud_msnm: alt, mes, temp_min_c, temp_max_c, precipitacion_mm_semana: precip } =
    input;
  const mesSin = Math.sin((2 * Math.PI * mes) / 12);
  const mesCos = Math.cos((2 * Math.PI * mes) / 12);
  const precipNorm = precip / 50;
  const frost = temp_min_c < 2 ? 1 : 0;
  const wet = precip > 25 ? 1 : 0;
  const rainySeason = [10, 11, 12, 1, 2, 3].includes(mes) ? 1 : 0;
  const highZone = alt > 3500 ? 1 : 0;

  return [
    alt / 4500,
    (lat + 12) / 3,
    (lng + 76) / 3,
    mesSin,
    mesCos,
    temp_min_c / 30,
    temp_max_c / 30,
    precipNorm,
    frost,
    wet,
    rainySeason,
    highZone
  ];
}

export function imputeClimateFromAltitude(altitud_msnm: number): {
  temp_min_c: number;
  temp_max_c: number;
  precipitacion_mm_semana: number;
} {
  const baseTemp = 22 - ((altitud_msnm - 2000) / 1000) * 6.5;
  const temp_max_c = baseTemp + 4;
  const temp_min_c = temp_max_c - 10;
  const precipitacion_mm_semana = 18;
  return { temp_min_c, temp_max_c, precipitacion_mm_semana };
}

export function predictCrops(input: CropMlInput, topK = 3): CropMlPrediction[] {
  const x = buildFeatureVector(input);
  const logits = model.weights.map((row, c) =>
    row.reduce((sum, w, j) => sum + w * x[j], 0) + model.biases[c]
  );
  const probs = softmax(logits);

  const ranked = model.classes
    .map((cultivo, indice) => ({ cultivo, probabilidad: probs[indice], indice }))
    .sort((a, b) => b.probabilidad - a.probabilidad);

  return ranked.slice(0, topK);
}

export function getModelLabel(): string {
  const acc = model.metrics?.accuracyTest;
  const accTxt = acc != null ? ` · ${(acc * 100).toFixed(0)}% precisión test` : "";
  return `ML ${model.version} (${model.algorithm})${accTxt}`;
}

export function getModelMeta(): CropModelWeights {
  return model;
}
