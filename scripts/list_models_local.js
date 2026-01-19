
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyA_ATd2t5Mc5pNTXTn9svH6YyTeagFeaN4";

async function listModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        if (data.models) {
            const models = data.models.map(m => m.name);
            console.log("--- GEMINI PRO MODELS ---");
            models.filter(m => m.includes("gemini") && m.includes("pro")).sort().forEach(m => console.log(m));

            console.log("\n--- IMAGEN MODELS ---");
            models.filter(m => m.includes("image") || m.includes("veo")).sort().forEach(m => console.log(m));

            console.log("\n--- OTHER RELEVANT ---");
            models.filter(m => m.includes("1.5") && !m.includes("pro")).sort().forEach(m => console.log(m));
        } else {
            console.log("No models found or error:", data);
        }
    } catch (error) {
        console.error(error);
    }
}

listModels();
