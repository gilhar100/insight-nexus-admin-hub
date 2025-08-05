
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

interface ResultsGptInsightsProps {
  gptResults: GPTResults | null;
}

const ResultsGptInsights: React.FC<ResultsGptInsightsProps> = ({ gptResults }) => {
  if (!gptResults) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">תובנות AI</h3>
      <div className="grid gap-4">
        {Object.entries(gptResults.insights).map(([dimension, insight]) => (
          <div key={dimension} className="border-b pb-3 last:border-b-0">
            <h4 className="font-semibold text-blue-600 mb-2">{dimension}</h4>
            <p className="text-gray-700">{insight}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsGptInsights;
