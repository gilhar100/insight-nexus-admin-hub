
import React from 'react';
import { SalimaDimensionPieChart } from '@/components/SalimaDimensionPieChart';
import { SalimaScoreDistributionChart } from '@/components/SalimaScoreDistributionChart';

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

interface GroupResultsProps {
  groupData: GroupData;
  isPresenterMode: boolean;
}

export const GroupResults: React.FC<GroupResultsProps> = ({ groupData, isPresenterMode }) => {
  return (
    <div className={isPresenterMode ? "presenter-grid" : "grid grid-cols-1 lg:grid-cols-2 gap-8"}>
      {/* Group Overall Score Summary */}
      <div className="card">
        <div className="card-header text-center">
          <div className={`flex items-center justify-between text-right card-title${isPresenterMode ? ' flex-col gap-4' : ''}`}>
            <span className={`font-bold${isPresenterMode ? ' text-4xl' : ' text-2xl'}`}>
              קבוצה {groupData.group_number} - ציונים ממוצעים במודל SALIMA
            </span>
            <span className={`bg-green-100 text-green-800 rounded badge${isPresenterMode ? ' text-2xl px-8 py-4' : ''}`}>
              {groupData.participant_count} משתתפים
            </span>
          </div>
        </div>
        <div className="card-content">
          <div className={`score-display`}>
            <div className={`font-bold text-green-600 mb-4 score-number`}>
              {groupData.averages.overall.toFixed(1)}
            </div>
            <div className={`text-gray-600 font-semibold score-label`}>
              ציון SLQ ממוצע
            </div>
            <div className={`mt-6 text-gray-500 score-description`}>
              ממוצע קבוצתי בכל שישת ממדי SALIMA
            </div>
          </div>
        </div>
      </div>

      {/* Dimension Strength Pie Chart */}
      <div className="card">
        <div className="card-header text-center">
          <div className={`flex items-center justify-center text-right card-title${isPresenterMode ? " text-3xl" : ""}`}>
            <span className={`ml-3`}><svg className={isPresenterMode ? "h-10 w-10" : "h-6 w-6"} style={{display: "inline-block"}} viewBox="0 0 24 24"><path fill="currentColor" d="M5 10c-1.656 0-3 1.343-3 3 0 1.656 1.344 3 3 3h2v-6H5zm2 9V8c0-1.104.896-2 2-2h6v2H9v11H7zm8-2h2c1.657 0 3-1.344 3-3 0-1.657-1.343-3-3-3v6z"/></svg></span>
            התפלגות חוזקות הממדים
          </div>
        </div>
        <div className="card-content">
          <div className="h-[520px] w-full flex items-center justify-center">
            <SalimaDimensionPieChart participants={groupData.participants} />
          </div>
        </div>
      </div>

      {/* Score Distribution Chart - Full Width */}
      {groupData.participant_count > 5 && (
        <div className="card" style={{gridColumn: isPresenterMode ? "span 2" : undefined}}>
          <div className="card-header text-center">
            <div className={`flex items-center justify-center text-right card-title${isPresenterMode ? " text-3xl" : ""}`}>
              <span className="ml-3"><svg className={isPresenterMode ? "h-10 w-10" : "h-6 w-6"} style={{display: "inline-block"}} viewBox="0 0 24 24"><path fill="currentColor" d="M5 10c-1.656 0-3 1.343-3 3 0 1.656 1.344 3 3 3h2v-6H5zm2 9V8c0-1.104.896-2 2-2h6v2H9v11H7zm8-2h2c1.657 0 3-1.344 3-3 0-1.657-1.343-3-3-3v6z"/></svg></span>
              התפלגות טווחי ציונים
            </div>
          </div>
          <div className="card-content">
            <div className="h-[520px] w-full flex items-center justify-center">
              <SalimaScoreDistributionChart participants={groupData.participants} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
