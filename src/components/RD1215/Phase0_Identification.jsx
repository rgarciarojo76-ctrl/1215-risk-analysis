import React, { useState } from 'react';
import { ClipboardCheck, ArrowRight, Cog } from 'lucide-react';

const Phase0_Identification = ({ onStart }) => {
    const [machineData, setMachineData] = useState({
        name: '',
        type: 'generic_fixed',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (machineData.name) {
            onStart(machineData);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-85px)] bg-[#f8fafc] p-6 font-sans">

            {/* Main Card Container */}
            <div className="bg-white w-full max-w-[900px] rounded-[24px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.06)] border border-gray-100 p-16 text-center flex flex-col items-center relative overflow-hidden">

                {/* Decorative Top Gradient (Subtle) */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-cyan-400"></div>

                {/* Title Section */}
                <h1 className="text-[42px] font-bold text-[#0ea5e9] mb-4 tracking-tight leading-tighter">
                    Sistema Experto de Adecuación RD 1215/1997
                </h1>

                <h2 className="text-xl text-gray-600 font-medium mb-10 max-w-2xl leading-relaxed">
                    Asistente virtual avanzado para la inspección técnica de seguridad en Equipos de Trabajo (Anexo I)
                </h2>

                <p className="text-gray-400 max-w-lg mb-12 text-[15px] leading-relaxed font-light">
                    Este sistema utiliza Inteligencia Artificial y Visión Computacional para identificar riesgos en maquinaria fija, generando documentación técnica de conformidad normativa y medidas preventivas.
                </p>

                {/* Dashed Area (The distinct feature) */}
                <div className="w-full max-w-[580px] border-2 border-dashed border-blue-200 bg-blue-50/30 rounded-[32px] p-10 flex flex-col items-center transition-all hover:border-blue-300 hover:bg-blue-50/50">

                    {/* Icon */}
                    <div className="mb-6 opacity-30">
                        {/* Using a generic SVG that looks like a document/machine or keeping the clipboard */}
                        {/* Replicating the 'ghostly' paper feel from original design */}
                        <ClipboardCheck className="w-16 h-16 text-gray-400" strokeWidth={1} />
                    </div>

                    <h3 className="text-[#0ea5e9] font-bold text-lg mb-2">
                        Nueva Inspección de Equipo
                    </h3>
                    <p className="text-gray-400 text-sm mb-8">
                        Configura los datos del equipo para iniciar el asistente
                    </p>

                    <form onSubmit={handleSubmit} className="w-full space-y-4">
                        <input
                            type="text"
                            required
                            placeholder="Denominación del Equipo (ej. Torno Paralelo)"
                            className="w-full px-5 py-3.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all placeholder-gray-400 text-center shadow-sm"
                            value={machineData.name}
                            onChange={(e) => setMachineData({ ...machineData, name: e.target.value })}
                        />

                        <div className="relative">
                            <select
                                className="w-full px-5 py-3.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all shadow-sm appearance-none text-center cursor-pointer"
                                value={machineData.type}
                                onChange={(e) => setMachineData({ ...machineData, type: e.target.value })}
                            >
                                <option value="generic_fixed">Equipo Fijo Genérico</option>
                                <option value="press">Prensa Mecánica / Hidráulica</option>
                                <option value="lathe">Torno Convencional</option>
                                <option value="milling">Fresadora Universal</option>
                                <option value="saw">Sierra de Cinta / Alternativa</option>
                            </select>
                            {/* Custom arrow could go here but default is fine for now */}
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-4 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-sm text-sm uppercase tracking-wide"
                        >
                            Comenzar Análisis
                        </button>
                    </form>
                </div>

            </div>

            {/* Footer Note */}
            <p className="mt-8 text-[11px] text-gray-400 max-w-2xl text-center">
                La información generada debe ser validada por un Técnico Superior en PRL. El uso de esta herramienta no exime de la responsabilidad de certificación oficial.
            </p>
        </div>
    );
};

export default Phase0_Identification;
