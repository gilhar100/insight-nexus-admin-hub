
interface ResultsSummaryCardsProps {
  results: {
    dimensions: {
      [dimension: string]: {
        name: string;
        score: number;
      };
    };
  };
}

const ResultsSummaryCards: React.FC<ResultsSummaryCardsProps> = ({ results }) => {
  const dimensionsArray = Object.values(results.dimensions);
  const highest = dimensionsArray.reduce((a, b) => (a.score > b.score ? a : b));
  const lowest = dimensionsArray.reduce((a, b) => (a.score < b.score ? a : b));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-xl shadow text-center">
        <div className="text-sm text-gray-500">הממד החזק ביותר</div>
        <div className="text-xl font-bold text-green-600">{highest.name}</div>
        <div className="text-base text-gray-600">{highest.score.toFixed(2)}</div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow text-center">
        <div className="text-sm text-gray-500">הממד החלש ביותר</div>
        <div className="text-xl font-bold text-red-600">{lowest.name}</div>
        <div className="text-base text-gray-600">{lowest.score.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default ResultsSummaryCards;
