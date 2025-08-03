
import { Document, Packer, Paragraph, TextRun, ImageRun, HeadingLevel, AlignmentType, PageBreak } from 'docx';
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
    
    // Page 1: Title Page
    const page1Sections = [
      new Paragraph({
        text: `דוח תובנות קבוצתי - קבוצה ${data.groupNumber}`,
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 600 },
      }),
      new Paragraph({
        text: 'שאלון מנהיגות',
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      }),
      new Paragraph({
        children: [new PageBreak()],
      }),
    ];

    // Page 2: SALIMA Section
    const page2Sections = [
      new Paragraph({
        text: 'ממדי SALIMA ותובנות מנהיגות',
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      }),
    ];

    // Add SALIMA charts if available
    if (data.chartImages['radar-chart']) {
      page2Sections.push(
        new Paragraph({
          children: [
            new ImageRun({
              data: base64ToArrayBuffer(data.chartImages['radar-chart']),
              transformation: {
                width: 400,
                height: 300,
              },
              type: 'png',
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 },
        }),
      );
    }

    if (data.chartImages['archetype-chart']) {
      page2Sections.push(
        new Paragraph({
          text: 'סגנון מנהיגות',
          heading: HeadingLevel.HEADING_2,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new ImageRun({
              data: base64ToArrayBuffer(data.chartImages['archetype-chart']),
              transformation: {
                width: 400,
                height: 300,
              },
              type: 'png',
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 },
        }),
      );
    }

    // SALIMA Dimensions
    page2Sections.push(
      new Paragraph({
        text: '🧭 ממדי SALIMA',
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 200 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'אסטרטגיה (S)', bold: true }),
          new TextRun({ text: ' - ראייה מערכתית, תכנון לטווח ארוך ויכולת להוביל חזון.' }),
        ],
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'אדפטיביות (A)', bold: true }),
          new TextRun({ text: ' - גמישות מחשבתית ורגשית ותגובה יעילה למצבים משתנים.' }),
        ],
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'למידה (L)', bold: true }),
          new TextRun({ text: ' - פתיחות לרעיונות חדשים, חשיבה ביקורתית ולמידה מתמשכת.' }),
        ],
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'השראה (I)', bold: true }),
          new TextRun({ text: ' - הנעה רגשית דרך דוגמה אישית וחזון שמעורר משמעות.' }),
        ],
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'משמעות (M)', bold: true }),
          new TextRun({ text: ' - חיבור עמוק לערכים, תכלית ותחושת שליחות אישית וארגונית.' }),
        ],
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'אותנטיות (A2)', bold: true }),
          new TextRun({ text: ' - כנות, שקיפות והתנהלות אנושית המחוברת לערכים פנימיים.' }),
        ],
        spacing: { after: 200 },
      }),
      new Paragraph({
        text: 'סגנונות מנהיגות',
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 200 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'מנהל ההזדמנות (S + A)', bold: true }),
          new TextRun({ text: ' - רואה רחוק ופועל בגמישות. מוביל שינוי תוך הסתגלות מהירה והבנת ההקשר.' }),
        ],
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'המנהל הסקרן (L + I)', bold: true }),
          new TextRun({ text: ' - לומד כל הזמן, מלהיב אחרים וסוחף דרך רעיונות ודוגמה אישית.' }),
        ],
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'המנהל המעצים (M + A2)', bold: true }),
          new TextRun({ text: ' - מוביל מתוך ערכים, יוצר חיבור אישי ותחושת משמעות בעבודה המשותפת.' }),
        ],
        spacing: { after: 200 },
      }),
      new Paragraph({
        children: [new PageBreak()],
      }),
    );

    // Page 3: WOCA Section
    const page3Sections = [
      new Paragraph({
        text: 'שאלון תודעה ארגונית',
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: data.wocaZoneLabel,
            bold: true,
            size: 32,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      }),
    ];

    // Add WOCA charts if available
    if (data.chartImages['woca-pie']) {
      page3Sections.push(
        new Paragraph({
          children: [
            new ImageRun({
              data: base64ToArrayBuffer(data.chartImages['woca-pie']),
              transformation: {
                width: 400,
                height: 300,
              },
              type: 'png',
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 },
        }),
      );
    }

    // WOCA Zones Description
    page3Sections.push(
      new Paragraph({
        text: 'אזורי WOCA',
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 200 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'אזור ההזדמנות (WIN/WIN)', bold: true }),
          new TextRun({ text: ' - שיח פתוח, הקשבה ויוזמה. תחושת שליחות, השפעה, שיתוף פעולה וצמיחה משותפת.' }),
        ],
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'אזור הנוחות (LOSE/LOSE)', bold: true }),
          new TextRun({ text: ' - הימנעות מקונפליקטים, קיפאון מחשבתי וחשש מיוזמות. שמירה על הקיים במחיר שחיקה.' }),
        ],
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'אזור האדישות (LOSE/LOSE)', bold: true }),
          new TextRun({ text: ' - נתק רגשי, חוסר עניין וחוסר תחושת השפעה. תחושת סטגנציה ויעדר מנהיגות.' }),
        ],
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'אזור המלחמה (WIN/LOSE)', bold: true }),
          new TextRun({ text: ' - דינמיקה של שליטה, חשדנות ומאבק. הישרדות טקטית על חשבון הקשבה, אמון ויציבות.' }),
        ],
        spacing: { after: 100 },
      }),
    );

    // Combine all sections
    const allSections = [...page1Sections, ...page2Sections, ...page3Sections];

    // Create document with landscape orientation (width > height)
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              size: {
                width: 15840, // 11 inches in twips (landscape width)
                height: 12240, // 8.5 inches in twips (landscape height)
                orientation: 'landscape',
              },
              margin: {
                top: 720,
                right: 720,
                bottom: 720,
                left: 720,
              },
            },
          },
          children: allSections,
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
