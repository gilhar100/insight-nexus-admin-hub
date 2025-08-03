import React from 'react';

interface GroupPDFExportLayoutProps {
  pdfImages: Record<string, string>;
  groupNumber: number;
  participantCount: number;
  salimaScore: number;
  strongestDimension: { name: string; score: number };
  weakestDimension: { name: string; score: number };
  wocaZoneLabel: string;
  wocaScore: number;
  wocaParticipantCount: number;
}

export const GroupPDFExportLayout: React.FC<GroupPDFExportLayoutProps> = ({
  pdfImages,
  groupNumber,
  participantCount,
  salimaScore,
  strongestDimension,
  weakestDimension,
  wocaZoneLabel,
  wocaScore,
  wocaParticipantCount,
}) => {
  return (
    <div 
      id="group-report-wrapper" // ✅ This ID allows capturing for PDF export
      className="bg-white text-black font-sans" 
      style={{ 
        width: '297mm', 
        minHeight: '210mm',
        margin: 0,
        padding: 0,
        direction: 'rtl',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <style>
        {`
          @page {
            size: A4 landscape;
            margin: 10mm;
          }
          
          @media print {
            body { 
              margin: 0; 
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .page-break { 
              page-break-before: always !important; 
              break-before: page !important;
              height: 100vh !important;
              box-sizing: border-box !important;
            }
            .page-content {
              height: 100vh !important;
              box-sizing: border-box !important;
              overflow: hidden !important;
            }
          }

          .chart-container {
            max-width: 100%;
            height: auto;
            overflow: hidden;
          }

          .chart-container img {
            max-width: 100%;
            height: auto;
            object-fit: contain;
          }

          .dimension-item {
            margin-bottom: 8px;
            padding: 6px 8px;
            border-right: 3px solid #2563eb;
            background-color: #f8fafc;
            break-inside: avoid;
          }

          .dimension-title {
            font-weight: bold;
            font-size: 14px;
            color: #1e40af;
            margin-bottom: 2px;
          }

          .dimension-description {
            font-size: 12px;
            color: #374151;
            line-height: 1.3;
          }
        `}
      </style>

      <div className="page-content flex flex-col items-center justify-center" style={{ height: '100vh', padding: '30mm 20mm' }}>
        <h1 
          className="text-center mb-6"
          style={{ 
            fontSize: '44px', 
            fontWeight: 'bold', 
            color: '#1e40af',
            lineHeight: '1.2'
          }}
        >
          דוח תובנות קבוצתי - קבוצה {groupNumber}
        </h1>
        <h2 
          className="text-center"
          style={{ 
            fontSize: '28px', 
            fontWeight: '600', 
            color: '#374151'
          }}
        >
          שאלון מנהיגות
        </h2>
      </div>

      <div className="page-break">
        <div className="page-content" style={{ height: '100vh', padding: '15mm', boxSizing: 'border-box' }}>
          <h2 className="text-center mb-6" style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e40af' }}>
            ממדי SALIMA ותובנות מנהיגות
          </h2>

          <div className="grid grid-cols-2 gap-6 mb-8" style={{ height: '45vh' }}>
            <div className="chart-container flex flex-col">
              {pdfImages['radar-chart'] && (
                <img 
                  src={pdfImages['radar-chart']} 
                  alt="SALIMA Radar Chart"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              )}
            </div>
            <div className="chart-container flex flex-col">
              <h3 className="text-center mb-2" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                סגנון מנהיגות
              </h3>
              {pdfImages['archetype-chart'] && (
                <img 
                  src={pdfImages['archetype-chart']} 
                  alt="Leadership Archetype Chart"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6" style={{ height: '35vh', overflow: 'hidden' }}>
            <div>
              <h3 className="mb-4" style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e40af' }}>
                🧭 ממדי SALIMA
              </h3>
              <div className="dimension-item"><div className="dimension-title">אסטרטגיה (S)</div><div className="dimension-description">ראייה מערכתית, תכנון לטווח ארוך ויכולת להוביל חזון.</div></div>
              <div className="dimension-item"><div className="dimension-title">אדפטיביות (A)</div><div className="dimension-description">גמישות מחשבתית ורגשית ותגובה יעילה למצבים משתנים.</div></div>
              <div className="dimension-item"><div className="dimension-title">למידה (L)</div><div className="dimension-description">פתיחות לרעיונות חדשים, חשיבה ביקורתית ולמידה מתמשכת.</div></div>
              <div className="dimension-item"><div className="dimension-title">השראה (I)</div><div className="dimension-description">הנעה רגשית דרך דוגמה אישית וחזון שמעורר משמעות.</div></div>
              <div className="dimension-item"><div className="dimension-title">משמעות (M)</div><div className="dimension-description">חיבור עמוק לערכים, תכלית ותחושת שליחות אישית וארגונית.</div></div>
              <div className="dimension-item"><div className="dimension-title">אותנטיות (A2)</div><div className="dimension-description">כנות, שקיפות והתנהלות אנושית המחוברת לערכים פנימיים.</div></div>
            </div>

            <div>
              <h3 className="mb-4" style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e40af' }}>
                סגנונות מנהיגות
              </h3>
              <div className="dimension-item"><div className="dimension-title">מנהל ההזדמנות (S + A)</div><div className="dimension-description">רואה רחוק ופועל בגמישות. מוביל שינוי תוך הסתגלות מהירה והבנת ההקשר.</div></div>
              <div className="dimension-item"><div className="dimension-title">המנהל הסקרן (L + I)</div><div className="dimension-description">לומד כל הזמן, מלהיב אחרים וסוחף דרך רעיונות ודוגמה אישית.</div></div>
              <div className="dimension-item"><div className="dimension-title">המנהל המעצים (M + A2)</div><div className="dimension-description">מוביל מתוך ערכים, יוצר חיבור אישי ותחושת משמעות בעבודה המשותפת.</div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-break">
        <div className="page-content" style={{ height: '100vh', padding: '15mm', boxSizing: 'border-box' }}>
          <h2 className="text-center mb-6" style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e40af' }}>
            שאלון תודעה ארגונית
          </h2>

          <div className="text-center mb-6 p-4 rounded-lg" style={{ fontSize: '32px', fontWeight: 'bold', backgroundColor: '#ecfdf5', color: '#065f46', border: '3px solid #10b981' }}>
            {wocaZoneLabel}
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6" style={{ height: '35vh' }}>
            <div className="chart-container">
              {pdfImages['woca-bar'] && (
                <img 
                  src={pdfImages['woca-bar']} 
                  alt="WOCA Bar Chart"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              )}
            </div>
            <div className="chart-container">
              {pdfImages['woca-pie'] && (
                <img 
                  src={pdfImages['woca-pie']} 
                  alt="WOCA Zone Distribution"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              )}
            </div>
          </div>

          <div style={{ height: '40vh', overflow: 'hidden' }}>
            <h3 className="mb-4" style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e40af' }}>
              אזורי WOCA
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="dimension-item" style={{ borderRightColor: '#10b981' }}>
                <div className="dimension-title" style={{ color: '#065f46' }}>אזור ההזדמנות (WIN/WIN)</div>
                <div className="dimension-description">שיח פתוח, הקשבה ויוזמה. תחושת שליחות, השפעה, שיתוף פעולה וצמיחה משותפת.</div>
              </div>
              <div className="dimension-item" style={{ borderRightColor: '#3b82f6' }}>
                <div className="dimension-title" style={{ color: '#1e40af' }}>אזור הנוחות (LOSE/LOSE)</div>
                <div className="dimension-description">הימנעות מקונפליקטים, קיפאון מחשבתי וחשש מיוזמות. שמירה על הקיים במחיר שחיקה.</div>
              </div>
              <div className="dimension-item" style={{ borderRightColor: '#6b7280' }}>
                <div className="dimension-title" style={{ color: '#374151' }}>אזור האדישות (LOSE/LOSE)</div>
                <div className="dimension-description">נתק רגשי, חוסר עניין וחוסר תחושת השפעה. תחושת סטגנציה ויעדר מנהיגות.</div>
              </div>
              <div className="dimension-item" style={{ borderRightColor: '#ef4444' }}>
                <div className="dimension-title" style={{ color: '#dc2626' }}>אזור המלחמה (WIN/LOSE)</div>
                <div className="dimension-description">דינמיקה של שליטה, חשדנות ומאבק. הישרדות טקטית על חשבון הקשבה, אמון ויציבות.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};