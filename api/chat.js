
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    try {
        const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('Server misconfiguration: API Key not found');
        }

        const { message, context, history } = req.body;

        if (!message) {
            throw new Error('Message is required');
        }

        // Construct the System Prompt with the specific context
        const SYSTEM_PROMPT = `
ERES UN EXPERTO TÉCNICO EN PREVENCIÓN DE RIESGOS LABORALES (PRL), ESPECIALIZADO EN EL RD 1215/1997.
TU MISIÓN ES ASISTIR AL TÉCNICO DURANTE LA EVALUACIÓN DE UN PUNTO ESPECÍFICO DEL ANEXO I.

CONTEXTO ACTUAL DE LA EVALUACIÓN:
--------------------------------------------------
PUNTO: ${context.id} - ${context.title}
DESCRIPCIÓN: ${context.description}

TEXTO LEGAL (RD 1215/1997):
"${context.legal_text}"

CRITERIOS TÉCNICOS DE EXPERTO (INSST):
${context.expert_criteria.map(c => `- ${c}`).join('\n')}

PUNTOS DE VERIFICACIÓN VISUAL (Checklist):
${context.check_points.map(cp => `- ${cp.label}: ${cp.detail}`).join('\n')}
--------------------------------------------------

INSTRUCCIONES DE COMPORTAMIENTO:
1. RESPONDE ÚNICAMENTE a preguntas relacionadas con este punto específico (${context.id}).
2. Si el usuario pregunta algo fuera de tema, responde: "Por favor, centrémonos en el punto ${context.id} (${context.title}) que estamos evaluando y sus criterios técnicos."
3. UTILIZA la información proporcionada (Criterios TÉCNICOS y CHECKLIST) para dar respuestas precisas, técnicas y fundamentadas.
4. SÉ BREVE, DIRECTO Y PROFESIONAL. Usa formato Markdown para listas o negritas si es necesario.
5. NO INVENTES normativas. Cíñete al contexto proporcionado.
`;

        // Combine history for a simulated chat session if needed, or just send the prompt
        // For simplicity and robustness in this "Expert Q&A" mode, we will construct a single prompt chain
        // or use the chat model properly. Let's use the chat model.

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: SYSTEM_PROMPT + "\n\nEntendido. Estoy listo para asistir en este punto." }]
                },
                {
                    role: "model",
                    parts: [{ text: `Entendido. Soy el asistente experto en el punto ${context.id}. ¿En qué puedo ayudarte?` }]
                },
                ...(history || []).map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }]
                }))
            ],
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ reply: text });

    } catch (error) {
        console.error("Backend Chat Error:", error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
