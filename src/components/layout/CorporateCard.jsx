import React from 'react';

const CorporateCard = ({ title, children, className = "", headerColor = "bg-white", borderColor = "border-t-4 border-t-blue-500", icon: Icon }) => {
    return (
        <div className={`bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col h-full overflow-hidden ${className}`}>
            {/* Header */}
            <div className={`px-5 py-4 flex items-center gap-3 border-b border-gray-50 ${headerColor} ${borderColor}`}>
                {Icon && <Icon className="w-5 h-5 opacity-80" />}
                <h3 className="font-bold text-gray-700 text-sm tracking-tight uppercase">{title}</h3>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden relative p-4">
                {children}
            </div>
        </div>
    );
};

export default CorporateCard;
