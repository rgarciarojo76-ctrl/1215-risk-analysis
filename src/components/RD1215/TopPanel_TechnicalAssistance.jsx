import React from 'react';
import { BookOpen, ExternalLink, Info } from 'lucide-react';
import CorporateCard from '../../layout/CorporateCard';

const TopPanel_TechnicalAssistance = ({ currentPoint }) => {
    return (
        <CorporateCard
            title={`Normativa: ${currentPoint.title}`}
            icon={BookOpen}
            borderColor="border-t-4 border-t-[#0ea5e9]" // Corporate Blue
        >
            <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded border border-blue-100 uppercase tracking-wider">
                        Anexo I - RD 1215/1997
                    </span>
                </div>

                <p className="text-gray-600 font-medium mb-4 leading-relaxed text-sm">
                    {currentPoint.description}
                </p>

                {currentPoint.details && (
                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-100/50 mb-4 flex gap-3">
                        <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-600 leading-snug">
                            {currentPoint.details}
                        </p>
                    </div>
                )}

                <div className="flex flex-wrap gap-2 mt-auto">
                    {currentPoint.ntp_refs.map((ref, idx) => (
                        <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-50 text-xs text-gray-500 border border-gray-100"
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
