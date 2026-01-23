import React, { useState } from 'react';
import { BookOpen, ExternalLink, Info, ListChecks, Gavel, Video, X } from 'lucide-react';
import CorporateCard from '../layout/CorporateCard';
import ExpertBotPanel from './ExpertBotPanel';

const TopPanel_TechnicalAssistance = ({ currentPoint }) => {
    const [isVideoOpen, setIsVideoOpen] = useState(false);

    return (
        <CorporateCard
            title={`Guía Técnica: ${currentPoint.title}`}
            icon={BookOpen}
            borderColor="border-t-4 border-t-[#0ea5e9]" // Corporate Blue
        >
            <div className="h-full flex flex-col gap-2 overflow-hidden relative">

                {/* Header Section: Badges + Video Button + Legal Text */}
                <div className="flex-none space-y-1.5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-100 uppercase tracking-wider">
                                RD 1215/97 - Anexo I
                            </span>
                            <span className="text-xs font-bold px-2 py-0.5 bg-purple-50 text-purple-600 rounded border border-purple-100 uppercase tracking-wider">
                                Criterios Foment
                            </span>
                        </div>

                        {/* Video Guide Button */}
                        {currentPoint.video_guide && (
                            <button
                                onClick={() => setIsVideoOpen(true)}
                                className="flex items-center gap-2 px-4 py-1.5 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-md shadow-sm transition-all transform active:scale-95 group"
                            >
                                <Video className="w-4 h-4 fill-white/20 group-hover:fill-white/40 transition-colors" />
                                <span className="text-sm font-bold">Guía de vídeo</span>
                            </button>
                        )}
                    </div>

                    <div className="bg-slate-50 border-l-4 border-slate-400 p-2 rounded-r-lg flex gap-3 items-start">
                        <div className="flex items-center gap-1 mt-0.5 flex-shrink-0">
                            <Gavel className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-xs font-bold text-slate-700 uppercase">Texto Legal:</span>
                        </div>
                        <p className="text-sm text-slate-600 italic font-medium leading-relaxed line-clamp-3 hover:line-clamp-none transition-all">
                            "{currentPoint.legal_text || currentPoint.description}"
                        </p>
                    </div>
                </div>

                {/* Main Content: 3-Column Grid */}
                <div className="flex-1 min-h-0 grid grid-cols-3 gap-4">

                    {/* Col 1: Expert Criteria */}
                    <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-2 min-h-0">
                        <div>
                            <h4 className="text-base font-bold text-gray-800 mb-2">Criterios Técnicos Generales</h4>
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
                                        <li key={idx} className="flex items-start gap-2 text-sm text-amber-900/80 leading-snug">
                                            <span className="min-w-[5px] h-1.5 mt-1.5 bg-amber-400 rounded-full flex-shrink-0"></span>
                                            {criteria}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Col 2: Check Points */}
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
                                            <div className="flex items-center justify-between mb-1">
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

                    {/* Col 3: Expert System Chatbot */}
                    <div className="flex flex-col h-full overflow-hidden">
                        <ExpertBotPanel currentPoint={currentPoint} />
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

                {/* VIDEO MODAL */}
                {isVideoOpen && currentPoint.video_guide && (
                    <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="relative w-full max-w-3xl bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800">
                            <button
                                onClick={() => setIsVideoOpen(false)}
                                className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white hover:bg-white hover:text-black rounded-full transition-colors backdrop-blur-md"
                            >
                                <X size={20} />
                            </button>
                            <h3 className="absolute top-4 left-4 z-10 text-white font-bold text-lg drop-shadow-md">
                                Guía Visual: {currentPoint.title}
                            </h3>
                            <video
                                src={currentPoint.video_guide}
                                controls
                                autoPlay
                                className="w-full h-auto max-h-[70vh]"
                            />
                        </div>
                    </div>
                )}
            </div>
        </CorporateCard>
    );
};

export default TopPanel_TechnicalAssistance;
