
import React from 'react';
import { EnhancedRespondentData } from '@/hooks/useEnhancedRespondentData';
import { DataSourceType } from '@/components/DataSourceToggle';

interface IndividualSalimaPDFLayoutProps {
  respondentData: EnhancedRespondentData;
  activeDataSource: DataSourceType;
}

export const IndividualSalimaPDFLayout: React.FC<IndividualSalimaPDFLayoutProps> = ({
  respondentData,
  activeDataSource
}) => {
  const getCurrentDimensions = () => {
    switch (activeDataSource) {
      case 'colleague':
        return respondentData.colleagueReport || respondentData.selfReport;
      case 'combined':
        return respondentData.combinedReport || respondentData.selfReport;
      default:
        return respondentData.selfReport;
    }
  };

  const getDataSourceLabel = () => {
    switch (activeDataSource) {
      case 'colleague':
        return 'דוח קולגות';
      case 'combined':
        return 'דוח משולב';
      default:
        return 'דוח עצמי';
    }
  };

  const parseInsightText = (insightText: string | null | undefined) => {
    if (!insightText) return { preserve: '', improve: '' };
    
    const lines = insightText.split('\n').filter(line => line.trim());
    
    if (lines.length >= 2) {
      return {
        preserve: lines[0].trim(),
        improve: lines[1].trim()
      };
    }
    
    return {
      preserve: lines[0] || '',
      improve: ''
    };
  };

  const currentDimensions = getCurrentDimensions();
  const radarChartData = [
    { dimension: 'אסטרטגיה', score: currentDimensions.strategy },
    { dimension: 'אדפטיביות', score: currentDimensions.adaptability },
    { dimension: 'למידה', score: currentDimensions.learning },
    { dimension: 'השראה', score: currentDimensions.inspiration },
    { dimension: 'משמעות', score: currentDimensions.meaning },
    { dimension: 'אותנטיות', score: currentDimensions.authenticity }
  ];

  return (
    <div className="pdf-container bg-white p-8 font-sans" dir="rtl" style={{ 
      width: '210mm', 
      minHeight: '297mm',
      fontSize: '12px',
      lineHeight: '1.4'
    }}>
      {/* Header */}
      <div className="text-center mb-8 pb-4 border-b-2 border-gray-300">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          דוח תובנות אישי - SALIMA
        </h1>
        <h2 className="text-lg text-gray-700">
          {respondentData.name} - {getDataSourceLabel()}
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          תאריך הפקה: {new Date().toLocaleDateString('he-IL')}
        </p>
      </div>

      {/* Overall Score */}
      <div className="mb-8 p-4 bg-blue-50 rounded-lg border">
        <h3 className="text-lg font-semibold text-blue-800 mb-2 text-center">
          ציון SALIMA כללי (SLQ)
        </h3>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {currentDimensions.overall.toFixed(1)}
          </div>
          <div className="text-gray-600">מתוך 5.0</div>
        </div>
      </div>

      {/* Dimensions Scores */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          ציוני הממדים
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {radarChartData.map((dimension, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded border">
              <div className="flex justify-between items-center">
                <span className="font-medium">{dimension.dimension}</span>
                <span className="text-lg font-bold text-blue-600">
                  {dimension.score.toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths and Development Areas */}
      <div className="mb-8">
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-3 text-center">
              ממדים בעלי הציון הגבוה ביותר
            </h4>
            <ul className="space-y-2">
              {radarChartData
                .sort((a, b) => b.score - a.score)
                .slice(0, 3)
                .map((dim, idx) => (
                  <li key={idx} className="font-medium text-green-700">
                    • {dim.dimension}: {dim.score.toFixed(1)}/5.0
                  </li>
                ))}
            </ul>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <h4 className="font-semibold text-amber-800 mb-3 text-center">
              תחומים לפיתוח
            </h4>
            <ul className="space-y-2">
              {radarChartData
                .sort((a, b) => a.score - b.score)
                .slice(0, 3)
                .map((dim, idx) => (
                  <li key={idx} className="font-medium text-amber-700">
                    • {dim.dimension}: {dim.score.toFixed(1)}/5.0
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Detailed Insights */}
      {respondentData.rawData && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            תובנות מפורטות
          </h3>

          {/* Strategy Insights */}
          {respondentData.rawData.insight_strategy && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-3">תובנות אסטרטגיה</h4>
              <div className="space-y-3">
                {(() => {
                  const parsed = parseInsightText(respondentData.rawData.insight_strategy);
                  return (
                    <>
                      {parsed.preserve && (
                        <div>
                          <h5 className="font-medium text-green-700 mb-1">שימור</h5>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {parsed.preserve}
                          </p>
                        </div>
                      )}
                      {parsed.improve && (
                        <div>
                          <h5 className="font-medium text-orange-700 mb-1">שיפור</h5>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {parsed.improve}
                          </p>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Adaptability Insights */}
          {respondentData.rawData.insight_adaptive && (
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-800 mb-3">תובנות אדפטיביות</h4>
              <div className="space-y-3">
                {(() => {
                  const parsed = parseInsightText(respondentData.rawData.insight_adaptive);
                  return (
                    <>
                      {parsed.preserve && (
                        <div>
                          <h5 className="font-medium text-green-700 mb-1">שימור</h5>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {parsed.preserve}
                          </p>
                        </div>
                      )}
                      {parsed.improve && (
                        <div>
                          <h5 className="font-medium text-orange-700 mb-1">שיפור</h5>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {parsed.improve}
                          </p>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Learning Insights */}
          {respondentData.rawData.insight_learning && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-3">תובנות למידה</h4>
              <div className="space-y-3">
                {(() => {
                  const parsed = parseInsightText(respondentData.rawData.insight_learning);
                  return (
                    <>
                      {parsed.preserve && (
                        <div>
                          <h5 className="font-medium text-green-700 mb-1">שימור</h5>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {parsed.preserve}
                          </p>
                        </div>
                      )}
                      {parsed.improve && (
                        <div>
                          <h5 className="font-medium text-orange-700 mb-1">שיפור</h5>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {parsed.improve}
                          </p>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Inspiration Insights */}
          {respondentData.rawData.insight_inspiration && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800 mb-3">תובנות השראה</h4>
              <div className="space-y-3">
                {(() => {
                  const parsed = parseInsightText(respondentData.rawData.insight_inspiration);
                  return (
                    <>
                      {parsed.preserve && (
                        <div>
                          <h5 className="font-medium text-green-700 mb-1">שימור</h5>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {parsed.preserve}
                          </p>
                        </div>
                      )}
                      {parsed.improve && (
                        <div>
                          <h5 className="font-medium text-orange-700 mb-1">שיפור</h5>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {parsed.improve}
                          </p>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Meaning Insights */}
          {respondentData.rawData.insight_meaning && (
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-3">תובנות משמעות</h4>
              <div className="space-y-3">
                {(() => {
                  const parsed = parseInsightText(respondentData.rawData.insight_meaning);
                  return (
                    <>
                      {parsed.preserve && (
                        <div>
                          <h5 className="font-medium text-green-700 mb-1">שימור</h5>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {parsed.preserve}
                          </p>
                        </div>
                      )}
                      {parsed.improve && (
                        <div>
                          <h5 className="font-medium text-orange-700 mb-1">שיפור</h5>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {parsed.improve}
                          </p>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Authenticity Insights */}
          {respondentData.rawData.insight_authentic && (
            <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
              <h4 className="font-semibold text-pink-800 mb-3">תובנות אותנטיות</h4>
              <div className="space-y-3">
                {(() => {
                  const parsed = parseInsightText(respondentData.rawData.insight_authentic);
                  return (
                    <>
                      {parsed.preserve && (
                        <div>
                          <h5 className="font-medium text-green-700 mb-1">שימור</h5>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {parsed.preserve}
                          </p>
                        </div>
                      )}
                      {parsed.improve && (
                        <div>
                          <h5 className="font-medium text-orange-700 mb-1">שיפור</h5>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {parsed.improve}
                          </p>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
