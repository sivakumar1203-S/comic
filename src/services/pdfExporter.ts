import { jsPDF } from 'jspdf';
import { ComicProject, LayoutSettings } from '../types/comic';

export interface ExportResult {
  filename: string;
  timestamp: string;
  totalPages: number;
  fileSizeBytes: number;
  pdfBlobUrl: string;
}

// Converts an SVG data URL or image URL to an HTMLImageElement and then a raster PNG data URL for jsPDF embedding
async function rasterizeImage(url: string, width = 800, height = 600): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(url);
        return;
      }
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      try {
        const pngData = canvas.toDataURL('image/jpeg', 0.92);
        resolve(pngData);
      } catch (e) {
        resolve(url);
      }
    };
    img.onerror = () => {
      // In case of error, resolve with placeholder or existing URL
      resolve(url);
    };
    img.src = url;
  });
}

/**
 * Layout Binding & PDF Generation (Scenario 3):
 * Assembles each panel's title, image, dialogues, and narrative text into a structured comic book layout
 * and outputs a professional, timestamped PDF file.
 */
export async function compileComicPdf(
  comic: ComicProject,
  layoutSettings: LayoutSettings = {
    gridColumns: 2,
    panelGap: 10,
    borderWidth: 2,
    showHalftone: true,
    paperTexture: true,
    captionStyle: 'yellow-box'
  }
): Promise<ExportResult> {
  // A4 dimensions in mm: 210 x 297
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;

  // Generate timestamp for filename
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const cleanTitle = comic.title.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 24);
  const filename = `ComicCraft_${cleanTitle}_${timestamp}.pdf`;

  // --- PAGE 1: TITLE & COVER BANNER + FIRST 2 PANELS ---
  // Draw comic header
  doc.setFillColor(254, 240, 138); // Yellow comic header
  doc.rect(margin, margin, pageWidth - (margin * 2), 34, 'F');
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1.5);
  doc.rect(margin, margin, pageWidth - (margin * 2), 34, 'S');

  // Title text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(220, 38, 38); // Red comic text
  doc.text(comic.title.toUpperCase(), pageWidth / 2, margin + 12, { align: 'center' });

  // Subtitle / Tone / Style badge
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'normal');
  const metaText = `Starring: ${comic.characterName}  •  Tone: ${comic.tone}  •  Style: ${comic.artStyle}  •  Setting: ${comic.setting}`;
  doc.text(metaText, pageWidth / 2, margin + 20, { align: 'center', maxWidth: pageWidth - 36 });

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Created with ComicCraft AI  •  ${now.toLocaleDateString()}  •  Collector's Edition`, pageWidth / 2, margin + 28, { align: 'center' });

  // Layout binding: Render panels (2 per page)
  let currentY = margin + 40;
  let pageCount = 1;

  for (let i = 0; i < comic.panels.length; i++) {
    const panel = comic.panels[i];

    // Every 2 panels (after the first 2 on page 1), create a new page
    if (i > 0 && i % 2 === 0) {
      doc.addPage();
      pageCount++;
      currentY = margin;

      // Header on subsequent pages
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text(`${comic.title}  —  Part ${Math.floor(i / 2) + 1}`, margin, currentY + 4);
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.5);
      doc.line(margin, currentY + 7, pageWidth - margin, currentY + 7);
      currentY += 12;
    }

    const panelHeight = 110;
    const panelWidth = pageWidth - (margin * 2);

    // Rasterize image for PDF insertion
    const rasterUrl = await rasterizeImage(panel.imageUrl, 800, 500);

    // Draw panel frame box
    doc.setFillColor(255, 255, 255);
    doc.rect(margin, currentY, panelWidth, panelHeight, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1.2);
    doc.rect(margin, currentY, panelWidth, panelHeight, 'S');

    // Panel Number Header Stamp
    doc.setFillColor(0, 0, 0);
    doc.rect(margin, currentY, 32, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(250, 204, 21); // Yellow
    doc.text(`PANEL ${panel.panelNumber}`, margin + 16, currentY + 5, { align: 'center' });

    // Panel Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(panel.title, margin + 36, currentY + 5);

    // Embed panel illustration image
    const imageTop = currentY + 8;
    const imageHeight = 74;
    try {
      doc.addImage(rasterUrl, 'JPEG', margin + 2, imageTop, panelWidth - 4, imageHeight);
    } catch (e) {
      // In case image failed to embed, draw a styled placeholder
      doc.setFillColor(241, 245, 249);
      doc.rect(margin + 2, imageTop, panelWidth - 4, imageHeight, 'F');
      doc.setTextColor(100, 116, 139);
      doc.text(`[Illustration: ${panel.title}]`, pageWidth / 2, imageTop + 35, { align: 'center' });
    }

    // Narration Box (Yellow caption box over bottom or top of panel)
    if (panel.narration) {
      const narY = imageTop + imageHeight - 16;
      doc.setFillColor(254, 240, 138); // Yellow caption box
      doc.rect(margin + 6, narY, panelWidth - 12, 14, 'F');
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.8);
      doc.rect(margin + 6, narY, panelWidth - 12, 14, 'S');

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(panel.narration, margin + 10, narY + 5, { maxWidth: panelWidth - 20 });
    }

    // Dialogues Box below image
    const dialogueY = imageTop + imageHeight + 2;
    doc.setFillColor(248, 250, 252);
    doc.rect(margin + 2, dialogueY, panelWidth - 4, 24, 'F');

    let textOffsetY = dialogueY + 5;
    for (const dlg of panel.dialogues.slice(0, 2)) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(185, 28, 28);
      doc.text(`${dlg.speaker}: `, margin + 6, textOffsetY);

      const speakerWidth = doc.getTextWidth(`${dlg.speaker}: `);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      const textToPrint = `"${dlg.text}"`;
      doc.text(textToPrint, margin + 6 + speakerWidth, textOffsetY, {
        maxWidth: panelWidth - 20 - speakerWidth
      });
      textOffsetY += 7;
    }

    // Sound effect stamp if present
    if (panel.soundEffect) {
      doc.setFillColor(239, 68, 68);
      doc.rect(pageWidth - margin - 35, currentY + 10, 30, 8, 'F');
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.8);
      doc.rect(pageWidth - margin - 35, currentY + 10, 30, 8, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text(panel.soundEffect.text, pageWidth - margin - 20, currentY + 15.5, { align: 'center' });
    }

    // Footer of page
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`ComicCraft • Page ${pageCount}`, pageWidth - margin, pageHeight - 6, { align: 'right' });

    currentY += panelHeight + 6;
  }

  // Generate Blob and trigger download
  const pdfBlob = doc.output('blob');
  const pdfBlobUrl = URL.createObjectURL(pdfBlob);

  // Trigger browser download
  const link = document.createElement('a');
  link.href = pdfBlobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return {
    filename,
    timestamp: now.toLocaleString(),
    totalPages: pageCount,
    fileSizeBytes: pdfBlob.size,
    pdfBlobUrl
  };
}
