import type { DiagnosticoPlantaResult } from "./diagnosticoLocal";
import {
  diagnosticarPlantaGemini,
  listarDiagnosticosFirestore
} from "../../services/geminiPlanta";

export type HistorialDiagnostico = {
  id: string;
  modelo: string;
  severidad: string;
  resumen: string;
  created_at: string | null;
};

export async function diagnosticarPlantaApi(input: {
  ancho: number;
  alto: number;
  imagenUri?: string;
  notas?: string;
}): Promise<{ result: DiagnosticoPlantaResult; id?: string }> {
  return diagnosticarPlantaGemini(input);
}

export async function listarMisDiagnosticos(limit = 10): Promise<HistorialDiagnostico[]> {
  return listarDiagnosticosFirestore(limit);
}
