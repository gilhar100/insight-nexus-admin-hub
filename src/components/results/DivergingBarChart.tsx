
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface DivergingBarChartProps {
  result: {
    dimensions: {
      [dimension: string]: {
        name: string;
        score: number;
      };
    };
  };
}

const DivergingBarChart: React.FC<DivergingBarChartProps> = ({ result }) => {
  const data = Object.entries(result.dimensions).map(([key, { name, score }]) => ({
    dimension: name,
    score,
  }));

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-center">ציוני הממדים</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="horizontal">
          <XAxis type="number" domain={[0, 5]} />
          <YAxis dataKey="dimension" type="category" width={100} />
          <Bar dataKey="score" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DivergingBarChart;
