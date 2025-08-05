
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

const ResultsAnalysis: React.FC<ResultsAnalysisProps> = ({
  result,
  insights,
  gptResults,
  isLoadingInsights = false,
  insightsAvailable = true,
  onRefreshInsights = () => {},
  answers,
  surveyId
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">ניתוח תוצאות</h3>
      {isLoadingInsights ? (
        <div className="text-center py-4">
          <div className="text-gray-600">טוען תובנות...</div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-gray-700">
            ניתוח מפורט של התוצאות יוצג כאן
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsAnalysis;
