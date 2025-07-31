
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
            }
            .overview-row {
              margin-bottom: 25px;
              text-align: center;
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
                מימדי SALIMA
              </h3>
              <p><strong>אסטרטגיה:</strong> ראיה רחבה וחשיבה מערכתית</p>
              <p><strong>למידה:</strong> פתיחות להתפתחות ולמידה</p>
              <p><strong>השראה:</strong> הנעת אנשים ואנרגיה חיובית</p>
              <p><strong>אדפטיביות:</strong> גמישות והתאמה לשינויים</p>
              <p><strong>אותנטיות:</strong> כנות והתנהלות בהתאם לערכים</p>
              <p><strong>משמעות:</strong> חיבור עמוק לתכלית העבודה</p>
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
              <h3 style={{ marginBottom: '12px' }}>חלוקת ארכיטיפים</h3>
              <div className="image-container">
                {pdfImages['archetype-chart'] && (
                  <img src={pdfImages['archetype-chart']} alt="Archetype Chart" className="full-image" />
                )}
              </div>
              
              <div className="archetype-box">
                <p><strong>המנהל הסקרן:</strong> סקרנות והתפתחות</p>
              </div>
              <div className="archetype-box">
                <p><strong>המנהל המעצים:</strong> חיבור ומשמעות</p>
              </div>
              <div className="archetype-box">
                <p><strong>מנהל ההזדמנות:</strong> חזון ותגובה מהירה</p>
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
            
            {/* Bar chart on bottom */}
            <div className="section">
              <h3 style={{ marginBottom: '8px' }}>חוזק אזורים</h3>
              <div className="image-container">
                {pdfImages['woca-bar'] && (
                  <img src={pdfImages['woca-bar']} alt="WOCA Bar" className="full-image" />
                )}
              </div>
            </div>
          </div>

          {/* Page 4: WOCA Legend */}
          <div className="page" style={{ pageBreakAfter: 'auto' }}>
            <div className="header">
              <h2>מדריך אזורי WOCA</h2>
            </div>
            
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#1f2937' }}>הסבר על אזורי WOCA</h3>
            </div>
            
            <div className="zone-box">
              <p><strong style={{ color: '#009E73' }}>אזור הזדמנות:</strong> השפעה גבוהה ועניין גבוה – אידיאלי לפעולה</p>
            </div>
            
            <div className="zone-box">
              <p><strong style={{ color: '#F0E442' }}>אזור נוחות:</strong> עניין גבוה אך השפעה נמוכה – צריך לחזק השפעה</p>
            </div>
            
            <div className="zone-box">
              <p><strong style={{ color: '#E69F00' }}>אזור אדישות:</strong> השפעה גבוהה אך עניין נמוך – דרוש חיבור רגשי</p>
            </div>
            
            <div className="zone-box">
              <p><strong style={{ color: '#0072B2' }}>אזור מלחמה:</strong> עניין והשפעה נמוכים – דרושה התערבות משמעותית</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
};
