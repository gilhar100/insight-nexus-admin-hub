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
  }>;
}

interface SalimaPDFLayoutProps {
  groupData: GroupData;
}

const getDimensionInsights = (averages: GroupData['averages']) => {
  const dimensions = [
    { key: 'strategy', name: 'אסטרטגיה (S)', score: averages.strategy },
    { key: 'authenticity', name: 'אותנטיות (A2)', score: averages.authenticity },
    { key: 'learning', name: 'למידה (L)', score: averages.learning },
    { key: 'inspiration', name: 'השראה (I)', score: averages.inspiration },
    { key: 'meaning', name: 'משמעות (M)', score: averages.meaning },
    { key: 'adaptability', name: 'אדפטיביות (A)', score: averages.adaptability }
  ];
  const strongest = dimensions.reduce((max, dim) => dim.score > max.score ? dim : max);
  const weakest = dimensions.reduce((min, dim) => dim.score < min.score ? dim : min);
  return { strongest, weakest };
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

export const SalimaPDFLayout: React.FC<SalimaPDFLayoutProps> = ({ groupData }) => {
  const dimensionInsights = getDimensionInsights(groupData.averages);

  return (
    <>
      {/* Basic test content */}
      <div className="bg-white p-8" style={{ width: '210mm', minHeight: '100px', direction: 'rtl', fontSize: '16px' }}>
        <h1 style={{ fontSize: '24px', color: '#1e40af', marginBottom: '20px' }}>דוח SALIMA - קבוצה {groupData.group_number}</h1>
        <p style={{ marginBottom: '10px' }}>ציון כללי: {groupData.averages.overall.toFixed(2)}</p>
        <p style={{ marginBottom: '10px' }}>מספר משתתפים: {groupData.participant_count}</p>
        <p style={{ marginBottom: '20px' }}>תאריך: {new Date().toLocaleDateString('he-IL')}</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
          <div style={{ padding: '15px', backgroundColor: '#f0f9ff', border: '1px solid #0ea5e9', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '18px', color: '#0369a1', marginBottom: '10px' }}>ממד חזק</h3>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#0ea5e9' }}>{dimensionInsights.strongest.name}</p>
            <p style={{ fontSize: '16px' }}>{dimensionInsights.strongest.score.toFixed(1)}</p>
          </div>
          <div style={{ padding: '15px', backgroundColor: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '18px', color: '#92400e', marginBottom: '10px' }}>ממד לפיתוח</h3>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b' }}>{dimensionInsights.weakest.name}</p>
            <p style={{ fontSize: '16px' }}>{dimensionInsights.weakest.score.toFixed(1)}</p>
          </div>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '20px', textAlign: 'center', marginBottom: '15px' }}>פרופיל קבוצתי</h3>
          <div style={graphWrapperStyle}>
            <SalimaGroupRadarChart averages={groupData.averages} />
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '20px', textAlign: 'center', marginBottom: '15px' }}>סגנונות ניהול</h3>
          <div style={graphWrapperStyle}>
            <ArchetypeDistributionChart groupNumber={groupData.group_number} isPresenterMode={true} />
          </div>
        </div>
      </div>
    </>
  );
};