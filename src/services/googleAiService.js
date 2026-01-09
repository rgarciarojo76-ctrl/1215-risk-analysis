import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `
Actúa como herramienta de apoyo y contraste técnico para un Técnico Superior en Prevención de Riesgos Laborales.
Tu tarea es analizar la imagen proporcionada y detectar exclusivamente factores de riesgo laborales OBJETIVAMENTE VISIBLES.
NO inventes riesgos que no se vean claramente en la imagen. Sé riguroso y cíñete a lo visual.

Para cada riesgo detectado, debes proporcionar:
1. Factor de riesgo: Descripción técnica y precisa del riesgo.
2. Evidencia: Qué se observa exactamente en la imagen que confirma el riesgo.
3. Medida: Medida preventiva detallada y técnica, basándote preferentemente en Criterios Técnicos del INSST.
4. Fuente: Referencia normativa española aplicable (RD 1215/1997, RD 486/1997) y especialmente Notas Técnicas de Prevención (NTP) del INSST relacionadas.
5. Probabilidad: Baja, Media o Alta.
6. Severidad: Baja, Media o Alta.
7. Grado de riesgo: Trivial, Tolerable, Moderado, Importante o Intolerable.
8. Plazo: Tiempo estimado para subsanar (ej: Inmediato, 1 mes, 6 meses).
9. Coste estimado: Rango de coste (ej: < 100€, 100-500€, > 500€).

También debes generar un "dalle_prompt" (en inglés) que describa VISUALMENTE la escena para que una IA pueda redibujarla.
CRITERIOS OBLIGATORIOS PARA LA GENERACIÓN (dalle_prompt):
1. FIDELIDAD ABSOLUTA: Mantén exactamente el mismo encuadre, perspectiva, iluminación y personas (misma postura/posición). NO alteres la escena base.
2. CAMBIOS PERMITIDOS: Solo introduce protecciones colectivas (barandillas, resguardos), señalización, orden/limpieza y EPIs.
3. PROHIBICIONES: NO inventes riesgos, NO añadas señales redundantes, NO cambies el trabajo realizado.
4. RESULTADO: La imagen debe ser fotorealista, técnica y juridicamente defendible.
El prompt debe ser extremadamente detallado en inglés, empezando con "Photo of..." y describiendo primero la escena original estática y luego las mejoras de seguridad aplicadas sutilmente.
IMPORTANTE: Responde ÚNICAMENTE con un objeto JSON válido con la siguiente estructura:
{
  "risks": [
    {
      "id": 1,
      "factor": "...",
      "evidencia": "...",
      "medida": "...",
      "fuente": "...",
      "probabilidad": "...",
      "severidad": "...",
      "grado_riesgo": "...",
      "plazo": "...",
      "coste_estimado": "..."
    }
  ],
  "dalle_prompt": "..."
}
`;

export const analyzeImageWithGemini = async (imageFile, apiKey) => {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Convert file to generative part
    const fileToGenerativePart = async (file) => {
        const base64EncodedDataPromise = new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(file);
        });
        return {
            inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
        };
    };

    const imagePart = await fileToGenerativePart(imageFile);

    try {
        const result = await model.generateContent([SYSTEM_PROMPT, imagePart]);
        const response = await result.response;
        let text = response.text();

        // Clean markdown code blocks if present
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return JSON.parse(text);
    } catch (error) {
        console.error("Error calling Gemini:", error);
        throw error;
    }
};

export const expandManualRiskWithGemini = async (riskDescription, apiKey) => {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return JSON.parse(text);
    } catch (error) {
        console.error("Error expanding risk with Gemini:", error);
        throw error;
    }
};

export const generateImageWithImagen = async (prompt, apiKey) => {
    // Use Imagen 4 Ultra via Google Generative Language API (Requires Billing)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-ultra-generate-001:predict?key=${apiKey}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            instances: [{ prompt: `Photorealistic industrial safety visualization, high quality, 4k: ${prompt}` }],
            parameters: { sampleCount: 1 }
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Imagen API failed');
    }

    const data = await response.json();
    if (data.predictions && data.predictions[0]?.bytesBase64Encoded) {
        return `data:image/jpeg;base64,${data.predictions[0].bytesBase64Encoded}`;
    }
    throw new Error('No image generated');
};
