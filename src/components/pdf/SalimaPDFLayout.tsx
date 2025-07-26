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
  height: '400px',
  width: '100%',
  overflow: 'hidden',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
} as React.CSSProperties;

export const SalimaPDFLayout: React.FC<SalimaPDFLayoutProps> = ({ groupData }) => {
  const dimensionInsights = getDimensionInsights(groupData.averages);

  return (
    <>
      {/* Cover Page */}
      <div className="bg-white p-8 font-sans" style={{ minHeight: '297mm', width: '210mm', direction: 'rtl' }}>
        <div className="text-center mb-12 border-b-2 border-blue-200 pb-6">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">דוח תובנות קבוצתי</h1>
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">ניתוח SALIMA - מנהיגות אישית</h2>
          <div className="flex justify-between items-center text-gray-600 text-lg mt-6">
            <div><strong>קבוצה:</strong> {groupData.group_number}</div>
            <div><strong>תאריך:</strong> {new Date().toLocaleDateString('he-IL')}</div>
          </div>
          <div className="text-center mt-4 text-gray-600 text-lg">
            <strong>משתתפים:</strong> {groupData.participant_count}
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-8 mb-8 text-center">
          <h3 className="text-2xl font-semibold text-blue-800 mb-4">ציון מנהיגות קבוצתי</h3>
          <div className="text-5xl font-bold text-blue-600 mb-2">{groupData.averages.overall.toFixed(2)}</div>
          <p className="text-blue-500 text-xl">ממוצע ציוני SLQ של {groupData.participant_count} משתתפים</p>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-green-800 mb-3">הממד החזק ביותר</h3>
            <div className="text-3xl font-bold text-green-600 mb-2">{dimensionInsights.strongest.score.toFixed(1)}</div>
            <div className="text-green-700 font-semibold text-lg">{dimensionInsights.strongest.name}</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-orange-800 mb-3">ממד לפיתוח</h3>
            <div className="text-3xl font-bold text-orange-600 mb-2">{dimensionInsights.weakest.score.toFixed(1)}</div>
            <div className="text-orange-700 font-semibold text-lg">{dimensionInsights.weakest.name}</div>
          </div>
        </div>
      </div>

      {/* Charts Page */}
      <div className="bg-white p-8 font-sans" style={{ pageBreakBefore: 'always', minHeight: '297mm', width: '210mm', direction: 'rtl' }}>
        <div className="space-y-12">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">פרופיל קבוצתי ייחודי</h3>
            <div style={graphWrapperStyle}>
              <SalimaGroupRadarChart averages={groupData.averages} />
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">מקרא סגנונות ניהול</h3>
            <div style={graphWrapperStyle}>
              <ArchetypeDistributionChart groupNumber={groupData.group_number} isPresenterMode={true} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};