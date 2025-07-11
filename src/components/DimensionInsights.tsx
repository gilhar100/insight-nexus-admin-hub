
import React from 'react';

interface DimensionInsight {
  key: string;
  name: string;
  score: number;
}

interface DimensionInsightsProps {
  strongest: DimensionInsight;
  weakest: DimensionInsight;
  isSameDimension: boolean;
  isPresenterMode: boolean;
}

const getDimensionExplanation = (dimensionKey: string) => {
  const explanations = {
    strategy: "היכולת לראות את התמונה הגדולה, לזהות הזדמנויות במצבים משתנים, ולפעול מתוך חזון ברור ולא רק מתוך תגובה למציאות הנוכחית. מנהלים עם ממד אסטרטגי גבוה מתמקדים באפקטיביות לטווח ארוך.",
    adaptability: "גמישות מחשבתית והתנהגותית, היכולת להסתגל במהירות לשינויים, להתמודד עם אי-ודאות ולפעול ביצירתיות גם במצבי קצה. ממד זה קשור לחוסן ולקבלת שינוי כהזדמנות.",
    learning: "גישה של צמיחה מתמשכת, פתיחות למשוב וללמידה מהצלחות וכישלונות. ממד הלמידה מצביע על סקרנות, עומק מקצועי ורצון להתפתח ולהשתפר כל הזמן.",
    inspiration: "היכולת להניע אחרים באמצעות נרטיב, ערכים ודוגמה אישית. מנהלים עם השראה גבוהה יוצרים אמון, מעוררים מוטיבציה ומקרינים נוכחות מנהיגותית.",
    meaning: "קשר עמוק לערכים פנימיים, מחויבות לתרומה שמעבר לעצמי ולתחושת שליחות. ממד המשמעות מייצג מנהיגות קשובה שפועלת בהלימה למטרות ערכיות.",
    authenticity: "שקיפות, יושרה ויכולת להביא את עצמך באופן כן ומדויק גם במצבי לחץ. ממד זה עוסק בכנות, אמפתיה, ובחיבור בין העולם הפנימי שלך להתנהלותך המקצועית."
  };
  return explanations[dimensionKey as keyof typeof explanations] || "";
};

export const DimensionInsights: React.FC<DimensionInsightsProps> = ({
  strongest,
  weakest,
  isSameDimension,
  isPresenterMode
}) => {
  return (
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
              
              <div className={`mt-4 p-4 bg-white border border-green-300 rounded-lg text-right ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                <p className="text-gray-700 leading-relaxed">
                  {getDimensionExplanation(strongest.key)}
                </p>
              </div>
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
  );
};
