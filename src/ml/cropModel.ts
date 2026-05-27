export type CropModelWeights = {
  version: string;
  algorithm: string;
  trainedAt: string;
  classes: string[];
  featureNames: string[];
  weights: number[][];
  biases: number[];
  metrics?: { accuracyTrain: number; accuracyTest: number };
};

export type CropMlInput = {
  lat: number;
  lng: number;
  altitud_msnm: number;
  mes: number;
  temp_min_c: number;
  temp_max_c: number;
  precipitacion_mm_semana: number;
};

export type CropMlPrediction = {
  cultivo: string;
  probabilidad: number;
  indice: number;
};
