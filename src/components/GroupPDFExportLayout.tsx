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
  wocaParticipantCount,
}) => {
  const currentDate = new Date().toLocaleDateString('he-IL');

  return (
    <div id="pdf-export-root" dir="rtl" style={{ fontFamily: 'Arial, sans-serif', color: '#1f2937', background: 'white', lineHeight: 1.4 }}>
      {/* Page 1: SALIMA Overview */}
      <div style={{ width: '794px', margin: '0 auto', padding: '40px', pageBreakAfter: 'always' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>דוח תובנות קבוצתי SALIMA</h1>
        <p style={{ textAlign: 'center', marginBottom: '20px' }}>קבוצה {groupNumber} • {currentDate} • {participantCount} משתתפים</p>
        <p style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>ציון SLQ קבוצתי: {salimaScore.toFixed(2)} / 5</p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '30px' }}>
          <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '8px', textAlign: 'center', flex: 1 }}>
            <p style={{ fontWeight: 600 }}>מימד חזק</p>
            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#059669' }}>{strongestDimension.name}</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>{strongestDimension.score.toFixed(2)}</p>
          </div>
          <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '8px', textAlign: 'center', flex: 1 }}>
            <p style={{ fontWeight: 600 }}>מימד חלש</p>
            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc2626' }}>{weakestDimension.name}</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>{weakestDimension.score.toFixed(2)}</p>
          </div>
        </div>

        <div style={{ backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '16px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '12px' }}>מימדי SALIMA</h3>
          <p><strong>אסטרטגיה:</strong> ראיה רחבה וחשיבה מערכתית</p>
          <p><strong>למידה:</strong> פתיחות להתפתחות ולמידה</p>
          <p><strong>השראה:</strong> הנעת אנשים ואנרגיה חיובית</p>
          <p><strong>אדפטיביות:</strong> גמישות והתאמה לשינויים</p>
          <p><strong>אותנטיות:</strong> כנות והתנהלות בהתאם לערכים</p>
          <p><strong>משמעות:</strong> חיבור עמוק לתכלית העבודה</p>
        </div>
      </div>

      {/* Page 2: SALIMA Charts */}
      <div style={{ width: '794px', margin: '0 auto', padding: '40px', pageBreakAfter: 'always' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>תרשימי SALIMA</h2>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          {pdfImages['radar-chart'] && <img src={pdfImages['radar-chart']} alt="Radar Chart" style={{ maxWidth: '85%', border: '1px solid #ccc', borderRadius: '8px' }} />}
        </div>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          {pdfImages['archetype-chart'] && <img src={pdfImages['archetype-chart']} alt="Archetype Chart" style={{ maxWidth: '85%', border: '1px solid #ccc', borderRadius: '8px' }} />}
        </div>
        <div style={{ backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '16px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <p><strong>המנהל הסקרן:</strong> סקרנות והתפתחות</p>
          <p><strong>המנהל המעצים:</strong> חיבור ומשמעות</p>
          <p><strong>מנהל ההזדמנות:</strong> חזון ותגובה מהירה</p>
        </div>
      </div>

      {/* Page 3: WOCA Summary */}
      <div style={{ width: '794px', margin: '0 auto', padding: '40px', pageBreakAfter: 'always' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>סיכום WOCA</h2>
        <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '20px', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
          <h3 style={{ color: '#059669', fontWeight: 'bold' }}>אזור מוביל: {wocaZoneLabel}</h3>
          <p><strong>ציון כללי:</strong> {wocaScore.toFixed(2)} מתוך 5</p>
          <p><strong>משתתפים:</strong> {wocaParticipantCount}</p>
        </div>
      </div>

      {/* Page 4: WOCA Charts */}
      <div style={{ width: '794px', margin: '0 auto', padding: '40px', pageBreakAfter: 'always' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>תרשימי WOCA</h2>
        
        {/* WOCA Pie Chart */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          {pdfImages['woca-pie'] && (
            <img 
              src={pdfImages['woca-pie']} 
              alt="WOCA Pie Chart" 
              style={{ 
                maxWidth: '90%', 
                height: 'auto',
                border: '1px solid #ccc', 
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }} 
            />
          )}
        </div>
        
        {/* WOCA Bar Chart */}
        <div style={{ textAlign: 'center' }}>
          {pdfImages['woca-bar'] && (
            <img 
              src={pdfImages['woca-bar']} 
              alt="WOCA Bar Chart" 
              style={{ 
                maxWidth: '90%', 
                height: 'auto',
                border: '1px solid #ccc', 
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }} 
            />
          )}
        </div>
      </div>

      {/* Page 5: WOCA Legend */}
      <div style={{ width: '794px', margin: '0 auto', padding: '40px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>מדריך אזורי WOCA</h2>
        <div style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px', marginBottom: '15px', maxWidth: '600px', marginInline: 'auto' }}>
          <h3 style={{ color: '#059669' }}>אזור הזדמנות</h3>
          <p>השפעה גבוהה ועניין גבוה – אידיאלי לפעולה</p>
        </div>
        <div style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px', marginBottom: '15px', maxWidth: '600px', marginInline: 'auto' }}>
          <h3 style={{ color: '#3b82f6' }}>אזור נוחות</h3>
          <p>עניין גבוה אך השפעה נמוכה – צריך לחזק השפעה</p>
        </div>
        <div style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px', marginBottom: '15px', maxWidth: '600px', marginInline: 'auto' }}>
          <h3 style={{ color: '#f59e0b' }}>אזור אדישות</h3>
          <p>השפעה גבוהה אך עניין נמוך – דרוש חיבור רגשי</p>
        </div>
        <div style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px', marginBottom: '15px', maxWidth: '600px', marginInline: 'auto' }}>
          <h3 style={{ color: '#ef4444' }}>אזור מלחמה</h3>
          <p>עניין והשפעה נמוכים – דרושה התערבות משמעותית</p>
        </div>
      </div>
    </div>
  );
};
