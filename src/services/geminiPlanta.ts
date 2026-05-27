import * as FileSystem from "expo-file-system";
import type { DiagnosticoPlantaResult } from "../features/planta/diagnosticoLocal";
import { getGeminiApiKey } from "../config/env";
import { analizarFotoPlantaDemo } from "../features/planta/diagnosticoLocal";
import type { HistorialDiagnostico } from "../features/planta/plantaApi";
import { getSupabase } from "../supabase/client";
import { requireUserId } from "../supabase/requireUser";

async function imageToBase64(uri: string): Promise<string | null> {
  try {
    return await FileSystem.readAsStringAsync(uri, { encoding: "base64" });
  } catch {
    return null;
  }
}

function mapGeminiJson(text: string): DiagnosticoPlantaResult | null {
  try {
    const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
    const o = JSON.parse(cleaned) as Record<string, unknown>;
    const sev = o.severidad;
    const severidad = sev === "baja" || sev === "media" || sev === "alta" ? sev : "media";
    return {
      titulo: String(o.titulo ?? "Diagnostico IA"),
      resumen: String(o.resumen ?? ""),
      posible_problema: String(o.posible_problema ?? ""),
      severidad,
      como_mejorar: Array.isArray(o.como_mejorar) ? o.como_mejorar.map(String) : [],
      prevencion: Array.isArray(o.prevencion) ? o.prevencion.map(String) : [],
      aviso: String(o.aviso ?? "Analisis Gemini + Supabase.")
    };
  } catch {
    return null;
  }
}

export async function diagnosticarPlantaGemini(input: {
  ancho: number;
  alto: number;
  imagenUri?: string;
  notas?: string;
}): Promise<{ result: DiagnosticoPlantaResult; id?: string }> {
  const key = getGeminiApiKey();
  let result: DiagnosticoPlantaResult;

  if (!key) {
    result = analizarFotoPlantaDemo({ ancho: input.ancho, alto: input.alto });
  } else {
    const parts: Array<Record<string, unknown>> = [
      {
        text:
          "Agronomo Pachamarca. JSON: titulo, resumen, posible_problema, severidad (baja|media|alta), como_mejorar[], prevencion[], aviso. " +
          (input.notas ?? "")
      }
    ];
    if (input.imagenUri) {
      const b64 = await imageToBase64(input.imagenUri);
      if (b64) parts.push({ inline_data: { mime_type: "image/jpeg", data: b64 } });
    }
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts }] })
    });
    if (!res.ok) {
      result = analizarFotoPlantaDemo({ ancho: input.ancho, alto: input.alto });
    } else {
      const json = (await res.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      result =
        mapGeminiJson(json.candidates?.[0]?.content?.parts?.[0]?.text ?? "") ??
        analizarFotoPlantaDemo({ ancho: input.ancho, alto: input.alto });
    }
  }

  const userId = await requireUserId();
  const { data, error } = await getSupabase()
    .from("diagnosticos_ia")
    .insert({
      user_id: userId,
      modelo: key ? "gemini-1.5-flash" : "demo-local",
      severidad: result.severidad,
      titulo: result.titulo,
      resumen: result.resumen
    })
    .select("id")
    .single();
  if (error) throw error;
  return { result, id: data?.id ? String(data.id) : undefined };
}

export async function listarDiagnosticosFirestore(lim = 10): Promise<HistorialDiagnostico[]> {
  const userId = await requireUserId();
  const { data, error } = await getSupabase()
    .from("diagnosticos_ia")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(lim);
  if (error) throw error;
  return (data ?? []).map((d) => ({
    id: String(d.id),
    modelo: String(d.modelo ?? "gemini"),
    severidad: String(d.severidad ?? "media"),
    resumen: String(d.resumen ?? ""),
    created_at: d.created_at ? new Date(String(d.created_at)).toISOString() : null
  }));
}
