/**
 * Entrena regresión logística multinomial (softmax) para predicción de cultivos.
 * Genera cropModelWeights.json para inferencia en la app (sin dependencias Python).
 *
 * Uso: node scripts/train-crop-ml.js
 */
const fs = require("fs");
const path = require("path");

const CLASSES = ["Papa", "Maíz amiláceo", "Quinua", "Cebada", "Haba"];
const FEATURE_NAMES = [
  "altitud_norm",
  "latitud_norm",
  "longitud_norm",
  "mes_sin",
  "mes_cos",
  "temp_min_norm",
  "temp_max_norm",
  "precip_norm",
  "riesgo_helada",
  "semana_lluviosa",
  "estacion_lluvias_sur",
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

/** Pachamarca / sierra central Perú */
function sampleLocation() {
  return {
    lat: rand(-12.85, -12.15),
    lng: rand(-75.95, -75.25),
    alt: rand(2400, 4200)
  };
}

function imputeClimate(alt) {
  const baseTemp = 22 - ((alt - 2000) / 1000) * 6.5;
  const temp_max = baseTemp + rand(2, 6);
  const temp_min = temp_max - rand(8, 14);
  const precip = rand(2, 45);
  return { temp_min, temp_max, precip };
}

function buildFeatures({ lat, lng, alt, mes, temp_min, temp_max, precip }) {
  const mesSin = Math.sin((2 * Math.PI * mes) / 12);
  const mesCos = Math.cos((2 * Math.PI * mes) / 12);
  const precipNorm = precip / 50;
  const frost = temp_min < 2 ? 1 : 0;
  const wet = precip > 25 ? 1 : 0;
  const rainySeason = [10, 11, 12, 1, 2, 3].includes(mes) ? 1 : 0;
  const highZone = alt > 3500 ? 1 : 0;
  return [
    alt / 4500,
    (lat + 12) / 3,
    (lng + 76) / 3,
    mesSin,
    mesCos,
    temp_min / 30,
    temp_max / 30,
    precipNorm,
    frost,
    wet,
    rainySeason,
    highZone
  ];
}

/** Etiqueta experta (base agronómica sierra) para generar dataset sintético */
function expertClassIndex(f) {
  const [altN, , , , , tminN, , precipN, frost, wet, rainy, high] = f;
  const alt = altN * 4500;
  const scores = CLASSES.map(() => 0);

  // Papa: 2800–4000 m, tolera frío
  scores[0] =
    2.2 -
    Math.abs(alt - 3400) / 900 +
    frost * 0.8 +
    high * 0.6 -
    wet * 0.2;

  // Maíz: 2000–3400 m, más cálido y lluvia moderada
  scores[1] =
    2.0 -
    Math.abs(alt - 2800) / 1100 +
    tminN * 1.2 +
    wet * 0.35 -
    high * 0.9;

  // Quinua: >3000 m, heladas
  scores[2] =
    1.8 -
    Math.abs(alt - 3700) / 800 +
    high * 1.1 +
    frost * 0.5 -
    (alt < 2800 ? 1.5 : 0);

  // Cebada: amplio rango alto, estación seca favorece
  scores[3] =
    1.6 -
    Math.abs(alt - 3200) / 1000 +
    (rainy ? -0.3 : 0.4) +
    frost * 0.4;

  // Haba: 2500–3800, inicio lluvias
  scores[4] =
    1.5 -
    Math.abs(alt - 3100) / 900 +
    rainy * 0.5 +
    precipN * 0.4 -
    (alt > 4000 ? 1 : 0);

  let best = 0;
  for (let i = 1; i < scores.length; i++) {
    if (scores[i] > scores[best]) best = i;
  }
  return best;
}

function generateDataset(n = 12000) {
  const X = [];
  const y = [];
  for (let i = 0; i < n; i++) {
    const loc = sampleLocation();
    const mes = sampleInt(1, 12);
    const climate = imputeClimate(loc.alt);
    const f = buildFeatures({ ...loc, mes, ...climate });
    let label = expertClassIndex(f);
    if (Math.random() < 0.08) {
      label = sampleInt(0, NUM_CLASSES - 1);
    }
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

function train({ X, y }, epochs = 2500, lr = 0.15, l2 = 0.0008) {
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
        for (let j = 0; j < NUM_FEATURES; j++) {
          gradW[c][j] += err * X[i][j];
        }
        gradB[c] += err;
      }
    }

    const n = X.length;
    for (let c = 0; c < NUM_CLASSES; c++) {
      for (let j = 0; j < NUM_FEATURES; j++) {
        W[c][j] -= (lr * (gradW[c][j] / n + l2 * W[c][j]));
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
    const probs = softmaxRow(logits);
    const pred = probs.indexOf(Math.max(...probs));
    if (pred === y[i]) ok++;
  }
  return ok / X.length;
}

function main() {
  console.log("Generando dataset sintético (sierra agrícola Perú)...");
  const trainSet = generateDataset(14000);
  const testSet = generateDataset(3000);

  console.log("Entrenando regresión logística multinomial...");
  const { W, b } = train(trainSet);

  const accTrain = accuracy(W, b, trainSet.X, trainSet.y);
  const accTest = accuracy(W, b, testSet.X, testSet.y);
  console.log(`Precisión train: ${(accTrain * 100).toFixed(1)}%`);
  console.log(`Precisión test:  ${(accTest * 100).toFixed(1)}%`);

  const payload = {
    version: "crop-ml-v1",
    algorithm: "multinomial_logistic_regression",
    trainedAt: new Date().toISOString(),
    classes: CLASSES,
    featureNames: FEATURE_NAMES,
    weights: W,
    biases: b,
    metrics: { accuracyTrain: accTrain, accuracyTest: accTest }
  };

  const targets = [
    path.join(__dirname, "../src/ml/cropModelWeights.json"),
    path.join(__dirname, "../web-admin/src/lib/cropMl/cropModelWeights.json")
  ];

  for (const t of targets) {
    fs.mkdirSync(path.dirname(t), { recursive: true });
    fs.writeFileSync(t, JSON.stringify(payload, null, 2), "utf8");
    console.log("Escrito:", t);
  }
}

main();
