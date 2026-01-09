import React from 'react';
import { AlertCircle, FileCheck, BookOpen } from 'lucide-react';
import './RiskTable.css';

const RiskTable = ({ risks }) => {
    if (!risks) {
        return (
            <div className="empty-state">
                <div className="empty-content">
                    <BookOpen size={48} className="empty-icon" />
                    <p>Realice un análisis para ver los factores de riesgo.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="table-container" id="tabla_factores">
            <table className="risk-table">
                <thead>
                    <tr>
                        <th>Factor de riesgo identificado</th>
                        <th>Evidencia visible en la imagen</th>
                        <th>Medida preventiva propuesta</th>
                        <th>Fuente preventiva utilizada</th>
                    </tr>
                </thead>
                <tbody>
                    {risks.map((risk) => (
                        <tr key={risk.id}>
                            <td className="col-risk">
                                <div className="risk-cell">
                                    <AlertCircle size={16} className="risk-icon" />
                                    {risk.factor}
                                </div>
                            </td>
                            <td className="col-evidence">{risk.evidencia}</td>
                            <td className="col-measure">
                                <div className="measure-cell">
                                    <FileCheck size={16} className="measure-icon" />
                                    {risk.medida}
                                </div>
                            </td>
                            <td className="col-source">
                                <span className="source-tag">{risk.fuente}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RiskTable;
