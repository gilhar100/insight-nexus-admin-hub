import React from 'react';
import { WocaGroupBarChart } from '@/components/WocaGroupBarChart';
import { ZoneDistributionChart } from '@/components/ZoneDistributionChart';
import { WocaRadarChart } from '@/components/WocaRadarChart';

interface WocaData {
  workshopData: any;
  wocaAnalysis: any;
}

interface WocaPDFLayoutProps {
  wocaData: WocaData;
}

const getZoneDistribution = (wocaAnalysis: any) => {
  if (!wocaAnalysis?.groupZoneCounts) return { opportunity: 0, comfort: 0, apathy: 0, war: 0 };
  return {
    opportunity: wocaAnalysis.groupZoneCounts.opportunity,
    comfort: wocaAnalysis.groupZoneCounts.comfort,
    apathy: wocaAnalysis.groupZoneCounts.apathy,
    war: wocaAnalysis.groupZoneCounts.war
  };
};

const graphWrapperStyle = {
  height: '350px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: '1px solid #e5e5e5',
  backgroundColor: '#fafafa'
} as React.CSSProperties;

export const WocaPDFLayout: React.FC<WocaPDFLayoutProps> = ({ wocaData }) => {
  const zoneDistribution = getZoneDistribution(wocaData.wocaAnalysis);
  const dominantZone = wocaData.wocaAnalysis?.groupDominantZoneByCount || 'לא זוהה';

  return (
    <>
      {/* Basic test content */}
      <div className="bg-white p-8" style={{ width: '210mm', minHeight: '100px', direction: 'rtl', fontSize: '16px' }}>
        <h1 style={{ fontSize: '24px', color: '#7c3aed', marginBottom: '20px' }}>דוח WOCA - סדנה {wocaData.workshopData.workshop_id}</h1>
        <p style={{ marginBottom: '10px' }}>אזור דומיננטי: {
          dominantZone === 'opportunity' ? 'אזור ההזדמנות' :
          dominantZone === 'comfort' ? 'אזור הנוחות' :
          dominantZone === 'apathy' ? 'אזור האדישות' :
          dominantZone === 'war' ? 'אזור המלחמה' : 'לא זוהה'
        }</p>
        <p style={{ marginBottom: '10px' }}>מספר משתתפים: {wocaData.workshopData.participant_count}</p>
        <p style={{ marginBottom: '20px' }}>תאריך: {new Date().toLocaleDateString('he-IL')}</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
          <div style={{ padding: '15px', backgroundColor: '#f0fdf4', border: '1px solid #16a34a', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '18px', color: '#15803d', marginBottom: '10px' }}>אזור ההזדמנות</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>{zoneDistribution.opportunity}</p>
            <p style={{ fontSize: '14px' }}>משתתפים</p>
          </div>
          <div style={{ padding: '15px', backgroundColor: '#eff6ff', border: '1px solid #2563eb', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '18px', color: '#1d4ed8', marginBottom: '10px' }}>אזור הנוחות</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>{zoneDistribution.comfort}</p>
            <p style={{ fontSize: '14px' }}>משתתפים</p>
          </div>
          <div style={{ padding: '15px', backgroundColor: '#f9fafb', border: '1px solid #6b7280', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '18px', color: '#374151', marginBottom: '10px' }}>אזור האדישות</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#6b7280' }}>{zoneDistribution.apathy}</p>
            <p style={{ fontSize: '14px' }}>משתתפים</p>
          </div>
          <div style={{ padding: '15px', backgroundColor: '#fef2f2', border: '1px solid #dc2626', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '18px', color: '#991b1b', marginBottom: '10px' }}>אזור המלחמה</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>{zoneDistribution.war}</p>
            <p style={{ fontSize: '14px' }}>משתתפים</p>
          </div>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '20px', textAlign: 'center', marginBottom: '15px' }}>ציוני אזורים קבוצתיים</h3>
          <div style={graphWrapperStyle}>
            <WocaGroupBarChart groupCategoryScores={wocaData.wocaAnalysis.groupCategoryScores} />
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '20px', textAlign: 'center', marginBottom: '15px' }}>התפלגות משתתפים באזורים</h3>
          <div style={graphWrapperStyle}>
            <ZoneDistributionChart zoneDistribution={zoneDistribution} />
          </div>
        </div>
      </div>
    </>
  );
};