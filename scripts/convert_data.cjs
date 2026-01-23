
const fs = require('fs');
const path = require('path');

// 1. Read Odoo Data
const odooPath = path.join(__dirname, '../odoo_data.json');
const odooData = JSON.parse(fs.readFileSync(odooPath, 'utf8'));

// 2. Read Old Data (to preserve manual fields like video_guide if we can match them)
// We'll skip complex matching for now and focus on the Odoo structure as requested.
// We will migrate specific hardcoded things manually if needed later.

// 3. Transform
const newAnnex = [];

// Odoo keys are "1", "2", ... "21"
// We want to sort them numerically
const sortedKeys = Object.keys(odooData).sort((a, b) => parseInt(a) - parseInt(b));

sortedKeys.forEach(key => {
    const sectionData = odooData[key];

    // Create the structure matching RD1215_ANNEX schema
    const newPoint = {
        id: key, // "1", "2"...
        // Odoo title is just "Órganos de accionamiento", we might want "1. Órganos..."
        title: `${key}. ${sectionData.title}`,
        section: "Anexo I - RD 1215/97", // Generic section name
        legal_text: "", // Odoo doesn't seem to have the legal text block, we might leave empty or fill later
        description: sectionData.title,

        // Map items to check_points
        check_points: sectionData.items.map(item => ({
            id: item.id.trim(), // "1.1.", "1.2." -> "1.1" etc.
            label: item.question,
            detail: item.criteria
        })),

        // Generate expert_criteria list from unique criteria text to avoid repetition if possible,
        // or just leave it empty and let check_points carry the weight.
        // For now, let's grab the first 3 unique criteria as a "summary" for the expert panel
        expert_criteria: [
            ...new Set(sectionData.items.map(i => i.criteria))
        ].slice(0, 4),

        details: "Verificar cumplimiento de los puntos listados.", // Generic detail
        ntp_refs: [],
        machine_type: "fixed",

        // Preserve specific manual overrides if we knew them (hardcoded for Point 1 e.g.)
        video_guide: (key === "1") ? "/videos/Organos_de_Accionamiento_RD1215.mp4" : null
    };

    newAnnex.push(newPoint);
});

// 4. Output
const loadContent = `export const RD1215_ANNEX = ${JSON.stringify(newAnnex, null, 2)};`;
const outPath = path.join(__dirname, '../src/data/rd1215_annex.js');

console.log(`Generated ${newAnnex.length} points.`);
// We will output to console to copy-paste or write to file directly?
// Creating a separate file to verify first is safer.
fs.writeFileSync(outPath, loadContent);
console.log(`Wrote to ${outPath}`);
