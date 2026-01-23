import React, { useRef, useState } from 'react';
import { Camera, RefreshCw, X, UploadCloud, Eye } from 'lucide-react';
import CorporateCard from '../layout/CorporateCard';
import { analyzeImageWithGemini } from '../../services/googleAiService';

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

        setMarkers(prev => ({
            ...prev,
            [currentPointId]: [...(prev[currentPointId] || []), newMarker]
        }));
        onAddFinding(newId);
    };

    const currentMarkers = markers[currentPointId] || [];

    const handleAIAnalysis = async () => {
        if (!image) return;
        setIsAnalyzing(true);
        try {
            // Call Real AI Service with Context
            const result = await analyzeImageWithGemini(image, currentPoint);

            if (result && result.risks && result.risks.length > 0) {
                const newMarkers = [];
                let nextId = (markers[currentPointId]?.length || 0) + 1;

                const currentFindings = [];

                result.risks.forEach(risk => {
                    // Convert Gemini 1000-scale coordinates to %
                    // coordinates: [ymin, xmin, ymax, xmax]
                    const [ymin, xmin, ymax, xmax] = risk.coordinates || [500, 500, 500, 500]; // Default center if missing

                    const centerX = ((xmin + xmax) / 2) / 10;
                    const centerY = ((ymin + ymax) / 2) / 10;

                    const markerId = nextId++;

                    newMarkers.push({
                        id: markerId,
                        x: centerX,
                        y: centerY
                    });

                    // Add finding via parent handler
                    // Signature: (id, description, measure)
                    onAddFinding(markerId, risk.factor, risk.medida); // Assuming parent handles state update for findings
                });

                // Update markers state
                setMarkers(prev => ({
                    ...prev,
                    [currentPointId]: [...(prev[currentPointId] || []), ...newMarkers]
                }));
            } else {
                // No risks found logic (optional toast)
                console.log("AI analysis completed: No risks found.");
            }

        } catch (error) {
            console.error("AI Analysis Error:", error);
            // Optional: Error toast
        } finally {
            setIsAnalyzing(false);
        }
    }


    return (
        <CorporateCard
            title="Captura del Entorno / Equipo (Peligro)"
            icon={Eye}
            borderColor="border-t-4 border-t-red-500"
            className="group"
        >
            <div className="relative w-full h-full flex items-center justify-center bg-gray-50/50 rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-200 transition-colors overflow-hidden">

                {/* Upload State */}
                {!image ? (
                    <label className="flex flex-col items-center justify-center cursor-pointer p-8 w-full h-full text-center">
                        <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-500 shadow-sm">
                            <UploadCloud className="w-7 h-7" />
                        </div>
                        <span className="text-gray-700 font-bold mb-1">Subir Imagen del Entorno</span>
                        <span className="text-gray-400 text-xs mb-6">Arrastra tu archivo aquí o selecciona una opción</span>

                        <div className="flex gap-3">
                            <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 shadow-sm hover:bg-gray-50 flex items-center gap-2">
                                <UploadCloud className="w-3 h-3" />
                                Seleccionar Archivo
                            </div>
                        </div>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                ) : (
                    // Image View State
                    <div className="relative w-full h-full bg-black/5">
                        <img
                            src={image}
                            alt="Target"
                            className="w-full h-full object-contain cursor-crosshair"
                            onClick={handleCanvasClick}
                        />

                        {/* Markers */}
                        {currentMarkers.map((m) => (
                            <div
                                key={m.id}
                                className="absolute w-6 h-6 -ml-3 -mt-3 border-2 border-white bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-md animate-in zoom-in"
                                style={{ left: `${m.x}%`, top: `${m.y}%` }}
                            >
                                {m.id}
                            </div>
                        ))}

                        {/* Actions Overlay */}
                        <div className="absolute top-2 right-2 flex gap-2">
                            <button
                                onClick={handleAIAnalysis}
                                disabled={isAnalyzing}
                                className="bg-white/90 text-indigo-600 p-1.5 rounded-lg shadow-sm hover:bg-white"
                            >
                                <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                            </button>

                            <button
                                onClick={clearImage}
                                className="bg-white/90 text-gray-600 p-1.5 rounded-lg shadow-sm hover:text-red-500 hover:bg-white"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </CorporateCard>
    );
};

export default VisionPanel_Collaborative;
