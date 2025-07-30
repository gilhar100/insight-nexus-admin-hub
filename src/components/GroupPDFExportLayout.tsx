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
    <div id="pdf-export-root" dir="rtl">
      {/* Page 1: SALIMA Overview */}
      <div className="page">
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

        <div className="dimensions-grid">
          <div className="dimension-row">
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

      {/* Page 2: SALIMA Charts */}
      <div className="page">
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

      {/* Page 3: WOCA Summary */}
      <div className="page">
        <div className="section-title">סיכום WOCA</div>

        <div className="woca-summary">
          <div className="woca-zone">
            <div className="woca-zone-name">אזור מוביל: {wocaZoneLabel}</div>
            <div className="woca-stats">
              <div className="woca-stats-row">
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
        <div className="subsection-title">תרשימי WOCA</div>

        <div className="charts-grid">
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

      {/* Page 5: WOCA Zone Legend */}
      <div className="page">
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
  );
};