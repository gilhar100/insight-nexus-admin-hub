
import React from 'react';
import { SalimaGroupRadarChart } from '@/components/SalimaGroupRadarChart';
import { ArchetypeDistributionChart } from '@/components/ArchetypeDistributionChart';
import { WocaGroupBarChart } from '@/components/WocaGroupBarChart';
import { GapAnalysisChart } from '@/components/GapAnalysisChart';

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

interface GroupInsightsPDFLayoutProps {
  groupNumber: number;
  salimaData?: GroupData;
  wocaData?: WocaData;
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

const getDimensionExplanation = (dimensionKey: string) => {
  const explanations = {
    strategy: "היכולת לראות את התמונה הגדולה ולפעול מתוך חזון ברור",
    authenticity: "שקיפות, יושרה ויכולת להביא את עצמך באופן כן ומדויק",
    learning: "גישה של צמיחה מתמשכת ופתיחות למשוב וללמידה",
    inspiration: "היכולת להניע אחרים באמצעות נרטיב, ערכים ודוגמה אישית",
    meaning: "קשר עמוק לערכים פנימיים ומחויבות לתרומה שמעבר לעצמי",
    adaptability: "גמישות מחשבתית והתנהגותית והיכולת להסתגל במהירות לשינויים"
  };
  return explanations[dimensionKey as keyof typeof explanations] || "";
};

export const GroupInsightsPDFLayout: React.FC<GroupInsightsPDFLayoutProps> = ({
  groupNumber,
  salimaData,
  wocaData
}) => {
  const dimensionInsights = salimaData ? getDimensionInsights(salimaData.averages) : null;
  const dominantZone = wocaData?.wocaAnalysis?.groupDominantZoneByCount || 'לא זוהה';
  
  return (
    <div className="bg-white font-sans" style={{ direction: 'rtl', fontSize: '14px' }}>
      
      {/* Page 1: Cover Page */}
      <div className="min-h-screen p-12 flex flex-col justify-center items-center text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-blue-800 mb-4">
            דוח תובנות קבוצתי
          </h1>
          <h2 className="text-3xl font-semibold text-blue-600 mb-8">
            ניתוח SALIMA & WOCA
          </h2>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-8 mb-8 text-center">
          <div className="text-6xl font-bold text-blue-800 mb-4">
            קבוצה {groupNumber}
          </div>
          <div className="text-2xl text-blue-600 mb-4">
            {salimaData?.participant_count || wocaData?.workshopData?.participant_count || 0} משתתפים
          </div>
          <div className="text-lg text-gray-600">
            {new Date().toLocaleDateString('he-IL', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
        
        <div className="text-gray-600 text-lg">
          דוח מקיף המכיל ניתוח מעמיק של ממדי מנהיגות ותרבות ארגונית
        </div>
      </div>

      {/* Page 2: SALIMA Radar Chart + Narrative */}
      {salimaData && (
        <>
          <div style={{ pageBreakBefore: 'always' }}></div>
          <div className="min-h-screen p-8">
            <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center border-b-2 border-blue-200 pb-4">
              ניתוח SALIMA - מנהיגות אישית
            </h1>
            
            {/* Overall Score */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8 text-center">
              <h2 className="text-2xl font-semibold text-blue-800 mb-2">ציון מנהיגות קבוצתי</h2>
              <div className="text-5xl font-bold text-blue-600 mb-2">
                {salimaData.averages.overall.toFixed(2)}
              </div>
              <p className="text-blue-500">
                ממוצע ציוני SLQ של {salimaData.participant_count} משתתפים
              </p>
            </div>

            {/* Radar Chart */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                פרופיל קבוצתי ייחודי
              </h3>
              <div className="h-96 flex items-center justify-center">
                <SalimaGroupRadarChart averages={salimaData.averages} />
              </div>
            </div>

            {/* Dimension Analysis */}
            {dimensionInsights && (
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-green-800 mb-2">הממד החזק ביותר</h3>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {dimensionInsights.strongest.score.toFixed(1)}
                  </div>
                  <div className="text-green-700 font-semibold mb-3">
                    {dimensionInsights.strongest.name}
                  </div>
                  <p className="text-sm text-green-600">
                    {getDimensionExplanation(dimensionInsights.strongest.key)}
                  </p>
                </div>
                
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-orange-800 mb-2">ממד לפיתוח</h3>
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {dimensionInsights.weakest.score.toFixed(1)}
                  </div>
                  <div className="text-orange-700 font-semibold mb-3">
                    {dimensionInsights.weakest.name}
                  </div>
                  <p className="text-sm text-orange-600">
                    {getDimensionExplanation(dimensionInsights.weakest.key)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Page 3: Archetype Distribution */}
      {salimaData && (
        <>
          <div style={{ pageBreakBefore: 'always' }}></div>
          <div className="min-h-screen p-8">
            <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center border-b-2 border-blue-200 pb-4">
              התפלגות ארכיטיפי מנהיגות
            </h1>
            
            <div className="h-96 mb-8">
              <ArchetypeDistributionChart 
                groupNumber={salimaData.group_number} 
                isPresenterMode={false}
              />
            </div>

            {/* Archetype Explanations */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-purple-800 mb-2">מנהל ההזדמנות</h3>
                <p className="text-sm text-purple-700">
                  מנהל המתמחה בזיהוי והנצלת הזדמנויות עסקיות ואישיות, 
                  משלב חשיבה מערכתית עם גמישות וביטחון בהחלטות
                </p>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-orange-800 mb-2">המנהל הסקרן</h3>
                <p className="text-sm text-orange-700">
                  מנהל שמוביל דרך סקרנות, חיפוש מתמיד אחר ידע, והשראה.
                  מדליק את הסביבה באנרגיה של למידה וצמיחה
                </p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-green-800 mb-2">המנהל המעצים</h3>
                <p className="text-sm text-green-700">
                  מנהל שפועל מתוך כנות, הקשבה ותחושת שליחות.
                  יוצר חיבור רגשי עם האנשים סביבו ומעודד כל אחד להרגיש חלק ממשהו גדול יותר
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Page 4: WOCA Zone Distribution */}
      {wocaData && (
        <>
          <div style={{ pageBreakBefore: 'always' }}></div>
          <div className="min-h-screen p-8">
            <h1 className="text-3xl font-bold text-purple-800 mb-6 text-center border-b-2 border-purple-200 pb-4">
              ניתוח WOCA - תרבות ארגונית
            </h1>
            
            {/* Dominant Zone */}
            <div className="bg-purple-50 rounded-lg p-6 mb-8 text-center">
              <h2 className="text-2xl font-semibold text-purple-800 mb-2">האזור הדומיננטי</h2>
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {dominantZone === 'opportunity' && 'אזור ההזדמנות'}
                {dominantZone === 'comfort' && 'אזור הנוחות'}
                {dominantZone === 'apathy' && 'אזור האדישות'}
                {dominantZone === 'war' && 'אזור המלחמה'}
                {dominantZone === 'לא זוהה' && 'לא זוהה אזור דומיננטי'}
              </div>
              <p className="text-purple-500">
                בהתבסס על {wocaData.workshopData.participant_count} משתתפים
              </p>
            </div>

            {/* WOCA Chart */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                ציוני אזורים קבוצתיים
              </h3>
              <div className="h-80">
                <GapAnalysisChart 
                  categoryScores={wocaData.wocaAnalysis.groupCategoryScores}
                  hideXAxisNumbers={true}
                  showYAxisLabels={true}
                />
              </div>
            </div>

            {/* WOCA Zone Explanations */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-green-800 mb-2">אזור ההזדמנות</h3>
                <p className="text-sm text-green-700">
                  חדשנות, השראה ומחוברות רגשית - האזור הרצוי ביותר
                </p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-blue-800 mb-2">אזור הנוחות</h3>
                <p className="text-sm text-blue-700">
                  שמרנות, יציבות ותפעול - שמירה על הקיים
                </p>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-yellow-800 mb-2">אזור האדישות</h3>
                <p className="text-sm text-yellow-700">
                  ניתוק, בלבול וחוסר מעורבות - דורש התערבות
                </p>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-red-800 mb-2">אזור המלחמה</h3>
                <p className="text-sm text-red-700">
                  פחד, קונפליקט והישרדות - דורש פעולה מיידית
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Page 5: Highlights & Summary */}
      <div style={{ pageBreakBefore: 'always' }}></div>
      <div className="min-h-screen p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center border-b-2 border-gray-200 pb-4">
          תובנות מרכזיות והמלצות
        </h1>
        
        {/* Key Highlights */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          {salimaData && dimensionInsights && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-blue-800 mb-4">תובנות SALIMA</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-green-600 font-semibold">נקודת חוזק:</span>
                  <span className="text-green-700">
                    {dimensionInsights.strongest.name} ({dimensionInsights.strongest.score.toFixed(1)})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-orange-600 font-semibold">אזור לפיתוח:</span>
                  <span className="text-orange-700">
                    {dimensionInsights.weakest.name} ({dimensionInsights.weakest.score.toFixed(1)})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-semibold">ציון מנהיגות כללי:</span>
                  <span className="text-blue-700 font-bold">
                    {salimaData.averages.overall.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {wocaData && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-purple-800 mb-4">תובנות WOCA</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-purple-600 font-semibold">אזור דומיננטי:</span>
                  <span className="text-purple-700">
                    {dominantZone === 'opportunity' && 'אזור ההזדמנות'}
                    {dominantZone === 'comfort' && 'אזור הנוחות'}
                    {dominantZone === 'apathy' && 'אזור האדישות'}
                    {dominantZone === 'war' && 'אזור המלחמה'}
                    {dominantZone === 'לא זוהה' && 'לא זוהה'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-600 font-semibold">מספר משתתפים:</span>
                  <span className="text-purple-700">
                    {wocaData.workshopData.participant_count}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">המלצות לפעולה</h2>
          <div className="space-y-4 text-sm">
            {salimaData && dimensionInsights && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">פיתוח מנהיגות:</h3>
                <p className="text-gray-700 leading-relaxed">
                  יש להמשיך לחזק את הממד של {dimensionInsights.strongest.name} 
                  ולהתמקד בפיתוח הממד של {dimensionInsights.weakest.name}.
                  מומלץ לפתח תוכנית התערבות ממוקדת המתמקדת בשיפור הממדים החלשים 
                  תוך מינוף החוזקות הקיימות.
                </p>
              </div>
            )}
            
            {wocaData && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">פיתוח תרבות ארגונית:</h3>
                <p className="text-gray-700 leading-relaxed">
                  {dominantZone === 'opportunity' && 'הקבוצה נמצאת באזור אידיאלי. יש לשמור על המצב הנוכחי ולהמשיך לעודד חדשנות והשראה.'}
                  {dominantZone === 'comfort' && 'הקבוצה נמצאת באזור יציב אך זקוקה לתנופה. מומלץ לעודד חדשנות ולהוסיף אתגרים חדשים.'}
                  {dominantZone === 'apathy' && 'הקבוצה זקוקה להתערבות מיידית. יש לבחון את הגורמים לאדישות ולפעול לשיפור המעורבות.'}
                  {dominantZone === 'war' && 'מצב קריטי הדורש התערבות דחופה. יש לטפל בקונפליקטים ולבנות מחדש את האמון.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
