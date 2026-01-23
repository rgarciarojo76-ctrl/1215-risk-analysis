
import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Trash2, Brain, Eye, ShieldCheck, Zap, ChevronRight } from 'lucide-react';
import { sendChatToGemini } from '../../services/googleAiService';
import CorporateCard from '../layout/CorporateCard';

const ExpertBotPanel = ({ currentPoint }) => {
    const [input, setInput] = useState('');
    const [conversation, setConversation] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Reset conversation when the point changes
    useEffect(() => {
        setConversation([
            {
                role: 'model',
                content: `Hola. Soy tu asistente experto para el punto **${currentPoint.id}: ${currentPoint.title}**. Dispongo de toda la información técnica y legal. ¿Qué duda tienes?`
            }
        ]);
        setInput('');
        setIsLoading(false);
    }, [currentPoint.id]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversation]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input };
        setConversation(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Prepare history for API (excluding the initial greeting if not needed, but keeping it is fine)
            // The system prompt in backend handles the persona.
            const apiHistory = conversation.map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            const responseText = await sendChatToGemini(userMessage.content, currentPoint, apiHistory);

            setConversation(prev => [...prev, { role: 'model', content: responseText }]);
        } catch (error) {
            console.error("Chat Error:", error);
            let errorMessage = "Lo siento, ha ocurrido un error técnico.";

            if (error.message.includes("API Key")) {
                errorMessage = "⚠️ Error de Configuración: No se ha detectado la clave API de Google Gemini en el servidor (GOOGLE_GEMINI_API_KEY). Por favor, agrégala en las variables de entorno de Vercel.";
            } else if (error.message.includes("Backend") || error.message.includes("Server Error")) {
                errorMessage = `Error del Servidor: ${error.message}`;
            } else {
                errorMessage = `Error Técnico: ${error.message}`;
            }

            setConversation(prev => [...prev, { role: 'model', content: errorMessage }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to render markdown-like simple formatting
    const renderContent = (content) => {
        // Simple replace for **text** to bold
        const parts = content.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
        <CorporateCard
            title="Asistente Técnico IA"
            icon={Brain}
            borderColor="border-t-4 border-t-indigo-600"
            className="h-full flex flex-col"
        >
            <div className="flex flex-col h-full overflow-hidden">
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto pr-2 space-y-4 p-2 bg-gray-50 rounded-md border border-gray-100 mb-2 flex flex-col">
                    <div className="flex-1 space-y-4">
                        {conversation.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'model' && (
                                    <div className="p-1 mr-2 bg-indigo-100 rounded-full h-8 w-8 flex items-center justify-center flex-none">
                                        <Bot size={16} className="text-indigo-700" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[85%] rounded-lg p-3 text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-br-none'
                                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                                        }`}
                                >
                                    <div className="whitespace-pre-wrap">
                                        {renderContent(msg.content)}
                                    </div>
                                </div>
                                {msg.role === 'user' && (
                                    <div className="p-1 ml-2 bg-gray-200 rounded-full h-8 w-8 flex items-center justify-center flex-none">
                                        <User size={16} className="text-gray-600" />
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="p-1 mr-2 bg-indigo-100 rounded-full h-8 w-8 flex items-center justify-center flex-none">
                                    <Bot size={16} className="text-indigo-700" />
                                </div>
                                <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-bl-none shadow-sm">
                                    <span className="animate-pulse text-gray-500 text-xs">Escribiendo...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Suggestions Chips (Fill Empty Space initially) */}
                    {conversation.length === 1 && !isLoading && (
                        <div className="mt-auto px-4 pb-4 pt-2 animate-in fade-in slide-in-from-bottom-8 duration-700">

                            {/* Stylish Header */}
                            <div className="flex items-center justify-center gap-3 mb-4 opacity-80">
                                <div className="h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent flex-1"></div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Guía Rápida de Inspección</span>
                                <div className="h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent flex-1"></div>
                            </div>

                            {/* Spectacular Grid */}
                            <div className="grid grid-cols-1 gap-2">

                                {/* Card 1: Visual Inspection */}
                                <button
                                    onClick={() => setInput('¿Qué debo inspeccionar visualmente?')}
                                    className="group relative flex items-center gap-3 p-3 bg-white rounded-xl border border-indigo-50 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-300 text-left overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="flex-none w-10 h-10 rounded-lg bg-blue-100/50 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                        <Eye className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="relative z-10">
                                        <h4 className="text-xs font-bold text-gray-700 group-hover:text-blue-700 transition-colors">Inspección Visual</h4>
                                        <p className="text-[10px] text-gray-500 group-hover:text-blue-600/70">¿Qué elementos físicos debo buscar?</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                                </button>

                                {/* Card 2: Acceptance Criteria */}
                                <button
                                    onClick={() => setInput('Criterios Aceptación/Rechazo')}
                                    className="group relative flex items-center gap-3 p-3 bg-white rounded-xl border border-indigo-50 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-300 text-left overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="flex-none w-10 h-10 rounded-lg bg-emerald-100/50 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                                        <ShieldCheck className="w-5 h-5 text-emerald-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="relative z-10">
                                        <h4 className="text-xs font-bold text-gray-700 group-hover:text-emerald-700 transition-colors">Criterios de Aceptación</h4>
                                        <p className="text-[10px] text-gray-500 group-hover:text-emerald-600/70">Condiciones de rechazo y tolerancia</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                                </button>

                                {/* Card 3: Technical Solutions */}
                                <button
                                    onClick={() => setInput('Soluciones Técnicas')}
                                    className="group relative flex items-center gap-3 p-3 bg-white rounded-xl border border-indigo-50 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-300 text-left overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-amber-50/50 to-orange-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="flex-none w-10 h-10 rounded-lg bg-amber-100/50 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
                                        <Zap className="w-5 h-5 text-amber-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="relative z-10">
                                        <h4 className="text-xs font-bold text-gray-700 group-hover:text-amber-700 transition-colors">Soluciones Técnicas</h4>
                                        <p className="text-[10px] text-gray-500 group-hover:text-amber-600/70">Medidas correctivas y mejoras</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                                </button>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} className="flex gap-2 pt-2 border-t border-gray-100">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Pregunta sobre este punto a la IA..."
                        className="flex-1 text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send size={18} />
                    </button>
                    {(conversation.length > 1) && (
                        <button
                            type="button"
                            onClick={() => setConversation([{
                                role: 'model',
                                content: `Hola. Soy tu asistente experto para el punto **${currentPoint.id}: ${currentPoint.title}**. Dispongo de toda la información técnica y legal. ¿Qué duda tienes?`
                            }])}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Reiniciar chat"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                </form>
            </div>
        </CorporateCard>
    );
};

export default ExpertBotPanel;
