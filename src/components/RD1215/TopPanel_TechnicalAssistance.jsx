import React from 'react';
import { BookOpen, ExternalLink, Info } from 'lucide-react';
import { RD1215_ANNEX } from '../../data/rd1215_annex';

const TopPanel_TechnicalAssistance = ({ currentPoint }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    {currentPoint.title}
                </h2>
                <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-100">
                    Anexo I - RD 1215/1997
                </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <p className="text-gray-700 font-medium mb-2 leading-relaxed">
                    {currentPoint.description}
                </p>

                {currentPoint.details && (
                    <div className="bg-amber-50 rounded-lg p-3 border border-amber-100 mb-3 flex gap-3">
                        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700 leading-snug">
                            {currentPoint.details}
                        </p>
                    </div>
                )}

                <div className="flex flex-wrap gap-2 mt-auto pt-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Referencias:</span>
                    {currentPoint.ntp_refs.map((ref, idx) => (
                        <a
                            key={idx}
                            href="#" // Placeholder for actual link logic
                            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 transition-colors"
                            onClick={(e) => e.preventDefault()}
                        >
                            <ExternalLink className="w-3 h-3" />
                            {ref}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopPanel_TechnicalAssistance;
