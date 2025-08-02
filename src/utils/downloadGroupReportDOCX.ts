
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak, ImageRun } from 'docx';
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

const convertBase64ToBuffer = (base64: string): Uint8Array => {
  const base64Data = base64.split(',')[1];
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const downloadGroupReportDOCX = async (data: DOCXExportData, filename: string) => {
  const {
    groupNumber,
    participantCount,
    salimaScore,
    strongestDimension,
    weakestDimension,
    wocaZoneLabel,
    wocaScore,
    wocaParticipantCount,
    chartImages,
  } = data;

  // Create document sections
  const children = [];

  // Page 1: Title Page
  children.push(
    new Paragraph({
      text: `דוח תובנות קבוצתי - קבוצה ${groupNumber}`,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    new Paragraph({
      text: 'שאלון מנהיגות',
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 800 },
    }),
    new Paragraph({
      children: [new PageBreak()],
    })
  );

  // Page 2: SALIMA Content
  children.push(
    new Paragraph({
      text: 'ממדי SALIMA ותובנות מנהיגות',
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );

  // Add SALIMA charts if available
  if (chartImages['radar-chart']) {
    const radarImageBuffer = convertBase64ToBuffer(chartImages['radar-chart']);
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new ImageRun({
            data: radarImageBuffer,
            transformation: {
              width: 300,
              height: 300,
            },
          }),
        ],
      })
    );
  }

  if (chartImages['archetype-chart']) {
    const archetypeImageBuffer = convertBase64ToBuffer(chartImages['archetype-chart']);
    children.push(
      new Paragraph({
        text: 'סגנון מנהיגות',
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 200 },
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new ImageRun({
            data: archetypeImageBuffer,
            transformation: {
              width: 300,
              height: 300,
            },
          }),
        ],
      })
    );
  }

  // SALIMA Dimensions descriptions
  children.push(
    new Paragraph({
      text: '🧭 ממדי SALIMA',
      alignment: AlignmentType.RIGHT,
      spacing: { before: 400, after: 200 },
    })
  );

  children.push(
    new Paragraph({
      text: 'אסטרטגיה (S)',
      alignment: AlignmentType.RIGHT,
      spacing: { after: 100 },
    })
  );

  children.push(
    new Paragraph({
      text: 'ראייה מערכתית, תכנון לטווח ארוך ויכולת להוביל חזון.',
      alignment: AlignmentType.RIGHT,
      spacing: { after: 200 },
    })
  );

  children.push(
    new Paragraph({
      text: 'אדפטיביות (A)',
      alignment: AlignmentType.RIGHT,
      spacing: { after: 100 },
    })
  );

  children.push(
    new Paragraph({
      text: 'גמישות מחשבתית ורגשית ותגובה יעילה למצבים משתנים.',
      alignment: AlignmentType.RIGHT,
      spacing: { after: 200 },
    })
  );

  children.push(
    new Paragraph({
      text: 'למידה (L)',
      alignment: AlignmentType.RIGHT,
      spacing: { after: 100 },
    })
  );

  children.push(
    new Paragraph({
      text: 'פתיחות לרעיונות חדשים, חשיבה ביקורתית ולמידה מתמשכת.',
      alignment: AlignmentType.RIGHT,
      spacing: { after: 200 },
    })
  );

  children.push(
    new Paragraph({
      text: 'השראה (I)',
      alignment: AlignmentType.RIGHT,
      spacing: { after: 100 },
    })
  );

  children.push(
    new Paragraph({
      text: 'הנעה רגשית דרך דוגמה אישית וחזון שמעורר משמעות.',
      alignment: AlignmentType.RIGHT,
      spacing: { after: 200 },
    })
  );

  children.push(
    new Paragraph({
      text: 'משמעות (M)',
      alignment: AlignmentType.RIGHT,
      spacing: { after: 100 },
    })
  );

  children.push(
    new Paragraph({
      text: 'חיבור עמוק לערכים, תכלית ותחושת שליחות אישית וארגונית.',
      alignment: AlignmentType.RIGHT,
      spacing: { after: 200 },
    })
  );

  children.push(
    new Paragraph({
      text: 'אותנטיות (A2)',
      alignment: AlignmentType.RIGHT,
      spacing: { after: 100 },
    })
  );

  children.push(
    new Paragraph({
      text: 'כנות, שקיפות והתנהלות אנושית המחוברת לערכים פנימיים.',
      alignment: AlignmentType.RIGHT,
      spacing: { after: 400 },
    })
  );

  // Leadership Styles
  children.push(
    new Paragraph({
      text: 'סגנונות מנהיגות',
      alignment: AlignmentType.RIGHT,
      spacing: { after: 200 },
    })
  );

  children.push(
    new Paragraph({
      text: 'מנהל ההזדמנות (S + A)',
      alignment: AlignmentType.RIGHT,
      spacing: { after: 100 },
    })
  );

  children.push(
    new Paragraph({
      text: 'רואה רחוק ופועל בגמישות. מוביל שינוי תוך הסתגלות מהירה והבנת ההקשר.',
      alignment: AlignmentType.RIGHT,
      spacing: { after: 200 },
    })
  );

  children.push(
    new Paragraph({
      text: 'המנהל הסקרן (L + I)',
      alignment: AlignmentType.RIGHT,
      spacing: { after: 100 },
    })
  );

  children.push(
    new Paragraph({
      text: 'לומד כל הזמן, מלהיב אחרים וסוחף דרך רעיונות ודוגמה אישית.',
      alignment: AlignmentType.RIGHT,
      spacing: { after: 200 },
    })
  );

  children.push(
    new Paragraph({
      text: 'המנהל המעצים (M + A2)',
      alignment: AlignmentType.RIGHT,
      spacing: { after: 100 },
    })
  );

  children.push(
    new Paragraph({
      text: 'מוביל מתוך ערכים, יוצר חיבור אישי ותחושת משמעות בעבודה המשותפת.',
      alignment: AlignmentType.RIGHT,
      spacing: { after: 400 },
    })
  );

  // Page break to WOCA
  children.push(
    new Paragraph({
      children: [new PageBreak()],
    })
  );

  // Page 3: WOCA Content
  children.push(
    new Paragraph({
      text: 'שאלון תודעה ארגונית',
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );

  children.push(
    new Paragraph({
      text: wocaZoneLabel,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );

  // Add WOCA charts if available
  if (chartImages['woca-bar']) {
    const wocaBarImageBuffer = convertBase64ToBuffer(chartImages['woca-bar']);
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new ImageRun({
            data: wocaBarImageBuffer,
            transformation: {
              width: 300,
              height: 300,
            },
          }),
        ],
      })
    );
  }

  if (chartImages['woca-pie']) {
    const wocaPieImageBuffer = convertBase64ToBuffer(chartImages['woca-pie']);
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new ImageRun({
            data: wocaPieImageBuffer,
            transformation: {
              width: 300,
              height: 300,
            },
          }),
        ],
      })
    );
  }

  // WOCA Zones descriptions
  children.push(
    new Paragraph({
      text: 'אזורי WOCA',
      alignment: AlignmentType.RIGHT,
      spacing: { before: 400, after: 200 },
    })
  );

  children.push(
    new Paragraph({
      text: 'אזור ההזדמנות (WIN/WIN)',
      alignment: AlignmentType.RIGHT,
      spacing: { after: 100 },
    })
  );

  children.push(
    new Paragraph({
      text: 'שיח פתוח, הקשבה ויוזמה. תחושת שליחות, השפעה, שיתוף פעולה וצמיחה משותפת.',
      alignment: AlignmentType.RIGHT,
      spacing: { after: 200 },
    })
  );

  children.push(
    new Paragraph({
      text: 'אזור הנוחות (LOSE/LOSE)',
      alignment: AlignmentType.RIGHT,
      spacing: { after: 100 },
    })
  );

  children.push(
    new Paragraph({
      text: 'הימנעות מקונפליקטים, קיפאון מחשבתי וחשש מיוזמות. שמירה על הקיים במחיר שחיקה.',
      alignment: AlignmentType.RIGHT,
      spacing: { after: 200 },
    })
  );

  children.push(
    new Paragraph({
      text: 'אזור האדישות (LOSE/LOSE)',
      alignment: AlignmentType.RIGHT,
      spacing: { after: 100 },
    })
  );

  children.push(
    new Paragraph({
      text: 'נתק רגשי, חוסר עניין וחוסר תחושת השפעה. תחושת סטגנציה ויעדר מנהיגות.',
      alignment: AlignmentType.RIGHT,
      spacing: { after: 200 },
    })
  );

  children.push(
    new Paragraph({
      text: 'אזור המלחמה (WIN/LOSE)',
      alignment: AlignmentType.RIGHT,
      spacing: { after: 100 },
    })
  );

  children.push(
    new Paragraph({
      text: 'דינמיקה של שליטה, חשדנות ומאבק. הישרדות טקטית על חשבון הקשבה, אמון ויציבות.',
      alignment: AlignmentType.RIGHT,
      spacing: { after: 200 },
    })
  );

  // Create the document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: 11906, // A4 landscape width in twentieths of a point
              height: 8418,  // A4 landscape height in twentieths of a point
            },
            margin: {
              top: 720,    // 0.5 inch in twentieths of a point
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children,
      },
    ],
  });

  // Generate and download
  const buffer = await Packer.toBuffer(doc);
  const blob = new Blob([buffer], { 
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
  });
  saveAs(blob, filename);
};
