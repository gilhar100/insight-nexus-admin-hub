
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface SalimaRadarChartProps {
  data: {
    dimension: string;
    score: number;
    color: string;
  }[];
}

const chartConfig = {
  score: {
    label: "Score",
    color: "#2563eb",
  },
};

export const SalimaRadarChart: React.FC<SalimaRadarChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    dimension: item.dimension,
    score: item.score,
    fullMark: 5
  }));

  return (
    <ChartContainer config={chartConfig} className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <PolarGrid />
          <PolarAngleAxis dataKey="dimension" />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 5]} 
            tick={{ fontSize: 10 }}
            tickCount={6}
          />
          <Radar
            name="SALIMA Score"
            dataKey="score"
            stroke="#2563eb"
            fill="#2563eb"
            fillOpacity={0.1}
            strokeWidth={2}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
        </RadarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
