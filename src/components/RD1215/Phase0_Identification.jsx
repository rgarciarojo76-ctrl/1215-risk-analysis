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
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-900/20 ring-4 ring-blue-500/10">
                <ClipboardCheck className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-3">
                Adecuación RD 1215/1997
            </h1>
            <p className="text-gray-500 mb-8 max-w-md">
                Sistema Experto para la evaluación de seguridad en equipos de trabajo fijos (Anexo I).
            </p>

            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
                <div className="text-left space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 ml-1">Denominación del Equipo</label>
                    <input
                        type="text"
                        required
                        placeholder="Ej. Fresadora Universal, Sierra de Cinta..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm hover:border-gray-300"
                        value={machineData.name}
                        onChange={(e) => setMachineData({ ...machineData, name: e.target.value })}
                    />
                </div>

                <div className="text-left space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 ml-1">Tipo de Equipo</label>
                    <select
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm hover:border-gray-300 cursor-pointer appearance-none"
                        value={machineData.type}
                        onChange={(e) => setMachineData({ ...machineData, type: e.target.value })}
                    >
                        <option value="generic_fixed">Equipo Fijo Genérico (Anexo I Completo)</option>
                        <option value="press">Prensa Mecánica/Hidráulica</option>
                        <option value="lathe">Torno</option>
                        <option value="milling">Fresadora</option>
                        <option value="saw">Sierra</option>
                        {/* Future expansion */}
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 px-6 rounded-xl shadow-lg shadow-blue-900/20 hover:shadow-blue-900/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                >
                    Iniciar Evaluación
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
            </form>
        </div>
    );
};

export default Phase0_Identification;
