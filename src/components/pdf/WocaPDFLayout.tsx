import React from 'react';
import { WocaCategoryRadarChart } from '@/components/WocaCategoryRadarChart';
import { SalimaDimensionPieChart } from '@/components/SalimaDimensionPieChart';
import { WocaGroupBarChart } from '@/components/WocaGroupBarChart';
import { WorkshopWocaAnalysis } from '@/utils/wocaAnalysis';

interface WocaPDFLayoutProps {
  workshopData: {
    workshop_id: number;
    participant_count: number;
    participants: any[];
    groupCategoryScores: any;
  };
  wocaAnalysis: WorkshopWocaAnalysis;
  zoneDistribution: {
    opportunity: number;
    comfort: number;
    apathy: number;
    war: number;
  };
}

const getZoneDescription = (zone: string): string => {
  switch (zone) {
    case 'war':
      return 'אזור מלחמה - רמת לחץ גבוהה';
    case 'opportunity':
      return 'אזור הזדמנויות - צמיחה אפשרית';
    case 'comfort':
      return 'אזור נוחות - יציבות';
    case 'apathy':
      return 'אזור אדישות - חוסר מעורבות';
    default:
      return zone;
  }
};

const getZoneColor = (zone: string): string => {
  switch (zone) {
    case 'war':
      return '#0072B2';
    case 'opportunity':
      return '#009E73';
    case 'comfort':
      return '#F0E442';
    case 'apathy':
      return '#E69F00';
    default:
      return '#6b7280';
  }
};

const getZoneName = (zone: string): string => {
  switch (zone) {
    case 'war':
      return 'אזור המלחמה';
    case 'opportunity':
      return 'אזור ההזדמנות';
    case 'comfort':
      return 'אזור הנוחות';
    case 'apathy':
      return 'אזור האדישות';
    default:
      return 'לא זוהה';
  }
};

export const WocaPDFLayout: React.FC<WocaPDFLayoutProps> = ({ 
  workshopData, 
  wocaAnalysis, 
  zoneDistribution 
}) => {
  const dominantZone = wocaAnalysis.groupDominantZoneByCount;
  const isTie = wocaAnalysis.groupIsTieByCount;

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
        borderBottom: '2px solid #009E73',
        paddingBottom: '20px'
      }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          color: '#009E73',
          margin: '0 0 10px 0'
        }}>
          תובנות קבוצתיות - ניתוח WOCA
        </h1>
        <h2 style={{ 
          fontSize: '20px', 
          color: '#6b7280',
          margin: '0'
        }}>
          סדנה {workshopData.workshop_id} • {workshopData.participant_count} משתתפים
        </h2>
      </div>

      {/* Dominant Zone Display */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '40px',
        padding: '30px',
        borderRadius: '10px',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ 
          fontSize: '22px', 
          fontWeight: 'bold', 
          marginBottom: '20px',
          color: '#1e40af'
        }}>
          התפלגות לפי אזורי WOCA
        </h3>
        
        {isTie ? (
          <div style={{ 
            display: 'inline-block', 
            padding: '15px 30px', 
            borderRadius: '25px',
            backgroundColor: '#e5e7eb',
            border: '1px solid #9ca3af'
          }}>
            <span style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              color: '#374151'
            }}>
              תיקו בין אזורים
            </span>
          </div>
        ) : dominantZone ? (
          <div style={{ 
            display: 'inline-block', 
            padding: '15px 30px', 
            borderRadius: '25px',
            backgroundColor: getZoneColor(dominantZone),
            border: `2px solid ${getZoneColor(dominantZone)}`
          }}>
            <span style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#ffffff',
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
            }}>
              {getZoneName(dominantZone)}
            </span>
          </div>
        ) : (
          <div style={{ 
            display: 'inline-block', 
            padding: '15px 30px', 
            borderRadius: '25px',
            backgroundColor: '#e5e7eb'
          }}>
            <span style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              color: '#374151'
            }}>
              לא זוהה אזור דומיננטי
            </span>
          </div>
        )}
      </div>

      {/* Charts Section */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr 1fr', 
        gap: '20px',
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
            fontSize: '16px', 
            fontWeight: 'bold', 
            marginBottom: '15px',
            color: '#1e40af'
          }}>
            ניתוח קטגוריות WOCA
          </h4>
          <div style={{ height: '250px', width: '100%' }}>
            <WocaCategoryRadarChart categoryScores={wocaAnalysis.groupCategoryScores} />
          </div>
        </div>

        {/* Pie Chart */}
        <div style={{ 
          padding: '20px',
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          textAlign: 'center'
        }}>
          <h4 style={{ 
            fontSize: '16px', 
            fontWeight: 'bold', 
            marginBottom: '15px',
            color: '#1e40af'
          }}>
            התפלגות אזורים
          </h4>
          <div style={{ height: '250px', width: '100%' }}>
            {/* Custom pie chart for PDF */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
              {Object.entries(zoneDistribution).map(([zone, count]) => {
                const zoneKey = zone as keyof typeof zoneDistribution;
                const zoneName = getZoneName(zoneKey);
                const zoneColor = getZoneColor(zoneKey);
                const percentage = workshopData.participant_count > 0 ? 
                  (count / workshopData.participant_count * 100).toFixed(1) : '0';

                return (
                  <div key={zone} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '8px',
                    fontSize: '14px'
                  }}>
                    <div style={{ 
                      width: '15px', 
                      height: '15px', 
                      backgroundColor: zoneColor,
                      borderRadius: '3px',
                      marginLeft: '8px'
                    }}></div>
                    <span style={{ color: '#374151' }}>
                      {zoneName}: {count} ({percentage}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div style={{ 
          padding: '20px',
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          textAlign: 'center'
        }}>
          <h4 style={{ 
            fontSize: '16px', 
            fontWeight: 'bold', 
            marginBottom: '15px',
            color: '#1e40af'
          }}>
            השוואת אזורים
          </h4>
          <div style={{ height: '250px', width: '100%' }}>
            <WocaGroupBarChart groupCategoryScores={wocaAnalysis.groupCategoryScores} />
          </div>
        </div>
      </div>

      {/* Zone Statistics */}
      <div style={{ 
        marginBottom: '40px',
        padding: '20px',
        backgroundColor: '#f8fafc',
        borderRadius: '10px',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: 'bold', 
          marginBottom: '20px',
          color: '#1e40af'
        }}>
          סטטיסטיקות אזורים
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr 1fr', 
          gap: '15px'
        }}>
          {Object.entries(zoneDistribution).map(([zone, count]) => {
            const zoneKey = zone as keyof typeof zoneDistribution;
            const zoneName = getZoneName(zoneKey);
            const zoneColor = getZoneColor(zoneKey);
            const percentage = workshopData.participant_count > 0 ? 
              (count / workshopData.participant_count * 100).toFixed(1) : '0';

            return (
              <div key={zone} style={{ 
                textAlign: 'center',
                padding: '15px',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                border: `2px solid ${zoneColor}`
              }}>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: 'bold', 
                  color: zoneColor,
                  marginBottom: '5px'
                }}>
                  {zoneName}
                </div>
                <div style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  color: '#1f2937',
                  marginBottom: '2px'
                }}>
                  {count}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#6b7280'
                }}>
                  {percentage}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Opportunity Zone Guide */}
      <div style={{ 
        padding: '25px',
        backgroundColor: '#f0fdf4',
        borderRadius: '10px',
        border: '2px solid #22c55e',
        marginBottom: '30px'
      }}>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: 'bold', 
          color: '#15803d',
          marginBottom: '15px',
          textAlign: 'center'
        }}>
          🎯 אזור ההזדמנות - המפתח לצמיחה
        </h3>
        <p style={{ 
          fontSize: '16px', 
          lineHeight: '1.6',
          color: '#374151',
          textAlign: 'center',
          margin: '0'
        }}>
          כל אלה מאפשרים מעבר משלושת אזורי הקיפאון (נוחות, מלחמה, אדישות) לאזור ההזדמנות – בו מתקיים שינוי טרנספורמטיבי ויצירת ערך אמיתי.
        </p>
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
        דוח נוצר ב-{new Date().toLocaleDateString('he-IL')} • מערכת ניתוח WOCA
      </div>
    </div>
  );
};