export type AlertScenario = "normal" | "lluvia" | "lluvia_fuerte" | "helada" | "critico";

export type AlertModelWeights = {
  version: string;
  algorithm: string;
  trainedAt: string;
  classes: AlertScenario[];
  featureNames: string[];
  weights: number[][];
  biases: number[];
  metrics?: { accuracyTrain: number; accuracyTest: number };
};

export type AlertMlInput = {
  lat: number;
  lng: number;
  altitud_msnm: number;
  mes: number;
  temp_min_c: number;
  temp_max_c: number;
  prob_precipitacion: number;
};

export type AlertMlResult = {
  escenario: AlertScenario;
  probabilidad: number;
  nivel: "bajo" | "medio" | "alto" | "critico";
  alertas: Array<{ mensaje: string; tipo: string }>;
  modelo: string;
};
