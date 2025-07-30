
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
    width: '210mm',
    minHeight: '297mm',
    margin: '0 auto',
    padding: '15mm',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fff',
    color: '#1f2937',
    boxSizing: 'border-box',
    pageBreakAfter: 'always',
    display: 'block',
    position: 'relative'
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '25px',
    paddingBottom: '15px',
    borderBottom: '2px solid #e5e7eb'
  };

  const sectionStyle: React.CSSProperties = {
    width: '100%',
    marginBottom: '20px',
    textAlign: 'center'
  };

  const imageContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '15px',
    width: '100%'
  };

  const imageStyle: React.CSSProperties = {
    maxWidth: '95%',
    maxHeight: '300px',
    height: 'auto',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    display: 'block'
  };

  const legendBoxStyle: React.CSSProperties = {
    textAlign: 'right',
    fontSize: '11px',
    lineHeight: 1.4,
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '12px',
    margin: '15px auto',
    maxWidth: '95%',
    boxSizing: 'border-box'
  };

  const statsRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    margin: '15px 0',
    padding: '10px',
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
    textAlign: 'center'
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
              margin: 0;
              padding: 0;
            }
            body {
              direction: rtl;
              font-family: Arial, sans-serif;
              color: #1f2937;
              background: white;
              line-height: 1.5;
            }
            .page {
              page-break-after: always;
              width: 210mm;
              min-height: 297mm;
              padding: 15mm;
              margin: 0 auto;
              background: white;
              box-sizing: border-box;
              position: relative;
            }
            .page:last-child {
              page-break-after: auto;
            }
            h1 {
              font-size: 22px;
              margin-bottom: 8px;
              font-weight: bold;
              color: #1f2937;
            }
            h2 {
              font-size: 18px;
              margin-bottom: 10px;
              font-weight: 600;
              color: #374151;
            }
            h3 {
              font-size: 14px;
              margin-bottom: 8px;
              font-weight: 600;
              color: #4b5563;
            }
            p {
              margin: 5px 0;
              font-size: 12px;
            }
            .header {
              text-align: center;
              margin-bottom: 25px;
              padding-bottom: 15px;
              border-bottom: 2px solid #e5e7eb;
            }
            .section {
              width: 100%;
              margin-bottom: 20px;
              text-align: center;
            }
            .image-container {
              display: flex;
              justify-content: center;
              align-items: center;
              margin-bottom: 15px;
              width: 100%;
            }
            img {
              max-width: 95%;
              max-height: 300px;
              height: auto;
              display: block;
              border: 1px solid #d1d5db;
              border-radius: 8px;
            }
            .legendBox {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 12px;
              font-size: 11px;
              line-height: 1.4;
              margin: 15px auto;
              max-width: 95%;
              box-sizing: border-box;
              text-align: right;
            }
            .stats-row {
              display: flex;
              justify-content: space-around;
              align-items: center;
              margin: 15px 0;
              padding: 10px;
              background-color: #f9fafb;
              border-radius: 6px;
              text-align: center;
            }
            .stat-item {
              flex: 1;
              padding: 0 10px;
            }
            .page-break {
              page-break-before: always;
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
                padding: 15mm;
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
          {/* Page 1: SALIMA Overview */}
          <div className="page" style={basePageStyle}>
            <div className="header" style={headerStyle}>
              <h1>דוח תובנות קבוצתי SALIMA</h1>
              <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>
                קבוצה {groupNumber} • {currentDate} • {participantCount} משתתפים
              </p>
            </div>

            <div style={sectionStyle}>
              <h2 style={{ color: '#059669', marginBottom: '15px' }}>
                ציון SLQ קבוצתי: {salimaScore.toFixed(2)} / 5
              </h2>
              
              <div style={statsRowStyle}>
                <div className="stat-item">
                  <p><strong>מימד חזק:</strong></p>
                  <p style={{ color: '#059669', fontSize: '14px' }}>
                    {strongestDimension.name} ({strongestDimension.score.toFixed(2)})
                  </p>
                </div>
                <div className="stat-item">
                  <p><strong>מימד חלש:</strong></p>
                  <p style={{ color: '#dc2626', fontSize: '14px' }}>
                    {weakestDimension.name} ({weakestDimension.score.toFixed(2)})
                  </p>
                </div>
              </div>
            </div>

            <div style={legendBoxStyle} className="legendBox">
              <h3 style={{ textAlign: 'center', marginBottom: '12px', color: '#1f2937' }}>
                מימדי SALIMA
              </h3>
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
            <div className="header" style={headerStyle}>
              <h2>תרשימי SALIMA</h2>
            </div>
            
            <div style={sectionStyle}>
              <h3 style={{ marginBottom: '12px' }}>תרשים רדאר קבוצתי</h3>
              <div style={imageContainerStyle}>
                {pdfImages['radar-chart'] && (
                  <img src={pdfImages['radar-chart']} alt="Radar Chart" style={imageStyle} />
                )}
              </div>
            </div>
            
            <div style={sectionStyle}>
              <h3 style={{ marginBottom: '12px' }}>חלוקת ארכיטיפים</h3>
              <div style={imageContainerStyle}>
                {pdfImages['archetype-chart'] && (
                  <img src={pdfImages['archetype-chart']} alt="Archetype Chart" style={imageStyle} />
                )}
              </div>
              
              <div style={legendBoxStyle} className="legendBox">
                <h3 style={{ textAlign: 'center', marginBottom: '8px' }}>ארכיטיפי מנהיגות</h3>
                <p><strong>המנהל הסקרן:</strong> סקרנות והתפתחות</p>
                <p><strong>המנהל המעצים:</strong> חיבור ומשמעות</p>
                <p><strong>מנהל ההזדמנות:</strong> חזון ותגובה מהירה</p>
              </div>
            </div>
          </div>

          {/* Page 3: WOCA Summary */}
          <div className="page" style={basePageStyle}>
            <div className="header" style={headerStyle}>
              <h1>סיכום WOCA</h1>
            </div>
            
            <div style={sectionStyle}>
              <div style={statsRowStyle}>
                <div className="stat-item">
                  <p><strong>אזור מוביל:</strong></p>
                  <p style={{ fontSize: '16px', color: '#059669' }}>{wocaZoneLabel}</p>
                </div>
                <div className="stat-item">
                  <p><strong>ציון כללי:</strong></p>
                  <p style={{ fontSize: '16px', color: '#1f2937' }}>{wocaScore.toFixed(2)} מתוך 5</p>
                </div>
                <div className="stat-item">
                  <p><strong>משתתפים:</strong></p>
                  <p style={{ fontSize: '16px', color: '#1f2937' }}>{wocaParticipantCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Page 4: WOCA Visuals */}
          <div className="page" style={basePageStyle}>
            <div className="header" style={headerStyle}>
              <h2>תרשימי WOCA</h2>
            </div>
            
            <div style={sectionStyle}>
              <h3 style={{ marginBottom: '10px' }}>חלוקת אזורים</h3>
              <div style={imageContainerStyle}>
                {pdfImages['woca-pie'] && (
                  <img src={pdfImages['woca-pie']} alt="WOCA Pie" style={imageStyle} />
                )}
              </div>
            </div>
            
            <div style={sectionStyle}>
              <h3 style={{ marginBottom: '10px' }}>חוזק אזורים</h3>
              <div style={imageContainerStyle}>
                {pdfImages['woca-bar'] && (
                  <img src={pdfImages['woca-bar']} alt="WOCA Bar" style={imageStyle} />
                )}
              </div>
            </div>
            
            <div style={sectionStyle}>
              <h3 style={{ marginBottom: '10px' }}>מטריצת WOCA</h3>
              <div style={imageContainerStyle}>
                {pdfImages['woca-matrix'] && (
                  <img src={pdfImages['woca-matrix']} alt="WOCA Matrix" style={imageStyle} />
                )}
              </div>
            </div>
          </div>

          {/* Page 5: WOCA Legend */}
          <div className="page" style={{ ...basePageStyle, pageBreakAfter: 'auto' }}>
            <div className="header" style={headerStyle}>
              <h2>מדריך אזורי WOCA</h2>
            </div>
            
            <div style={legendBoxStyle} className="legendBox">
              <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                <h3 style={{ color: '#1f2937' }}>הסבר על אזורי WOCA</h3>
              </div>
              
              <p style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#059669' }}>אזור הזדמנות:</strong> השפעה גבוהה ועניין גבוה – אידיאלי לפעולה
              </p>
              <p style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#3b82f6' }}>אזור נוחות:</strong> עניין גבוה אך השפעה נמוכה – צריך לחזק השפעה
              </p>
              <p style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#f59e0b' }}>אזור אדישות:</strong> השפעה גבוהה אך עניין נמוך – דרוש חיבור רגשי
              </p>
              <p>
                <strong style={{ color: '#ef4444' }}>אזור מלחמה:</strong> עניין והשפעה נמוכים – דרושה התערבות משמעותית
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
};
