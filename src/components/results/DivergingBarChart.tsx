
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";

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
    name,
    score,
  }));

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-center">ציוני הממדים</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 5]} />
          <YAxis dataKey="name" type="category" width={100} />
          <Tooltip />
          <Bar dataKey="score" fill="#60a5fa">
            <LabelList dataKey="score" position="right" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DivergingBarChart;
