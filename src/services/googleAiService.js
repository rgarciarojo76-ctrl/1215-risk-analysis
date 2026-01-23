// import { GoogleGenerativeAI } from "@google/generative-ai"; // Removed - Backend only


const generateSystemPrompt = (currentPoint) => `
ROL Y CONTEXTO
Actúa como un técnico superior en prevención de riesgos laborales, aplicando el RD 1215/1997.
Estás evaluando el PUNTO ${currentPoint?.id || 'General'}: "${currentPoint?.title || ''}".

CONTEXTO TÉCNICO ESPECÍFICO:
"${currentPoint?.legal_text || ''}"

CRITERIOS DE EXPERTO (BUSCAR ACTIVAMENTE):
${currentPoint?.expert_criteria?.map(c => `- ${c}`).join('\n') || '- Analizar riesgos generales.'}

PUNTOS DE VERIFICACIÓN VISUAL (EVIDENCIAS):
${currentPoint?.check_points?.map(cp => `- ${cp.label}: ${cp.detail}`).join('\n') || ''}

TU TAREA:
1. Analiza la imagen buscando CUMPLIMIENTO o INCUMPLIMIENTO de estos criterios específicos.
2. Si ves un riesgo claro relacionado con estos puntos, márcalo.
3. Si la imagen cumple los criterios visuales (ej. colores correctos, resguardos presentes), indícalo también si es relevante, pero prioriza los RIESGOS.

FORMATO DE SALIDA (ESTRICTAMENTE JSON):
Responde ÚNICAMENTE con un objeto JSON válido:
{
  "risks": [
    {
      "id": 1,
      "factor": "Nombre corto del riesgo o defecto detectado",
      "evidencia": "Explicación de por qué incumple el criterio específico",
      "medida": "Medida correctiva sugerida",
      "probabilidad": "Media",
      "severidad": "Alta",
      "coordinates": [ymin, xmin, ymax, xmax] // Coordenadas 0-1000 del elemento en la imagen.
    }
  ]
}
`;



// Note: apiKey is no longer used on frontend, but kept in signature to avoid breaking component calls immediately
// Note: input can be a File object or a Base64 Data URL string
export const analyzeImageWithGemini = async (input, currentPoint) => {
    let base64Data = '';
    let mimeType = 'image/jpeg'; // Default

    if (input instanceof File) {
        mimeType = input.type;
        base64Data = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(input);
        });
    } else if (typeof input === 'string' && input.startsWith('data:')) {
        // Handle Data URL: "data:image/png;base64,..."
        const matches = input.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
            mimeType = matches[1];
            base64Data = matches[2];
        }
    } else {
        throw new Error("Invalid image input. Must be File or Data URL.");
    }

    // Generate Context-Aware Prompt
    const systemPrompt = generateSystemPrompt(currentPoint);

    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                systemPrompt: systemPrompt,
                imageBase64: base64Data,
                mimeType: mimeType
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

export const sendChatToGemini = async (message, context, history) => {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, context, history })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Backend Chat Failed');
        }

        const data = await response.json();
        return data.reply;
    } catch (error) {
        console.error("Error calling Backend Chat:", error);
        throw error;
    }
};

