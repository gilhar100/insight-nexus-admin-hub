import React from 'react';
import { SalimaGroupRadarChart } from '@/components/SalimaGroupRadarChart';
import { ArchetypeDistributionChart } from '@/components/ArchetypeDistributionChart';
import { WocaGroupBarChart } from '@/components/WocaGroupBarChart';
import { ZoneDistributionChart } from '@/components/ZoneDistributionChart';

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

interface WocaData {
  workshopData: any;
  wocaAnalysis: any;
}

interface CombinedPDFLayoutProps {
  groupId: number;
  salimaData: GroupData;
  wocaData: WocaData;
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
  height: '300px',
  width: '100%',
  overflow: 'hidden',
  breakInside: 'avoid',
  pageBreakInside: 'avoid',
  WebkitColumnBreakInside: 'avoid',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

export const CombinedPDFLayout: React.FC<CombinedPDFLayoutProps> = ({
  groupId,
  salimaData,
  wocaData
}) => {
  const dimensionInsights = getDimensionInsights(salimaData.averages);
  const zoneDistribution = getZoneDistribution(wocaData.wocaAnalysis);
  const dominantZone = wocaData.wocaAnalysis?.groupDominantZoneByCount || 'לא זוהה';

  return (
    <>
      {/* Cover Page */}
      <div className="bg-white p-6 font-sans" style={{ minHeight: '210mm', width: '297mm', direction: 'rtl' }}>
        <div className="text-center mb-8 border-b-2 border-blue-200 pb-4">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">דוח תובנות קבוצתי</h1>
          <h2 className="text-xl font-semibold text-blue-600 mb-3">ניתוח SALIMA & WOCA</h2>
          <div className="flex justify-between items-center text-gray-600 text-sm">
            <div><strong>קבוצה:</strong> סדנה {groupId}</div>
            <div><strong>תאריך:</strong> {new Date().toLocaleDateString('he-IL')}</div>
          </div>
          <div className="text-center mt-2 text-gray-600 text-sm">
            <strong>משתתפים:</strong> SALIMA: {salimaData.participant_count} | WOCA: {wocaData.workshopData.participant_count}
          </div>
        </div>
      </div>

      {/* SALIMA Summary */}
      <div style={{ pageBreakBefore: 'always' }} className="bg-white p-6 font-sans" style={{ minHeight: '210mm', width: '297mm', direction: 'rtl' }}>
        <h2 className="text-xl font-bold text-blue-800 mb-4 border-r-4 border-blue-500 pr-3">ניתוח SALIMA - מנהיגות אישית</h2>
        <div className="bg-blue-50 rounded-lg p-4 mb-4 text-center">
          <h3 className="text-lg font-semibold text-blue-800 mb-1">ציון מנהיגות קבוצתי</h3>
          <div className="text-3xl font-bold text-blue-600">{salimaData.averages.overall.toFixed(2)}</div>
          <p className="text-blue-500 mt-1 text-sm">ממוצע ציוני SLQ של {salimaData.participant_count} משתתפים</p>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-base font-bold text-green-800 mb-1">הממד החזק ביותר</h3>
            <div className="text-xl font-bold text-green-600 mb-1">{dimensionInsights.strongest.score.toFixed(1)}</div>
            <div className="text-green-700 font-semibold text-sm">{dimensionInsights.strongest.name}</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h3 className="text-base font-bold text-orange-800 mb-1">ממד לפיתוח</h3>
            <div className="text-xl font-bold text-orange-600 mb-1">{dimensionInsights.weakest.score.toFixed(1)}</div>
            <div className="text-orange-700 font-semibold text-sm">{dimensionInsights.weakest.name}</div>
          </div>
        </div>
      </div>

      {/* SALIMA Charts */}
      <div style={{ pageBreakBefore: 'always' }} className="bg-white p-6 font-sans" style={{ minHeight: '210mm', width: '297mm', direction: 'rtl' }}>
        <div className="space-y-12">
          <div className="text-center">
            <h3 className="text-base font-semibold text-gray-800 mb-2">פרופיל קבוצתי ייחודי</h3>
            <div style={graphWrapperStyle}>
              <SalimaGroupRadarChart averages={salimaData.averages} />
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-base font-semibold text-gray-800 mb-2">חלוקת ארכיטיפים</h3>
            <div style={graphWrapperStyle}>
              <ArchetypeDistributionChart groupNumber={salimaData.group_number} isPresenterMode={false} />
            </div>
          </div>
        </div>
      </div>

      {/* WOCA Summary */}
      <div style={{ pageBreakBefore: 'always' }} className="bg-white p-6 font-sans" style={{ minHeight: '210mm', width: '297mm', direction: 'rtl' }}>
        <h2 className="text-xl font-bold text-purple-800 mb-4 border-r-4 border-purple-500 pr-3">ניתוח WOCA - תרבות ארגונית</h2>
        <div className="bg-purple-50 rounded-lg p-4 mb-4 text-center">
          <h3 className="text-lg font-semibold text-purple-800 mb-1">האזור הדומיננטי</h3>
          <div className="text-xl font-bold text-purple-600">
            {dominantZone === 'opportunity' && 'אזור ההזדמנות'}
            {dominantZone === 'comfort' && 'אזור הנוחות'}
            {dominantZone === 'apathy' && 'אזור האדישות'}
            {dominantZone === 'war' && 'אזור המלחמה'}
            {dominantZone === 'לא זוהה' && 'לא זוהה אזור דומיננטי'}
          </div>
          <p className="text-purple-500 mt-1 text-sm">בהתבסס על {wocaData.workshopData.participant_count} משתתפים</p>
        </div>
      </div>

      {/* WOCA Charts */}
      <div style={{ pageBreakBefore: 'always' }} className="bg-white p-6 font-sans" style={{ minHeight: '210mm', width: '297mm', direction: 'rtl' }}>
        <div className="space-y-12">
          <div className="text-center">
            <h3 className="text-base font-semibold text-gray-800 mb-2">ציוני אזורים קבוצתיים</h3>
            <div style={graphWrapperStyle}>
              <WocaGroupBarChart groupCategoryScores={wocaData.wocaAnalysis.groupCategoryScores} />
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-base font-semibold text-gray-800 mb-2">התפלגות משתתפים באזורים</h3>
            <div style={graphWrapperStyle}>
              <ZoneDistributionChart zoneDistribution={zoneDistribution} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};