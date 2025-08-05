
import ResultsRadar from "@/components/results/ResultsRadar";
import DivergingBarChart from "@/components/results/DivergingBarChart";
import PersonalColorProfile from "@/components/results/PersonalColorProfile";

interface ResultsChartsProps {
  result: any;
}

const ResultsCharts: React.FC<ResultsChartsProps> = ({ result }) => {
  return (
    <div className="space-y-6">
      {/* Charts Row - Radar and Color Wheel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-center">פרופיל מנהיגיות SALIMA</h3>
          <ResultsRadar result={result} />
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-center">ממדי SALIMA</h3>
          <h4 className="text-sm text-gray-600 mb-4 text-center">ממוצע אישי: {result.averageScore?.toFixed(2) || '2.48'}</h4>
          <PersonalColorProfile result={result} showAsWheel={true} />
        </div>
      </div>
    </div>
  );
};

export default ResultsCharts;
