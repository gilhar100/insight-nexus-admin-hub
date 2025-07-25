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
  const dimensions = [{
    key: 'strategy',
    name: 'אסטרטגיה (S)',
    score: averages.strategy
  }, {
    key: 'authenticity',
    name: 'אותנטיות (A2)',
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
    name: 'אדפטיביות (A)',
    score: averages.adaptability
  }];
  
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

export const CombinedPDFLayout: React.FC<CombinedPDFLayoutProps> = ({
  groupId,
  salimaData,
  wocaData
}) => {
  const dimensionInsights = getDimensionInsights(salimaData.averages);
  const zoneDistribution = getZoneDistribution(wocaData.wocaAnalysis);
  const dominantZone = wocaData.wocaAnalysis?.groupDominantZoneByCount || 'לא זוהה';

  return (
    <div className="bg-white p-6 font-sans" style={{ minHeight: '297mm', width: '210mm', direction: 'rtl' }}>
      {/* Header */}
      <div className="text-center mb-8 border-b-2 border-blue-200 pb-4">
        <h1 className="text-3xl font-bold text-blue-800 mb-2">
          דוח תובנות קבוצתי
        </h1>
        <h2 className="text-xl font-semibold text-blue-600 mb-3">
          ניתוח SALIMA & WOCA
        </h2>
        <div className="flex justify-between items-center text-gray-600 text-sm">
          <div>
            <strong>קבוצה:</strong> סדנה {groupId}
          </div>
          <div>
            <strong>תאריך:</strong> {new Date().toLocaleDateString('he-IL')}
          </div>
        </div>
        <div className="text-center mt-2 text-gray-600 text-sm">
          <strong>משתתפים:</strong> SALIMA: {salimaData.participant_count} | WOCA: {wocaData.workshopData.participant_count}
        </div>
      </div>

      {/* SALIMA Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-blue-800 mb-4 border-r-4 border-blue-500 pr-3">
          ניתוח SALIMA - מנהיגות אישית
        </h2>
        
        {/* Overall Score */}
        <div className="bg-blue-50 rounded-lg p-4 mb-4 text-center">
          <h3 className="text-lg font-semibold text-blue-800 mb-1">ציון מנהיגות קבוצתי</h3>
          <div className="text-3xl font-bold text-blue-600">
            {salimaData.averages.overall.toFixed(2)}
          </div>
          <p className="text-blue-500 mt-1 text-sm">
            ממוצע ציוני SLQ של {salimaData.participant_count} משתתפים
          </p>
        </div>

        {/* Dimension Insights */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-base font-bold text-green-800 mb-1">הממד החזק ביותר</h3>
            <div className="text-xl font-bold text-green-600 mb-1">
              {dimensionInsights.strongest.score.toFixed(1)}
            </div>
            <div className="text-green-700 font-semibold text-sm">
              {dimensionInsights.strongest.name}
            </div>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h3 className="text-base font-bold text-orange-800 mb-1">ממד לפיתוח</h3>
            <div className="text-xl font-bold text-orange-600 mb-1">
              {dimensionInsights.weakest.score.toFixed(1)}
            </div>
            <div className="text-orange-700 font-semibold text-sm">
              {dimensionInsights.weakest.name}
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="space-y-6 mb-6">
          <div className="text-center">
            <h3 className="text-base font-semibold text-gray-800 mb-2">פרופיל קבוצתי ייחודי</h3>
            <div className="h-40 w-full max-w-md mx-auto flex items-center justify-center overflow-hidden">
              <SalimaGroupRadarChart averages={salimaData.averages} />
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-base font-semibold text-gray-800 mb-2">חלוקת ארכיטיפים</h3>
            <div className="h-40 w-full max-w-md mx-auto flex items-center justify-center overflow-hidden">
              <ArchetypeDistributionChart groupNumber={salimaData.group_number} isPresenterMode={false} />
            </div>
          </div>
        </div>
      </div>

      {/* Page Break */}
      <div style={{ pageBreakBefore: 'always' }}></div>

      {/* WOCA Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-purple-800 mb-4 border-r-4 border-purple-500 pr-3">
          ניתוח WOCA - תרבות ארגונית
        </h2>

        {/* Dominant Zone */}
        <div className="bg-purple-50 rounded-lg p-4 mb-4 text-center">
          <h3 className="text-lg font-semibold text-purple-800 mb-1">האזור הדומיננטי</h3>
          <div className="text-xl font-bold text-purple-600">
            {dominantZone === 'opportunity' && 'אזור ההזדמנות'}
            {dominantZone === 'comfort' && 'אזור הנוחות'}
            {dominantZone === 'apathy' && 'אזור האדישות'}
            {dominantZone === 'war' && 'אזור המלחמה'}
            {dominantZone === 'לא זוהה' && 'לא זוהה אזור דומיננטי'}
          </div>
          <p className="text-purple-500 mt-1 text-sm">
            בהתבסס על {wocaData.workshopData.participant_count} משתתפים
          </p>
        </div>

        {/* Charts */}
        <div className="space-y-6 mb-6">
          <div className="text-center">
            <h3 className="text-base font-semibold text-gray-800 mb-2">ציוני אזורים קבוצתיים</h3>
            <div className="h-40 w-full max-w-md mx-auto flex items-center justify-center overflow-hidden">
              <WocaGroupBarChart 
                groupCategoryScores={wocaData.wocaAnalysis.groupCategoryScores}
              />
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-base font-semibold text-gray-800 mb-2">התפלגות משתתפים באזורים</h3>
            <div className="h-40 w-full max-w-md mx-auto flex items-center justify-center overflow-hidden">
              <ZoneDistributionChart 
                zoneDistribution={zoneDistribution}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Page Break */}
      <div style={{ pageBreakBefore: 'always' }}></div>

      {/* Legend Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-r-4 border-gray-500 pr-4">
          מקרא והסברים
        </h2>

        {/* SALIMA Dimensions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">ממדי SALIMA</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800">אסטרטגיה (S)</h4>
              <p className="text-sm text-gray-700">היכולת לראות את התמונה הגדולה ולפעול מתוך חזון ברור</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800">אדפטיביות (A)</h4>
              <p className="text-sm text-gray-700">גמישות מחשבתית והתנהגותית והיכולת להסתגל במהירות לשינויים</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800">למידה (L)</h4>
              <p className="text-sm text-gray-700">גישה של צמיחה מתמשכת ופתיחות למשוב וללמידה</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800">השראה (I)</h4>
              <p className="text-sm text-gray-700">היכולת להניע אחרים באמצעות נרטיב, ערכים ודוגמה אישית</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800">משמעות (M)</h4>
              <p className="text-sm text-gray-700">קשר עמוק לערכים פנימיים ומחויבות לתרומה שמעבר לעצמי</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800">אותנטיות (A2)</h4>
              <p className="text-sm text-gray-700">שקיפות, יושרה ויכולת להביא את עצמך באופן כן ומדויק</p>
            </div>
          </div>
        </div>

        {/* SALIMA Archetypes */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-green-800 mb-4">מקרא סגנונות ניהול</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800">מנהל הזדמנויות</h4>
              <p className="text-sm text-gray-700">מנהל המתמחה בזיהוי והנצלת הזדמנויות עסקיות ואישיות</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800">מנהל מעצים</h4>
              <p className="text-sm text-gray-700">מנהל המתמקד בפיתוח והעצמת הצוות והאנשים סביבו</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800">מנהל סקרן</h4>
              <p className="text-sm text-gray-700">מנהל המניע למידה, חדשנות וחקירה מתמשכת</p>
            </div>
          </div>
        </div>

        {/* WOCA Zones */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-purple-800 mb-4">אזורי WOCA</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800">אזור ההזדמנות</h4>
              <p className="text-sm text-gray-700">חדשנות, השראה ומחוברות רגשית - האזור הרצוי ביותר</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800">אזור הנוחות</h4>
              <p className="text-sm text-gray-700">שמרנות, יציבות ותפעול - שמירה על הקיים</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800">אזור האדישות</h4>
              <p className="text-sm text-gray-700">ניתוק, בלבול וחוסר מעורבות - דורש התערבות</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-800">אזור המלחמה</h4>
              <p className="text-sm text-gray-700">פחד, קונפליקט והישרדות - דורש פעולה מיידית</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-6 border">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">סיכום והמלצות</h3>
        <div className="space-y-4 text-sm text-gray-700">
          <p>
            <strong>SALIMA:</strong> הקבוצה מציגה ציון מנהיגות קבוצתי של {salimaData.averages.overall.toFixed(2)}, 
            עם נקודת חוזק ב{dimensionInsights.strongest.name} וצורך בפיתוח ב{dimensionInsights.weakest.name}.
          </p>
          <p>
            <strong>WOCA:</strong> התרבות הארגונית מתאפיינת באזור {
              dominantZone === 'opportunity' ? 'ההזדמנות - מצב חיובי המעיד על סביבה פתוחה וצומחת' :
              dominantZone === 'comfort' ? 'הנוחות - מצב יציב אך ללא תנופה ארגונית' :
              dominantZone === 'apathy' ? 'האדישות - מצב מדאיג הדורש התערבות מיידית' :
              dominantZone === 'war' ? 'המלחמה - מצב קריטי הדורש פעולה דחופה' :
              'לא מוגדר - יש צורך בניתוח מעמיק יותר'
            }.
          </p>
          <p>
            <strong>המלצה:</strong> יש לפתח תוכנית התערבות ממוקדת המתייחסת לממדי SALIMA החלשים 
            ולאזורי WOCA הבעייתיים, תוך מינוף נקודות החוזק הקיימות.
          </p>
        </div>
      </div>
    </div>
  );
};