
import { getSalimaColor } from '@/utils/salimaColors';

interface DatabaseInsights {
  insight_strategy?: string;
  insight_adaptive?: string;
  insight_learning?: string;
  insight_inspiration?: string;
  insight_meaning?: string;
  insight_authentic?: string;
}

interface GPTResults {
  insights: {
    אסטרטגיה: string;
    אדפטיביות: string;
    לומד: string;
    השראה: string;
    משמעות: string;
    אותנטיות: string;
  };
}

interface ResultsAnalysisProps {
  result: any;
  insights: DatabaseInsights;
  gptResults: GPTResults | null;
  isLoadingInsights?: boolean;
  insightsAvailable?: boolean;
  onRefreshInsights?: () => void;
  answers: { questionId: number; value: number }[];
  surveyId: string | null;
}

const DIMENSION_KEYS = [
  { key: "strategy", label: "אסטרטגיה", hebrewKey: "אסטרטגיה" },
  { key: "adaptive", label: "אדפטיביות", hebrewKey: "אדפטיביות" },
  { key: "learning", label: "למידה", hebrewKey: "לומד" },
  { key: "inspiration", label: "השראה", hebrewKey: "השראה" },
  { key: "meaning", label: "משמעות", hebrewKey: "משמעות" },
  { key: "authentic", label: "אותנטיות", hebrewKey: "אותנטיות" },
];

const ResultsAnalysis: React.FC<ResultsAnalysisProps> = ({
  result,
  insights,
  gptResults,
  isLoadingInsights = false,
}) => {
  if (isLoadingInsights) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">ניתוח תוצאות</h3>
        <div className="text-center py-4">
          <div className="text-gray-600">טוען תובנות...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">טבעיות צבע אישית</h2>
      <p className="text-sm text-gray-600 mb-6 text-center">הפרופיל הצבעוני הייחודי שלך במנהיגות</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {DIMENSION_KEYS.map(({ key, label, hebrewKey }) => {
          const text = gptResults?.insights?.[hebrewKey as keyof typeof gptResults.insights] ||
                       insights[`insight_${key}` as keyof typeof insights];
          
          const score = result?.dimensions?.[key]?.score || 0;
          const color = getSalimaColor(label);

          if (!text) return null;

          return (
            <div key={key} className="bg-gray-50 rounded-lg p-4 relative">
              <div className="flex items-center justify-between mb-3">
                <h3 
                  className="text-lg font-bold" 
                  style={{ color: color }}
                >
                  {label}
                </h3>
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-semibold">
                  לפיתוח
                </span>
              </div>
              <div className="text-gray-700 text-sm leading-relaxed">
                {text || "נתונים נמצאים אישיות נכלונית..."}
              </div>
              {/* Score indicator */}
              <div className="mt-3 text-right">
                <span className="text-xs text-gray-500">ציון: {score.toFixed(1)}/5</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center">
        <div className="flex items-center gap-2 text-green-600 font-semibold">
          <span>✓</span>
          <span>התובנות נשמרו בהצלחה במערכת</span>
        </div>
      </div>
    </div>
  );
};

export default ResultsAnalysis;
