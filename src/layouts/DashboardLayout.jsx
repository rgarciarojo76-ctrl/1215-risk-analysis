import React from 'react';
import ImageUploader from '../components/ImageUploader';
import RiskTable from '../components/RiskTable';
import ComparisonView from '../components/ComparisonView';
import ManualRiskEntry from '../components/ManualRiskEntry';
import './DashboardLayout.css';
import SettingsModal from '../components/SettingsModal';
import { Upload, FileText, SplitSquareHorizontal, Settings } from 'lucide-react';

const DashboardLayout = () => {
    const [uploadedImage, setUploadedImage] = React.useState(null);
    const [analysisResult, setAnalysisResult] = React.useState(null);
    const [afterImage, setAfterImage] = React.useState(null);
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

    const handleAnalysisComplete = (data) => {
        setAnalysisResult(data.risks);
        setAfterImage(data.afterImage);
    };

    const handleManualRiskAdd = (newRisk) => {
        setAnalysisResult(prev => [...(prev || []), newRisk]);
    };

    const handleExport = async () => {
        // Dynamic import to avoid SSR issues if any, though standard import is fine in Vite
        const { generatePDFReport } = await import('../utils/pdfExport');
        generatePDFReport(analysisResult, uploadedImage, afterImage);
    };



    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="brand-section">
                    <img src="/aspy_logo.png" alt="ASPY Logo" className="brand-logo" />
                    <div className="brand-info">
                        <h1>ASPY AI LAB</h1>
                        <span className="brand-subtitle">App: Análisis de Imágenes – Riesgos PRL</span>
                    </div>
                </div>

                <div className="status-section">
                    <div className="status-badge">Estado: Piloto interno</div>
                    <div className="status-disclaimer">AVISO: Apoyo técnico (no sustitutivo del criterio profesional). La información debe ser validada.</div>
                </div>

                <div className="header-actions">
                    <button onClick={() => setIsSettingsOpen(true)} className="icon-btn" title="Configurar API">
                        <Settings size={20} />
                    </button>
                    <button onClick={handleExport} className="export-btn">
                        Exportar PDF
                    </button>
                </div>
            </header>

            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

            <main className="dashboard-grid">
                {/* Left Panel: Upload (Before) - Red Border */}
                <section className="panel-left panel-border-red">
                    <div className="panel-header">
                        <Upload size={20} />
                        <h2>Imagen Original (Antes)</h2>
                    </div>
                    <ImageUploader
                        setUploadedImage={setUploadedImage}
                        onAnalysisComplete={handleAnalysisComplete}
                    />
                </section>

                {/* Right Panel: After Image - Green Border */}
                <section className="panel-right panel-border-green">
                    <div className="panel-header">
                        <SplitSquareHorizontal size={20} />
                        <h2>Medidas Aplicadas (Después)</h2>
                    </div>
                    <div className="after-image-container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', overflow: 'hidden' }}>
                        {afterImage ? (
                            <img src={afterImage} alt="Simulación Después" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        ) : (
                            <div style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>
                                <p>La simulación aparecerá aquí tras el análisis</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Bottom Panel: Risk Table - Full Width */}
                <section className="panel-bottom">
                    <div className="panel-header">
                        <FileText size={20} />
                        <h2>Factores de Riesgo Identificados</h2>
                    </div>
                    <RiskTable risks={analysisResult} />
                </section>
            </main>

            <ManualRiskEntry onAddRisk={handleManualRiskAdd} />
        </div>
    );
};

export default DashboardLayout;
