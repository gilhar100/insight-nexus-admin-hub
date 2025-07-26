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
  height: '400px',
  width: '100%',
  overflow: 'hidden',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
} as React.CSSProperties;

export const WocaPDFLayout: React.FC<WocaPDFLayoutProps> = ({ wocaData }) => {
  const zoneDistribution = getZoneDistribution(wocaData.wocaAnalysis);
  const dominantZone = wocaData.wocaAnalysis?.groupDominantZoneByCount || 'לא זוהה';

  return (
    <>
      {/* Cover Page */}
      <div className="bg-white p-8 font-sans" style={{ minHeight: '297mm', width: '210mm', direction: 'rtl' }}>
        <div className="text-center mb-12 border-b-2 border-purple-200 pb-6">
          <h1 className="text-4xl font-bold text-purple-800 mb-4">דוח תובנות קבוצתי</h1>
          <h2 className="text-2xl font-semibold text-purple-600 mb-4">ניתוח WOCA - תרבות ארגונית</h2>
          <div className="flex justify-between items-center text-gray-600 text-lg mt-6">
            <div><strong>קבוצה:</strong> סדנה {wocaData.workshopData.workshop_id}</div>
            <div><strong>תאריך:</strong> {new Date().toLocaleDateString('he-IL')}</div>
          </div>
          <div className="text-center mt-4 text-gray-600 text-lg">
            <strong>משתתפים:</strong> {wocaData.workshopData.participant_count}
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-8 mb-8 text-center">
          <h3 className="text-2xl font-semibold text-purple-800 mb-4">האזור הדומיננטי</h3>
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {dominantZone === 'opportunity' && 'אזור ההזדמנות'}
            {dominantZone === 'comfort' && 'אזור הנוחות'}
            {dominantZone === 'apathy' && 'אזור האדישות'}
            {dominantZone === 'war' && 'אזור המלחמה'}
            {dominantZone === 'לא זוהה' && 'לא זוהה אזור דומיננטי'}
          </div>
          <p className="text-purple-500 text-xl">בהתבסס על {wocaData.workshopData.participant_count} משתתפים</p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-green-800 mb-3">אזור ההזדמנות</h3>
            <div className="text-3xl font-bold text-green-600">{zoneDistribution.opportunity}</div>
            <p className="text-green-700 mt-2">משתתפים</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-blue-800 mb-3">אזור הנוחות</h3>
            <div className="text-3xl font-bold text-blue-600">{zoneDistribution.comfort}</div>
            <p className="text-blue-700 mt-2">משתתפים</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">אזור האדישות</h3>
            <div className="text-3xl font-bold text-gray-600">{zoneDistribution.apathy}</div>
            <p className="text-gray-700 mt-2">משתתפים</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-red-800 mb-3">אזור המלחמה</h3>
            <div className="text-3xl font-bold text-red-600">{zoneDistribution.war}</div>
            <p className="text-red-700 mt-2">משתתפים</p>
          </div>
        </div>
      </div>

      {/* Charts Page */}
      <div className="bg-white p-8 font-sans" style={{ pageBreakBefore: 'always', minHeight: '297mm', width: '210mm', direction: 'rtl' }}>
        <div className="space-y-12">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">ציוני אזורים קבוצתיים</h3>
            <div style={graphWrapperStyle}>
              <WocaGroupBarChart groupCategoryScores={wocaData.wocaAnalysis.groupCategoryScores} />
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">התפלגות משתתפים באזורים</h3>
            <div style={graphWrapperStyle}>
              <ZoneDistributionChart zoneDistribution={zoneDistribution} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};