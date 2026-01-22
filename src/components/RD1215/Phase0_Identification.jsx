import React, { useState } from 'react';
import { Play, ClipboardCheck, ArrowRight } from 'lucide-react';
import { RD1215_ANNEX } from '../../data/rd1215_annex';

const Phase0_Identification = ({ onStart }) => {
    const [machineData, setMachineData] = useState({
        name: '',
        type: 'generic_fixed',
        location: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (machineData.name) {
            onStart(machineData);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-90px)] bg-[#f8fafc] p-4 font-sans animate-in fade-in duration-700">

            {/* Main Card */}
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl border border-gray-100 p-12 text-center flex flex-col items-center">

                {/* Title Section */}
                <h1 className="text-5xl font-bold text-[#2563eb] mb-2 tracking-tight">
                    RD 1215 Analyzer
                </h1>
                <h2 className="text-xl text-gray-700 font-medium mb-8">
                    Gestión Inteligente de Adecuación de Equipos
                </h2>

                <p className="text-gray-500 max-w-lg mb-12 text-sm leading-relaxed">
                    Tu asistente experto en normativa y prevención. Selecciona el tipo de máquina e inicia la inspección para un análisis instantáneo de riesgos y medidas preventivas.
                </p>

                {/* Card Form Area */}
                <div className="w-full max-w-md bg-white border-2 border-dashed border-gray-200 rounded-3xl p-10 flex flex-col items-center transition-all hover:border-blue-300 hover:shadow-lg hover:bg-blue-50/10">

                    <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-500">
                        <ClipboardCheck className="w-10 h-10" />
                    </div>

                    <h3 className="text-gray-900 font-semibold mb-2">Configura la Inspección</h3>
                    <p className="text-gray-400 text-xs mb-6">Define el equipo para cargar la normativa específica</p>

                    <form onSubmit={handleSubmit} className="w-full space-y-4">
                        <input
                            type="text"
                            required
                            placeholder="Denominación (Ej. Torno Pinacho)"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            value={machineData.name}
                            onChange={(e) => setMachineData({ ...machineData, name: e.target.value })}
                        />

                        <select
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white"
                            value={machineData.type}
                            onChange={(e) => setMachineData({ ...machineData, type: e.target.value })}
                        >
                            <option value="generic_fixed">Equipo Fijo Genérico</option>
                            <option value="press">Prensa Hidráulica/Mecánica</option>
                            <option value="lathe">Torno Convencional</option>
                            <option value="milling">Fresadora Universal</option>
                        </select>

                        <button
                            type="submit"
                            className="w-full mt-4 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            Iniciar Análisis
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default Phase0_Identification;
