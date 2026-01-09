import React, { useState } from 'react';
import { MessageSquare, PlusCircle, X, Minimize2, Maximize2, Loader2 } from 'lucide-react';
import './ChatWidget.css';

const ManualRiskEntry = ({ onAddRisk }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const riskDesc = input;
        setInput("");
        setIsLoading(true);

        try {
            const googleKey = localStorage.getItem('google_gemini_api_key');
            let newRisk;

            if (googleKey && googleKey.length > 20) {
                const { expandManualRiskWithGemini } = await import('../services/googleAiService');
                newRisk = await expandManualRiskWithGemini(riskDesc, googleKey);
            } else {
                // Fallback / Mock expansion
                newRisk = {
                    factor: riskDesc,
                    evidencia: "Riesgo identificado manualmente por el técnico.",
                    medida: "Revisar y aplicar medidas estándar según normativa.",
                    fuente: "Criterio Técnico",
                    probabilidad: "Media",
                    severidad: "Media",
                    grado_riesgo: "Moderado",
                    plazo: "1 mes",
                    coste_estimado: "100-500€"
                };
            }

            // Generate a random ID or handle in parent
            newRisk.id = Date.now();
            // Force source text as requested
            newRisk.fuente = "Factor de riesgo identificado por el técnico";

            onAddRisk(newRisk);

        } catch (error) {
            // alert("Error al procesar el riesgo: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`chat-widget ${isOpen ? 'open' : 'closed'}`}>
            <div className="chat-header" onClick={() => setIsOpen(!isOpen)} style={{ background: '#009FE3' }}>
                <div className="chat-title">
                    <PlusCircle size={18} />
                    <span>Factores identificados por el técnico</span>
                </div>
                <button className="toggle-btn">
                    {isOpen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
            </div>

            {isOpen && (
                <div className="chat-content">
                    <div className="messages-area">
                        <p className="helper-text" style={{ padding: '1rem', color: '#666', fontSize: '0.9rem' }}>
                            Indica un factor de riesgo que hayas detectado. La IA completará automáticamente la evidencia, medida preventiva y normativa aplicable.
                        </p>
                    </div>
                    <form className="chat-input-area" onSubmit={handleSend}>
                        <input
                            type="text"
                            placeholder="Ej: Cable en mal estado..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? <Loader2 size={16} className="spin" /> : <PlusCircle size={16} />}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ManualRiskEntry;
