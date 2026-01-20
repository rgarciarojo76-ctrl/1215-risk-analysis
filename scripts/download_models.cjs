
const fs = require('fs');
const https = require('https');
const path = require('path');

const modelsDir = path.join(__dirname, '../public/models');
const baseUrl = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';

const files = [
    'tiny_face_detector_model-weights_manifest.json',
    'tiny_face_detector_model-shard1',
    'face_landmark_68_model-weights_manifest.json', // Useful for alignment if needed later
    'face_landmark_68_model-shard1',
    'face_recognition_model-weights_manifest.json', // Just in case
    'face_recognition_model-shard1',
    'face_recognition_model-shard2'
];

if (!fs.existsSync(modelsDir)) {
    fs.mkdirSync(modelsDir, { recursive: true });
}

const downloadFile = (file) => {
    const filePath = path.join(modelsDir, file);
    const fileUrl = `${baseUrl}/${file}`;

    console.log(`Downloading ${file}...`);

    https.get(fileUrl, (response) => {
        if (response.statusCode !== 200) {
            console.error(`Failed to download ${file}: ${response.statusCode}`);
            return;
        }

        const fileStream = fs.createWriteStream(filePath);
        response.pipe(fileStream);

        fileStream.on('finish', () => {
            fileStream.close();
            console.log(`Downloaded ${file}`);
        });
    }).on('error', (err) => {
        fs.unlink(filePath, () => { });
        console.error(`Error downloading ${file}: ${err.message}`);
    });
};

files.forEach(downloadFile);
