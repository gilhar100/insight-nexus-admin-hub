
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
  archetypeLegendText,
  wocaZoneLabel,
  wocaScore,
  wocaParticipantCount
}) => {
  const rootStyle: React.CSSProperties = {
    width: '794px',
    height: '1123px',
    margin: '0 auto',
    direction: 'rtl',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    boxSizing: 'border-box'
  };

  const pageStyle: React.CSSProperties = {
    width: '794px',
    height: '1123px',
    padding: '40px',
    fontFamily: 'Arial, sans-serif',
    direction: 'rtl',
    backgroundColor: '#ffffff',
    color: '#1f2937',
    pageBreakAfter: 'always',
    boxSizing: 'border-box',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column'
  };

  const contentWrapperStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '700px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '30px',
    borderBottom: '3px solid hsl(var(--primary))',
    paddingBottom: '20px',
    width: '100%'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: 'hsl(var(--primary))',
    marginBottom: '10px'
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '16px',
    color: 'hsl(var(--muted-foreground))',
    marginBottom: '20px'
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: '25px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };

  const scoreBoxStyle: React.CSSProperties = {
    backgroundColor: 'hsl(var(--accent))',
    border: '2px solid hsl(var(--primary))',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    marginBottom: '25px',
    width: '100%',
    maxWidth: '500px'
  };

  const dimensionBoxStyle: React.CSSProperties = {
    backgroundColor: 'hsl(var(--muted))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '8px',
    padding: '16px',
    margin: '8px',
    flex: '1',
    textAlign: 'center',
    minWidth: '200px'
  };

  const dimensionRowStyle: React.CSSProperties = {
    display: 'flex',
    gap: '16px',
    marginBottom: '25px',
    width: '100%',
    maxWidth: '600px',
    justifyContent: 'center'
  };

  const chartContainerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '25px',
    width: '100%',
    maxWidth: '650px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };

  const chartImageStyle: React.CSSProperties = {
    maxWidth: '100%',
    height: 'auto',
    border: '1px solid hsl(var(--border))',
    borderRadius: '8px',
    display: 'block',
    margin: '0 auto'
  };

  const legendStyle: React.CSSProperties = {
    backgroundColor: 'hsl(var(--muted))',
    padding: '18px',
    borderRadius: '8px',
    marginTop: '20px',
    width: '100%',
    maxWidth: '650px'
  };

  const legendItemStyle: React.CSSProperties = {
    marginBottom: '10px',
    fontSize: '13px',
    lineHeight: '1.4',
    textAlign: 'right'
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: 'hsl(var(--primary))',
    textAlign: 'center'
  };

  const currentDate = new Date().toLocaleDateString('he-IL');

  return (
    <div id="pdf-export-root" style={rootStyle}>
      {/* Page 1 - SALIMA Overview */}
      <div style={pageStyle}>
        <div style={contentWrapperStyle}>
          <div style={headerStyle}>
            <h1 style={titleStyle}>דוח תובנות קבוצתי SALIMA</h1>
            <p style={subtitleStyle}>קבוצה {groupNumber} • {currentDate} • {participantCount} משתתפים</p>
          </div>

          <div style={scoreBoxStyle}>
            <h2 style={{ fontSize: '22px', marginBottom: '10px', color: 'hsl(var(--primary))' }}>
              ציון SLQ קבוצתי
            </h2>
            <div style={{ fontSize: '42px', fontWeight: 'bold', color: 'hsl(var(--primary))' }}>
              {salimaScore.toFixed(2)}
            </div>
            <p style={{ fontSize: '14px', color: 'hsl(var(--muted-foreground))', marginTop: '8px' }}>
              מתוך 5.0
            </p>
          </div>

          <div style={dimensionRowStyle}>
            <div style={dimensionBoxStyle}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: 'hsl(var(--primary))' }}>
                מימד חזק ביותר
              </h3>
              <p style={{ fontSize: '14px', fontWeight: 'bold' }}>{strongestDimension.name}</p>
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: 'hsl(var(--primary))' }}>
                {strongestDimension.score.toFixed(2)}
              </p>
            </div>
            <div style={dimensionBoxStyle}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: 'hsl(var(--destructive))' }}>
                מימד חלש ביותר
              </h3>
              <p style={{ fontSize: '14px', fontWeight: 'bold' }}>{weakestDimension.name}</p>
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: 'hsl(var(--destructive))' }}>
                {weakestDimension.score.toFixed(2)}
              </p>
            </div>
          </div>

          <div style={legendStyle}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: 'hsl(var(--primary))', textAlign: 'center' }}>
              מימדי SALIMA
            </h3>
            <div style={legendItemStyle}><strong>אסטרטגיה:</strong> יכולת לראות את התמונה הרחבה ולתכנן לטווח ארוך</div>
            <div style={legendItemStyle}><strong>למידה:</strong> פתיחות לרכישת ידע חדש ולפיתוח מתמיד</div>
            <div style={legendItemStyle}><strong>השראה:</strong> יכולת להניע ולעורר מוטיבציה באחרים</div>
            <div style={legendItemStyle}><strong>אדפטיביות:</strong> גמישות והסתגלות לשינויים ואתגרים</div>
            <div style={legendItemStyle}><strong>אותנטיות:</strong> נאמנות לערכים האישיים והארגוניים</div>
            <div style={legendItemStyle}><strong>משמעות:</strong> יצירת תחושת מטרה ומשמעות בעבודה</div>
          </div>
        </div>
      </div>

      {/* Page 2 - SALIMA Visuals */}
      <div style={pageStyle}>
        <div style={contentWrapperStyle}>
          <div style={headerStyle}>
            <h1 style={titleStyle}>תרשימי SALIMA</h1>
            <p style={subtitleStyle}>ייצוג חזותי של תוצאות הקבוצה</p>
          </div>

          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>תרשים רדאר קבוצתי</h2>
            <div style={chartContainerStyle}>
              {pdfImages['radar-chart'] && (
                <img src={pdfImages['radar-chart']} alt="Group Radar Chart" style={chartImageStyle} />
              )}
            </div>
          </div>

          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>חלוקת ארכיטיפים</h2>
            <div style={chartContainerStyle}>
              {pdfImages['archetype-chart'] && (
                <img src={pdfImages['archetype-chart']} alt="Archetype Distribution" style={chartImageStyle} />
              )}
            </div>
          </div>

          <div style={legendStyle}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: 'hsl(var(--primary))', textAlign: 'center' }}>
              ארכיטיפי מנהיגות
            </h3>
            <div style={legendItemStyle}><strong>המנהל הסקרן:</strong> מתמחה בלמידה ופיתוח אישי ומקצועי</div>
            <div style={legendItemStyle}><strong>המנהל המעצים:</strong> מתמחה באותנטיות ויצירת משמעות</div>
            <div style={legendItemStyle}><strong>מנהל ההזדמנות:</strong> מתמחה באסטרטגיה, השראה ואדפטיביות</div>
          </div>
        </div>
      </div>

      {/* Page 3 - WOCA Summary */}
      <div style={pageStyle}>
        <div style={contentWrapperStyle}>
          <div style={headerStyle}>
            <h1 style={titleStyle}>סיכום WOCA</h1>
            <p style={subtitleStyle}>תוצאות אזור מוביל וציון כללי</p>
          </div>

          <div style={scoreBoxStyle}>
            <h2 style={{ fontSize: '22px', marginBottom: '20px', color: 'hsl(var(--primary))' }}>
              אזור מוביל
            </h2>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'hsl(var(--primary))', marginBottom: '16px' }}>
              {wocaZoneLabel}
            </div>
          </div>

          <div style={dimensionRowStyle}>
            <div style={dimensionBoxStyle}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: 'hsl(var(--primary))' }}>
                ציון WOCA כללי
              </h3>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: 'hsl(var(--primary))' }}>
                {wocaScore.toFixed(2)}
              </p>
              <p style={{ fontSize: '14px', color: 'hsl(var(--muted-foreground))' }}>
                מתוך 5.0
              </p>
            </div>
            <div style={dimensionBoxStyle}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: 'hsl(var(--primary))' }}>
                משתתפי WOCA
              </h3>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: 'hsl(var(--primary))' }}>
                {wocaParticipantCount}
              </p>
              <p style={{ fontSize: '14px', color: 'hsl(var(--muted-foreground))' }}>
                משתתפים
              </p>
            </div>
          </div>

          <div style={legendStyle}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: 'hsl(var(--primary))', textAlign: 'center' }}>
              על מדד WOCA
            </h3>
            <p style={{ fontSize: '13px', lineHeight: '1.6', textAlign: 'right' }}>
              מדד WOCA מודד את רמת המעורבות וההשפעה של הצוות בארגון. 
              האזור המוביל מציין את האזור בו הקבוצה מרוכזת ביותר והוא משקף את הדינמיקה הקבוצתית 
              ואת יכולות ההשפעה של הצוות בהקשרים ארגוניים שונים.
            </p>
          </div>
        </div>
      </div>

      {/* Page 4 - WOCA Visuals */}
      <div style={pageStyle}>
        <div style={contentWrapperStyle}>
          <div style={headerStyle}>
            <h1 style={titleStyle}>תרשימי WOCA</h1>
            <p style={subtitleStyle}>ייצוג חזותי של חלוקת האזורים</p>
          </div>

          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>תרשים עוגה - חלוקת קטגוריות</h2>
            <div style={chartContainerStyle}>
              {pdfImages['woca-pie'] && (
                <img src={pdfImages['woca-pie']} alt="WOCA Pie Chart" style={chartImageStyle} />
              )}
            </div>
          </div>

          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>תרשים עמודות - חוזק אזורים</h2>
            <div style={chartContainerStyle}>
              {pdfImages['woca-bar'] && (
                <img src={pdfImages['woca-bar']} alt="WOCA Bar Chart" style={chartImageStyle} />
              )}
            </div>
          </div>

          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>מטריצת WOCA</h2>
            <div style={chartContainerStyle}>
              {pdfImages['woca-matrix'] && (
                <img src={pdfImages['woca-matrix']} alt="WOCA Matrix Chart" style={chartImageStyle} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Page 5 - WOCA Zone Legend */}
      <div style={{ ...pageStyle, pageBreakAfter: 'auto' }}>
        <div style={contentWrapperStyle}>
          <div style={headerStyle}>
            <h1 style={titleStyle}>מדריך אזורי WOCA</h1>
            <p style={subtitleStyle}>הסבר על כל אזור ומשמעותו</p>
          </div>

          <div style={sectionStyle}>
            <div style={{ ...dimensionBoxStyle, marginBottom: '20px', backgroundColor: 'hsl(142 76% 36% / 0.1)', width: '100%', maxWidth: '600px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#009E73' }}>
                🎯 אזור הזדמנות
              </h3>
              <p style={{ fontSize: '13px', lineHeight: '1.6', textAlign: 'right' }}>
                אזור של השפעה גבוהה ועניין רב. כאן הצוות מרגיש מעורב ובעל יכולת השפעה משמעותית על התוצאות.
                זהו האזור האידיאלי לפעילות ויוזמות חשובות.
              </p>
            </div>

            <div style={{ ...dimensionBoxStyle, marginBottom: '20px', backgroundColor: 'hsl(54 91% 62% / 0.1)', width: '100%', maxWidth: '600px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#F0E442' }}>
                😌 אזור נוחות
              </h3>
              <p style={{ fontSize: '13px', lineHeight: '1.6', textAlign: 'right' }}>
                אזור של השפעה נמוכה אך עניין גבוה. הצוות מתעניין בנושא אך חש שיש לו השפעה מוגבלת על התוצאות.
                יש פוטנציאל לשיפור דרך הגדלת ההשפעה.
              </p>
            </div>

            <div style={{ ...dimensionBoxStyle, marginBottom: '20px', backgroundColor: 'hsl(36 100% 50% / 0.1)', width: '100%', maxWidth: '600px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#E69F00' }}>
                😐 אזור אדישות
              </h3>
              <p style={{ fontSize: '13px', lineHeight: '1.6', textAlign: 'right' }}>
                אזור של השפעה גבוהה אך עניין נמוך. הצוות יכול להשפיע אך לא מתעניין מספיק בנושא.
                דרוש חיזוק המוטיבציה והעניין.
              </p>
            </div>

            <div style={{ ...dimensionBoxStyle, marginBottom: '20px', backgroundColor: 'hsl(204 100% 35% / 0.1)', width: '100%', maxWidth: '600px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#0072B2' }}>
                ⚔️ אזור מלחמה
              </h3>
              <p style={{ fontSize: '13px', lineHeight: '1.6', textAlign: 'right' }}>
                אזור של השפעה נמוכה ועניין נמוך. זהו האזור המאתגר ביותר בו הצוות לא מרגיש מעורב ולא מסוגל להשפיע.
                דרושה התערבות משמעותית לשיפור המצב.
              </p>
            </div>
          </div>

          <div style={legendStyle}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: 'hsl(var(--primary))', textAlign: 'center' }}>
              💡 המלצות לפעולה
            </h3>
            <p style={{ fontSize: '13px', lineHeight: '1.6', textAlign: 'right' }}>
              זהו את האזור המוביל של הקבוצה ובחן אילו אסטרטגיות יעזרו להעביר נושאים חשובים לאזור ההזדמנות.
              התמקד בפיתוח כישורי השפעה באזורים בעלי עניין גבוה, ובחיזוק המוטיבציה באזורים בעלי השפעה גבוהה.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
