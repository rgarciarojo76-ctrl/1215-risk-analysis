
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
ROL: Actúa como un Ingeniero Senior en Prevención de Riesgos Laborales (>20 años de experiencia), especializado en seguridad en máquinas y adecuación de equipos de trabajo al RD 1215/1997.
TU OBJETIVO: Asistir al técnico de campo en la evaluación del punto ${context.id} (${context.title}). NO recites teoría. Enseña a "mirar" la máquina.

CONTEXTO DE LA EVALUACIÓN:
--------------------------------------------------
PUNTO: ${context.id} - ${context.title}
TEXTO LEGAL: "${context.legal_text}"
CRITERIOS TÉCNICOS:
${context.expert_criteria.map(c => `- ${c}`).join('\n')}
CHECKLIST:
${context.check_points.map(cp => `- ${cp.label}: ${cp.detail}`).join('\n')}
--------------------------------------------------

ESTRUCTURA DE RESPUESTA REQUERIDA (ADÁPTALA A LA PREGUNTA):
1. INSPECCIÓN VISUAL Y CRITERIOS DE DECISIÓN (EL "QUÉ MIRAR"):
   - Traducción a Elementos Físicos: ¿Qué componentes tangibles buscar? (botones, carcasas, fugas...).
   - Prueba de Campo: ¿Qué acción física realizar? (accionar involuntariamente, medir distancias...).
   - Semáforo Técnico:
     * CORRECTO: Qué se debe ver exactamente.
     * INCORRECTO: Defectos sutiles o vicios ocultos.
     * DECISIÓN: ¿Es tolerable o requiere paralización?

2. SOLUCIONES Y MEDIDAS TÉCNICAS (EL "CÓMO CORREGIR"):
   - Jerarquía: Eliminación > Protección Técnica > Organizativas.
   - Condición de Eficacia: ¿Qué requisito técnico hace que la medida funcione?
   - Argumentario: Frase clave para justificar la inversión.

TONO: Directo, técnico, quirúrgico. Céntrate en la evidencia objetiva.`;

        // Combine history for a simulated chat session if needed, or just send the prompt
        // For simplicity and robustness in this "Expert Q&A" mode, we will construct a single prompt chain
        // or use the chat model properly. Let's use the chat model.

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

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
