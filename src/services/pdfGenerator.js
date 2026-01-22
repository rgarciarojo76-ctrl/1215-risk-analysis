import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateItemReport = (machineData, point, imageBase64, markers, findings) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // -- HEADER --
    doc.setFillColor(41, 128, 185); // Blue Header
    doc.rect(0, 0, pageWidth, 20, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("INFORME DE ELEMENTO - RD 1215/1997", 10, 13);

    doc.setFontSize(10);
    doc.text(`${machineData.name} | ${machineData.type}`, pageWidth - 10, 13, { align: 'right' });

    // -- CONTENT --
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

    // -- IMAGE WITH MARKERS --
    if (imageBase64) {
        const imgProps = doc.getImageProperties(imageBase64);
        const imgWidth = pageWidth - 40;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

        // Limit height to available space
        const maxImgHeight = 100;
        const finalWidth = imgHeight > maxImgHeight ? (imgWidth * maxImgHeight) / imgHeight : imgWidth;
        const finalHeight = imgHeight > maxImgHeight ? maxImgHeight : imgHeight;
        const xOffset = (pageWidth - finalWidth) / 2;

        try {
            doc.addImage(imageBase64, 'JPEG', xOffset, yPos, finalWidth, finalHeight);

            // Draw Markers
            // Markers are in %, so we map to finalWidth/finalHeight
            doc.setDrawColor(255, 0, 0); // Red border
            doc.setLineWidth(0.5);
            doc.setTextColor(255, 0, 0);
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");

            markers.forEach(m => {
                const mx = xOffset + (m.x / 100) * finalWidth;
                const my = yPos + (m.y / 100) * finalHeight;

                doc.circle(mx, my, 3); // Draw circle radius 3
                doc.text(String(m.id), mx + 4, my + 4);
            });

            yPos += finalHeight + 10;
        } catch (e) {
            console.error("Error adding image to PDF", e);
            doc.text("[Error al cargar imagen]", 10, yPos);
            yPos += 20;
        }
    } else {
        doc.text("[Sin imagen adjunta]", 10, yPos);
        yPos += 10;
    }

    // -- TABLE OF FINDINGS --
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
        styles: { fontSize: 9 },
        columnStyles: {
            0: { cellWidth: 15, halign: 'center', fontStyle: 'bold', textColor: [200, 0, 0] },
            1: { cellWidth: 80 },
            2: { cellWidth: 'auto' }
        }
    });

    // Save
    doc.save(`Reporte_Item_${point.id}.pdf`);
};

export const generateFinalReport = (machineData, annexPoints, images, markers, findings, complianceStatus) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // --- COVER PAGE ---
    doc.setFillColor(44, 62, 80); // Dark Blue Theme
    doc.rect(0, 0, pageWidth, 297, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.text("INFORME DE ADECUACIÓN", pageWidth / 2, 80, { align: 'center' });
    doc.text("RD 1215/1997", pageWidth / 2, 95, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(`Equipo: ${machineData.name}`, pageWidth / 2, 120, { align: 'center' });
    doc.text(`Tipo: ${machineData.type}`, pageWidth / 2, 128, { align: 'center' });
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, pageWidth / 2, 136, { align: 'center' });

    // Summary Stats
    const totalPoints = annexPoints.length;
    const nonCompliantCount = Object.values(complianceStatus).filter(s => s === 'non_compliant').length;
    const compliantCount = Object.values(complianceStatus).filter(s => s === 'compliant').length;

    doc.setFillColor(255, 255, 255);
    doc.roundedRect(pageWidth / 2 - 60, 160, 120, 60, 3, 3, 'F');
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(12);
    doc.text("Resumen de Evaluación", pageWidth / 2, 175, { align: 'center' });

    doc.setFontSize(10);
    doc.text(`Puntos Evaluados: ${totalPoints}`, pageWidth / 2, 190, { align: 'center' });
    doc.setTextColor(39, 174, 96);
    doc.text(`CUMPLE: ${compliantCount}`, pageWidth / 2, 200, { align: 'center' });
    doc.setTextColor(192, 57, 43);
    doc.text(`NO CUMPLE: ${nonCompliantCount}`, pageWidth / 2, 210, { align: 'center' });

    doc.addPage();
    doc.setFillColor(255, 255, 255); // Reset bg

    // --- NON-COMPLIANT ITEMS ---
    const ncPoints = annexPoints.filter(p => complianceStatus[p.id] === 'non_compliant');

    if (ncPoints.length === 0) {
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(16);
        doc.text("¡Enhorabuena! No se detectaron incumplimientos.", 20, 30);
    } else {
        ncPoints.forEach((point, index) => {
            if (index > 0) doc.addPage();

            // Reuse the logic from item report slightly modified for batch
            // Title
            doc.setFillColor(192, 57, 43); // Red header for findings
            doc.rect(0, 0, pageWidth, 15, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(12);
            doc.text(`DEFICIENCIA DETECTADA: ${point.id}`, 10, 10);

            let yPos = 25;

            // Description
            doc.setTextColor(50, 50, 50);
            doc.setFontSize(10);
            const desc = doc.splitTextToSize(point.title + ": " + point.description, pageWidth - 20);
            doc.text(desc, 10, yPos);
            yPos += (desc.length * 5) + 5;

            // Image
            const imageBase64 = images[point.id];
            const pointMarkers = markers[point.id] || [];

            if (imageBase64) {
                try {
                    const imgProps = doc.getImageProperties(imageBase64);
                    const imgWidth = 140;
                    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
                    const finalHeight = Math.min(imgHeight, 100);
                    const xOffset = (pageWidth - imgWidth) / 2;

                    doc.addImage(imageBase64, 'JPEG', xOffset, yPos, imgWidth, finalHeight);

                    // Markers Drawing
                    doc.setDrawColor(255, 0, 0);
                    doc.setLineWidth(0.5);
                    doc.setTextColor(255, 0, 0);
                    doc.setFontSize(10);
                    pointMarkers.forEach(m => {
                        const mx = xOffset + (m.x / 100) * imgWidth;
                        const my = yPos + (m.y / 100) * finalHeight;
                        doc.circle(mx, my, 3);
                        doc.text(String(m.id), mx + 4, my + 4);
                    });

                    yPos += finalHeight + 10;
                } catch (e) { /* ignore */ }
            }

            // Findings Table
            const pointFindings = findings[point.id] || [];
            if (pointFindings.length > 0) {
                const tableData = pointFindings.map(f => [f.markerId, f.evidence, f.measure]);
                autoTable(doc, {
                    startY: yPos,
                    head: [['ID', 'Evidencia', 'Medida Correctora']],
                    body: tableData,
                    theme: 'grid',
                    styles: { fontSize: 9 }
                });
            }
        });
    }

    // --- CONCLUSIONS ---
    doc.addPage();
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Conclusiones y Valoración", 20, 30);
    doc.setFontSize(11);
    doc.text("En base a las comprobaciones realizadas...", 20, 45);

    // Logic for global rating
    let rating = "EQUIPO ADECUADO";
    if (nonCompliantCount > 0) rating = "NO ADECUADO - REQUIERE CORRECCIONES";

    doc.setFont("helvetica", "bold");
    doc.text(`Valoración Global: ${rating}`, 20, 60);

    doc.save(`Informe_Final_RD1215_${machineData.name}.pdf`);
};
