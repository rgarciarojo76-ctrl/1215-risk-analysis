import React, { useState } from 'react';
import Phase0_Identification from './Phase0_Identification';
import Phase1_Analysis from './Phase1_Analysis';
import { RD1215_ANNEX } from '../../data/rd1215_annex';
import CorporateLayout from '../layout/CorporateLayout';

const WizardContainer = () => {
    const [step, setStep] = useState(0); // 0 = Identification, 1 = Analysis
    const [machineData, setMachineData] = useState(null);
    const [findings, setFindings] = useState({}); // { pointId: { status: 'ok'|'nok', observations: [] } }

    const handleStart = (data) => {
        setMachineData(data);
        setStep(1);
    };

    return (
        <CorporateLayout appName="App: Análisis Riesgos 1215">
            {step === 0 && (
                <Phase0_Identification onStart={handleStart} />
            )}

            {step === 1 && (
                <Phase1_Analysis
                    machineData={machineData}
                    onBack={() => setStep(0)}
                />
            )}
        </CorporateLayout>
    );
};

export default WizardContainer;
