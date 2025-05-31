
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

// SALIMA dimension colors
const SALIMA_COLORS = {
  'Strategy': '#3B82F6', // Blue
  'Learning': '#10B981', // Green
  'Inspiration': '#EF4444', // Red
  'Adaptability': '#F59E0B', // Orange
  'Authenticity': '#EC4899', // Pink
  'Meaning': '#8B5CF6' // Purple
};

export const SalimaRadarChart: React.FC<SalimaRadarChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    dimension: item.dimension,
    score: item.score,
    fullMark: 5,
    color: SALIMA_COLORS[item.dimension as keyof typeof SALIMA_COLORS] || item.color
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
