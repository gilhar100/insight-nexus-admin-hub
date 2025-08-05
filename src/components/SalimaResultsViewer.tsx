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
    <div className="flex flex-col gap-4 p-4 sm:p-6 lg:p-10 bg-sky-50 min-h-screen">
      <ResultsHeader surveyId={surveyId || ""} />
      <ResultsScoreDisplay results={results} />
      <ResultsSummaryCards results={results} />
      <ResultsCharts result={results} />
      <ResultsDominantArchetype dominantArchetype={insights.dominant_archetype} />
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
      <ResultsGptInsights gptResults={gptResults} />
      <ResultsActions surveyId={surveyId} />
    </div>
  );
};

export default SalimaResultsViewer;