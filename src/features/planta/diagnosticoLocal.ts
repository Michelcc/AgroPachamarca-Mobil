/**
 * Asistente de diagnóstico **demostración** (sin modelo de visión en el dispositivo).
 * Las sugerencias son orientativas; en producción conviene un servicio con modelo entrenado.
 */
export type DiagnosticoPlantaResult = {
  titulo: string;
  resumen: string;
  posible_problema: string;
  severidad: "baja" | "media" | "alta";
  como_mejorar: string[];
  prevencion: string[];
  aviso: string;
};

const ESCENARIOS: DiagnosticoPlantaResult[] = [
  {
    titulo: "Hoja con manchas oscuras",
    resumen:
      "Por la forma típica de manchas en hojas, podría tratarse de un hongo foliar o exceso de humedad en el follaje.",
    posible_problema: "Mildiu u otra enfermedad fúngica (no confirmado sin laboratorio).",
    severidad: "media",
    como_mejorar: [
      "Mejorar el aire entre plantas (poda sanitaria de ramas muy cargadas).",
      "Evitar mojar el follaje al regar; preferir riego al pie en horas con sol.",
      "Si tu técnico agrícola lo indica, aplicar fungicida autorizado para el cultivo y seguir la dosis al pie de la letra.",
      "Retirar hojas muy afectadas y desecharlas lejos del cultivo (no compostar enfermas)."
    ],
    prevencion: [
      "Rotar cultivos según plan de suelo.",
      "Monitorear después de lluvias o rocío fuerte en zonas frías como Pachamarca."
    ],
    aviso:
      "Esta respuesta es generada en modo demostración a partir de datos básicos de la imagen. No sustituye visita de campo ni análisis de laboratorio."
  },
  {
    titulo: "Hoja amarillenta o clorótica",
    resumen:
      "El tono amarillento puede deberse a falta de nutrientes (nitrógeno, hierro) o a encharcamiento / raíces con poco oxígeno.",
    posible_problema: "Clorosis por nutrición o estrés hídrico.",
    severidad: "baja",
    como_mejorar: [
      "Revisar drenaje y compactación del suelo; evitar pisar surcos mojados.",
      "Si hay análisis de suelo reciente, contrastar con recomendaciones de fertilización local.",
      "Aplicar enmienda o fertilizante solo si un técnico confirma el déficit (evitar sobredosis)."
    ],
    prevencion: [
      "Mantener materia orgánica estable en el suelo según prácticas de la zona.",
      "Registrar riegos y lluvias para no combinar ambos en exceso."
    ],
    aviso:
      "Modo demostración: confirma síntomas con muestreo y asesoría del programa agrario local."
  },
  {
    titulo: "Bordes secos o quemados",
    resumen:
      "Los márgenes secos suelen relacionarse con salinidad, viento fuerte, helada tardía o fitotoxicidad por producto mal dosificado.",
    posible_problema: "Estrés abiótico (clima, sales o aplicación agrícola).",
    severidad: "media",
    como_mejorar: [
      "Revisar calendario de últimas aplicaciones y compatibilidad de productos.",
      "Proteger lote con cortavientos o riego ligero antes de heladas leves, según criterio técnico.",
      "En suelos salinos, consultar lavado controlado y cultivos tolerantes."
    ],
    prevencion: [
      "Hacer prueba de jarra en mezclas nuevas antes de fumigar todo el lote.",
      "Registrar temperatura mínima nocturna en las fechas críticas."
    ],
    aviso:
      "Demostración: la causa real solo se define con historia del lote y visita al terreno."
  },
  {
    titulo: "Plaga visible u orificios en hoja",
    resumen:
      "Si observas perforaciones, larvas o excrementos, puede haber insectos masticadores o chupadores activos.",
    posible_problema: "Daño por insectos (especie a identificar en campo).",
    severidad: "alta",
    como_mejorar: [
      "Tomar fotos claras del insecto y de la parte dañada para el técnico o estación experimental.",
      "Evaluar umbral económico antes de aplicar; no aplicar por rutina sin conteo.",
      "Usar solo productos registrados para el cultivo y respetar carencias de cosecha."
    ],
    prevencion: [
      "Colocar trampas de monitoreo según recomendación regional.",
      "Fomentar enemigos naturales (floración perimetral) donde aplique."
    ],
    aviso:
      "Modo demostración: identificación de plaga requiere especialista o laboratorio de entomología."
  }
];

export function analizarFotoPlantaDemo(input: { ancho: number; alto: number }): DiagnosticoPlantaResult {
  const idx = Math.abs(Math.floor(input.ancho * 13 + input.alto * 7)) % ESCENARIOS.length;
  const base = ESCENARIOS[idx];
  return {
    ...base,
    resumen: `${base.resumen} (Análisis demo según tamaño de imagen ${input.ancho}×${input.alto}px.)`
  };
}
