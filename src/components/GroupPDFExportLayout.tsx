
import React from 'react';

interface GroupPDFExportLayoutProps {
  pdfImages: Record<string, string>;
  groupNumber: number;
  participantCount: number;
  salimaScore: number;
  strongestDimension: { name: string; score: number };
  weakestDimension: { name: string; score: number };
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
  return (
    <div 
      className="bg-white text-black font-sans" 
      style={{ 
        width: '297mm', 
        minHeight: '210mm',
        margin: 0,
        padding: 0,
        direction: 'rtl',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      {/* Embedded CSS for print optimization */}
      <style>
        {`
          @page {
            size: A4 landscape;
            margin: 15mm;
          }
          
          @media print {
            body { margin: 0; }
            .page-break { 
              page-break-before: always; 
              break-before: page;
            }
          }
          
          .chart-container {
            max-width: 100%;
            height: auto;
            overflow: hidden;
          }
          
          .chart-container img {
            max-width: 100%;
            height: auto;
            object-fit: contain;
          }
          
          .dimension-item {
            margin-bottom: 12px;
            padding: 8px;
            border-right: 3px solid #2563eb;
            background-color: #f8fafc;
          }
          
          .dimension-title {
            font-weight: bold;
            font-size: 16px;
            color: #1e40af;
            margin-bottom: 4px;
          }
          
          .dimension-description {
            font-size: 14px;
            color: #374151;
            line-height: 1.4;
          }
        `}
      </style>

      {/* Page 1: Group Info and Title */}
      <div className="flex flex-col items-center justify-center" style={{ minHeight: '210mm', padding: '40mm 20mm' }}>
        <h1 
          className="text-center mb-8"
          style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            color: '#1e40af',
            lineHeight: '1.2'
          }}
        >
          דוח תובנות קבוצתי - קבוצה {groupNumber}
        </h1>
        <h2 
          className="text-center"
          style={{ 
            fontSize: '32px', 
            fontWeight: '600', 
            color: '#374151'
          }}
        >
          שאלון מנהיגות
        </h2>
      </div>

      {/* Page 2: SALIMA Visualizations */}
      <div className="page-break" style={{ minHeight: '210mm', padding: '20mm' }}>
        <h2 
          className="text-center mb-8"
          style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: '#1e40af'
          }}
        >
          ממדי SALIMA ותובנות מנהיגות
        </h2>
        
        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          {/* Radar Chart */}
          <div className="chart-container">
            {pdfImages['radar-chart'] && (
              <img 
                src={pdfImages['radar-chart']} 
                alt="SALIMA Radar Chart"
                style={{ width: '100%', height: 'auto' }}
              />
            )}
          </div>
          
          {/* Archetype Chart */}
          <div className="chart-container">
            <h3 className="text-center mb-4" style={{ fontSize: '20px', fontWeight: 'bold' }}>
              סגנון מנהיגות
            </h3>
            {pdfImages['archetype-chart'] && (
              <img 
                src={pdfImages['archetype-chart']} 
                alt="Leadership Archetype Chart"
                style={{ width: '100%', height: 'auto' }}
              />
            )}
          </div>
        </div>

        {/* SALIMA Dimensions Text */}
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column: SALIMA Dimensions */}
          <div>
            <h3 className="mb-6" style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e40af' }}>
              🧭 ממדי SALIMA
            </h3>
            
            <div className="dimension-item">
              <div className="dimension-title">אסטרטגיה (S)</div>
              <div className="dimension-description">ראייה מערכתית, תכנון לטווח ארוך ויכולת להוביל חזון.</div>
            </div>
            
            <div className="dimension-item">
              <div className="dimension-title">אדפטיביות (A)</div>
              <div className="dimension-description">גמישות מחשבתית ורגשית ותגובה יעילה למצבים משתנים.</div>
            </div>
            
            <div className="dimension-item">
              <div className="dimension-title">למידה (L)</div>
              <div className="dimension-description">פתיחות לרעיונות חדשים, חשיבה ביקורתית ולמידה מתמשכת.</div>
            </div>
            
            <div className="dimension-item">
              <div className="dimension-title">השראה (I)</div>
              <div className="dimension-description">הנעה רגשית דרך דוגמה אישית וחזון שמעורר משמעות.</div>
            </div>
            
            <div className="dimension-item">
              <div className="dimension-title">משמעות (M)</div>
              <div className="dimension-description">חיבור עמוק לערכים, תכלית ותחושת שליחות אישית וארגונית.</div>
            </div>
            
            <div className="dimension-item">
              <div className="dimension-title">אותנטיות (A2)</div>
              <div className="dimension-description">כנות, שקיפות והתנהלות אנושית המחוברת לערכים פנימיים.</div>
            </div>
          </div>

          {/* Right Column: Leadership Styles */}
          <div>
            <h3 className="mb-6" style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e40af' }}>
              סגנונות מנהיגות
            </h3>
            
            <div className="dimension-item">
              <div className="dimension-title">מנהל ההזדמנות (S + A)</div>
              <div className="dimension-description">רואה רחוק ופועל בגמישות. מוביל שינוי תוך הסתגלות מהירה והבנת ההקשר.</div>
            </div>
            
            <div className="dimension-item">
              <div className="dimension-title">המנהל הסקרן (L + I)</div>
              <div className="dimension-description">לומד כל הזמן, מלהיב אחרים וסוחף דרך רעיונות ודוגמה אישית.</div>
            </div>
            
            <div className="dimension-item">
              <div className="dimension-title">המנהל המעצים (M + A2)</div>
              <div className="dimension-description">מוביל מתוך ערכים, יוצר חיבור אישי ותחושת משמעות בעבודה המשותפת.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Page 3: WOCA Visualizations */}
      <div className="page-break" style={{ minHeight: '210mm', padding: '20mm' }}>
        <h2 
          className="text-center mb-8"
          style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: '#1e40af'
          }}
        >
          שאלון תודעה ארגונית
        </h2>
        
        {/* Big Zone Label */}
        <div 
          className="text-center mb-8 p-6 rounded-lg"
          style={{ 
            fontSize: '36px', 
            fontWeight: 'bold', 
            backgroundColor: '#ecfdf5',
            color: '#065f46',
            border: '3px solid #10b981'
          }}
        >
          {wocaZoneLabel}
        </div>

        {/* WOCA Charts Row */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          {/* WOCA Bar Chart */}
          <div className="chart-container">
            {pdfImages['woca-bar'] && (
              <img 
                src={pdfImages['woca-bar']} 
                alt="WOCA Bar Chart"
                style={{ width: '100%', height: 'auto' }}
              />
            )}
          </div>
          
          {/* WOCA Pie Chart */}
          <div className="chart-container">
            {pdfImages['woca-pie'] && (
              <img 
                src={pdfImages['woca-pie']} 
                alt="WOCA Zone Distribution"
                style={{ width: '100%', height: 'auto' }}
              />
            )}
          </div>
        </div>

        {/* WOCA Zones Description */}
        <div>
          <h3 className="mb-6" style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e40af' }}>
            אזורי WOCA
          </h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="dimension-item" style={{ borderRightColor: '#10b981' }}>
              <div className="dimension-title" style={{ color: '#065f46' }}>אזור ההזדמנות (WIN/WIN)</div>
              <div className="dimension-description">שיח פתוח, הקשבה ויוזמה. תחושת שליחות, השפעה, שיתוף פעולה וצמיחה משותפת.</div>
            </div>
            
            <div className="dimension-item" style={{ borderRightColor: '#3b82f6' }}>
              <div className="dimension-title" style={{ color: '#1e40af' }}>אזור הנוחות (LOSE/LOSE)</div>
              <div className="dimension-description">הימנעות מקונפליקטים, קיפאון מחשבתי וחשש מיוזמות. שמירה על הקיים במחיר שחיקה.</div>
            </div>
            
            <div className="dimension-item" style={{ borderRightColor: '#6b7280' }}>
              <div className="dimension-title" style={{ color: '#374151' }}>אזור האדישות (LOSE/LOSE)</div>
              <div className="dimension-description">נתק רגשי, חוסר עניין וחוסר תחושת השפעה. תחושת סטגנציה ויעדר מנהיגות.</div>
            </div>
            
            <div className="dimension-item" style={{ borderRightColor: '#ef4444' }}>
              <div className="dimension-title" style={{ color: '#dc2626' }}>אזור המלחמה (WIN/LOSE)</div>
              <div className="dimension-description">דינמיקה של שליטה, חשדנות ומאבק. הישרדות טקטית על חשבון הקשבה, אמון ויציבות.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
