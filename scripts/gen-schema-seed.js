const fs = require("fs");
const path = require("path");

const src = fs.readFileSync(
  path.join(__dirname, "../src/schema/agroPostgresTables.ts"),
  "utf8"
);
const m = src.match(/export const AGRO_POSTGRES_TABLES = \[([\s\S]*?)\] as const/);
const tables = [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);

const rules = [
  ["Terreno", /parcela|finca|lote|suelo|ndvi|ortofoto|carbono|biodiversidad|capas_suelo/i],
  ["Clima", /clima|lluvia|meteo|pronostico|agua|caudal|eventos_clima|variables_ambientales/i],
  ["Cultivo", /cultivo|campania|riego|labores|ensayo|floracion|cosecha|merma|calibre|poscosecha|transporte|rotacion|nutricion/i],
  ["Sanidad", /plaga|trampa|fito|fauna|aplicaciones_fito/i],
  ["Comercial", /precio|pedido|contrato|proveedor|guia|certificado|recepcion|orden_compra|insumo|maquinaria|combustible|almacen/i],
  ["Cooperativa", /cooperativa|socio|grupo_productor|aporte|liquidacion/i],
  ["Finanzas", /gasto|flujo|credito|presupuesto|poliza|seguro/i],
  ["Calidad ISO", /iso|bpa|conformidad|auditoria|evidencia|acta|matriz|riesgo|cumplimiento|prueba_iso/i],
  ["IA y sensores", /ia_|iot|sensor|drone|vuelo|pipeline|embedding|consultas_ia|recomendaciones_ia|diagnostico/i],
  ["Capacitación", /curso|capacitacion|inscripcion|evaluacion|visita|extension/i],
  ["Trazabilidad", /trazabilidad|qrcode|semilla|laboratorio|muestreo/i]
];

function cat(t) {
  for (const [c, r] of rules) if (r.test(t)) return c;
  return "Sistema";
}

function esc(s) {
  return s.replace(/'/g, "''");
}

const rows = tables.map((t) => `  ('${esc(t)}', '${esc(cat(t))}')`);
process.stdout.write(rows.join(",\n"));
