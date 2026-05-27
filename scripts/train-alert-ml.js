/**
 * Entrena clasificador ML de alertas climáticas (softmax).
 * Uso: node scripts/train-alert-ml.js
 */
const fs = require("fs");
const path = require("path");

const CLASSES = ["normal", "lluvia", "lluvia_fuerte", "helada", "critico"];
const FEATURE_NAMES = [
  "latitud_norm",
  "longitud_norm",
  "altitud_norm",
  "temp_min_norm",
  "temp_max_norm",
  "precip_prob_norm",
  "amplitud_termica",
  "mes_sin",
  "mes_cos",
  "indicador_helada",
  "indicador_lluvia_fuerte",
  "zona_alta_sierra"
];

const NUM_FEATURES = FEATURE_NAMES.length;
const NUM_CLASSES = CLASSES.length;

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function sampleInt(a, b) {
  return Math.floor(rand(a, b + 1));
}

function sampleLocation() {
  return {
    lat: rand(-12.85, -12.15),
    lng: rand(-75.95, -75.25),
    alt: rand(2400, 4200)
  };
}

function sampleWeather(alt) {
  const base = 22 - ((alt - 2000) / 1000) * 6.5;
  const temp_max = base + rand(1, 8);
  const temp_min = temp_max - rand(6, 16);
  const prob_precip = rand(0, 1);
  return { temp_min, temp_max, prob_precip };
}

function buildFeatures({ lat, lng, alt, mes, temp_min, temp_max, prob_precip }) {
  const mesSin = Math.sin((2 * Math.PI * mes) / 12);
  const mesCos = Math.cos((2 * Math.PI * mes) / 12);
  const frost = temp_min < 2 ? 1 : 0;
  const heavyRain = prob_precip >= 0.85 ? 1 : 0;
  const highZone = alt > 3500 ? 1 : 0;
  return [
    (lat + 12) / 3,
    (lng + 76) / 3,
    alt / 4500,
    temp_min / 30,
    temp_max / 30,
    prob_precip,
    (temp_max - temp_min) / 25,
    mesSin,
    mesCos,
    frost,
    heavyRain,
    highZone
  ];
}

function expertClassIndex(f, raw) {
  const frost = raw.temp_min < 2;
  const p = raw.prob_precip;
  if (frost && p >= 0.75) return 4; // critico
  if (frost) return 3; // helada
  if (p >= 0.85) return 2; // lluvia_fuerte
  if (p >= 0.65) return 1; // lluvia
  return 0; // normal
}

function generateDataset(n = 10000) {
  const X = [];
  const y = [];
  for (let i = 0; i < n; i++) {
    const loc = sampleLocation();
    const mes = sampleInt(1, 12);
    const w = sampleWeather(loc.alt);
    const f = buildFeatures({ ...loc, mes, ...w });
    let label = expertClassIndex(f, w);
    if (Math.random() < 0.06) label = sampleInt(0, NUM_CLASSES - 1);
    X.push(f);
    y.push(label);
  }
  return { X, y };
}

function softmaxRow(logits) {
  const m = Math.max(...logits);
  const ex = logits.map((z) => Math.exp(z - m));
  const s = ex.reduce((a, b) => a + b, 0);
  return ex.map((v) => v / s);
}

function train({ X, y }, epochs = 2000, lr = 0.12, l2 = 0.001) {
  const W = Array.from({ length: NUM_CLASSES }, () =>
    Array.from({ length: NUM_FEATURES }, () => (Math.random() - 0.5) * 0.08)
  );
  const b = new Array(NUM_CLASSES).fill(0);

  for (let epoch = 0; epoch < epochs; epoch++) {
    const gradW = W.map((row) => row.map(() => 0));
    const gradB = new Array(NUM_CLASSES).fill(0);
    let loss = 0;

    for (let i = 0; i < X.length; i++) {
      const logits = W.map((row, c) => row.reduce((s, w, j) => s + w * X[i][j], 0) + b[c]);
      const probs = softmaxRow(logits);
      loss -= Math.log(Math.max(probs[y[i]], 1e-9));
      for (let c = 0; c < NUM_CLASSES; c++) {
        const err = probs[c] - (c === y[i] ? 1 : 0);
        for (let j = 0; j < NUM_FEATURES; j++) gradW[c][j] += err * X[i][j];
        gradB[c] += err;
      }
    }

    const n = X.length;
    for (let c = 0; c < NUM_CLASSES; c++) {
      for (let j = 0; j < NUM_FEATURES; j++) {
        W[c][j] -= lr * (gradW[c][j] / n + l2 * W[c][j]);
      }
      b[c] -= lr * (gradB[c] / n);
    }
    if (epoch % 500 === 499) {
      console.log(`  epoch ${epoch + 1}  loss=${(loss / n).toFixed(4)}`);
    }
  }
  return { W, b };
}

function accuracy(W, b, X, y) {
  let ok = 0;
  for (let i = 0; i < X.length; i++) {
    const logits = W.map((row, c) => row.reduce((s, w, j) => s + w * X[i][j], 0) + b[c]);
    const pred = softmaxRow(logits).indexOf(Math.max(...softmaxRow(logits)));
    if (pred === y[i]) ok++;
  }
  return ok / X.length;
}

function main() {
  console.log("Entrenando clasificador de alertas climáticas...");
  const trainSet = generateDataset(12000);
  const testSet = generateDataset(3000);
  const { W, b } = train(trainSet);
  const accTrain = accuracy(W, b, trainSet.X, trainSet.y);
  const accTest = accuracy(W, b, testSet.X, testSet.y);
  console.log(`Precisión train: ${(accTrain * 100).toFixed(1)}%`);
  console.log(`Precisión test:  ${(accTest * 100).toFixed(1)}%`);

  const payload = {
    version: "alert-ml-v1",
    algorithm: "multinomial_logistic_regression",
    trainedAt: new Date().toISOString(),
    classes: CLASSES,
    featureNames: FEATURE_NAMES,
    weights: W,
    biases: b,
    metrics: { accuracyTrain: accTrain, accuracyTest: accTest }
  };

  for (const t of [
    path.join(__dirname, "../src/ml/alertModelWeights.json"),
    path.join(__dirname, "../web-admin/src/lib/alertMl/alertModelWeights.json")
  ]) {
    fs.mkdirSync(path.dirname(t), { recursive: true });
    fs.writeFileSync(t, JSON.stringify(payload, null, 2), "utf8");
    console.log("Escrito:", t);
  }
}

main();
