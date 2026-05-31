import {
  DIMENSIONES_OPERACIONALIZACION,
  type DimensionOperacional
} from "./operacionalizacion";

/** Módulos técnicos anidados dentro de cada dimensión */
export type ModuloDimension = {
  id: string;
  label: string;
  descripcion: string;
  webHref: string;
  mobileScreen?: RootModuloScreen;
  emoji: string;
};

export type RootModuloScreen =
  | "ModuloProductos"
  | "ModuloSensores"
  | "ModuloClima"
  | "ModuloCultivo"
  | "ModuloPlanta";

export const MODULOS_POR_DIMENSION: Record<string, ModuloDimension[]> = {
  productividad: [
    {
      id: "productos",
      label: "Productos",
      descripcion: "Catálogo e inventario (rendimiento y calidad)",
      webHref: "/admin/tablas/productos",
      mobileScreen: "ModuloProductos",
      emoji: "📦"
    }
  ],
  gestion_recursos: [
    {
      id: "productos",
      label: "Productos / insumos",
      descripcion: "Fertilizantes y recursos medidos",
      webHref: "/admin/tablas/productos",
      mobileScreen: "ModuloProductos",
      emoji: "📦"
    },
    {
      id: "sensores",
      label: "Sensores de suelo",
      descripcion: "Medición IoT: humedad, pH, temperatura",
      webHref: "/admin/tablas/sensores",
      mobileScreen: "ModuloSensores",
      emoji: "📡"
    }
  ],
  prediccion_agricola: [
    {
      id: "recomendaciones",
      label: "Recomendaciones ML",
      descripcion: "Predicción de cultivos",
      webHref: "/admin/recomendaciones",
      mobileScreen: "ModuloCultivo",
      emoji: "🌾"
    },
    {
      id: "alertas",
      label: "Alertas climáticas",
      descripcion: "Anticipación y riesgos",
      webHref: "/admin/alertas",
      mobileScreen: "ModuloClima",
      emoji: "☁️"
    },
    {
      id: "planta",
      label: "Diagnósticos IA",
      descripcion: "Análisis de planta con visión",
      webHref: "/admin/diagnosticos",
      mobileScreen: "ModuloPlanta",
      emoji: "🔬"
    }
  ],
  toma_decisiones: []
};

export function getDimensionById(id: string): DimensionOperacional | undefined {
  return DIMENSIONES_OPERACIONALIZACION.find((d) => d.id === id);
}
