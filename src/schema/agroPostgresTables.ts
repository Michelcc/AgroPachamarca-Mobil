/** Catálogo funcional para campo (sin tablas de infra duplicadas). */
export const MIN_TABLES_THESIS = 100;

export const AGRO_POSTGRES_TABLES = [
  "acciones_correctivas",
  "actas_revision_calidad",
  "alertas_comunidad",
  "alertas_historial",
  "almacenes_granel",
  "analisis_laboratorio_externo",
  "aplicaciones_fitosanitarias",
  "aportes_capital_social",
  "auditoria_cambios",
  "auditorias_internas_sgsi",
  "avistamientos_fauna_benefica",
  "balance_nutricion",
  "biodiversidad_shannon_parcela",
  "campanias_agricolas",
  "capas_suelo_geologia",
  "capturas_trampa",
  "casos_fitotoxicidad",
  "catalogo_cultivos",
  "catalogo_insumo_quimico",
  "certificados_origen",
  "configuracion_usuario",
  "consentimientos_usuario_pd",
  "consultas_ia_log",
  "consumo_combustible",
  "contratos_compra",
  "controles_cumplimiento_iso",
  "cooperativas_agrarias",
  "cosecha",
  "creditos_agricolas",
  "cursos_capacitacion",
  "diagnosticos_ia_planta",
  "documentos_adjuntos",
  "encuestas_satisfaccion",
  "ensayos_campo",
  "etiquetas_procesos_normalizados",
  "evaluaciones_curso",
  "eventos_clima_extremo",
  "evidencias_cumplimiento_iso",
  "evidencias_foto_auditoria",
  "fcm_tokens",
  "fichas_seguridad_hoja",
  "fincas",
  "firmas_digitales_registro",
  "floracion_reclutamiento",
  "flujos_caja",
  "gastos",
  "grupos_productores",
  "guias_remision_electronica",
  "historial_suelo",
  "indicadores_agregados",
  "indicadores_iso_25010",
  "indices_ndvi_parcela",
  "inscripciones_curso",
  "inspecciones_bpa",
  "insumos",
  "labores_campo",
  "lecturas_estacion_meteo",
  "lecturas_sensor_suelo",
  "liquidaciones_pagos_productor",
  "lotes",
  "lotes_semilla_trazabilidad",
  "mantenimiento_maquinaria",
  "maquinaria_agricola",
  "matrices_requisito_funcional",
  "matriz_riesgos",
  "mediciones_caudal",
  "mensajes_comunidad_chat",
  "mensajes_ticket_interaccion",
  "mermas_cosecha_registro",
  "monitoreo_aereo_drones",
  "muestreos_agua_canal",
  "muestreos_calidad",
  "no_conformidades",
  "normas_iso_referencia",
  "notificaciones_usuario",
  "orden_compra_detalle",
  "ortofotos_parcela",
  "paneles_solares_finca",
  "parcelas",
  "pedidos_mercado_mayorista",
  "plagas",
  "planes_contingencia",
  "politicas_retencion_datos",
  "polizas_seguro_campo",
  "pozos_agua",
  "precios_mercado",
  "presupuestos_campania",
  "proveedores",
  "qrcode_trazabilidad_lote",
  "recepciones_mercancia",
  "recomendaciones_ia_cultivo_cache",
  "registros_lluvia",
  "respuestas_encuesta_linea",
  "riego",
  "rotacion_cultivos",
  "seleccion_calibres",
  "sensores_iot_registry",
  "socios_cooperativa",
  "stock_carbono_parcela",
  "tickets_soporte",
  "trampas_monitoreo",
  "transportes_cosecha",
  "tratamientos_poscosecha",
  "trazabilidad_muestra_laboratorio",
  "umbrales_monitores_plaga",
  "variables_ambientales_diarias",
  "visitas_extension_rural",
  "visitas_tecnico",
  "vuelos_drone_agendados"
] as const;

export type AgroTableName = (typeof AGRO_POSTGRES_TABLES)[number];

const TABLE_SET = new Set<string>(AGRO_POSTGRES_TABLES);

export function isAgroCampoTable(tabla: string): tabla is AgroTableName {
  return TABLE_SET.has(tabla);
}

export type TableCategory =
  | "Terreno"
  | "Clima"
  | "Cultivo"
  | "Sanidad"
  | "Comercial"
  | "Cooperativa"
  | "Finanzas"
  | "Calidad ISO"
  | "IA y sensores"
  | "Capacitación"
  | "Trazabilidad"
  | "Sistema";

const CATEGORY_RULES: Array<{ category: TableCategory; match: RegExp }> = [
  { category: "Terreno", match: /parcela|finca|lote|suelo|ndvi|ortofoto|carbono|biodiversidad|capas_suelo/i },
  { category: "Clima", match: /clima|lluvia|meteo|pronostico|agua|caudal|eventos_clima|variables_ambientales/i },
  { category: "Cultivo", match: /cultivo|campania|riego|labores|ensayo|floracion|cosecha|merma|calibre|poscosecha|transporte|rotacion|nutricion/i },
  { category: "Sanidad", match: /plaga|trampa|fito|fauna|aplicaciones_fito/i },
  { category: "Comercial", match: /precio|pedido|contrato|proveedor|guia|certificado|recepcion|orden_compra|insumo|maquinaria|combustible|almacen/i },
  { category: "Cooperativa", match: /cooperativa|socio|grupo_productor|aporte|liquidacion/i },
  { category: "Finanzas", match: /gasto|flujo|credito|presupuesto|poliza|seguro/i },
  { category: "Calidad ISO", match: /iso|bpa|conformidad|auditoria|evidencia|acta|matriz|riesgo|cumplimiento|prueba_iso/i },
  { category: "IA y sensores", match: /ia_|iot|sensor|drone|vuelo|pipeline|embedding|consultas_ia|recomendaciones_ia|diagnostico/i },
  { category: "Capacitación", match: /curso|capacitacion|inscripcion|evaluacion|visita|extension/i },
  { category: "Trazabilidad", match: /trazabilidad|qrcode|semilla|laboratorio|muestreo/i },
  { category: "Sistema", match: /.*/ }
];

export function tableCategory(tabla: string): TableCategory {
  for (const rule of CATEGORY_RULES) {
    if (rule.match.test(tabla)) return rule.category;
  }
  return "Sistema";
}

export function tableLabel(tabla: string): string {
  return tabla.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function assertThesisMinimum(): boolean {
  return AGRO_POSTGRES_TABLES.length >= MIN_TABLES_THESIS;
}

export const TABLE_COUNT = AGRO_POSTGRES_TABLES.length;
