import React from 'react';
import { Settings, TriangleAlert } from 'lucide-react';

const Header = ({ onOpenSettings, onExport }) => {
    return (
        <header className="dashboard-header">
            <div className="brand-section">
                <img src="/logo-direccion-tecnica.jpg" alt="Dirección Técnica Logo" className="brand-logo" />
                <div className="brand-info">
                    <h1>DIRECCIÓN TÉCNICA IA LAB</h1>
                    <span className="brand-subtitle">App: Análisis de Imágenes – Riesgos PRL</span>
                </div>
            </div>

            <div className="status-section">
                <div className="status-badge">Estado: Piloto interno</div>
                <div className="status-disclaimer">
                    <TriangleAlert size={18} className="disclaimer-icon" />
                    <div className="disclaimer-content">
                        <span className="disclaimer-title">AVISO:</span>
                        <span className="disclaimer-body">Apoyo técnico (no sustitutivo del criterio profesional). La información debe ser validada.</span>
                    </div>
                </div>
            </div>

            <div className="header-actions">
                <button onClick={onOpenSettings} className="icon-btn" title="Configurar API">
                    <Settings size={20} />
                </button>
                <button onClick={onExport} className="export-btn">
                    Exportar PDF
                </button>
            </div>
        </header>
    );
};

export default Header;
