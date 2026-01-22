import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, X } from 'lucide-react';
import { googleAiService } from '../../services/googleAiService';

const VisionPanel_Collaborative = ({
    currentPoint,
    markers,
    setMarkers,
    onAddFinding,
    currentPointId,
    images,
    setImages
}) => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const imageContainerRef = useRef(null);

    // Get image from global state
    const image = images[currentPointId];

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImages(prev => ({ ...prev, [currentPointId]: e.target.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setImages(prev => {
            const copy = { ...prev };
            delete copy[currentPointId];
            return copy;
        });
    };

    const handleCanvasClick = (e) => {
        if (!image || isAnalyzing) return;

        const rect = e.target.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        const newId = (markers[currentPointId]?.length || 0) + 1;

        const newMarker = { id: newId, x, y };

        // Update Markers
        setMarkers(prev => ({
            ...prev,
            [currentPointId]: [...(prev[currentPointId] || []), newMarker]
        }));

        // Add blank finding
        onAddFinding(newId);
    };

    const handleAIAnalysis = async () => {
        if (!image) return;
        setIsAnalyzing(true);
        try {
            // Mocking AI delay
            setTimeout(() => {
                // Mock logic
                if ((markers[currentPointId] || []).length === 0) {
                    const mockMarker = { id: 1, x: 50, y: 50 };
                    setMarkers(prev => ({ ...prev, [currentPointId]: [mockMarker] }));
                    onAddFinding(1, "Posible deficiencia detectada por IA (Revisar)", "Instalar resguardo fijo.");
                }
            }, 1000);

        } catch (error) {
            console.error("AI Error:", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const currentMarkers = markers[currentPointId] || [];

    return (
        <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden h-full flex flex-col relative group">
            {/* Header / Controls */}
            <div className="absolute top-4 left-4 right-4 flex justify-between z-20 pointer-events-none">
                <div className="pointer-events-auto">
                    {!image ? (
                        <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer shadow-lg flex items-center gap-2 transition-all">
                            <Camera className="w-4 h-4" />
                            <span className="text-sm font-medium">Subir Foto</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>
                    ) : (
                        <button
                            onClick={clearImage}
                            className="bg-black/50 hover:bg-red-600/80 text-white p-2 rounded-lg backdrop-blur-sm transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <div className="pointer-events-auto">
                    {image && (
                        <button
                            onClick={handleAIAnalysis}
                            disabled={isAnalyzing}
                            className={`px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all ${isAnalyzing ? 'bg-indigo-600/50 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                                }`}
                        >
                            <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                            <span className="text-sm font-medium">
                                {isAnalyzing ? 'Analizando...' : 'Auto-Análisis IA'}
                            </span>
                        </button>
                    )}
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 bg-black flex items-center justify-center relative select-none">
                {!image ? (
                    <div className="text-gray-500 flex flex-col items-center gap-3">
                        <Camera className="w-12 h-12 opacity-50" />
                        <p className="text-sm">Sube una foto para comenzar a inspeccionar</p>
                    </div>
                ) : (
                    <div className="relative w-full h-full">
                        <img
                            src={image}
                            alt="Analysis Target"
                            className="w-full h-full object-contain cursor-crosshair"
                            onClick={handleCanvasClick}
                        />

                        {/* Markers Layer */}
                        <div className="absolute inset-0 pointer-events-none">
                            {currentMarkers.map((m, idx) => (
                                <div
                                    key={m.id}
                                    className="absolute w-8 h-8 -ml-4 -mt-4 border-2 border-white bg-red-500/80 text-white rounded-full flex items-center justify-center font-bold shadow-lg animate-in zoom-in duration-300"
                                    style={{ left: `${m.x}%`, top: `${m.y}%` }}
                                >
                                    {m.id}
                                </div>
                            ))}
                        </div>

                        {/* Intro Guidance */}
                        {currentMarkers.length === 0 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs pointer-events-none">
                                Haz click en la imagen para marcar puntos de riesgo
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VisionPanel_Collaborative;
