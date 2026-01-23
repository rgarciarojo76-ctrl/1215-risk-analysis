
import fs from 'fs';
import path from 'path';

const csvPath = '/Users/rubengarciarojo/Desktop/Check List 1215 Odoo 2023-09-21.csv';
const content = fs.readFileSync(csvPath, 'utf-8');

const lines = content.split('\n');
const sections = {};

let currentSection = null;

lines.forEach(line => {
    // csv format: ID;Question;Comment;...
    // Naive split by semicolon is risky if comments contain semicolons, but let's try.
    const parts = line.split(';');
    if (parts.length < 3) return;

    const id = parts[0].trim();
    const text = parts[1].trim();
    const comment = parts[2].trim().replace(/^"/, '').replace(/"$/, ''); // clean quotes

    if (!id) return;

    // Detect top-level sections (e.g., "1", "2", "3")
    if (/^\d+$/.test(id)) {
        currentSection = id;
        if (!sections[currentSection]) {
            sections[currentSection] = {
                title: text,
                items: []
            };
        }
    }
    // Detect sub-items (e.g., "1.1", "1.1.", "1.2")
    else if (/^\d+(\.\d+)+/.test(id)) {
        const root = id.split('.')[0];
        if (sections[root]) {
            sections[root].items.push({
                id: id,
                question: text,
                criteria: comment
            });
        }
    }
});

console.log(JSON.stringify(sections, null, 2));
