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
      <div style={{ width: '210mm', margin: '0 auto', padding: '15mm', background: '#fff', fontFamily: 'Arial, sans-serif', color: '#1f2937' }}>

        {/* Page 1: SALIMA Overview */}
        <div style={{ pageBreakAfter: 'always', textAlign: 'center' }}>
          <h1 style={{ fontSize: '28px', borderBottom: '2px solid #e5e7eb', paddingBottom: '15px' }}>דוח תובנות קבוצתי SALIMA</h1>
          <p>{`קבוצה ${groupNumber} • ${currentDate} • ${participantCount} משתתפים`}</p>
          <h2 style={{ fontSize: '24px', margin: '20px 0', color: '#059669' }}>{`ציון SLQ קבוצתי: ${salimaScore.toFixed(2)} / 5`}</h2>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '30px' }}>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px', background: '#f9fafb', width: '200px' }}>
              <div style={{ color: '#059669' }}>מימד חזק</div>
              <strong>{strongestDimension.name}</strong>
              <div>{strongestDimension.score.toFixed(2)}</div>
            </div>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px', background: '#f9fafb', width: '200px' }}>
              <div style={{ color: '#dc2626' }}>מימד חלש</div>
              <strong>{weakestDimension.name}</strong>
              <div>{weakestDimension.score.toFixed(2)}</div>
            </div>
          </div>

          <div style={{ background: '#f9f9f9', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', fontSize: '14px', maxWidth: '600px', margin: '0 auto' }}>
            <strong>מימדי SALIMA</strong>
            <p><strong>אסטרטגיה:</strong> ראיה רחבה וחשיבה מערכתית</p>
            <p><strong>למידה:</strong> פתיחות להתפתחות ולמידה</p>
            <p><strong>השראה:</strong> הנעת אנשים ואנרגיה חיובית</p>
            <p><strong>אדפטיביות:</strong> גמישות והתאמה לשינויים</p>
            <p><strong>אותנטיות:</strong> כנות והתנהלות בהתאם לערכים</p>
            <p><strong>משמעות:</strong> חיבור עמוק לתכלית העבודה</p>
          </div>
        </div>

        {/* Page 2: SALIMA Charts */}
        <div style={{ pageBreakAfter: 'always', textAlign: 'center' }}>
          <h2>תרשימי SALIMA</h2>
          {pdfImages['radar-chart'] && <img src={pdfImages['radar-chart']} alt="Radar" style={{ maxWidth: '80%', margin: '20px auto', display: 'block' }} />}
          {pdfImages['archetype-chart'] && <img src={pdfImages['archetype-chart']} alt="Archetype" style={{ maxWidth: '80%', margin: '20px auto', display: 'block' }} />}
        </div>

        {/* Page 3: WOCA Summary */}
        <div style={{ pageBreakAfter: 'always', textAlign: 'center' }}>
          <h2>סיכום WOCA</h2>
          <div style={{ margin: '0 auto', maxWidth: '400px', background: '#f0f9ff', padding: '20px', borderRadius: '8px' }}>
            <p><strong>אזור מוביל:</strong> {wocaZoneLabel}</p>
            <p><strong>ציון כללי:</strong> {wocaScore.toFixed(2)} מתוך 5</p>
            <p><strong>משתתפים:</strong> {wocaParticipantCount}</p>
          </div>
        </div>

        {/* Page 4: WOCA Charts */}
        <div style={{ pageBreakAfter: 'always', textAlign: 'center' }}>
          <h2>תרשימי WOCA</h2>
          {pdfImages['woca-pie'] && <img src={pdfImages['woca-pie']} alt="WOCA Pie" style={{ maxWidth: '70%', margin: '10px auto', display: 'block' }} />}
          {pdfImages['woca-bar'] && <img src={pdfImages['woca-bar']} alt="WOCA Bar" style={{ maxWidth: '70%', margin: '10px auto', display: 'block' }} />}
          {pdfImages['woca-matrix'] && <img src={pdfImages['woca-matrix']} alt="WOCA Matrix" style={{ maxWidth: '80%', margin: '10px auto', display: 'block' }} />}
        </div>

        {/* Page 5: WOCA Legend */}
        <div style={{ textAlign: 'center' }}>
          <h2>מדריך אזורי WOCA</h2>
          <div style={{ margin: '0 auto', maxWidth: '600px' }}>
            <p><strong>אזור הזדמנות:</strong> השפעה גבוהה ועניין גבוה – אידיאלי לפעולה</p>
            <p><strong>אזור נוחות:</strong> עניין גבוה אך השפעה נמוכה – צריך לחזק השפעה</p>
            <p><strong>אזור אדישות:</strong> השפעה גבוהה אך עניין נמוך – דרוש חיבור רגשי</p>
            <p><strong>אזור מלחמה:</strong> עניין והשפעה נמוכים – דרושה התערבות משמעותית</p>
          </div>
        </div>
      </div>
    </div>
  );
};