
interface ResultsGptInsightsProps {
  gptResults: {
    extra?: string;
  } | null;
}

const ResultsGptInsights: React.FC<ResultsGptInsightsProps> = ({ gptResults }) => {
  if (!gptResults?.extra) return null;

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-2">
      <h2 className="text-lg font-semibold text-gray-800">הרחבות מבוססות AI</h2>
      <p className="text-gray-700 whitespace-pre-line">{gptResults.extra}</p>
    </div>
  );
};

export default ResultsGptInsights;
