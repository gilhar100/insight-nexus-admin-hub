
import React from 'react';
import { SalimaGroupRadarChart } from '@/components/SalimaGroupRadarChart';
import { ArchetypeDistributionChart } from '@/components/ArchetypeDistributionChart';

interface GroupSalimaPDFLayoutProps {
  groupData: {
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
  };
}

const getDimensionInsights = (averages: any) => {
  const dimensions = [
    { key: 'strategy', name: 'אסטרטגיה (S)', score: averages.strategy },
    { key: 'learning', name: 'למידה (L)', score: averages.learning },
    { key: 'inspiration', name: 'השראה (I)', score: averages.inspiration },
    { key: 'meaning', name: 'משמעות (M)', score: averages.meaning },
    { key: 'authenticity', name: 'אותנטיות (A2)', score: averages.authenticity },
    { key: 'adaptability', name: 'אדפטיביות (A)', score: averages.adaptability }
  ];
  
  const strongest = dimensions.reduce((max, dim) => dim.score > max.score ? dim : max);
  const weakest = dimensions.reduce((min, dim) => dim.score < min.score ? dim : min);
  
  return { dimensions, strongest, weakest };
};

const getDimensionExplanation = (dimensionKey: string) => {
  const explanations = {
    strategy: "היכולת לראות את התמונה הגדולה, לזהות הזדמנויות במצבים משתנים, ולפעול מתוך חזון ברור.",
    learning: "גישה של צמיחה מתמשכת, פתיחות למשוב וללמידה מהצלחות וכישלונות.",
    inspiration: "היכולת להניע אחרים באמצעות נרטיב, ערכים ודוגמה אישית.",
    meaning: "קשר עמוק לערכים פנימיים, מחויבות לתרומה שמעבר לעצמי ולתחושת שליחות.",
    authenticity: "שקיפות, יושרה ויכולת להביא את עצמך באופן כן ומדויק גם במצבי לחץ.",
    adaptability: "גמישות מחשבתית והתנהגותית, היכולת להסתגל במהירות לשינויים."
  };
  return explanations[dimensionKey as keyof typeof explanations] || "";
};

const archetypeDescriptions = {
  "המנהל הסקרן": "מנהל שמוביל דרך סקרנות, חיפוש מתמיד אחר ידע, והשראה. הוא שואל שאלות, משתף תובנות, ומדליק את הסביבה באנרגיה של למידה וצמיחה.",
  "המנהל המעצים": "מנהל שפועל מתוך כנות, הקשבה ותחושת שליחות. הוא יוצר חיבור רגשי עם האנשים סביבו, נותן מקום לערכים וזהות, ומעודד כל אחד להרגיש חלק ממשהו גדול יותר.",
  "מנהל ההזדמנות": "מנהל שמזהה מגמות, חושב קדימה, ופועל בזריזות גם בתנאים משתנים. הוא לא נבהל מאי-ודאות, אלא רואה בה קרקע ליוזמה."
};

export const GroupSalimaPDFLayout: React.FC<GroupSalimaPDFLayoutProps> = ({ groupData }) => {
  const { dimensions, strongest, weakest } = getDimensionInsights(groupData.averages);

  return (
    <div className="bg-white text-black" style={{ fontFamily: 'Arial, sans-serif', direction: 'rtl' }}>
      {/* Page 1 - Header and Overview */}
      <div data-page="1" className="p-12 bg-white" style={{ width: '794px', height: '1123px', pageBreakAfter: 'always' }}>
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-800 mb-6">
            דוח תובנות קבוצתי SALIMA
          </h1>
          <div className="text-3xl text-gray-700 mb-4">
            קבוצה מספר: {groupData.group_number}
          </div>
          <div className="text-2xl text-gray-600 mb-8">
            {groupData.participant_count} משתתפים
          </div>
          <div className="text-lg text-gray-500">
            {new Date().toLocaleDateString('he-IL')}
          </div>
        </div>

        {/* Overall Score */}
        <div className="text-center mb-16">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-10 inline-block">
            <h2 className="text-3xl font-bold text-blue-800 mb-4">
              ציון מנהיגות קבוצתי
            </h2>
            <div className="text-7xl font-bold text-blue-600 mb-4">
              {groupData.averages.overall.toFixed(2)}
            </div>
            <div className="text-xl text-blue-500">
              ממוצע ציוני SLQ
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">
              הממד החזק ביותר
            </h3>
            <div className="text-5xl font-bold text-green-600 mb-4 text-center">
              {strongest.score.toFixed(1)}
            </div>
            <div className="text-xl text-green-700 font-semibold text-center">
              {strongest.name}
            </div>
          </div>

          <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-orange-800 mb-6 text-center">
              ממד לפיתוח
            </h3>
            <div className="text-5xl font-bold text-orange-600 mb-4 text-center">
              {weakest.score.toFixed(1)}
            </div>
            <div className="text-xl text-orange-700 font-semibold text-center">
              {weakest.name}
            </div>
          </div>
        </div>
      </div>

      {/* Page 2 - Radar Chart */}
      <div data-page="2" className="p-12 bg-white" style={{ width: '794px', height: '1123px', pageBreakAfter: 'always' }}>
        <h2 className="text-4xl font-bold text-center text-blue-800 mb-12">
          פרופיל קבוצתי ייחודי - שישה ממדים
        </h2>
        
        <div className="flex items-center justify-center" style={{ height: '750px' }}>
          <div className="w-full max-w-4xl h-full">
            <SalimaGroupRadarChart averages={groupData.averages} />
          </div>
        </div>
      </div>

      {/* Page 3 - Dimension Insights */}
      <div data-page="3" className="p-12 bg-white" style={{ width: '794px', height: '1123px', pageBreakAfter: 'always' }}>
        <h2 className="text-4xl font-bold text-center text-blue-800 mb-12">
          תובנות לפי ממדים
        </h2>
        
        <div className="grid grid-cols-2 gap-8">
          {dimensions.map((dimension) => (
            <div key={dimension.key} className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {dimension.name}
                </h3>
                <div className="text-3xl font-bold text-blue-600">
                  {dimension.score.toFixed(1)}
                </div>
              </div>
              <p className="text-base text-gray-700 leading-relaxed">
                {getDimensionExplanation(dimension.key)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Page 4 - Archetype Distribution */}
      <div data-page="4" className="p-12 bg-white" style={{ width: '794px', height: '1123px' }}>
        <h2 className="text-4xl font-bold text-center text-blue-800 mb-12">
          התפלגות סגנון מנהיגות
        </h2>
        
        <div className="mb-12" style={{ height: '400px' }}>
          <ArchetypeDistributionChart 
            groupNumber={groupData.group_number} 
            isPresenterMode={false}
          />
        </div>
        
        <div className="space-y-8">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">
            תיאור הארכיטיפים
          </h3>
          
          {Object.entries(archetypeDescriptions).map(([archetype, description]) => (
            <div key={archetype} className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <h4 className="text-2xl font-bold text-blue-800 mb-4">
                {archetype}
              </h4>
              <p className="text-lg text-gray-700 leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
