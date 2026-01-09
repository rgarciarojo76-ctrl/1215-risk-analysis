
const SYSTEM_PROMPT = `
Actúa como herramienta de apoyo y contraste técnico para un Técnico Superior en Prevención de Riesgos Laborales.
Analiza los factores de riesgo visibles.
Salida en formato JSON estricto:
{
  "risks": [
    {
      "id": 1,
      "factor": "Descripción detallada del factor de riesgo",
      "evidencia": "Evidencia visual clara",
      "medida": "Medida preventiva detallada",
      "fuente": "Referencia normativa",
      "probabilidad": "Baja|Media|Alta",
      "severidad": "Baja|Media|Alta",
      "grado_riesgo": "Trivial|Tolerable|Moderado|Importante|Intolerable",
      "plazo": "Ej: Inmediato, 1 mes, 6 meses",
      "coste_estimado": "Ej: < 100€, 100-500€, > 500€"
    }
  ],
  "dalle_prompt": "Una descripción visual detallada de la escena de la imagen original, pero transformándola para que muestre las medidas preventivas ya aplicadas. Estilo fotorrealista, fotografía industrial profesional."
}
`;

export const analyzeImageWithOpenAI = async (imageFile, apiKey) => {
    // Convert file to base64
    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const base64Image = await toBase64(imageFile);

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: SYSTEM_PROMPT
                    },
                    {
                        role: "user",
                        content: [
                            { type: "text", text: "Analiza esta imagen detectando riesgos laborales." },
                            {
                                type: "image_url",
                                image_url: {
                                    url: base64Image
                                }
                            }
                        ]
                    }
                ],
                response_format: { type: "json_object" },
                max_tokens: 1000
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        const content = JSON.parse(data.choices[0].message.content);
        return content;
    } catch (error) {
        console.error("Error calling OpenAI:", error);
        throw error;
    }
};

export const generateSafetyImage = async (prompt, apiKey) => {
    try {
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "dall-e-3",
                prompt: `Fotografía industrial realista: ${prompt}`,
                n: 1,
                size: "1024x1024"
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        return data.data[0].url; // URL of the generated image
    } catch (error) {
        console.error("Error generating image:", error);
        throw error;
    }
};

export const expandManualRisk = async (riskDescription, apiKey) => {
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: `Eres un experto en PRL. El usuario te dará una breve descripción de un riesgo. Tu trabajo es completarla con detalles técnicos, medidas y normativa.
Salida JSON estricto:
{
  "id": "generated_id",
  "factor": "${riskDescription}",
  "evidencia": "Descripción técnica detallada basada en el factor",
  "medida": "Medida preventiva propuesta",
  "fuente": "Normativa aplicable (RD, NTP...)",
  "probabilidad": "Media",
  "severidad": "Media",
  "grado_riesgo": "Moderado",
  "plazo": "1 mes",
  "coste_estimado": "100-500€"
}`
                    },
                    {
                        role: "user",
                        content: riskDescription
                    }
                ],
                response_format: { type: "json_object" }
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        return JSON.parse(data.choices[0].message.content);
    } catch (error) {
        console.error("Error expanding risk:", error);
        throw error;
    }
};
