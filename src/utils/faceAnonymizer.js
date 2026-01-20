
import * as faceapi from 'face-api.js';

let modelsLoaded = false;

// Load models from public directory
export const loadFaceApiModels = async () => {
    if (modelsLoaded) return;

    try {
        const modelPath = '/models'; // served from public/models
        console.log('Loading FaceAPI models from:', modelPath);

        await faceapi.nets.tinyFaceDetector.loadFromUri(modelPath);
        // await faceapi.nets.faceLandmark68Net.loadFromUri(modelPath); // Optional, for accuracy if needed

        modelsLoaded = true;
        console.log('FaceAPI models loaded successfully');
    } catch (error) {
        console.error('Error loading FaceAPI models:', error);
        throw error;
    }
};

// Main function to anonymize an image file
export const anonymizeImage = async (imageFile) => {
    if (!modelsLoaded) {
        await loadFaceApiModels();
    }

    // 1. Create HTMLImageElement from File
    const img = await faceapi.bufferToImage(imageFile);

    // 2. Detect Faces (using TinyFaceDetector for speed)
    // inputSize: 224, 320, 416, 512, 608... higher = slower but more accurate
    const detectionOptions = new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.3 });
    const detections = await faceapi.detectAllFaces(img, detectionOptions);

    console.log(`FaceAPI: Detected ${detections.length} faces`);

    if (detections.length === 0) {
        // No faces, return original
        return {
            file: imageFile,
            url: URL.createObjectURL(imageFile),
            count: 0
        };
    }

    // 3. Draw to Canvas and Blur Faces
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');

    // Draw original image first
    ctx.drawImage(img, 0, 0);

    // Apply blur to each face region
    detections.forEach(detection => {
        const { x, y, width, height } = detection.box;

        // Save context
        ctx.save();

        // Define clipping path for the face
        ctx.beginPath();
        // Ellipse blur looks more natural than rect
        ctx.ellipse(x + width / 2, y + height / 2, width / 2 * 1.2, height / 2 * 1.2, 0, 0, 2 * Math.PI);
        ctx.clip();

        // Apply blur filter
        ctx.filter = 'blur(15px)'; // Heavy blur
        ctx.drawImage(img, 0, 0); // Draw image again over content, but clipped and blurred

        // Restore context
        ctx.restore();
    });

    // 4. Convert back to Blob/File
    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            const newFile = new File([blob], "anonymized_" + imageFile.name, { type: imageFile.type });
            const newUrl = URL.createObjectURL(newFile);

            resolve({
                file: newFile,
                url: newUrl,
                count: detections.length
            });
        }, imageFile.type);
    });
};
