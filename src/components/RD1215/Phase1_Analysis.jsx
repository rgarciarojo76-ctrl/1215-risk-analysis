import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, FileDown, CheckCircle, XCircle } from 'lucide-react';
import { RD1215_ANNEX } from '../../data/rd1215_annex';
import TopPanel_TechnicalAssistance from './TopPanel_TechnicalAssistance';
import VisionPanel_Collaborative from './VisionPanel_Collaborative';
import FindingsPanel_Table from './FindingsPanel_Table';
import { generateItemReport, generateFinalReport } from '../../services/pdfGenerator';

const Phase1_Analysis = ({ machineData, onBack }) => {
    const [currentPointIndex, setCurrentPointIndex] = useState(0);
    const [markers, setMarkers] = useState({}); // { pointId: [{id, x, y}] }
    const [findings, setFindings] = useState({}); // { pointId: [{markerId, evidence, measure}] }
    const [images, setImages] = useState({}); // { pointId: base64 }
    const [complianceStatus, setComplianceStatus] = useState({}); // { pointId: 'compliant' | 'non_compliant' | null }

    const currentPoint = RD1215_ANNEX[currentPointIndex];
    const isFirst = currentPointIndex === 0;
    const isLast = currentPointIndex === RD1215_ANNEX.length - 1;

    // Helpers
    const handleAddFinding = (markerId, evidence = '', measure = '') => {
        setFindings(prev => {
            const currentList = prev[currentPoint.id] || [];
            // Avoid duplicates
            if (currentList.find(f => f.markerId === markerId)) return prev;

            return {
                ...prev,
                [currentPoint.id]: [...currentList, { markerId, evidence, measure }]
            };
        });

        // Auto-switch to non-compliant if findings exist
        if (complianceStatus[currentPoint.id] !== 'non_compliant') {
            setComplianceStatus(prev => ({ ...prev, [currentPoint.id]: 'non_compliant' }));
        }
    };

    // Modal State
    const [reportStatus, setReportStatus] = useState('idle'); // idle, generating, completed

    const handleNext = () => {
        if (!isLast) {
            setCurrentPointIndex(prev => prev + 1);
        } else {
            // Confirm Dialog (Custom or Native - keeping native for confirm, but custom for progress)
            if (window.confirm("¿Desea finalizar la inspección y generar el informe PDF?")) {
                setReportStatus('generating');

                // Allow UI to update before blocking
                setTimeout(() => {
                    try {
                        generateFinalReport(
                            machineData,
                            RD1215_ANNEX,
                            images,
                            markers,
                            findings,
                            complianceStatus
                        );
                        setReportStatus('completed');
                    } catch (e) {
                        console.error(e);
                        alert("Error al generar el informe");
                        setReportStatus('idle');
                    }
                }, 100);
            }
        }
    };

    const handlePrev = () => {
        if (!isFirst) setCurrentPointIndex(prev => prev - 1);
        else onBack();
    };

    const toggleCompliance = (status) => {
        setComplianceStatus(prev => ({ ...prev, [currentPoint.id]: status }));
    };

    // Calculate Progress
    const progress = ((currentPointIndex + 1) / RD1215_ANNEX.length) * 100;

    return (
        <div className="flex flex-col h-screen bg-gray-50 overflow-hidden relative">

            {/* REPORT GENERATION MODAL */}
            {reportStatus !== 'idle' && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center animate-in zoom-in-95 duration-200">
                        {reportStatus === 'generating' ? (
                            <>
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Generando Informe...</h3>
                                <p className="text-sm text-gray-500">Compilando datos, imágenes y evaluaciones técnicas.</p>
                            </>
                        ) : (
                            <>
                                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-500" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">¡Informe Listo!</h3>
                                <p className="text-sm text-gray-500 mb-6">El documento se ha descargado correctamente.</p>
                                <button
                                    onClick={onBack}
                                    className="w-full py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-black transition-colors"
                                >
                                    Volver al Inicio
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Header Toolbar */}
            <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-30 flex-none">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="text-gray-500 hover:bg-gray-100 p-2 rounded-lg transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-gray-800">{machineData.name}</h1>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded uppercase font-semibold tracking-wider">
                                {{
                                    'generic_fixed': 'Equipo Fijo Genérico',
                                    'press': 'Prensa Mecánica / Hidráulica',
                                    'lathe': 'Torno Convencional',
                                    'milling': 'Fresadora Universal',
                                    'saw': 'Sierra de Cinta'
                                }[machineData.type] || machineData.type}
                            </span>
                            <span>• Punto {currentPointIndex + 1} de {RD1215_ANNEX.length}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Compliance Toggles */}
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => toggleCompliance('compliant')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${complianceStatus[currentPoint.id] === 'compliant'
                                ? 'bg-green-500 text-white shadow-sm'
                                : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            <CheckCircle className="w-3.5 h-3.5" />
                            CUMPLE
                        </button>
                        <button
                            onClick={() => toggleCompliance('non_compliant')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${complianceStatus[currentPoint.id] === 'non_compliant'
                                ? 'bg-red-500 text-white shadow-sm'
                                : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            <XCircle className="w-3.5 h-3.5" />
                            NO CUMPLE
                        </button>
                    </div>

                    <div className="h-6 w-px bg-gray-200"></div>

                    <button
                        onClick={() => generateItemReport(
                            machineData,
                            currentPoint,
                            images[currentPoint.id],
                            markers[currentPoint.id] || [],
                            findings[currentPoint.id] || []
                        )}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 text-xs font-medium shadow-sm active:scale-[0.98] transition-all"
                    >
                        <FileDown className="w-3.5 h-3.5" />
                        Reporte
                    </button>

                    <div className="h-6 w-px bg-gray-200"></div>

                    {/* Integrated Navigation */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={handlePrev}
                            disabled={isFirst}
                            className={`p-2 rounded-lg border border-gray-200 transition-all ${isFirst
                                ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                                : 'bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300 shadow-sm'}`}
                            title="Anterior"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        <button
                            onClick={handleNext}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm ${isLast
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                        >
                            {isLast ? "Finalizar" : "Siguiente"}
                            {!isLast && <ChevronRight className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-gray-200 w-full relative z-20 flex-none">
                <div
                    className="h-full bg-blue-600 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            {/* Main Content Grid - Fixed Screen Height, No Scroll on body */}
            <div className="flex-1 p-4 grid grid-cols-12 grid-rows-12 gap-4 h-[calc(100vh-4.25rem)] overflow-hidden">

                {/* AREA 1: INFORMATION (Top 2/3 approx -> 8/12 rows) */}
                <div className="col-span-12 row-span-7 min-h-0">
                    <TopPanel_TechnicalAssistance currentPoint={currentPoint} />
                </div>

                {/* AREA 2: UTILITIES (Bottom 1/3 approx -> 4/12 rows) */}

                {/* Utility A: Vision (Left) */}
                <div className="col-span-4 row-span-5 min-h-0">
                    <VisionPanel_Collaborative
                        currentPoint={currentPoint}
                        currentPointId={currentPoint.id}
                        markers={markers}
                        setMarkers={setMarkers}
                        images={images}
                        setImages={setImages}
                        onAddFinding={handleAddFinding}
                    />
                </div>

                {/* Utility B: Findings List (Right) - Now takes full 4 rows height */}
                <div className="col-span-8 row-span-5 min-h-0">
                    <FindingsPanel_Table
                        currentPointId={currentPoint.id}
                        findings={findings}
                        setFindings={setFindings}
                        markers={markers}
                        setMarkers={setMarkers}
                    />
                </div>

            </div>
        </div>
    );
};

export default Phase1_Analysis;
