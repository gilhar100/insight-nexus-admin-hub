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
const getDimensionInsights = (averages: GroupData['averages']) => {
  const dimensions = [{
    key: 'strategy',
    name: 'אסטרטגיה (S)',
    score: averages.strategy
  }, {
    key: 'authenticity',
    name: 'אותנטיות (A)',
    score: averages.authenticity
  }, {
    key: 'learning',
    name: 'למידה (L)',
    score: averages.learning
  }, {
    key: 'inspiration',
    name: 'השראה (I)',
    score: averages.inspiration
  }, {
    key: 'meaning',
    name: 'משמעות (M)',
    score: averages.meaning
  }, {
    key: 'adaptability',
    name: 'הסתגלות (A2)',
    score: averages.adaptability
  }];
  const strongest = dimensions.reduce((max, dim) => dim.score > max.score ? dim : max);
  const weakest = dimensions.reduce((min, dim) => dim.score < min.score ? dim : min);
  return {
    strongest,
    weakest,
    isSameDimension: strongest.key === weakest.key
  };
};
export const GroupResults: React.FC<GroupResultsProps> = ({
  groupData,
  isPresenterMode
}) => {
  const {
    strongest,
    weakest,
    isSameDimension
  } = getDimensionInsights(groupData.averages);
  return <div className={isPresenterMode ? "presenter-grid" : "grid grid-cols-1 lg:grid-cols-2 gap-8"}>
      {/* Dimension Insights Section */}
      <div className="card" style={{
      gridColumn: isPresenterMode ? "span 2" : undefined
    }}>
        <div className="card-header text-center">
          
        </div>
        <div className="card-content">
          {!isSameDimension ? <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {/* Strongest Dimension */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <h3 className={`font-bold text-green-800 mb-3 ${isPresenterMode ? 'text-2xl' : 'text-xl'}`}>
                  הממד החזק ביותר
                </h3>
                <div className={`font-bold text-green-600 mb-2 ${isPresenterMode ? 'text-4xl' : 'text-3xl'}`}>
                  {strongest.score.toFixed(1)}
                </div>
                <div className={`text-green-700 font-semibold ${isPresenterMode ? 'text-xl' : 'text-lg'}`}>
                  {strongest.name}
                </div>
                <p className={`text-green-600 mt-2 ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                  הממד עם הציון הממוצע הגבוה ביותר בקבוצה
                </p>
              </div>

              {/* Weakest Dimension */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
                <h3 className={`font-bold text-orange-800 mb-3 ${isPresenterMode ? 'text-2xl' : 'text-xl'}`}>
                  ממד לפיתוח
                </h3>
                <div className={`font-bold text-orange-600 mb-2 ${isPresenterMode ? 'text-4xl' : 'text-3xl'}`}>
                  {weakest.score.toFixed(1)}
                </div>
                <div className={`text-orange-700 font-semibold ${isPresenterMode ? 'text-xl' : 'text-lg'}`}>
                  {weakest.name}
                </div>
                <p className={`text-orange-600 mt-2 ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                  הממד הדורש הכי הרבה פיתוח בקבוצה
                </p>
              </div>
            </div> : <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <h3 className={`font-bold text-yellow-800 mb-3 ${isPresenterMode ? 'text-2xl' : 'text-xl'}`}>
                ממד דומיננטי
              </h3>
              <div className={`font-bold text-yellow-600 mb-2 ${isPresenterMode ? 'text-4xl' : 'text-3xl'}`}>
                {strongest.score.toFixed(1)}
              </div>
              <div className={`text-yellow-700 font-semibold ${isPresenterMode ? 'text-xl' : 'text-lg'}`}>
                {strongest.name}
              </div>
              <p className={`text-yellow-600 mt-2 ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                אותו ממד זוהה כחזק ביותר וכדורש פיתוח—כדאי לבחון את התפלגות הציונים
              </p>
            </div>}
        </div>
      </div>

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
            
          </div>
        </div>
      </div>

      {/* Dimension Strength Pie Chart */}
      <div className="card">
        <div className="card-header text-center">
          <div className={`flex items-center justify-center text-right card-title${isPresenterMode ? " text-3xl" : ""}`}>
            
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
      {groupData.participant_count > 5 && <div className="card" style={{
      gridColumn: isPresenterMode ? "span 2" : undefined
    }}>
          <div className="card-header text-center">
            <div className={`flex items-center justify-center text-right card-title${isPresenterMode ? " text-3xl" : ""}`}>
              
              התפלגות טווחי ציונים
            </div>
          </div>
          <div className="card-content">
            <div className="h-[520px] w-full flex items-center justify-center">
              <SalimaScoreDistributionChart participants={groupData.participants} />
            </div>
          </div>
        </div>}
    </div>;
};