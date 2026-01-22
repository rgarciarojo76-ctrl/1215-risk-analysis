import React from 'react';
import { BookOpen, ExternalLink, Info, CheckCircle2, ListChecks, Gavel } from 'lucide-react';
import CorporateCard from '../layout/CorporateCard';

const TopPanel_TechnicalAssistance = ({ currentPoint }) => {
    return (
        <CorporateCard
            title={`Guía Técnica: ${currentPoint.title}`}
            icon={BookOpen}
            borderColor="border-t-4 border-t-[#0ea5e9]" // Corporate Blue
        >
            <div className="h-full overflow-y-auto pr-2 custom-scrollbar space-y-4">

                {/* Header Badges */}
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-100 uppercase tracking-wider">
                        RD 1215/97 - Anexo I
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-50 text-purple-600 rounded border border-purple-100 uppercase tracking-wider">
                        Criterios Foment
                    </span>
                </div>

                {/* Legal Text (Accordion style or Box) */}
                <div className="bg-slate-50 border-l-4 border-slate-400 p-3 rounded-r-lg">
                    <div className="flex items-center gap-2 mb-1">
                        <Gavel className="w-4 h-4 text-slate-500" />
                        <h4 className="text-xs font-bold text-slate-700 uppercase">Texto Legal</h4>
                    </div>
                    <p className="text-xs text-slate-600 italic font-medium leading-relaxed">
                        "{currentPoint.legal_text || currentPoint.description}"
                    </p>
                </div>

                {/* Description / Main Criteria */}
                <div>
                    <h4 className="text-sm font-bold text-gray-800 mb-2">Criterios Técnicos Generales</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {currentPoint.details}
                    </p>
                </div>

                {/* Expert Criteria List (Foment) */}
                {currentPoint.expert_criteria && (
                    <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100">
                        <div className="flex items-center gap-2 mb-3">
                            <Info className="w-5 h-5 text-amber-600" />
                            <h4 className="text-sm font-bold text-amber-800">Aspectos Clave (Guía)</h4>
                        </div>
                        <ul className="space-y-2">
                            {currentPoint.expert_criteria.map((criteria, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-xs text-amber-900/80 leading-snug">
                                    <span className="min-w-[4px] h-4 mt-0.5 bg-amber-400 rounded-full"></span>
                                    {criteria}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Visual Check Points */}
                {currentPoint.check_points && ((currentPoint.check_points.length > 0) && (
                    <div className="border border-green-100 rounded-xl overflow-hidden">
                        <div className="bg-green-50 px-4 py-2 border-b border-green-100 flex items-center gap-2">
                            <ListChecks className="w-4 h-4 text-green-600" />
                            <h4 className="text-xs font-bold text-green-700 uppercase">Puntos de Verificación Visual</h4>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {currentPoint.check_points.map((cp, idx) => (
                                <div key={idx} className="px-4 py-3 hover:bg-green-50/30 transition-colors">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-bold text-gray-700">{cp.label}</span>
                                    </div>
                                    <p className="text-[11px] text-gray-500">{cp.detail}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                    {currentPoint.ntp_refs.map((ref, idx) => (
                        <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-50 text-[10px] uppercase font-bold text-gray-400 border border-gray-100"
                        >
                            <ExternalLink className="w-3 h-3" />
                            {ref}
                        </span>
                    ))}
                </div>
            </div>
        </CorporateCard>
    );
};

export default TopPanel_TechnicalAssistance;
