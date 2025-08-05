
interface ResultsScoreDisplayProps {
  results: {
    averageScore: number;
  };
}

const ResultsScoreDisplay: React.FC<ResultsScoreDisplayProps> = ({ results }) => {
  return (
    <div className="flex flex-col items-center gap-2 bg-white rounded-xl p-6 shadow-md">
      <div className="text-lg text-gray-600">ציון מנהיגות כללי</div>
      <div className="text-5xl font-bold text-blue-600">
        {results.averageScore.toFixed(2)} / 5
      </div>
    </div>
  );
};

export default ResultsScoreDisplay;
