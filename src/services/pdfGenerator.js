import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// --- CONSTANTS & THEME ---
const THEME = {
    primary: [44, 62, 80],    // Dark Blue
    accent: [41, 128, 185],   // Light Blue
    success: [39, 174, 96],   // Green
    danger: [192, 57, 43],    // Red
    warning: [243, 156, 18],  // Orange
    text: [50, 50, 50],       // Dark Gray
    lightText: [100, 100, 100],
    white: [255, 255, 255]
};

const FONTS = {
    main: "helvetica"
};

/**
 * GENERATOR CLASS FOR RD 1215/1997 FINAL REPORT
 */
class FinalReportGenerator {
    constructor(machineData, annexPoints, images, markers, findings, complianceStatus) {
        this.doc = new jsPDF();
        this.data = {
            machine: machineData,
            points: annexPoints,
            images: images,
            markers: markers,
            findings: findings,
            status: complianceStatus
        };
        this.pageWidth = this.doc.internal.pageSize.width;
        this.pageHeight = this.doc.internal.pageSize.height;
        this.pageCount = 0;
    }

    // --- HELPERS ---

    addHeader() {
        // Simple header for internal pages
        this.doc.setFillColor(...THEME.primary);
        this.doc.rect(0, 0, this.pageWidth, 15, 'F');

        this.doc.setTextColor(...THEME.white);
        this.doc.setFontSize(10);
        this.doc.setFont(FONTS.main, "bold");
        this.doc.text("INFORME TÉCNICO DE ADECUACIÓN - RD 1215/1997", 10, 10);

        this.doc.setFont(FONTS.main, "normal");
        this.doc.text(`${this.data.machine.name} | ${new Date().toLocaleDateString()}`, this.pageWidth - 10, 10, { align: 'right' });
    }

    addFooter() {
        const pageCount = this.doc.internal.getNumberOfPages();
        this.doc.setFontSize(8);
        this.doc.setTextColor(150, 150, 150);
        this.doc.text(`Página ${pageCount}`, this.pageWidth / 2, this.pageHeight - 10, { align: 'center' });
    }

    checkNewPage(neededHeight) {
        // Implement if needed for complex flow, though mostly we use addPage manually
    }

    formatType(type) {
        const types = {
            'generic_fixed': 'Equipo Fijo Genérico',
            'press': 'Prensa Mecánica / Hidráulica',
            'lathe': 'Torno Convencional',
            'milling': 'Fresadora Universal',
            'saw': 'Sierra de Cinta'
        };
        return types[type] || type;
    }

    // --- SECTIONS ---

    generateCover() {
        const { machine, status } = this.data;

        // Background
        this.doc.setFillColor(...THEME.primary);
        this.doc.rect(0, 0, this.pageWidth, this.pageHeight, 'F');

        // Border Design
        this.doc.setDrawColor(...THEME.accent);
        this.doc.setLineWidth(2);
        this.doc.rect(15, 15, this.pageWidth - 30, this.pageHeight - 30);

        // Title
        this.doc.setTextColor(...THEME.white);
        this.doc.setFontSize(32);
        this.doc.setFont(FONTS.main, "bold");
        this.doc.text("INFORME DE", this.pageWidth / 2, 80, { align: 'center' });
        this.doc.text("ADECUACIÓN", this.pageWidth / 2, 95, { align: 'center' });

        // Subtitle
        this.doc.setFontSize(16);
        this.doc.setFont(FONTS.main, "normal");
        this.doc.text("REAL DECRETO 1215/1997", this.pageWidth / 2, 110, { align: 'center' });
        this.doc.text("Disposiciones mínimas de seguridad y salud", this.pageWidth / 2, 118, { align: 'center' });

        // Machine Info Box
        this.doc.setFillColor(255, 255, 255, 0.1);
        this.doc.roundedRect(this.pageWidth / 2 - 80, 140, 160, 60, 3, 3, 'F');

        this.doc.setFontSize(14);
        this.doc.text(`Equipo: ${machine.name}`, this.pageWidth / 2, 155, { align: 'center' });
        this.doc.setFontSize(12);
        this.doc.text(`Tipo: ${this.formatType(machine.type)}`, this.pageWidth / 2, 165, { align: 'center' });
        this.doc.text(`Fecha de Inspección: ${new Date().toLocaleDateString()}`, this.pageWidth / 2, 175, { align: 'center' });

        // Status Stamp
        const nonCompliantCount = Object.values(status).filter(s => s === 'non_compliant').length;
        const isCompliant = nonCompliantCount === 0;

        const stampColor = isCompliant ? THEME.success : THEME.danger;
        const stampText = isCompliant ? "ADECUADO" : "NO ADECUADO";

        this.doc.setDrawColor(...stampColor);
        this.doc.setLineWidth(3);
        this.doc.roundedRect(this.pageWidth / 2 - 40, 220, 80, 20, 2, 2, 'D');
        this.doc.setTextColor(...stampColor);
        this.doc.setFontSize(16);
        this.doc.setFont(FONTS.main, "bold");
        this.doc.text(stampText, this.pageWidth / 2, 233, { align: 'center' });
    }

    generateExecutiveSummary() {
        this.doc.addPage();
        this.addHeader();

        const { points, status } = this.data;
        const total = points.length;
        const compliant = Object.values(status).filter(s => s === 'compliant').length;
        const nonCompliant = Object.values(status).filter(s => s === 'non_compliant').length;
        const notApplicable = Object.values(status).filter(s => s === 'not_applicable').length;
        const pending = total - compliant - nonCompliant - notApplicable;

        // Title
        this.doc.setTextColor(...THEME.primary);
        this.doc.setFontSize(18);
        this.doc.setFont(FONTS.main, "bold");
        this.doc.text("1. Resumen Ejecutivo", 20, 35);

        // Stats Cards - Adjusted for 4 cards or 3 cards merging N/A and Pending
        const cardWidth = 40;
        const gap = 5;
        const startX = (this.pageWidth - (cardWidth * 4 + gap * 3)) / 2;
        const yCard = 50;

        // Helper to draw card
        const drawCard = (x, title, value, color) => {
            this.doc.setFillColor(245, 245, 245);
            this.doc.roundedRect(x, yCard, cardWidth, 40, 2, 2, 'F');
            this.doc.setDrawColor(...color);
            this.doc.setLineWidth(0.5);
            this.doc.roundedRect(x, yCard, cardWidth, 40, 2, 2, 'S');

            this.doc.setTextColor(...THEME.text);
            this.doc.setFontSize(8);
            this.doc.setFont(FONTS.main, "bold");
            this.doc.text(title, x + cardWidth / 2, yCard + 12, { align: 'center' });

            this.doc.setTextColor(...color);
            this.doc.setFontSize(20);
            this.doc.setFont(FONTS.main, "bold");
            this.doc.text(String(value), x + cardWidth / 2, yCard + 28, { align: 'center' });
        };

        drawCard(startX, "CUMPLE", compliant, THEME.success);
        drawCard(startX + cardWidth + gap, "NO CUMPLE", nonCompliant, THEME.danger);
        drawCard(startX + (cardWidth + gap) * 2, "NO APLICA", notApplicable, THEME.lightText);
        drawCard(startX + (cardWidth + gap) * 3, "PENDIENTE", pending, THEME.warning);

        // ... existing conclusion logic ...
        // Conclusions Text
        this.doc.setTextColor(...THEME.text);
        this.doc.setFontSize(12);
        this.doc.setFont(FONTS.main, "normal");

        // Identify Critical Risks (Points with at least one 'high' severity finding)
        const criticalPoints = [];
        Object.entries(this.data.findings).forEach(([pointId, findingsList]) => {
            if (findingsList.some(f => f.severity === 'high')) {
                const point = points.find(p => p.id === pointId);
                if (point) criticalPoints.push(point);
            }
        });

        const criticalCount = criticalPoints.length;

        let conclusion = "";
        if (nonCompliant === 0) {
            conclusion = `Tras la evaluación de los ${total} puntos del RD 1215/1997, no se han detectado desviaciones en los apartados aplicables. El equipo se considera ADECUADO.`;
        } else {
            conclusion = `Se han detectado ${nonCompliant} desviaciones no conformes. `;
            if (criticalCount > 0) {
                conclusion += `ATENCIÓN: Se han identificado ${criticalCount} RIESGOS CRÍTICOS que deben ser corregidos inmediatamente.`;
            } else {
                conclusion += "El equipo requiere medidas correctoras para considerarse adecuado.";
            }
        }

        // ... list logic ...
        const splitConclusion = this.doc.splitTextToSize(conclusion, this.pageWidth - 40);
        this.doc.text(splitConclusion, 20, 110);

        // List of Risks
        let yList = 160;

        // 1. Critical Risks
        if (criticalCount > 0) {
            this.doc.setTextColor(...THEME.danger);
            this.doc.setFontSize(14);
            this.doc.setFont(FONTS.main, "bold");
            this.doc.text(`RIESGOS CRÍTICOS DETECTADOS (${criticalCount})`, 20, 150);

            // Sort critical points by ID
            const sortedCritical = [...criticalPoints].sort((a, b) => {
                return parseFloat(a.id) - parseFloat(b.id);
            });

            sortedCritical.forEach(p => {
                this.doc.setTextColor(...THEME.text);
                this.doc.setFontSize(10);
                this.doc.setFont(FONTS.main, "bold"); // Bold for critical
                const line = `• Punto ${p.id}: ${p.title}`;
                this.doc.text(line, 25, yList);
                yList += 7;
            });

            yList += 10; // Spacing
        }

        // 2. Other Non-Compliant Points
        const otherNonCompliant = points.filter(p => status[p.id] === 'non_compliant' && !criticalPoints.includes(p));

        if (otherNonCompliant.length > 0) {
            this.doc.setTextColor(...THEME.warning); // Orange for others
            this.doc.setFontSize(14);
            this.doc.setFont(FONTS.main, "bold");
            this.doc.text(`Otras Desviaciones (${otherNonCompliant.length})`, 20, yList);
            yList += 10;

            // Sort other points by ID
            const sortedOther = [...otherNonCompliant].sort((a, b) => {
                return parseFloat(a.id) - parseFloat(b.id);
            });

            sortedOther.forEach(p => {
                this.doc.setTextColor(...THEME.lightText);
                this.doc.setFontSize(10);
                this.doc.setFont(FONTS.main, "normal");
                const line = `• Punto ${p.id}: ${p.title}`;
                this.doc.text(line, 25, yList);
                yList += 7;
            });
        }
    }

    // ... (generateDetailedFindings remains mostly same, it filters non_compliant so N/A won't appear there)

    generateAnnex() {
        this.doc.addPage();
        this.addHeader();

        // Title
        this.doc.setTextColor(...THEME.primary);
        this.doc.setFontSize(18);
        this.doc.setFont(FONTS.main, "bold");
        this.doc.text("3. Anexo: Lista de Comprobación Completa", 20, 35);

        // Table of all points
        const { points, status } = this.data;

        const tableData = points.map(p => {
            const st = status[p.id];
            let statusText = "PENDIENTE";
            if (st === 'compliant') statusText = "CUMPLE";
            if (st === 'non_compliant') statusText = "NO CUMPLE";
            if (st === 'not_applicable') statusText = "NO APLICA";

            return [p.id, p.title, statusText];
        });

        autoTable(this.doc, {
            startY: 45,
            head: [['Punto', 'Requisito', 'Estado']],
            body: tableData,
            theme: 'striped',
            headStyles: { fillColor: [...THEME.primary] },
            columnStyles: {
                0: { cellWidth: 20, fontStyle: 'bold' },
                1: { cellWidth: 'auto' },
                2: { cellWidth: 30, halign: 'center', fontStyle: 'bold' }
            },
            styles: { fontSize: 8 },
            didParseCell: (data) => {
                if (data.section === 'body' && data.column.index === 2) {
                    const text = data.cell.raw;
                    if (text === 'CUMPLE') {
                        data.cell.styles.textColor = THEME.success;
                    } else if (text === 'NO CUMPLE') {
                        data.cell.styles.textColor = THEME.danger;
                    } else if (text === 'NO APLICA') {
                        data.cell.styles.textColor = THEME.lightText;
                        data.cell.styles.fontStyle = 'italic';
                    } else {
                        // PENDIENTE
                        data.cell.styles.textColor = THEME.warning;
                    }
                }
            }
        });

        this.addFooter();
    }

    save() {
        const filename = `Informe_RD1215_${this.data.machine.name.replace(/\s+/g, '_')}.pdf`;
        this.doc.save(filename);
    }

    generate() {
        this.generateCover();
        this.generateExecutiveSummary();
        this.generateDetailedFindings();
        this.generateAnnex();
        this.save();
    }
}

// --- EXPORTED FUNCTIONS ---

export const generateFinalReport = (machineData, annexPoints, images, markers, findings, complianceStatus) => {
    const generator = new FinalReportGenerator(machineData, annexPoints, images, markers, findings, complianceStatus);
    generator.generate();
};

export const generateItemReport = (machineData, point, imageBase64, markers, findings) => {
    // Keep the existing simple Item Report or refactor if needed. 
    // For now, let's keep it but ensure it works with the imports.
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // -- HEADER --
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, pageWidth, 20, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("INFORME DE ELEMENTO - RD 1215/1997", 10, 13);
    doc.setFontSize(10);
    doc.text(`${machineData.name} | ${machineData.type}`, pageWidth - 10, 13, { align: 'right' });

    let yPos = 30;

    // Point Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Punto ${point.id}: ${point.title}`, 10, yPos);

    yPos += 7;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const descLines = doc.splitTextToSize(point.description, pageWidth - 20);
    doc.text(descLines, 10, yPos);
    yPos += (descLines.length * 5) + 5;

    // Image
    if (imageBase64) {
        try {
            const imgProps = doc.getImageProperties(imageBase64);
            const imgWidth = pageWidth - 40;
            const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
            const maxImgHeight = 100;
            const finalWidth = imgHeight > maxImgHeight ? (imgWidth * maxImgHeight) / imgHeight : imgWidth;
            const finalHeight = imgHeight > maxImgHeight ? maxImgHeight : imgHeight;
            const xOffset = (pageWidth - finalWidth) / 2;

            doc.addImage(imageBase64, 'JPEG', xOffset, yPos, finalWidth, finalHeight);

            // Markers
            doc.setDrawColor(255, 0, 0);
            doc.setLineWidth(0.5);
            doc.setTextColor(255, 0, 0);
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");

            markers.forEach(m => {
                const mx = xOffset + (m.x / 100) * finalWidth;
                const my = yPos + (m.y / 100) * finalHeight;
                doc.circle(mx, my, 3);
                doc.text(String(m.id), mx + 4, my + 4);
            });

            yPos += finalHeight + 10;
        } catch (e) {
            console.error(e);
        }
    }

    // Table
    const tableData = findings.map(f => [
        f.markerId,
        f.evidence || 'Sin especificar',
        f.measure || 'Sin especificar'
    ]);

    autoTable(doc, {
        startY: yPos,
        head: [['ID', 'Evidencia Detectada', 'Medida Correctora']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185] },
        styles: { fontSize: 9 }
    });

    doc.save(`Reporte_Item_${point.id}.pdf`);
};
