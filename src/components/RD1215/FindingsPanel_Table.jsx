import React from 'react';
import { AlertTriangle, CheckCircle, Trash2, ClipboardList } from 'lucide-react';
import CorporateCard from '../layout/CorporateCard';

const FindingsPanel_Table = ({ findings, setFindings, markers, setMarkers, currentPointId }) => {

    // Get findings for current point
    const currentFindings = findings[currentPointId] || [];

    const handleUpdateFinding = (markerId, field, value) => {
        const updated = currentFindings.map(f =>
            f.markerId === markerId ? { ...f, [field]: value } : f
        );

        // Update global state
        setFindings(prev => ({
            ...prev,
            [currentPointId]: updated
        }));
    };

    const handleDelete = (markerId) => {
        // Remove from findings
        const updatedFindings = currentFindings.filter(f => f.markerId !== markerId);
        setFindings(prev => ({ ...prev, [currentPointId]: updatedFindings }));

        // Remove from markers (Visual Panel needs this sync)
        setMarkers(prev => ({
            ...prev,
            [currentPointId]: (prev[currentPointId] || []).filter(m => m.id !== markerId)
        }));
    };

    return (
        <CorporateCard
            title="Factores de Riesgo Identificados (Lista)"
            icon={ClipboardList}
            borderColor="border-t-4 border-t-amber-500"
        >
            <div className="h-full overflow-hidden flex flex-col">
                {currentFindings.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-300 gap-4">
                        <ClipboardList className="w-12 h-12 opacity-50" />
                        <p className="text-sm font-medium">No se han registrado hallazgos</p>
                        <p className="text-xs max-w-xs text-center">Marca puntos en la imagen para añadir observaciones</p>
                    </div>
                ) : (
                    <div className="overflow-auto custom-scrollbar flex-1 -mx-4 px-4 pb-4">
                        <table className="w-full text-sm text-left border-separate border-spacing-y-2">
                            <thead>
                                <tr className="text-sm text-gray-400 font-semibold uppercase tracking-wider">
                                    <th className="px-2 pb-2">REF</th>
                                    <th className="px-2 pb-2">Evidencia (Deficiencia)</th>
                                    <th className="px-2 pb-2">Medida Correctiva</th>
                                    <th className="w-8"></th>
                                </tr>
                            </thead>
                            <tbody className="space-y-2">
                                {currentFindings.map((finding) => (
                                    <tr key={finding.markerId} className="bg-gray-50/50 hover:bg-blue-50/30 transition-colors rounded-lg group text-sm shadow-sm shadow-black/5">
                                        <td className="px-3 py-3 font-bold text-red-500 w-12 text-center bg-white rounded-l-lg border-y border-l border-gray-100">
                                            {finding.markerId}
                                        </td>
                                        <td className="px-2 py-2 bg-white border-y border-gray-100">
                                            <textarea
                                                className="w-full p-2 text-gray-600 bg-gray-50 rounded border-transparent focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none resize-none transition-all placeholder-gray-300"
                                                rows="2"
                                                placeholder="Describa la deficiencia..."
                                                value={finding.evidence}
                                                onChange={(e) => handleUpdateFinding(finding.markerId, 'evidence', e.target.value)}
                                            />
                                        </td>
                                        <td className="px-2 py-2 bg-white border-y border-gray-100">
                                            <textarea
                                                className="w-full p-2 text-gray-600 bg-gray-50 rounded border-transparent focus:bg-white focus:border-green-300 focus:ring-2 focus:ring-green-100 outline-none resize-none transition-all placeholder-gray-300"
                                                rows="2"
                                                placeholder="Propuesta de medida..."
                                                value={finding.measure}
                                                onChange={(e) => handleUpdateFinding(finding.markerId, 'measure', e.target.value)}
                                            />
                                        </td>
                                        <td className="px-2 py-2 text-center bg-white rounded-r-lg border-y border-r border-gray-100">
                                            <button
                                                onClick={() => handleDelete(finding.markerId)}
                                                className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </CorporateCard>
    );
};

export default FindingsPanel_Table;
