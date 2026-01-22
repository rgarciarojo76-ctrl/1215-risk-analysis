import React from 'react';
import { AlertTriangle, Settings } from 'lucide-react';

const CorporateHeader = ({ appName }) => {
    return (
        <header className="bg-white border-b border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] sticky top-0 z-50 h-[85px] flex items-center w-full font-sans">
            <div className="w-full max-w-[1800px] mx-auto px-8 flex justify-between items-center h-full">

                {/* Left: Branding (Full Logo Image) */}
                <div className="flex items-center">
                    <img
                        src="/logo-ia-lab.jpg"
                        alt="Dirección Técnica IA LAB"
                        className="h-[65px] w-auto object-contain"
                    />
                    {/* Divider and App Name */}
                    <div className="w-px h-8 bg-gray-300 mx-6"></div>
                    <div className="flex flex-col">
                        <span className="text-[#0ea5e9] font-bold text-lg leading-none">
                            RD 1215/1997
                        </span>
                        <span className="text-gray-400 text-xs font-medium tracking-wide">
                            SISTEMA EXPERTO
                        </span>
                    </div>
                </div>

                {/* Center/Right: Status & Disclaimer */}
                <div className="flex items-center gap-6">
                    {/* Status Pill */}
                    <div className="bg-[#e0f2fe] text-[#0284c7] px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wide uppercase shadow-sm border border-blue-100">
                        Estado: Piloto interno
                    </div>

                    {/* Warning Banner - Exact Match style */}
                    <div className="flex items-center bg-[#fffbeb] border border-[#fcd34d] text-[#92400e] px-6 py-2.5 rounded-full gap-3 shadow-sm">
                        <AlertTriangle className="w-4 h-4 text-[#d97706] flex-shrink-0 stroke-[2.5]" />
                        <div className="flex flex-row gap-1 text-[12px] leading-tight items-center">
                            <span className="font-bold text-[#b45309]">AVISO:</span>
                            <span className="font-medium opacity-90">Apoyo técnico (no sustitutivo del criterio profesional). La información debe ser validada.</span>
                        </div>
                    </div>

                    {/* Settings Icon (Visual only) */}
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <Settings className="w-5 h-5 pointer-events-none" />
                    </button>
                </div>

            </div>
        </header>
    );
};

export default CorporateHeader;
