import React from 'react';
import { AlertTriangle, Download, BrainCircuit } from 'lucide-react';

// Using Tailwind matching the referenced style
const CorporateHeader = ({ onExport, exportDisabled, appName = "App: Análisis Riesgos 1215" }) => {
    return (
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 h-[90px] flex items-center w-full">
            <div className="w-full max-w-[1920px] mx-auto px-6 flex justify-between items-center h-full">

                {/* Left: Branding */}
                <div className="flex items-center h-full gap-6">
                    <div className="flex items-center">
                        {/* Logo Image if available, otherwise fallback */}
                        <img
                            src="/logo-direccion-tecnica.jpg"
                            alt="Dirección Técnica"
                            className="h-12 w-auto object-contain"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                        <div className="hidden h-12 w-12 bg-blue-600 rounded flex items-center justify-center text-white">
                            <BrainCircuit className="w-8 h-8" />
                        </div>
                    </div>

                    <div className="w-px h-10 bg-gray-200"></div>

                    <div className="flex flex-col justify-center">
                        <h1 className="text-xl font-bold text-[#0284c7] tracking-tight leading-tight">
                            DIRECCIÓN TÉCNICA IA LAB
                        </h1>
                        <p className="text-xs text-gray-500 font-medium">{appName}</p>
                    </div>
                </div>

                {/* Center: Warnings */}
                <div className="flex items-center gap-4">
                    <div className="bg-sky-50 text-[#0284c7] border border-sky-100 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                        Estado: Piloto Interno
                    </div>

                    <div className="hidden md:flex items-center bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-lg gap-3">
                        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <div className="flex flex-col md:flex-row gap-1 text-[11px] leading-tight">
                            <span className="font-bold text-amber-700">AVISO:</span>
                            <span>Apoyo técnico (no sustitutivo del criterio profesional). La información debe ser validada.</span>
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="min-w-[140px] flex justify-end">
                    {/* If we have specific header actions, they go here. Default is empty or specific logic passed in */}
                </div>

            </div>
        </header>
    );
};

export default CorporateHeader;
