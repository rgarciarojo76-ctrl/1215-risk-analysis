import React from 'react';
import { AlertTriangle, Settings } from 'lucide-react';

const CorporateHeader = ({ appName }) => {
    return (
        <header className="bg-white border-b border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] sticky top-0 z-50 h-auto lg:h-[85px] flex items-center w-full font-sans">
            <div className="w-full max-w-[1800px] mx-auto px-4 lg:px-8 flex flex-col lg:flex-row justify-between items-center h-full py-3 lg:py-0 gap-4 lg:gap-0">

                {/* Left: Branding (Full Logo Image) */}
                <div className="flex items-center justify-center lg:justify-start w-full lg:w-auto">
                    <img
                        src="/logo-ia-lab.jpg"
                        alt="Dirección Técnica IA LAB"
                        className="h-[50px] lg:h-[65px] w-auto object-contain"
                    />
                    {/* Divider and App Name */}
                    <div className="w-px h-8 bg-gray-300 mx-4 lg:mx-6"></div>
                    <div className="flex flex-col justify-center">
                        <span className="text-[#0ea5e9] font-bold text-base lg:text-lg leading-tight">
                            DIRECCIÓN TÉCNICA IA LAB
                        </span>
                        <span className="text-gray-400 text-[10px] lg:text-xs font-medium tracking-wide">
                            App: Adecuación 1215 | Equipo Fijo
                        </span>
                    </div>
                </div>

                {/* Center/Right: Status & Disclaimer */}
                <div className="flex flex-col lg:flex-row items-center gap-3 lg:gap-6 w-full lg:w-auto">
                    {/* Status Pill */}
                    <div className="bg-[#e0f2fe] text-[#0284c7] px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wide uppercase shadow-sm border border-blue-100 hidden lg:block">
                        Estado: Piloto interno
                    </div>

                    {/* Warning Banner - Responsive Text */}
                    <div className="flex items-center bg-[#fffbeb] border border-[#fcd34d] text-[#92400e] px-4 lg:px-6 py-2 rounded-full gap-2 lg:gap-3 shadow-sm w-full lg:w-auto justify-center">
                        <AlertTriangle className="w-4 h-4 text-[#d97706] flex-shrink-0 stroke-[2.5]" />
                        <div className="flex flex-col lg:flex-row gap-0 lg:gap-1 text-[11px] lg:text-[12px] leading-tight items-center text-center lg:text-left">
                            <span className="font-bold text-[#b45309]">AVISO:</span>
                            <span className="font-medium opacity-90">Apoyo técnico. Validar por técnico.</span>
                        </div>
                    </div>

                    {/* Settings Icon (Visual only) */}
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors hidden lg:block">
                        <Settings className="w-5 h-5 pointer-events-none" />
                    </button>
                </div>

            </div>
        </header>
    );
};

export default CorporateHeader;
