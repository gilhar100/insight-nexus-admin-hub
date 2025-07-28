import React from 'react';

interface GroupPDFExportLayoutProps {
  pdfImages: Record<string, string>;
  groupNumber: number;
  participantCount: number;
  salimaScore: number;
  strongestDimension: { name: string; score: number };
  weakestDimension: { name: string; score: number };
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
  wocaScore,
  wocaParticipantCount
}) => {
  const pageStyle = {
    width: '794px',
    height: '1123px',
    padding: '48px',
    pageBreakAfter: 'always' as const,
    backgroundColor: '#fff',
    direction: 'rtl' as const,
    fontFamily: 'Arial, sans-serif',
    boxSizing: 'border-box' as const,
    position: 'relative' as const,
    overflow: 'hidden' as const
  };

  const chartStyle = {
    width: '100%',
    maxHeight: '450px',
    objectFit: 'contain' as const,
    display: 'block',
    margin: '24px auto'
  };

  return (
    <div id="pdf-export-root">

      <div style={pageStyle}>
        <h1 style={{ fontSize: '24px', textAlign: 'center' }}>דוח קבוצתי - SALIMA</h1>
        <div style={{ textAlign: 'center', marginBottom: '12px', fontSize: '16px' }}>
          קבוצה {groupNumber} | {participantCount} משתתפים | {new Date().toLocaleDateString('he-IL')}
        </div>
        <h2 style={{ fontSize: '20px', textAlign: 'center', marginTop: '24px' }}>ציון מנהיגות קבוצתי</h2>
        <div style={{ fontSize: '60px', color: '#0072f5', textAlign: 'center', fontWeight: 'bold' }}>{salimaScore.toFixed(2)}</div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '48px' }}>
          <div style={{ width: '45%', backgroundColor: '#fffbe6', border: '2px solid #ffc107', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', color: '#ff6f00', fontWeight: 'bold' }}>ממד לפיתוח</div>
            <div style={{ fontSize: '36px', color: '#ff6f00', fontWeight: 'bold' }}>{weakestDimension.score}</div>
            <div>{weakestDimension.name}</div>
          </div>

          <div style={{ width: '45%', backgroundColor: '#e8f5e9', border: '2px solid #4caf50', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', color: '#2e7d32', fontWeight: 'bold' }}>הממד החזק ביותר</div>
            <div style={{ fontSize: '36px', color: '#2e7d32', fontWeight: 'bold' }}>{strongestDimension.score}</div>
            <div>{strongestDimension.name}</div>
          </div>
        </div>

        <h3 style={{ fontSize: '18px', textAlign: 'center', marginTop: '48px' }}>פרופיל קבוצתי ייחודי</h3>
        <img src={pdfImages['radar-chart']} alt="Radar Chart" style={chartStyle} />
      </div>

      <div style={pageStyle}>
        <h2 style={{ fontSize: '22px', textAlign: 'center' }}>התפלגות סגנון מנהיגות</h2>
        <img src={pdfImages['archetype-chart']} alt="Archetype Chart" style={chartStyle} />

        <div style={{ padding: '0 32px', fontSize: '16px', lineHeight: '1.6' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>הסבר על סגנונות המנהיגות</h3>
          <p><strong>המנהל הסקרן:</strong> חוקר, שואל שאלות, מוביל באנרגיה של למידה וצמיחה.</p>
          <p><strong>המנהל המעצים:</strong> פועל מתוך כנות ותחושת שליחות, מחבר את האנשים למשמעות.</p>
          <p><strong>מנהל ההזדמנות:</strong> חושב קדימה, מזהה מגמות, פועל בגמישות ובחזון.</p>
        </div>
      </div>

      <div style={pageStyle}>
        <h2 style={{ fontSize: '22px', textAlign: 'center' }}>WOCA - ניתוח אזורי שינוי</h2>
        <div style={{ textAlign: 'center', fontSize: '16px', marginBottom: '8px' }}>
          {wocaParticipantCount} משתתפים | ציון ממוצע: {wocaScore.toFixed(2)}
        </div>
        <img src={pdfImages['woca-bar']} alt="WOCA Bar Chart" style={chartStyle} />

        <div style={{ padding: '0 32px', fontSize: '16px', lineHeight: '1.6' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>הסבר על אזורי השינוי</h3>
          <p><strong>הזדמנות:</strong> אזור עם פוטנציאל גבוה לצמיחה.</p>
          <p><strong>נוחות:</strong> אזור יציב אך עם סיכון להתקבעות.</p>
          <p><strong>אדישות:</strong> אזור של חוסר מעורבות ודורש התעוררות.</p>
          <p><strong>מלחמה:</strong> התנגדות פעילה לשינוי.</p>

          <div style={{ backgroundColor: '#fff8e1', border: '1px solid #fbc02d', padding: '12px', marginTop: '24px', fontSize: '14px', textAlign: 'center' }}>
            ⚠️ הערה: גרף זה מציג ציונים ממוצעים, לא התפלגות אזורי תודעה בין המשתתפים
          </div>
        </div>
      </div>

    </div>
  );
};