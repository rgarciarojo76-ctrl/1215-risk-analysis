import React from 'react';
import { AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';

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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Tabla de Deficiencias y Medidas
                </h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {currentFindings.length} Items detectados
                </span>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar rounded-lg border border-gray-200">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 sticky top-0 z-10">
                        <tr>
                            <th className="px-3 py-3 w-12 text-center border-b">ID</th>
                            <th className="px-3 py-3 border-b">Evidencia Visible (Deficiencia)</th>
                            <th className="px-3 py-3 border-b">Medida Correctiva Propuesta</th>
                            <th className="px-3 py-3 w-10 border-b"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {currentFindings.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center py-8 text-gray-400 italic">
                                    No se han detectado deficiencias. Haz clic en la imagen para añadir un marcador.
                                </td>
                            </tr>
                        ) : (
                            currentFindings.map((finding) => (
                                <tr key={finding.markerId} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-3 py-3 text-center font-bold text-red-600 border-r border-dashed border-gray-200">
                                        {finding.markerId}
                                    </td>
                                    <td className="px-2 py-2">
                                        <textarea
                                            className="w-full p-2 text-gray-700 bg-transparent rounded focus:bg-white focus:ring-1 focus:ring-blue-400 outline-none resize-none text-xs"
                                            rows="2"
                                            placeholder="Describa el problema..."
                                            value={finding.evidence}
                                            onChange={(e) => handleUpdateFinding(finding.markerId, 'evidence', e.target.value)}
                                        />
                                    </td>
                                    <td className="px-2 py-2">
                                        <textarea
                                            className="w-full p-2 text-gray-700 bg-transparent rounded focus:bg-white focus:ring-1 focus:ring-green-400 outline-none resize-none text-xs"
                                            rows="2"
                                            placeholder="Propuesta de solución..."
                                            value={finding.measure}
                                            onChange={(e) => handleUpdateFinding(finding.markerId, 'measure', e.target.value)}
                                        />
                                    </td>
                                    <td className="px-2 py-2 text-center">
                                        <button
                                            onClick={() => handleDelete(finding.markerId)}
                                            className="p-1.5 text-gray-400 hover:text-red-500 rounded hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FindingsPanel_Table;
