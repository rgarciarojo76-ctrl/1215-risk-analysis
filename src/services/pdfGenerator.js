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
        const na = total - compliant - nonCompliant; // Assuming rest is NA or untested

        // Title
        this.doc.setTextColor(...THEME.primary);
        this.doc.setFontSize(18);
        this.doc.setFont(FONTS.main, "bold");
        this.doc.text("1. Resumen Ejecutivo", 20, 35);

        // Stats Cards
        const cardWidth = 50;
        const startX = (this.pageWidth - (cardWidth * 3 + 20)) / 2;
        const yCard = 50;

        // Helper to draw card
        const drawCard = (x, title, value, color) => {
            this.doc.setFillColor(245, 245, 245);
            this.doc.roundedRect(x, yCard, cardWidth, 40, 2, 2, 'F');
            this.doc.setDrawColor(...color);
            this.doc.setLineWidth(0.5);
            this.doc.roundedRect(x, yCard, cardWidth, 40, 2, 2, 'S');

            this.doc.setTextColor(...THEME.text);
            this.doc.setFontSize(10);
            this.doc.setFont(FONTS.main, "normal");
            this.doc.text(title, x + cardWidth / 2, yCard + 12, { align: 'center' });

            this.doc.setTextColor(...color);
            this.doc.setFontSize(20);
            this.doc.setFont(FONTS.main, "bold");
            this.doc.text(String(value), x + cardWidth / 2, yCard + 28, { align: 'center' });
        };

        drawCard(startX, "CUMPLE", compliant, THEME.success);
        drawCard(startX + cardWidth + 10, "NO CUMPLE", nonCompliant, THEME.danger);
        drawCard(startX + (cardWidth + 10) * 2, "NO APLICA / PEND.", na, THEME.lightText);

        // Conclusions Text
        this.doc.setTextColor(...THEME.text);
        this.doc.setFontSize(12);
        this.doc.setFont(FONTS.main, "normal");

        let conclusion = "";
        if (nonCompliant === 0) {
            conclusion = "Tras la evaluación realizada, no se han detectado desviaciones respecto a los requisitos del RD 1215/1997. El equipo de trabajo se considera ADECUADO para su uso, siempre que se mantengan las condiciones actuales de mantenimiento y operación.";
        } else {
            conclusion = `Se han detectado ${nonCompliant} desviaciones que requieren subsanación. El equipo NO PUEDE considerarse adecuado hasta que se implementen las medidas correctoras indicadas en este informe. Se recomienda priorizar las deficiencias marcadas como críticas para garantizar la seguridad inmediata de los operarios.`;
        }

        const splitConclusion = this.doc.splitTextToSize(conclusion, this.pageWidth - 40);
        this.doc.text(splitConclusion, 20, 110);

        // Critical Risk List (Placeholder logic: All Non-compliant are Risks)
        if (nonCompliant > 0) {
            this.doc.setTextColor(...THEME.danger);
            this.doc.setFontSize(14);
            this.doc.setFont(FONTS.main, "bold");
            this.doc.text("Riesgos Detectados", 20, 150);

            const ncPoints = points.filter(p => status[p.id] === 'non_compliant');
            let yList = 160;

            ncPoints.forEach(p => {
                this.doc.setTextColor(...THEME.text);
                this.doc.setFontSize(10);
                this.doc.setFont(FONTS.main, "normal");
                const line = `• Punto ${p.id}: ${p.title}`;
                this.doc.text(line, 25, yList);
                yList += 8;
            });
        }
    }

    generateDetailedFindings() {
        const { points, status, images, markers, findings } = this.data;
        const ncPoints = points.filter(p => status[p.id] === 'non_compliant');

        if (ncPoints.length === 0) return;

        // Section Title Page (Optional, maybe just start listing?)
        // Let's just start listing, but add a separator if logic allows.

        ncPoints.forEach((point) => {
            this.doc.addPage();
            this.addHeader();

            // Section Header
            this.doc.setFillColor(...THEME.danger);
            this.doc.rect(0, 15, this.pageWidth, 12, 'F');
            this.doc.setTextColor(...THEME.white);
            this.doc.setFontSize(11);
            this.doc.setFont(FONTS.main, "bold");
            this.doc.text(`2. Detalle de Deficiencias - Punto ${point.id}`, 20, 24);

            let yPos = 35;

            // Point Description
            this.doc.setTextColor(...THEME.text);
            this.doc.setFontSize(10);
            this.doc.setFont(FONTS.main, "bold");
            this.doc.text("Requisito Legal:", 20, yPos);
            yPos += 5;
            this.doc.setFont(FONTS.main, "normal");
            this.doc.setTextColor(...THEME.lightText);
            const desc = this.doc.splitTextToSize(point.description, this.pageWidth - 40);
            this.doc.text(desc, 20, yPos);
            yPos += (desc.length * 5) + 10;

            // Image
            const imgData = images[point.id];
            const pointMarkers = markers[point.id] || [];

            if (imgData) {
                try {
                    const imgProps = this.doc.getImageProperties(imgData);
                    const imgWidth = 120;
                    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
                    const finalHeight = Math.min(imgHeight, 90);
                    const xOffset = (this.pageWidth - imgWidth) / 2;

                    this.doc.addImage(imgData, 'JPEG', xOffset, yPos, imgWidth, finalHeight);

                    // Markers
                    this.doc.setDrawColor(255, 0, 0);
                    this.doc.setLineWidth(0.5);
                    this.doc.setTextColor(255, 0, 0);
                    this.doc.setFontSize(9);
                    this.doc.setFont(FONTS.main, "bold");

                    pointMarkers.forEach(m => {
                        const mx = xOffset + (m.x / 100) * imgWidth;
                        const my = yPos + (m.y / 100) * finalHeight;
                        this.doc.circle(mx, my, 3);
                        this.doc.text(String(m.id), mx + 4, my + 4);
                    });

                    yPos += finalHeight + 10;
                } catch (e) {
                    console.error("Error Image", e);
                }
            }

            // Findings Table
            const pointFindings = findings[point.id] || [];
            if (pointFindings.length > 0) {
                const tableData = pointFindings.map(f => [
                    f.markerId,
                    f.evidence || "No especificado",
                    f.measure || "Pendiente de definir"
                ]);

                autoTable(this.doc, {
                    startY: yPos,
                    head: [['ID', 'Evidencia Detectada', 'Medida Correctora Propuesta']],
                    body: tableData,
                    theme: 'grid',
                    headStyles: { fillColor: [...THEME.danger], textColor: 255, fontStyle: 'bold' },
                    columnStyles: {
                        0: { cellWidth: 15, halign: 'center', fontStyle: 'bold', textColor: [200, 0, 0] },
                        1: { cellWidth: 80 },
                        2: { cellWidth: 'auto' }
                    },
                    styles: { fontSize: 9, cellPadding: 3 }
                });
            } else {
                this.doc.setTextColor(...THEME.warning);
                this.doc.text("No se han registrado detalles específicos para este incumplimiento.", 20, yPos);
            }

            this.addFooter();
        });
    }

    generateAnnex() {
        this.doc.addPage();
        this.addHeader();

        // Title
        this.doc.setTextColor(...THEME.primary);
        this.doc.setFontSize(18);
        this.doc.setFont(FONTS.main, "bold");
        this.doc.text("3. Anexo: Lista de Comprobación", 20, 35);

        // Table of all points
        const { points, status } = this.data;

        const tableData = points.map(p => {
            const st = status[p.id];
            let statusText = "NO APLICA";
            if (st === 'compliant') statusText = "CUMPLE";
            if (st === 'non_compliant') statusText = "NO CUMPLE";

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
                    if (text === 'CUMPLE') data.cell.styles.textColor = THEME.success;
                    if (text === 'NO CUMPLE') data.cell.styles.textColor = THEME.danger;
                    if (text === 'NO APLICA') data.cell.styles.textColor = THEME.lightText;
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
