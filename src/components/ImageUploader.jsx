import React, { useState } from 'react';
import { Upload, Camera, Loader2 } from 'lucide-react';
import './ImageUploader.css';

// Mock function to simulate AI Analysis
const mockAnalyzeImage = async (file) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                risks: [
                    {
                        id: 1,
                        factor: "Ausencia de resguardo en transmisión",
                        evidencia: "Sistema de transmisión por correa y polea accesible sin herramienta.",
                        medida: "Instalación de resguardo fijo envolvente que impida el acceso a la zona de peligro.",
                        fuente: "RD 1215/1997, Anexo I, 1.8",
                        probabilidad: "Alta",
                        severidad: "Alta",
                        grado_riesgo: "Importante",
                        plazo: "Inmediato",
                        coste_estimado: "100-500€"
                    },
                    {
                        id: 2,
                        factor: "Almacenamiento inadecuado en altura",
                        evidencia: "Palets remontados sin sistema de retención visible y con desplome lateral.",
                        medida: "Uso de estanterías certificadas o apilamiento estable con sistema de flejado.",
                        fuente: "NTP 298: Almacenamiento en estanterías",
                        probabilidad: "Media",
                        severidad: "Alta",
                        grado_riesgo: "Moderado",
                        plazo: "1 mes",
                        coste_estimado: "> 500€"
                    },
                    {
                        id: 3,
                        factor: "Señalización de extinción no visible",
                        evidencia: "Extintor obstaculizado por material de embalaje, no visible desde vía de evacuación.",
                        medida: "Reubicación de extintor y señalización fotoluminiscente a altura reglamentaria.",
                        fuente: "RD 513/2017 (RIPCI) y Guía Técnica RD 486/1997",
                        probabilidad: "Media",
                        severidad: "Media",
                        grado_riesgo: "Tolerable",
                        plazo: "1 semana",
                        coste_estimado: "< 100€"
                    }
                ],
                // For 'After' image, we simulate a 'processed' version.
                // In a real app this comes from the generation API.
                afterImage: URL.createObjectURL(file)
            });
        }, 2000); // 2 second delay
    });
};

const ImageUploader = ({ setUploadedImage, onAnalysisComplete }) => {
    const [preview, setPreview] = useState(null);
    const [isAnalyzeLoading, setIsAnalyzeLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleFile = (file) => {
        if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
            const url = URL.createObjectURL(file);
            setPreview(url);
            setUploadedImage(url);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };



    const handleAnalyze = async () => {
        if (!preview) return;
        setIsAnalyzeLoading(true);
        try {
            const googleKey = localStorage.getItem('google_gemini_api_key');
            let resultRisks;
            let afterImageUrl = preview;

            if (googleKey && googleKey.length > 20) {
                // Real Analysis with Gemini
                const response = await fetch(preview);
                const blob = await response.blob();

                // 1. Analyze Image with Gemini
                const { analyzeImageWithGemini } = await import('../services/googleAiService');
                const analysisData = await analyzeImageWithGemini(blob, googleKey);
                resultRisks = analysisData.risks;

                // 2. Image Generation: Real Imagen 4 Check
                if (analysisData.dalle_prompt) {
                    const { generateImageWithImagen } = await import('../services/googleAiService');
                    console.log("Generating buffer image with Imagen 4...");
                    try {
                        afterImageUrl = await generateImageWithImagen(analysisData.dalle_prompt, googleKey);
                    } catch (genError) {
                        console.warn("Imagen generation failed, falling back to original:", genError);
                        afterImageUrl = preview;
                    }
                } else {
                    afterImageUrl = preview;
                }
            } else {
                // Mock Analysis (Fallback)
                const response = await fetch(preview);
                const blob = await response.blob();
                const mockResult = await mockAnalyzeImage(blob);
                resultRisks = mockResult.risks;
                afterImageUrl = mockResult.afterImage;
            }

            onAnalysisComplete({
                risks: resultRisks,
                afterImage: afterImageUrl
            });

        } catch (error) {
            console.error("Analysis failed:", error);
            alert("Error en el análisis: " + error.message);
        } finally {
            setIsAnalyzeLoading(false);
        }
    };

    return (
        <div className="uploader-container">
            <div
                className={`drop-zone ${dragActive ? 'active' : ''} ${preview ? 'has-image' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('img_subida').click()}
            >
                {preview ? (
                    <img src={preview} alt="Vista previa" className="preview-image" id="img_subida_preview" />
                ) : (
                    <div className="upload-prompt">
                        <Upload size={48} className="upload-icon" />
                        <p>Arrastre imagen aquí o haga clic para subir</p>
                        <span className="file-types">JPG, PNG</span>

                        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                            {/* Standard File Upload Button */}
                            <button
                                type="button"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    background: 'white',
                                    color: '#2563eb',
                                    border: '1px solid #2563eb',
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    document.getElementById('img_subida').click();
                                }}
                            >
                                <Upload size={18} />
                                Subir Archivo
                            </button>

                            {/* Camera Button */}
                            <button
                                type="button"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    background: '#2563eb',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    document.getElementById('camera_input').click();
                                }}
                            >
                                <Camera size={18} />
                                Usar Cámara
                            </button>
                        </div>
                    </div>
                )}

                <input
                    type="file"
                    id="img_subida"
                    accept="image/png, image/jpeg"
                    onChange={handleChange}
                    className="file-input"
                />

                {/* Dedicated Camera Input */}
                <input
                    type="file"
                    id="camera_input"
                    accept="image/*"
                    capture="environment"
                    onChange={handleChange}
                    style={{ display: 'none' }}
                />

                {preview && (
                    <button
                        className="change-image-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            document.getElementById('img_subida').click();
                        }}
                    >
                        Cambiar imagen
                    </button>
                )}
            </div>

            <button
                id="btn_analizar"
                className={`analyze-btn ${!preview ? 'disabled' : ''}`}
                onClick={handleAnalyze}
                disabled={!preview || isAnalyzeLoading}
            >
                {isAnalyzeLoading ? (
                    <>
                        <Loader2 className="spinner" size={18} />
                        Analizando...
                    </>
                ) : (
                    <>
                        <Camera size={18} />
                        Analizar Imagen
                    </>
                )}
            </button>
        </div>
    );
};

export default ImageUploader;
