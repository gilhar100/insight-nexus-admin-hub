
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

interface ResultsRadarProps {
  result: {
    dimensions: {
      [dimension: string]: {
        name: string;
        score: number;
      };
    };
  };
  hideScores?: boolean;
}

const ResultsRadar: React.FC<ResultsRadarProps> = ({ result, hideScores = false }) => {
  const data = Object.entries(result.dimensions).map(([key, { name, score }]) => ({
    dimension: name,
    score,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="dimension" />
        <PolarRadiusAxis domain={[0, 5]} />
        <Radar name="Score" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default ResultsRadar;
