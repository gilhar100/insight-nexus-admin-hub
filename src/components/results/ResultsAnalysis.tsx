
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
  { key: "strategy", label: "אסטרטגיה" },
  { key: "adaptive", label: "אדפטיביות" },
  { key: "learning", label: "לומד" },
  { key: "inspiration", label: "השראה" },
  { key: "meaning", label: "משמעות" },
  { key: "authentic", label: "אותנטיות" },
];

const ResultsAnalysis: React.FC<ResultsAnalysisProps> = ({
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
    <div className="bg-white p-4 rounded-xl shadow space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">ניתוח אישי לפי ממדים</h2>
      {DIMENSION_KEYS.map(({ key, label }) => {
        const text =
          gptResults?.insights?.[label] ||
          insights[`insight_${key}` as keyof typeof insights];

        if (!text) return null;

        return (
          <div key={key}>
            <h3 className="text-md font-bold text-gray-700 mb-1">{label}</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{text}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ResultsAnalysis;
