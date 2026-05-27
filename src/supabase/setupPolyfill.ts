/** Polyfill URL para Supabase en React Native (importar al inicio de App). */
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("react-native-url-polyfill/auto");
} catch {
  /* npm install react-native-url-polyfill si falta */
}
