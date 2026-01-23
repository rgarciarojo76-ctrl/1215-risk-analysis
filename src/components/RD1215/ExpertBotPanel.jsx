
import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Trash2, Brain } from 'lucide-react';
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
            setConversation(prev => [...prev, { role: 'model', content: "Lo siento, ha ocurrido un error al consultar al experto. Por favor, inténtalo de nuevo." }]);
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
                        <div className="mt-auto pt-4 pb-2 px-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2 text-center">Consultas Sugeridas</p>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {['¿Cuáles son los riesgos principales?', '¿Qué medida preventiva recomiendas?', '¿Cómo verifico esto visualmente?', 'Referencia Legal'].map((suggestion, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setInput(suggestion)}
                                        className="text-xs bg-white border border-indigo-100 text-indigo-600 px-3 py-1.5 rounded-full hover:bg-indigo-50 hover:border-indigo-200 transition-colors shadow-sm"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
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
