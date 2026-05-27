/**
 * Hermes no compila import() con comentarios de Supabase 2.50+.
 * Reemplaza la carga opcional de OpenTelemetry por Promise.resolve(null).
 */
const fs = require("fs");
const path = require("path");

const files = [
  "node_modules/@supabase/supabase-js/dist/index.cjs",
  "node_modules/@supabase/supabase-js/dist/index.mjs"
];

const pattern =
  /otelModulePromise = import\(\s*\/\* webpackIgnore: true \*\/\s*\/\* @vite-ignore \*\/\s*OTEL_PKG\s*\)\.catch\(\(\) => null\)/;

const replacement = "otelModulePromise = Promise.resolve(null)";

let patched = 0;
for (const rel of files) {
  const file = path.join(__dirname, "..", rel);
  if (!fs.existsSync(file)) continue;
  const src = fs.readFileSync(file, "utf8");
  if (!pattern.test(src)) continue;
  fs.writeFileSync(file, src.replace(pattern, replacement));
  patched += 1;
  console.log("patch-supabase-hermes:", rel);
}

if (patched === 0) {
  console.log("patch-supabase-hermes: nada que parchear (ya aplicado o version distinta)");
}
