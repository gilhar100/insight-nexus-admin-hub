
import React from 'react';

interface GroupPDFExportLayoutProps {
  pdfImages: Record<string, string>;
  groupNumber: number;
  participantCount: number;
  salimaScore: number;
  strongestDimension: { name: string; score: number };
  weakestDimension: { name: string; score: number };
  archetypeLegendText?: string;
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
  wocaParticipantCount
}) => {
  const currentDate = new Date().toLocaleDateString('he-IL');

  return (
    <html dir="rtl" lang="he">
      <head>
        <meta charSet="UTF-8" />
        <style>
          {`
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            body {
              direction: rtl;
              font-family: Arial, sans-serif;
              color: #1f2937;
              background: white;
              line-height: 1.4;
            }
            .page {
              page-break-after: always;
              width: 210mm;
              min-height: 297mm;
              padding: 40px;
              margin: 0 auto;
              background: white;
              box-sizing: border-box;
              position: relative;
              display: flex;
              flex-direction: column;
              max-width: 794px;
            }
            .page:last-child {
              page-break-after: auto;
            }
            h1 {
              font-size: 24px;
              margin-bottom: 8px;
              font-weight: bold;
              color: #1f2937;
              text-align: center;
            }
            h2 {
              font-size: 20px;
              margin-bottom: 10px;
              font-weight: 600;
              color: #374151;
              text-align: center;
            }
            h3 {
              font-size: 16px;
              margin-bottom: 8px;
              font-weight: 600;
              color: #4b5563;
              text-align: center;
            }
            p {
              margin: 4px 0;
              font-size: 13px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #e5e7eb;
            }
            .section {
              margin-bottom: 20px;
              text-align: center;
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .compact-section {
              margin-bottom: 15px;
              text-align: center;
            }
            .image-container {
              display: block;
              text-align: center;
              margin: 10px 0;
              width: 100%;
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .compact-image {
              max-width: 90%;
              width: auto;
              height: auto;
              display: block;
              margin: 0 auto;
              border: 1px solid #d1d5db;
              border-radius: 8px;
            }
            .full-image {
              max-width: 85%;
              width: auto;
              height: auto;
              display: block;
              margin: 0 auto;
              border: 1px solid #d1d5db;
              border-radius: 8px;
            }
            .legend-box {
              background: #f9f9f9;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 15px;
              font-size: 12px;
              line-height: 1.5;
              margin: 15px auto;
              max-width: 100%;
              text-align: center;
            }
            .zone-box {
              background: #f9f9f9;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 16px;
              margin-bottom: 12px;
              max-width: 100%;
              text-align: center;
            }
            .archetype-box {
              background: #f9f9f9;
              border-radius: 8px;
              padding: 16px;
              margin-bottom: 12px;
              text-align: center;
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .overview-row {
              margin-bottom: 25px;
              text-align: center;
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .score-display {
              font-size: 28px;
              font-weight: bold;
              color: #059669;
              margin: 20px 0;
            }
            .dimensions-container {
              display: flex;
              justify-content: center;
              gap: 40px;
              margin: 20px 0;
            }
            .dimension-block {
              background: #f9fafb;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              min-width: 200px;
            }
            .stats-row {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin: 20px 0;
              text-align: center;
            }
            .stat-item {
              background-color: #f9fafb;
              border-radius: 8px;
              padding: 15px;
              text-align: center;
            }
            .numeric-value {
              font-weight: bold;
              font-size: 16px;
            }
            .two-column {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 30px;
            }
            .column {
              text-align: center;
            }
            .fill-space {
              flex-grow: 1;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            @media print {
              body {
                width: 210mm;
                margin: 0;
                padding: 0;
              }
              .page {
                page-break-after: always;
                margin: 0;
                width: 210mm;
                min-height: 297mm;
                padding: 12mm;
              }
              .page:last-child {
                page-break-after: auto;
              }
            }
          `}
        </style>
      </head>
      <body>
        <div id="pdf-export-root">
          {/* Page 1: SALIMA Overview with WOCA Summary */}
          <div className="page">
            <div className="header">
              <h1>דוח תובנות קבוצתי SALIMA</h1>
            </div>

            {/* Row 1: Group info */}
            <div className="overview-row">
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                קבוצה {groupNumber} • {currentDate} • {participantCount} משתתפים
              </p>
            </div>

            {/* Row 2: SLQ Score */}
            <div className="overview-row">
              <div className="score-display">
                ציון SLQ קבוצתי: {salimaScore.toFixed(2)} / 5
              </div>
            </div>

            {/* Row 3: Strongest/Weakest Dimensions */}
            <div className="overview-row">
              <div className="dimensions-container">
                <div className="dimension-block">
                  <p><strong>מימד חזק:</strong></p>
                  <p style={{ color: '#059669', fontSize: '16px', fontWeight: 'bold' }}>
                    {strongestDimension.name}
                  </p>
                  <p style={{ color: '#059669', fontSize: '18px', fontWeight: 'bold' }}>
                    {strongestDimension.score.toFixed(2)}
                  </p>
                </div>
                <div className="dimension-block">
                  <p><strong>מימד חלש:</strong></p>
                  <p style={{ color: '#dc2626', fontSize: '16px', fontWeight: 'bold' }}>
                    {weakestDimension.name}
                  </p>
                  <p style={{ color: '#dc2626', fontSize: '18px', fontWeight: 'bold' }}>
                    {weakestDimension.score.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="legend-box">
              <h3 style={{ textAlign: 'center', marginBottom: '12px', color: '#1f2937' }}>
                🧭 ממדי SALIMA
              </h3>
              <p><strong>1. אסטרטגיה (S)</strong></p>
              <p>ראייה מערכתית, תכנון לטווח ארוך ויכולת להוביל חזון.</p>
              <p><strong>2. אדפטיביות (A)</strong></p>
              <p>גמישות מחשבתית ורגשית ותגובה יעילה למצבים משתנים.</p>
              <p><strong>3. למידה (L)</strong></p>
              <p>פתיחות לרעיונות חדשים, חשיבה ביקורתית ולמידה מתמשכת.</p>
              <p><strong>4. השראה (I)</strong></p>
              <p>הנעה רגשית דרך דוגמה אישית וחזון שמעורר משמעות.</p>
              <p><strong>5. משמעות (M)</strong></p>
              <p>חיבור עמוק לערכים, תכלית ותחושת שליחות אישית וארגונית.</p>
              <p><strong>6. אותנטיות (A2)</strong></p>
              <p>כנות, שקיפות והתנהלות אנושית המחוברת לערכים פנימיים.</p>
            </div>

            {/* WOCA Summary integrated into first page */}
            <div className="section">
              <h2 style={{ color: '#3b82f6', marginBottom: '15px' }}>סיכום WOCA</h2>
              
              <div className="stats-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                <div className="stat-item">
                  <p><strong>אזור מוביל:</strong></p>
                  <p className="numeric-value" style={{ color: '#059669' }}>{wocaZoneLabel}</p>
                </div>
                <div className="stat-item">
                  <p><strong>ציון כללי:</strong></p>
                  <p className="numeric-value">{wocaScore.toFixed(2)} מתוך 5</p>
                </div>
                <div className="stat-item">
                  <p><strong>משתתפים:</strong></p>
                  <p className="numeric-value">{wocaParticipantCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Page 2: SALIMA Charts */}
          <div className="page">
            <div className="header">
              <h2>תרשימי SALIMA</h2>
            </div>
            
            <div className="section">
              <h3 style={{ marginBottom: '12px' }}>תרשים רדאר קבוצתי</h3>
              <div className="image-container">
                {pdfImages['radar-chart'] && (
                  <img src={pdfImages['radar-chart']} alt="Radar Chart" className="full-image" />
                )}
              </div>
            </div>
            
            <div className="section">
              <h3 style={{ marginBottom: '12px' }}>התפלגות סגנונות מנהיגות</h3>
              <div className="image-container">
                {pdfImages['archetype-chart'] && (
                  <img src={pdfImages['archetype-chart']} alt="Archetype Chart" className="full-image" />
                )}
              </div>
              
              <div className="legend-box">
                <h3 style={{ textAlign: 'center', marginBottom: '12px', color: '#1f2937' }}>
                  📊 סגנונות מנהיגות (ארכיטיפים SALIMA)
                </h3>
                <p><strong>1. מנהל ההזדמנות (S + A)</strong></p>
                <p>רואה רחוק ופועל בגמישות. מוביל שינוי תוך הסתגלות מהירה והבנת ההקשר.</p>
                <p><strong>2. המנהל הסקרן (L + I)</strong></p>
                <p>לומד כל הזמן, מלהיב אחרים וסוחף דרך רעיונות ודוגמה אישית.</p>
                <p><strong>3. המנהל המעצים (M + A2)</strong></p>
                <p>מוביל מתוך ערכים, יוצר חיבור אישי ותחושת משמעות בעבודה המשותפת.</p>
              </div>
            </div>
          </div>

          {/* Page 3: WOCA Charts - Stacked layout */}
          <div className="page">
            <div className="header">
              <h2>תרשימי WOCA</h2>
            </div>
            
            {/* Pie chart on top */}
            <div className="section">
              <h3 style={{ marginBottom: '8px' }}>חלוקת אזורים</h3>
              <div className="image-container">
                {pdfImages['woca-pie'] && (
                  <img src={pdfImages['woca-pie']} alt="WOCA Pie" className="full-image" />
                )}
              </div>
            </div>
            
            {/* WOCA Legend moved here */}
            <div className="legend-box">
              <h3 style={{ textAlign: 'center', marginBottom: '12px', color: '#1f2937' }}>
                🎯 אזורי WOCA
              </h3>
              <p><strong>1. אזור ההזדמנות (WIN/WIN)</strong></p>
              <p>שיח פתוח, הקשבה ויוזמה. תחושת שליחות, השפעה, שיתוף פעולה וצמיחה משותפת.</p>
              <p><strong>2. אזור הנוחות (LOSE/LOSE)</strong></p>
              <p>הימנעות מקונפליקטים, קיפאון מחשבתי וחשש מיוזמות. שמירה על הקיים במחיר שחיקה.</p>
              <p><strong>3. אזור האדישות (LOSE/LOSE)</strong></p>
              <p>נתק רגשי, חוסר עניין וחוסר תחושת השפעה. תחושת סטגנציה ויעדר מנהיגות.</p>
              <p><strong>4. אזור המלחמה (WIN/LOSE)</strong></p>
              <p>דינמיקה של שליטה, חשדנות ומאבק. הישרדות טקטית על חשבון הקשבה, אמון ויציבות.</p>
            </div>
            
          </div>

        </div>
      </body>
    </html>
  );
};
