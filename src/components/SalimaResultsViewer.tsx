
import ResultsHeader from "@/components/results/ResultsHeader";
import ResultsScoreDisplay from "@/components/results/ResultsScoreDisplay";
import ResultsSummaryCards from "@/components/results/ResultsSummaryCards";
import ResultsCharts from "@/components/results/ResultsCharts";
import ResultsDominantArchetype from "@/components/results/ResultsDominantArchetype";
import ResultsAnalysis from "@/components/results/ResultsAnalysis";
import ResultsGptInsights from "@/components/results/ResultsGptInsights";
import ResultsActions from "@/components/results/ResultsActions";

interface DatabaseInsights {
  insight_strategy?: string;
  insight_adaptive?: string;
  insight_learning?: string;
  insight_inspiration?: string;
  insight_meaning?: string;
  insight_authentic?: string;
  dominant_archetype?: string;
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
  extra?: string;
}

interface ResultsViewerProps {
  results: any;
  answers: { questionId: number; value: number }[];
  insights: DatabaseInsights;
  gptResults: GPTResults | null;
  surveyId: string | null;
  isLoadingInsights?: boolean;
  insightsAvailable?: boolean;
  onRefreshInsights?: () => void;
}

const SalimaResultsViewer: React.FC<ResultsViewerProps> = ({
  results,
  answers,
  insights,
  gptResults,
  surveyId,
  isLoadingInsights = false,
  insightsAvailable = true,
  onRefreshInsights = () => {},
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <ResultsHeader surveyId={surveyId || ""} />
        
        {/* Score Display */}
        <ResultsScoreDisplay results={results} />
        
        {/* Summary Cards */}
        <ResultsSummaryCards results={results} />
        
        {/* Charts Section */}
        <ResultsCharts result={results} />
        
        {/* Personal Insights */}
        <ResultsAnalysis
          result={results}
          insights={insights}
          gptResults={gptResults}
          isLoadingInsights={isLoadingInsights}
          insightsAvailable={insightsAvailable}
          onRefreshInsights={onRefreshInsights}
          answers={answers}
          surveyId={surveyId}
        />
        
        {/* Action Buttons */}
        <ResultsActions surveyId={surveyId} />
      </div>
    </div>
  );
};

export default SalimaResultsViewer;
