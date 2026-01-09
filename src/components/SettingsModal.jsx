import React, { useState, useEffect } from 'react';
import { X, Save, Key } from 'lucide-react';
import './SettingsModal.css';

const SettingsModal = ({ isOpen, onClose }) => {
    const [apiKey, setApiKey] = useState('');

    useEffect(() => {
        const storedKey = localStorage.getItem('google_gemini_api_key');
        if (storedKey) setApiKey(storedKey);
    }, [isOpen]);

    const handleSave = () => {
        localStorage.setItem('google_gemini_api_key', apiKey);
        onClose();
        alert('Configuración guardada correctamente.');
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Configuración API</h2>
                    <button onClick={onClose} className="close-btn"><X size={20} /></button>
                </div>
                <div className="modal-body">
                    <p>Para usar el análisis real con Gemini 1.5 Pro, introduce tu API Key de Google AI.</p>
                    <div className="input-group">
                        <Key size={16} className="input-icon" />
                        <input
                            type="password"
                            placeholder="Introduce tu Google AI Key..."
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                        />
                    </div>
                    <p className="note">Puedes obtener tu clave en <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer">Google AI Studio</a>. Se guarda localmente en su navegador.</p>
                </div>
                <div className="modal-footer">
                    <button onClick={handleSave} className="save-btn">
                        <Save size={16} /> Guardar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
