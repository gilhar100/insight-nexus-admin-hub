
import React from 'react';
import { SalimaScoreDistributionChart } from '@/components/SalimaScoreDistributionChart';
import { SalimaGroupRadarChart } from '@/components/SalimaGroupRadarChart';
import { SalimaBellCurveChart } from '@/components/SalimaBellCurveChart';

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
    name: 'הסתגלות (A)',
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

const getDimensionExplanation = (dimensionKey: string) => {
  const explanations = {
    strategy: "ממד זה משקף יכולת ניהול חזון ברור, חשיבה לטווח ארוך, והתבוננות מעמיקה. מנהלים חזקים בתחום זה פועלים לפי \"מפה דינמית\" – הם לא מוותרים על היעד, אך יודעים לשנות מסלול בהתאם לשינויים במציאות. הם מביטים קדימה, מזהים תהליכים מורכבים, ומובילים מתוך הבנה רחבה ולא רק מתוך תגובה מיידית.",
    adaptability: "הממד האדפטיבי מעיד על יכולת גמישות, יצירתיות, ואופטימיות בעת שינוי. מנהלים אדפטיביים מצליחים לעורר השראה גם בתקופות של חוסר ודאות, מגיבים בגמישות לאתגרים, ומצליחים לרתום אחרים דרך שמחה והתלהבות מהעשייה. זהו מרכיב קריטי בהתמודדות אפקטיבית עם שינויים ארגוניים.",
    learning: "הממד הלומד מתאר את המידה שבה המנהיג פתוח להקשבה, סקרנות ולמידה מתמשכת. למידה במודל זה היא לא רק צבירת ידע אלא תהליך טרנספורמטיבי של הפקת תובנות ושיפור מתמיד. מנהלים שמצטיינים בממד זה שואלים שאלות, מבקשים משוב, ולומדים לעומק מהצלחות וכישלונות כאחד.",
    inspiration: "ממד ההשראה עוסק ביכולת להוות מודל אישי שמעורר מחויבות והזדהות. מנהיגים מעוררי השראה משדרים ביטחון עצמי, עומדים על ערכים ברורים, ומובילים לא דרך סמכות פורמלית אלא מתוך שיח, קשרים לא פורמליים ודוגמה אישית. זהו ממד שמייצר טרנספורמציה בסובבים.",
    meaning: "ממד המשמעות בוחן את היכולת להנחיל ערך שמעבר לאינטרס האישי. מנהיגות משמעותית עוסקת בחזון שיש לו תרומה רחבה – חברתית, ערכית או קהילתית. כאשר ארגון פועל ממקום של משמעות, נוצרת תחושת שליחות שמעודדת התמדה, רתימה ותחושת שותפות אמיתית.",
    authenticity: "הממד האותנטי עוסק בקשר האנושי והישיר שמנהיג יוצר עם סביבתו. הוא כולל אמפתיה, שקיפות, בהירות וכנות. מנהיג אותנטי נתפס כאמין, קשוב, ופתוח – תכונות המהוות תנאי הכרחי לרתימת אחרים ולהנעה משמעותית של שינוי. בהעדר אותנטיות, האמון נשחק והובלה נהיית מאתגרת."
  };
  return explanations[dimensionKey as keyof typeof explanations] || "";
};

export const GroupResults: React.FC<GroupResultsProps> = ({
  groupData,
  isPresenterMode
}) => {
  // Add safety check for groupData
  if (!groupData || !groupData.participants || groupData.participants.length === 0) {
    return (
      <div className="card">
        <div className="card-content p-8 text-center">
          <p className="text-gray-600">אין נתונים להצגה עבור קבוצה זו</p>
        </div>
      </div>
    );
  }

  // Add safety check for dimension insights
  let dimensionInsights;
  try {
    dimensionInsights = getDimensionInsights(groupData.averages);
  } catch (error) {
    console.error('Error calculating dimension insights:', error);
    dimensionInsights = {
      strongest: { key: 'strategy', name: 'אסטרטגיה', score: 0 },
      weakest: { key: 'strategy', name: 'אסטרטגיה', score: 0 },
      isSameDimension: false
    };
  }

  const { strongest, weakest, isSameDimension } = dimensionInsights;

  return (
    <div className={isPresenterMode ? "presenter-grid" : "grid grid-cols-1 lg:grid-cols-2 gap-8"}>
      {/* Dimension Insights Section */}
      <div className="card" style={{ gridColumn: isPresenterMode ? "span 2" : undefined }}>
        <div className="card-header text-center"></div>
        <div className="card-content">
          {!isSameDimension ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
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
                
                <div className={`mt-4 p-4 bg-white border border-orange-300 rounded-lg text-right ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                  <p className="text-gray-700 leading-relaxed">
                    {getDimensionExplanation(weakest.key)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
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
              
              <div className={`mt-4 p-4 bg-white border border-yellow-300 rounded-lg text-right ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                <p className="text-gray-700 leading-relaxed">
                  {getDimensionExplanation(strongest.key)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Score Distribution Chart - Full Width */}
      {groupData.participant_count > 5 && (
        <div className="card" style={{ gridColumn: isPresenterMode ? "span 2" : undefined }}>
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
        </div>
      )}

      {/* Radar Chart – Group Averages per SALIMA Dimension */}
      <div className="card">
        <div className="card-header text-center">
          <div className={`flex items-center justify-center text-right card-title${isPresenterMode ? " text-3xl" : ""}`}>
            תרשים רדאר – פרופיל קבוצתי לפי ממד
          </div>
        </div>
        <div className="card-content">
          <div className="h-[520px] w-full flex items-center justify-center">
            <SalimaGroupRadarChart averages={groupData.averages} />
          </div>
        </div>
      </div>

      {/* Bell Curve – SLQ Score Distribution - Full Width */}
      <div className="card" style={{ gridColumn: "span 2" }}>
        <div className="card-header text-center">
          <div className={`flex items-center justify-center text-right card-title${isPresenterMode ? " text-3xl" : ""}`}>
            התפלגות ציוני SLQ
          </div>
        </div>
        <div className="card-content">
          <div className="h-[400px] w-full flex items-center justify-center">
            <SalimaBellCurveChart participants={groupData.participants} averageScore={groupData.averages.overall} />
          </div>
        </div>
      </div>
    </div>
  );
};
