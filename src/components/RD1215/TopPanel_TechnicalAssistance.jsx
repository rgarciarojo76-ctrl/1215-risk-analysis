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
            <div className="h-full flex flex-col gap-2 overflow-hidden">

                {/* Header Section: Badges + Legal Text (Compact) */}
                <div className="flex-none space-y-1.5">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-100 uppercase tracking-wider">
                            RD 1215/97 - Anexo I
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 bg-purple-50 text-purple-600 rounded border border-purple-100 uppercase tracking-wider">
                            Criterios Foment
                        </span>
                    </div>

                    <div className="bg-slate-50 border-l-4 border-slate-400 p-2 rounded-r-lg flex gap-3 items-start">
                        <div className="flex items-center gap-1 mt-0.5 flex-shrink-0">
                            <Gavel className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-xs font-bold text-slate-700 uppercase">Texto Legal:</span>
                        </div>
                        <p className="text-xs text-slate-600 italic font-medium leading-snug line-clamp-2 hover:line-clamp-none transition-all">
                            "{currentPoint.legal_text || currentPoint.description}"
                        </p>
                    </div>
                </div>

                {/* Main Content: 2-Column Grid to save vertical space */}
                <div className="flex-1 min-h-0 grid grid-cols-2 gap-4">

                    {/* Left Col: Expert Criteria */}
                    <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-2">
                        <div>
                            <h4 className="text-sm font-bold text-gray-800 mb-1">Criterios Técnicos Generales</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {currentPoint.details}
                            </p>
                        </div>

                        {currentPoint.expert_criteria && (
                            <div className="bg-amber-50/50 rounded-lg p-3 border border-amber-100 flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Info className="w-4 h-4 text-amber-600" />
                                    <h4 className="text-sm font-bold text-amber-800">Aspectos Clave (Guía)</h4>
                                </div>
                                <ul className="space-y-2">
                                    {currentPoint.expert_criteria.map((criteria, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-xs text-amber-900/80 leading-snug">
                                            <span className="min-w-[5px] h-1.5 mt-1.5 bg-amber-400 rounded-full flex-shrink-0"></span>
                                            {criteria}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Right Col: Check Points */}
                    <div className="flex flex-col h-full overflow-hidden">
                        {currentPoint.check_points && (currentPoint.check_points.length > 0) ? (
                            <div className="border border-green-100 rounded-lg overflow-hidden flex flex-col h-full bg-white">
                                <div className="bg-green-50 px-3 py-2 border-b border-green-100 flex items-center gap-2 flex-shrink-0">
                                    <ListChecks className="w-4 h-4 text-green-600" />
                                    <h4 className="text-sm font-bold text-green-700 uppercase">Verificación Visual</h4>
                                </div>
                                <div className="overflow-y-auto custom-scrollbar flex-1 p-0 divide-y divide-gray-100">
                                    {currentPoint.check_points.map((cp, idx) => (
                                        <div key={idx} className="px-3 py-2.5 hover:bg-green-50/30 transition-colors">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <span className="text-xs font-bold text-gray-700">{cp.label}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 leading-tight">{cp.detail}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-300 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                <span className="text-sm">Sin puntos de verificación visual</span>
                            </div>
                        )}
                    </div>

                </div>

                {/* Footer: Refs */}
                <div className="flex-none pt-2 border-t border-gray-100 flex gap-2">
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
