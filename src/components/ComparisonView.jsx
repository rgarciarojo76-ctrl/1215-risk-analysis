import React, { useState } from 'react';
import { ZoomIn, RotateCcw } from 'lucide-react';
import './ComparisonView.css';

const ComparisonView = ({ beforeImage, afterImage }) => {
    const [sliderValue, setSliderValue] = useState(50);
    const [zoomLevel, setZoomLevel] = useState(1);

    // If we only have before image or nothing, show simple view
    if (!beforeImage) {
        return <div className="comparison-placeholder">Suba una imagen para ver la comparación</div>;
    }

    const handleSliderChange = (e) => {
        setSliderValue(e.target.value);
    };

    const handleZoom = () => {
        setZoomLevel(prev => prev === 1 ? 2 : 1);
    };

    // If 'after' image is not ready, just show 'before'
    const showComparison = !!afterImage;

    return (
        <div className="comparison-container">
            <div className="controls">
                <button title="Zoom" onClick={handleZoom} className="control-btn">
                    <ZoomIn size={16} />
                    {zoomLevel}x
                </button>
                {showComparison && (
                    <div className="legend">
                        <span className="legend-item before">Antes</span>
                        <span className="legend-item after">Después</span>
                    </div>
                )}
            </div>

            <div
                className="image-wrapper"
                style={{ transform: `scale(${zoomLevel})` }}
            >
                {/* Background Image (Before - actually After in standard slider logic usually goes on top differently, 
                    but let's do: Background = After (Fixed), Foreground = Before (Clipped) 
                    OR Background = Before, Foreground = After (Clipped).
                    Let's do: Background = After, Foreground = Before (Clippable).
                 */}

                {showComparison ? (
                    <>
                        <img src={afterImage} alt="Despues" className="img-base" />
                        <div
                            className="img-overlay"
                            style={{ width: `${sliderValue}%` }}
                        >
                            <img src={beforeImage} alt="Antes" />
                        </div>
                        <div
                            className="slider-line"
                            style={{ left: `${sliderValue}%` }}
                        >
                            <div className="slider-handle"></div>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={sliderValue}
                            onChange={handleSliderChange}
                            className="slider-input"
                        />
                    </>
                ) : (
                    <img src={beforeImage} alt="Vista Original" className="img-single" />
                )}
            </div>
        </div>
    );
};

export default ComparisonView;
