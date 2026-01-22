import React from 'react';
import CorporateHeader from './CorporateHeader';

const CorporateLayout = ({ children, appName }) => {
    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-gray-900">
            <CorporateHeader appName={appName} />
            <main className="flex-1 w-full max-w-[1920px] mx-auto relative">
                {children}
            </main>
        </div>
    );
};

export default CorporateLayout;
