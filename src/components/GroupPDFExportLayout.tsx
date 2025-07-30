
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
              width: 210mm;
              margin: 0;
              padding: 0;
            }
            .page {
              page-break-after: always;
              width: 210mm;
              height: 297mm;
              padding: 0;
              margin: 0;
              background: white;
              position: relative;
            }
            .page:last-child {
              page-break-after: auto;
            }
            .content-container {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 180mm;
              text-align: center;
            }
            .page-title {
              font-size: 28px;
              font-weight: bold;
              color: #1f2937;
              text-align: center;
              margin-bottom: 30px;
              width: 100%;
            }
            .section-title {
              font-size: 24px;
              font-weight: bold;
              color: #3b82f6;
              text-align: center;
              margin-bottom: 25px;
              width: 100%;
            }
            .subsection-title {
              font-size: 20px;
              font-weight: 600;
              color: #1f2937;
              text-align: center;
              margin-bottom: 20px;
              width: 100%;
            }
            .group-info {
              text-align: center;
              font-size: 16px;
              color: #6b7280;
              margin-bottom: 30px;
              width: 100%;
            }
            .main-score {
              text-align: center;
              margin-bottom: 30px;
              width: 100%;
            }
            .main-score .score-value {
              font-size: 36px;
              font-weight: bold;
              color: #059669;
              margin-bottom: 10px;
              display: block;
            }
            .dimensions-container {
              width: 100%;
              margin-bottom: 30px;
            }
            .dimensions-row {
              width: 100%;
              text-align: center;
            }
            .dimension-box {
              display: inline-block;
              width: 200px;
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              margin: 0 10px;
              vertical-align: top;
            }
            .dimension-label {
              font-size: 16px;
              font-weight: 600;
              color: #374151;
              margin-bottom: 8px;
            }
            .dimension-name {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 8px;
            }
            .dimension-score {
              font-size: 24px;
              font-weight: bold;
            }
            .strong-dimension .dimension-name,
            .strong-dimension .dimension-score {
              color: #059669;
            }
            .weak-dimension .dimension-name,
            .weak-dimension .dimension-score {
              color: #dc2626;
            }
            .legend-box {
              background: #f9f9f9;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 20px;
              font-size: 14px;
              line-height: 1.6;
              margin: 20px auto;
              width: 80%;
              text-align: center;
            }
            .legend-title {
              font-size: 18px;
              font-weight: bold;
              color: #1f2937;
              margin-bottom: 15px;
            }
            .legend-item {
              margin-bottom: 8px;
            }
            .chart-container {
              margin: 15px auto;
              text-align: center;
              width: 100%;
            }
            .chart-image {
              max-width: 100%;
              height: auto;
              display: block;
              margin: 0 auto;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
            }
            .compact-chart {
              max-width: 70%;
            }
            .full-chart {
              max-width: 85%;
            }
            .woca-summary {
              text-align: center;
              margin-bottom: 25px;
              width: 100%;
            }
            .woca-zone {
              background: #f0f9ff;
              border: 1px solid #bfdbfe;
              border-radius: 8px;
              padding: 20px;
              margin: 0 auto 20px auto;
              text-align: center;
              width: 60%;
            }
            .woca-zone-name {
              font-size: 24px;
              font-weight: bold;
              color: #059669;
              margin-bottom: 15px;
            }
            .woca-stats-container {
              width: 100%;
              text-align: center;
            }
            .woca-stat {
              display: inline-block;
              width: 150px;
              background: #f9fafb;
              border-radius: 8px;
              padding: 15px;
              text-align: center;
              margin: 0 10px;
              vertical-align: top;
            }
            .woca-stat-label {
              font-size: 14px;
              color: #6b7280;
              margin-bottom: 5px;
            }
            .woca-stat-value {
              font-size: 20px;
              font-weight: bold;
              color: #1f2937;
            }
            .archetype-descriptions {
              margin-top: 20px;
              width: 80%;
              margin-left: auto;
              margin-right: auto;
            }
            .archetype-item {
              background: #f9f9f9;
              border-radius: 8px;
              padding: 15px;
              margin-bottom: 10px;
              text-align: center;
              font-size: 14px;
            }
            .archetype-name {
              font-weight: bold;
              color: #1f2937;
            }
            .zone-explanation {
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 20px;
              margin: 0 auto 15px auto;
              text-align: center;
              width: 80%;
            }
            .zone-name {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .zone-description {
              font-size: 14px;
              color: #4b5563;
              line-height: 1.5;
            }
            .opportunity { color: #059669; }
            .comfort { color: #3b82f6; }
            .apathy { color: #f59e0b; }
            .war { color: #ef4444; }
            .charts-container {
              width: 100%;
              margin-bottom: 25px;
            }
            .charts-row {
              width: 100%;
              text-align: center;
              margin-bottom: 20px;
            }
            .chart-section {
              display: inline-block;
              width: 45%;
              text-align: center;
              vertical-align: top;
              margin: 0 2.5%;
            }
            .chart-section h3 {
              font-size: 16px;
              font-weight: 600;
              color: #374151;
              margin-bottom: 15px;
            }
            .full-width-chart {
              width: 100%;
              text-align: center;
              margin: 20px auto;
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
                height: 297mm;
                padding: 0;
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
          <div className="page">
            <div className="content-container">
              <div className="page-title">
                דוח תובנות קבוצתי SALIMA
              </div>

              <div className="group-info">
                קבוצה {groupNumber} • {currentDate} • {participantCount} משתתפים
              </div>

              <div className="main-score">
                <div className="score-value">
                  ציון SLQ קבוצתי: {salimaScore.toFixed(2)} / 5
                </div>
              </div>

              <div className="dimensions-container">
                <div className="dimensions-row">
                  <div className="dimension-box strong-dimension">
                    <div className="dimension-label">מימד חזק</div>
                    <div className="dimension-name">{strongestDimension.name}</div>
                    <div className="dimension-score">{strongestDimension.score.toFixed(2)}</div>
                  </div>
                  <div className="dimension-box weak-dimension">
                    <div className="dimension-label">מימד חלש</div>
                    <div className="dimension-name">{weakestDimension.name}</div>
                    <div className="dimension-score">{weakestDimension.score.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              <div className="legend-box">
                <div className="legend-title">מימדי SALIMA</div>
                <div className="legend-item"><strong>אסטרטגיה:</strong> ראיה רחבה וחשיבה מערכתית</div>
                <div className="legend-item"><strong>למידה:</strong> פתיחות להתפתחות ולמידה</div>
                <div className="legend-item"><strong>השראה:</strong> הנעת אנשים ואנרגיה חיובית</div>
                <div className="legend-item"><strong>אדפטיביות:</strong> גמישות והתאמה לשינויים</div>
                <div className="legend-item"><strong>אותנטיות:</strong> כנות והתנהלות בהתאם לערכים</div>
                <div className="legend-item"><strong>משמעות:</strong> חיבור עמוק לתכלית העבודה</div>
              </div>
            </div>
          </div>

          {/* Page 2: SALIMA Charts */}
          <div className="page">
            <div className="content-container">
              <div className="subsection-title">תרשימי SALIMA</div>
              
              <div className="chart-section">
                <h3>תרשים רדאר קבוצתי</h3>
                <div className="chart-container">
                  {pdfImages['radar-chart'] && (
                    <img src={pdfImages['radar-chart']} alt="Radar Chart" className="chart-image full-chart" />
                  )}
                </div>
              </div>
              
              <div className="chart-section">
                <h3>חלוקת ארכיטיפים</h3>
                <div className="chart-container">
                  {pdfImages['archetype-chart'] && (
                    <img src={pdfImages['archetype-chart']} alt="Archetype Chart" className="chart-image full-chart" />
                  )}
                </div>
                
                <div className="archetype-descriptions">
                  <div className="archetype-item">
                    <span className="archetype-name">המנהל הסקרן:</span> סקרנות והתפתחות
                  </div>
                  <div className="archetype-item">
                    <span className="archetype-name">המנהל המעצים:</span> חיבור ומשמעות
                  </div>
                  <div className="archetype-item">
                    <span className="archetype-name">מנהל ההזדמנות:</span> חזון ותגובה מהירה
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Page 3: WOCA Summary */}
          <div className="page">
            <div className="content-container">
              <div className="section-title">סיכום WOCA</div>
              
              <div className="woca-summary">
                <div className="woca-zone">
                  <div className="woca-zone-name">אזור מוביל: {wocaZoneLabel}</div>
                  <div className="woca-stats-container">
                    <div className="woca-stat">
                      <div className="woca-stat-label">ציון כללי</div>
                      <div className="woca-stat-value">{wocaScore.toFixed(2)} מתוך 5</div>
                    </div>
                    <div className="woca-stat">
                      <div className="woca-stat-label">משתתפים</div>
                      <div className="woca-stat-value">{wocaParticipantCount}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Page 4: WOCA Charts */}
          <div className="page">
            <div className="content-container">
              <div className="subsection-title">תרשימי WOCA</div>
              
              <div className="charts-container">
                <div className="charts-row">
                  <div className="chart-section">
                    <h3>חלוקת אזורים</h3>
                    <div className="chart-container">
                      {pdfImages['woca-pie'] && (
                        <img src={pdfImages['woca-pie']} alt="WOCA Pie" className="chart-image compact-chart" />
                      )}
                    </div>
                  </div>
                  
                  <div className="chart-section">
                    <h3>חוזק אזורים</h3>
                    <div className="chart-container">
                      {pdfImages['woca-bar'] && (
                        <img src={pdfImages['woca-bar']} alt="WOCA Bar" className="chart-image compact-chart" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="full-width-chart">
                <h3>מטריצת WOCA</h3>
                <div className="chart-container">
                  {pdfImages['woca-matrix'] && (
                    <img src={pdfImages['woca-matrix']} alt="WOCA Matrix" className="chart-image full-chart" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Page 5: WOCA Zone Legend */}
          <div className="page">
            <div className="content-container">
              <div className="subsection-title">מדריך אזורי WOCA</div>
              
              <div className="zone-explanation">
                <div className="zone-name opportunity">אזור הזדמנות</div>
                <div className="zone-description">השפעה גבוהה ועניין גבוה – אידיאלי לפעולה</div>
              </div>
              
              <div className="zone-explanation">
                <div className="zone-name comfort">אזור נוחות</div>
                <div className="zone-description">עניין גבוה אך השפעה נמוכה – צריך לחזק השפעה</div>
              </div>
              
              <div className="zone-explanation">
                <div className="zone-name apathy">אזור אדישות</div>
                <div className="zone-description">השפעה גבוהה אך עניין נמוך – דרוש חיבור רגשי</div>
              </div>
              
              <div className="zone-explanation">
                <div className="zone-name war">אזור מלחמה</div>
                <div className="zone-description">עניין והשפעה נמוכים – דרושה התערבות משמעותית</div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
};
