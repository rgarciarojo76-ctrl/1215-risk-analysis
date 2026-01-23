
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

// Manual .env loading
try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        envContent.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^["'](.*)["']$/, '$1'); // remove quotes
                process.env[key] = value;
            }
        });
        console.log("Loaded .env.local");
    } else {
        console.log("No .env.local found");
    }
} catch (e) {
    console.error("Error reading .env.local", e);
}

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

if (!apiKey) {
    console.error("Please provide GOOGLE_GEMINI_API_KEY env var (checked .env.local)");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function checkModels() {
    console.log("Checking available models...");
    try {
        const variants = [
            "gemini-1.5-flash",
            "gemini-1.5-flash-latest",
            "gemini-1.5-flash-001",
            "gemini-1.5-flash-002",
            "gemini-pro",
            "gemini-1.5-pro",
            "gemini-1.5-pro-latest"
        ];

        for (const m of variants) {
            try {
                process.stdout.write(`Testing ${m.padEnd(25)} ... `);
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent("Hi");
                const response = await result.response;
                console.log(`✅ OK`);
            } catch (e) {
                // filter out 404s to be clean
                const msg = e.message || "";
                let status = "FAIL";
                if (msg.includes("404")) status = "404 Not Found";
                else if (msg.includes("400")) status = "400 Bad Request";
                else if (msg.includes("403")) status = "403 Forbidden";
                else status = msg.split('[')[0];

                console.log(`❌ ${status}`);
            }
        }

    } catch (error) {
        console.error("Fatal:", error);
    }
}

checkModels();
