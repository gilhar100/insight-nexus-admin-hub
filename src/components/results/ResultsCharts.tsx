
import ResultsRadar from "@/components/results/ResultsRadar";
import DivergingBarChart from "@/components/results/DivergingBarChart";
import PersonalColorProfile from "@/components/results/PersonalColorProfile";

interface ResultsChartsProps {
  result: any;
}

const ResultsCharts: React.FC<ResultsChartsProps> = ({ result }) => {
  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      <div className="mobile-stack flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6">
        <div className="w-full lg:w-1/2">
          <div className="chart-container">
            <DivergingBarChart result={result} />
          </div>
        </div>
        <div className="w-full lg:w-1/2">
          <div className="bg-white rounded-lg p-2 sm:p-3 lg:p-4 shadow-sm chart-container">
            <ResultsRadar result={result} hideScores={true} />
          </div>
        </div>
      </div>

      <div className="w-full chart-container">
        <PersonalColorProfile result={result} />
      </div>
    </div>
  );
};

export default ResultsCharts;
