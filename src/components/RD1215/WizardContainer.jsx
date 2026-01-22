import React, { useState } from 'react';
import Phase0_Identification from './Phase0_Identification';
import Phase1_Analysis from './Phase1_Analysis';
import { RD1215_ANNEX } from '../../data/rd1215_annex';

const WizardContainer = () => {
    const [step, setStep] = useState(0); // 0 = Identification, 1 = Analysis
    const [machineData, setMachineData] = useState(null);
    const [findings, setFindings] = useState({}); // { pointId: { status: 'ok'|'nok', observations: [] } }

    const handleStart = (data) => {
        setMachineData(data);
        setStep(1);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <div className="max-w-[1600px] mx-auto bg-white min-h-screen shadow-2xl border-x border-gray-100 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60 pointer-events-none"></div>

                {step === 0 && (
                    <div className="flex items-center justify-center p-4">
                        <Phase0_Identification onStart={handleStart} />
                    </div>
                )}

                {step === 1 && (
                    <Phase1_Analysis
                        machineData={machineData}
                        onBack={() => setStep(0)}
                    />
                )}
            </div>
        </div>
    );
};

export default WizardContainer;
