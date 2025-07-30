
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
  const basePageStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '210mm',
    minHeight: '297mm',
    margin: '0 auto',
    padding: '20mm',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fff',
    color: '#1f2937',
    boxSizing: 'border-box',
    pageBreakAfter: 'always',
    display: 'block'
  };

  const sectionStyle: React.CSSProperties = {
    width: '100%',
    marginBottom: '20px',
    textAlign: 'right'
  };

  const imageStyle: React.CSSProperties = {
    maxWidth: '100%',
    height: 'auto',
    border: '1px solid #ccc',
    borderRadius: '8px',
    marginBottom: '15px',
    display: 'block',
    margin: '0 auto 15px auto'
  };

  const legendBoxStyle: React.CSSProperties = {
    textAlign: 'right',
    fontSize: '12px',
    lineHeight: 1.5,
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    padding: '15px',
    marginTop: '15px',
    width: '100%',
    boxSizing: 'border-box'
  };

  const currentDate = new Date().toLocaleDateString('he-IL');

  return (
    <html dir="rtl" lang="he">
      <head>
        <meta charSet="UTF-8" />
        <style>
          {`
            * {
              box-sizing: border-box;
            }
            body {
              direction: rtl;
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              color: #1f2937;
              width: 210mm;
              background: white;
            }
            .page {
              page-break-after: always;
              width: 100%;
              max-width: 210mm;
              min-height: 297mm;
              padding: 20mm;
              margin: 0 auto;
              background: white;
              box-sizing: border-box;
            }
            .page:last-child {
              page-break-after: auto;
            }
            h1, h2, h3, p {
              text-align: right;
              margin: 10px 0;
            }
            h1 {
              font-size: 24px;
              margin-bottom: 15px;
            }
            h2 {
              font-size: 20px;
              margin-bottom: 12px;
            }
            h3 {
              font-size: 16px;
              margin-bottom: 10px;
            }
            img {
              max-width: 100%;
              height: auto;
              display: block;
              margin: 0 auto 15px auto;
              border: 1px solid #ccc;
              border-radius: 8px;
            }
            .legendBox {
              background: #f9f9f9;
              border-radius: 8px;
              padding: 15px;
              font-size: 12px;
              line-height: 1.5;
              width: 100%;
              box-sizing: border-box;
              text-align: right;
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
              }
            }
          `}
        </style>
      </head>
      <body>
        <div id="pdf-export-root">
          {/* Page 1: SALIMA Overview */}
          <div className="page" style={basePageStyle}>
            <div style={sectionStyle}>
              <h1>דוח תובנות קבוצתי SALIMA</h1>
              <p>קבוצה {groupNumber} • {currentDate} • {participantCount} משתתפים</p>
              <h2>ציון SLQ קבוצתי: {salimaScore.toFixed(2)} / 5</h2>
              <p><strong>מימד חזק:</strong> {strongestDimension.name} ({strongestDimension.score.toFixed(2)})</p>
              <p><strong>מימד חלש:</strong> {weakestDimension.name} ({weakestDimension.score.toFixed(2)})</p>
            </div>

            <div style={legendBoxStyle} className="legendBox">
              <h3>מימדי SALIMA</h3>
              <p><strong>אסטרטגיה:</strong> ראיה רחבה וחשיבה מערכתית</p>
              <p><strong>למידה:</strong> פתיחות להתפתחות ולמידה</p>
              <p><strong>השראה:</strong> הנעת אנשים ואנרגיה חיובית</p>
              <p><strong>אדפטיביות:</strong> גמישות והתאמה לשינויים</p>
              <p><strong>אותנטיות:</strong> כנות והתנהלות בהתאם לערכים</p>
              <p><strong>משמעות:</strong> חיבור עמוק לתכלית העבודה</p>
            </div>
          </div>

          {/* Page 2: SALIMA Charts */}
          <div className="page" style={basePageStyle}>
            <div style={sectionStyle}>
              <h2>תרשים רדאר קבוצתי</h2>
              {pdfImages['radar-chart'] && <img src={pdfImages['radar-chart']} alt="Radar Chart" style={imageStyle} />}
            </div>
            <div style={sectionStyle}>
              <h2>חלוקת ארכיטיפים</h2>
              {pdfImages['archetype-chart'] && <img src={pdfImages['archetype-chart']} alt="Archetype Chart" style={imageStyle} />}
              <div style={legendBoxStyle} className="legendBox">
                <h3>ארכיטיפי מנהיגות</h3>
                <p><strong>המנהל הסקרן:</strong> סקרנות והתפתחות</p>
                <p><strong>המנהל המעצים:</strong> חיבור ומשמעות</p>
                <p><strong>מנהל ההזדמנות:</strong> חזון ותגובה מהירה</p>
              </div>
            </div>
          </div>

          {/* Page 3: WOCA Summary */}
          <div className="page" style={basePageStyle}>
            <div style={sectionStyle}>
              <h1>סיכום WOCA</h1>
              <p>אזור מוביל: <strong>{wocaZoneLabel}</strong></p>
              <p>ציון כללי: {wocaScore.toFixed(2)} מתוך 5</p>
              <p>משתתפים: {wocaParticipantCount}</p>
            </div>
          </div>

          {/* Page 4: WOCA Visuals */}
          <div className="page" style={basePageStyle}>
            <div style={sectionStyle}>
              <h2>תרשים עוגה - חלוקת אזורים</h2>
              {pdfImages['woca-pie'] && <img src={pdfImages['woca-pie']} alt="WOCA Pie" style={imageStyle} />}
            </div>
            <div style={sectionStyle}>
              <h2>תרשים עמודות - חוזק אזורים</h2>
              {pdfImages['woca-bar'] && <img src={pdfImages['woca-bar']} alt="WOCA Bar" style={imageStyle} />}
            </div>
            <div style={sectionStyle}>
              <h2>מטריצת WOCA</h2>
              {pdfImages['woca-matrix'] && <img src={pdfImages['woca-matrix']} alt="WOCA Matrix" style={imageStyle} />}
            </div>
          </div>

          {/* Page 5: WOCA Legend */}
          <div className="page" style={{ ...basePageStyle, pageBreakAfter: 'auto' }}>
            <div style={legendBoxStyle} className="legendBox">
              <h2>מדריך אזורי WOCA</h2>
              <p><strong>אזור הזדמנות:</strong> השפעה גבוהה ועניין גבוה – אידיאלי לפעולה</p>
              <p><strong>אזור נוחות:</strong> עניין גבוה אך השפעה נמוכה – צריך לחזק השפעה</p>
              <p><strong>אזור אדישות:</strong> השפעה גבוהה אך עניין נמוך – דרוש חיבור רגשי</p>
              <p><strong>אזור מלחמה:</strong> עניין והשפעה נמוכים – דרושה התערבות משמעותית</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
};
