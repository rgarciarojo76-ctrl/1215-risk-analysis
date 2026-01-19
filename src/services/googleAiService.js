// import { GoogleGenerativeAI } from "@google/generative-ai"; // Removed - Backend only

const SYSTEM_PROMPT = `
ROL Y CONTEXTO
Actúa como un técnico superior en prevención de riesgos laborales, aplicando estrictamente la Ley 31/1995, sus Reales Decretos de desarrollo, y los criterios técnicos del INSST.
Tu función NO ES recrear ni reinterpretar la escena, sino intervenir mínimamente sobre una fotografía real existente (Digital Twin).

PRINCIPIO FUNDAMENTAL (OBLIGATORIO)
La fotografía original es inmutable. Debe tratarse como una imagen base fija.
Si un elemento no está directamente relacionado con una medida preventiva, no puede ser modificado.

FASE 1 · ANÁLISIS 
Identifica únicamente los factores de riesgo laborales OBJETIVAMENTE VISIBLES.
Selecciona todas las medidas preventivas razonables (Técnicas, Equipos, Señalización, EPIs).

FASE 2 · GENERACIÓN DE "dalle_prompt" (Descripción Visual Definitiva)
El objetivo es generar una imagen que muestre CÓMO DEBERÍA QUEDAR la escena tras aplicar las medidas.
Escribe un prompt en INGLÉS detallado y visual, como si describieras una fotografía ya terminada.

ESTRUCTURA DEL PROMPT:
1. "High quality photorealistic industrial photograph of..." (Describe el tipo de lugar: almacén, oficina, obra).
2. "VISUAL CONTEXT": Describe la escena general (iluminación, colores principales, tipo de suelo/paredes) para mantener la coherencia con la imagen original.
3. "SAFETY MEASURES APPLIED (KEY ELEMENTS)":
   - Describe VISUALMENTE los elementos de seguridad que AHORA ESTÁN PRESENTES.
   - NO digas "se debe instalar", di "there is a yellow guardrail installed at...".
   - Ejemplo: "A bright yellow safety barrier is clearly visible blocking the drop-off edge."
   - Ejemplo: "A standard green and white emergency exit sign is mounted above the door."
   - Ejemplo: "The floor is clean and marked with yellow/black hazard tape."
4. "ATMOSPHERE": "Professional, clean, safe working environment, 4k, sharp focus."

IMPORTANTE PARA EL PROMPT:
- Debe funcionar tanto para editar la foto original como para generar una nueva desde cero si falla la edición.
- Por eso, la descripción debe ser completa y autosuficiente.
- Describe la escena FINAL SEGURA, no el proceso de cambio.

FORMATO DE SALIDA (ESTRICTAMENTE JSON):
Responde ÚNICAMENTE con un objeto JSON válido con la siguiente estructura:
{
  "risks": [
    {
      "id": 1,
      "factor": "Descripción técnica del riesgo",
      "evidencia": "Qué se observa visualmente",
      "medida": "Medida preventiva técnica (INSST)",
      "fuente": "Normativa legal / NTP aplicable",
      "probabilidad": "Baja/Media/Alta",
      "severidad": "Baja/Media/Alta",
      "grado_riesgo": "Trivial/Tolerable/Moderado/Importante/Intolerable",
      "plazo": "Inmediato/1 mes...",
      "coste_estimado": "€...",
      "coordinates": [ymin, xmin, ymax, xmax] // Coordenadas 0-1000 (0,0=Top-Left, 1000,1000=Bottom-Right). Basado en imagen COMPLETA sin recortar.
    }
  ],
  "dalle_prompt": "El prompt en INGLÉS descrito arriba. Máximo 400 caracteres."
}
`;


// Note: apiKey is no longer used on frontend, but kept in signature to avoid breaking component calls immediately
export const analyzeImageWithGemini = async (imageFile, apiKey) => {
    // Convert file to base64
    const base64Promise = new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(imageFile);
    });
    const base64Data = await base64Promise;

    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                systemPrompt: SYSTEM_PROMPT,
                imageBase64: base64Data,
                mimeType: imageFile.type
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server Error: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error calling Backend Analyze:", error);
        throw error;
    }
};

export const expandManualRiskWithGemini = async (riskDescription, apiKey) => {
    const prompt = `
Eres un experto en Prevención de Riesgos Laborales (PRL). 
El usuario te proporcionará una breve descripción de un factor de riesgo detectado manualmente. 
Tu tarea es completar todos los detalles técnicos necesarios para una ficha de evaluación profesional.

Factor de riesgo proporcionado: "${riskDescription}"

Responde ÚNICAMENTE con un objeto JSON válido:
{
  "id": "generated_id",
  "factor": "${riskDescription}",
  "evidencia": "Descripción técnica detallada de por qué esto supone un riesgo basándote en el factor mencionado",
  "medida": "Medida preventiva técnica basada en criterios del INSST",
  "fuente": "Normativa legal (RD) y Notas Técnicas de Prevención (NTP) del INSST aplicables",
  "probabilidad": "Media",
  "severidad": "Media",
  "grado_riesgo": "Moderado",
  "plazo": "1 mes",
  "coste_estimado": "100-500€"
}
`;

    try {
        const response = await fetch('/api/expand', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) {
            throw new Error('Backend Expand Failed');
        }

        return await response.json();
    } catch (error) {
        console.error("Error calling Backend Expand:", error);
        throw error;
    }
};

export const generateImageWithImagen = async (prompt, apiKey, imageBase64) => {
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, imageBase64 })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Backend Generate Failed');
        }

        const data = await response.json();
        return data.image; // Base64 image
    } catch (error) {
        console.error("Error calling Backend Generate:", error);
        throw error;
    }
};
