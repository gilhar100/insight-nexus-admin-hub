import { Document, Packer, Paragraph, TextRun, ImageRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

interface DOCXExportData {
  groupNumber: number;
  participantCount: number;
  salimaScore: number;
  strongestDimension: { name: string; score: number };
  weakestDimension: { name: string; score: number };
  wocaZoneLabel: string;
  wocaScore: number;
  wocaParticipantCount: number;
  chartImages: Record<string, string>;
}

const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = atob(base64.split(',')[1]);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

export const downloadGroupReportDOCX = async (data: DOCXExportData, filename: string) => {
  try {
    console.log('🚀 Starting DOCX generation...');
    
    const sections = [];
    
    // Title page
    sections.push(
      new Paragraph({
        text: 'דוח קבוצתי מקיף',
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `קבוצה מספר: ${data.groupNumber}`,
            bold: true,
            size: 28,
          }),
        ],
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({
        text: '',
        spacing: { after: 400 },
      }),
    );

    // SALIMA Section
    sections.push(
      new Paragraph({
        text: 'תוצאות SALIMA',
        heading: HeadingLevel.HEADING_1,
      }),
      new Paragraph({
        children: [
          new TextRun({ text: `משתתפים: `, bold: true }),
          new TextRun({ text: `${data.participantCount}` }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: `ציון כללי: `, bold: true }),
          new TextRun({ text: `${data.salimaScore.toFixed(2)}` }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: `הממד החזק ביותר: `, bold: true }),
          new TextRun({ text: `${data.strongestDimension.name} (${data.strongestDimension.score.toFixed(2)})` }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: `הממד החלש ביותר: `, bold: true }),
          new TextRun({ text: `${data.weakestDimension.name} (${data.weakestDimension.score.toFixed(2)})` }),
        ],
      }),
    );

    // Add SALIMA charts if available
    if (data.chartImages['radar-chart']) {
      sections.push(
        new Paragraph({
          text: 'תרשים רדאר SALIMA',
          heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph({
          children: [
            new ImageRun({
              data: base64ToArrayBuffer(data.chartImages['radar-chart']),
              transformation: {
                width: 500,
                height: 375,
              },
              type: 'png',
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
      );
    }

    if (data.chartImages['archetype-chart']) {
      sections.push(
        new Paragraph({
          text: 'התפלגות ארכיטיפים',
          heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph({
          children: [
            new ImageRun({
              data: base64ToArrayBuffer(data.chartImages['archetype-chart']),
              transformation: {
                width: 500,
                height: 675,
              },
              type: 'png',
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
      );
    }

    // WOCA Section
    sections.push(
      new Paragraph({
        text: 'תוצאות WOCA',
        heading: HeadingLevel.HEADING_1,
      }),
      new Paragraph({
        children: [
          new TextRun({ text: `משתתפים: `, bold: true }),
          new TextRun({ text: `${data.wocaParticipantCount}` }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: `ציון ממוצע: `, bold: true }),
          new TextRun({ text: `${data.wocaScore.toFixed(2)}` }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: `אזור דומיננטי: `, bold: true }),
          new TextRun({ text: data.wocaZoneLabel }),
        ],
      }),
    );

    // Add WOCA charts if available
    if (data.chartImages['woca-bar']) {
      sections.push(
        new Paragraph({
          text: 'תרשים עמודות WOCA',
          heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph({
          children: [
            new ImageRun({
              data: base64ToArrayBuffer(data.chartImages['woca-bar']),
              transformation: {
                width: 500,
                height: 375,
              },
              type: 'png',
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
      );
    }

    if (data.chartImages['woca-pie']) {
      sections.push(
        new Paragraph({
          text: 'התפלגות אזורים',
          heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph({
          children: [
            new ImageRun({
              data: base64ToArrayBuffer(data.chartImages['woca-pie']),
              transformation: {
                width: 500,
                height: 375,
              },
              type: 'png',
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
      );
    }

    // Create document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: sections,
        },
      ],
    });

    // Generate and download
    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);
    
    console.log('✅ DOCX generation completed successfully!');
  } catch (error) {
    console.error('❌ DOCX Generation Error:', error);
    throw error;
  }
};