import React from 'react';
import { SalimaGroupRadarChart } from '@/components/SalimaGroupRadarChart';
import { ArchetypeDistributionChart } from '@/components/ArchetypeDistributionChart';

interface GroupData {
  group_number: number;
  participant_count: number;
  averages: {
    strategy: number;
    learning: number;
    inspiration: number;
    meaning: number;
    authenticity: number;
    adaptability: number;
    overall: number;
  };
  participants: Array<{
    dimension_s: number;
    dimension_l: number;
    dimension_i: number;
    dimension_m: number;
    dimension_a: number;
    dimension_a2: number;
    dominant_archetype?: string;
  }>;
}

interface SalimaPDFLayoutProps {
  groupData: GroupData;
}

const getDimensionInsights = (averages: GroupData['averages']) => {
  const dimensions = [
    { key: 'strategy', name: 'אסטרטגיה', score: averages.strategy },
    { key: 'adaptability', name: 'אדפטיביות', score: averages.adaptability },
    { key: 'learning', name: 'למידה', score: averages.learning },
    { key: 'inspiration', name: 'השראה', score: averages.inspiration },
    { key: 'meaning', name: 'משמעות', score: averages.meaning },
    { key: 'authenticity', name: 'אותנטיות', score: averages.authenticity }
  ];

  const strongest = dimensions.reduce((max, dim) => dim.score > max.score ? dim : max);
  const weakest = dimensions.reduce((min, dim) => dim.score < min.score ? dim : min);

  return {
    strongest,
    weakest,
    isSameDimension: strongest.key === weakest.key
  };
};

const getDimensionExplanation = (dimensionKey: string): string => {
  const explanations = {
    strategy: "יכולת לחשב מהלכים, לנתח מידע מורכב ולקבל החלטות אסטרטגיות גם בתנאי אי וודאות. ממד זה עוסק בחשיבה ביקורתית, ראייה מערכתית ויכולת תכנון ארוך טווח.",
    adaptability: "גמישות מחשבתית והתנהגותית, פתיחות לשינוי ויכולת התאמה מהירה למצבים חדשים. ממד זה כולל חוסן נפשי, יכולת למידה מכשלונות והסתגלות לאתגרים.",
    learning: "סקרנות אינטלקטואלית, תיאבון למידה והתפתחות מתמדת. ממד זה עוסק ביכולת לשלב ידע חדש, בפתיחות לביקורת ובחיפוש אחר הזדמנויות צמיחה.",
    inspiration: "יכולת לעורר ולהניע אחרים, להעביר חזון ולהוביל שינוי חיובי. ממד זה כולל כריזמה, יכולת השפעה ומיומנות בבניית קשרים משמעותיים.",
    meaning: "חיבור למטרה גבוהה, תחושת משמעות בעבודה ויכולת ליצור ערך לאחרים. ממד זה עוסק בבהירות ערכית, בהבנת התרומה האישית ובהשפעה החיובית על הסביבה.",
    authenticity: "שקיפות, יושרה ויכולת להביא את עצמך באופן כן ומדויק גם במצבי לחץ. ממד זה עוסק בכנות, אמפתיה, ובחיבור בין העולם הפנימי שלך להתנהלותך המקצועית."
  };
  return explanations[dimensionKey as keyof typeof explanations] || "";
};

export const SalimaPDFLayout: React.FC<SalimaPDFLayoutProps> = ({ groupData }) => {
  if (!groupData || !groupData.participants || groupData.participants.length === 0) {
    return null;
  }

  const dimensionInsights = getDimensionInsights(groupData.averages);
  const { strongest, weakest, isSameDimension } = dimensionInsights;

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      padding: '20px', 
      backgroundColor: '#ffffff',
      color: '#000000',
      direction: 'rtl'
    }}>
      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        borderBottom: '2px solid #2563eb',
        paddingBottom: '20px'
      }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          color: '#2563eb',
          margin: '0 0 10px 0'
        }}>
          תובנות קבוצתיות - שאלון מנהיגות SALIMA
        </h1>
        <h2 style={{ 
          fontSize: '20px', 
          color: '#6b7280',
          margin: '0'
        }}>
          קבוצה {groupData.group_number} • {groupData.participant_count} משתתפים
        </h2>
      </div>

      {/* Overall Score */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '40px',
        padding: '30px',
        backgroundColor: '#f8fafc',
        borderRadius: '10px',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ 
          fontSize: '22px', 
          fontWeight: 'bold', 
          color: '#1e40af',
          margin: '0 0 15px 0'
        }}>
          ציון מנהיגות קבוצתי
        </h3>
        <div style={{ 
          fontSize: '48px', 
          fontWeight: 'bold', 
          color: '#2563eb',
          margin: '0 0 10px 0'
        }}>
          {groupData.averages.overall.toFixed(2)}
        </div>
        <p style={{ 
          fontSize: '16px', 
          color: '#6b7280',
          margin: '0'
        }}>
          ממוצע ציוני SLQ של {groupData.participant_count} משתתפים
        </p>
      </div>

      {/* Dimension Insights */}
      {!isSameDimension && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            marginBottom: '20px',
            color: '#1e40af'
          }}>
            תובנות מרכזיות
          </h3>
          
          {/* Strongest Dimension */}
          <div style={{ 
            marginBottom: '25px',
            padding: '20px',
            backgroundColor: '#f0f9ff',
            borderRadius: '8px',
            border: '1px solid #0ea5e9'
          }}>
            <h4 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              color: '#0369a1',
              margin: '0 0 10px 0'
            }}>
              💪 הממד החזק ביותר: {strongest.name} ({strongest.score.toFixed(2)})
            </h4>
            <p style={{ 
              fontSize: '14px', 
              lineHeight: '1.6',
              color: '#374151',
              margin: '0'
            }}>
              {getDimensionExplanation(strongest.key)}
            </p>
          </div>

          {/* Weakest Dimension */}
          <div style={{ 
            padding: '20px',
            backgroundColor: '#fef3c7',
            borderRadius: '8px',
            border: '1px solid #f59e0b'
          }}>
            <h4 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              color: '#92400e',
              margin: '0 0 10px 0'
            }}>
              🎯 אזור לפיתוח: {weakest.name} ({weakest.score.toFixed(2)})
            </h4>
            <p style={{ 
              fontSize: '14px', 
              lineHeight: '1.6',
              color: '#374151',
              margin: '0'
            }}>
              {getDimensionExplanation(weakest.key)}
            </p>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '30px',
        marginBottom: '40px'
      }}>
        {/* Radar Chart */}
        <div style={{ 
          padding: '20px',
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          textAlign: 'center'
        }}>
          <h4 style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            marginBottom: '20px',
            color: '#1e40af'
          }}>
            פרופיל קבוצתי ייחודי
          </h4>
          <div style={{ height: '300px', width: '100%' }}>
            <SalimaGroupRadarChart averages={groupData.averages} />
          </div>
        </div>

        {/* Archetype Distribution */}
        <div style={{ 
          padding: '20px',
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          textAlign: 'center'
        }}>
          <h4 style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            marginBottom: '20px',
            color: '#1e40af'
          }}>
            התפלגות ארכיטיפים
          </h4>
          <div style={{ height: '300px', width: '100%' }}>
            <ArchetypeDistributionChart groupNumber={groupData.group_number} isPresenterMode={false} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '40px',
        paddingTop: '20px',
        borderTop: '1px solid #e2e8f0',
        color: '#6b7280',
        fontSize: '12px'
      }}>
        דוח נוצר ב-{new Date().toLocaleDateString('he-IL')} • מערכת תובנות SALIMA
      </div>
    </div>
  );
};