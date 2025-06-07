
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { WOCA_ZONE_COLORS } from '@/utils/wocaColors';
import { WocaCategoryScores } from '@/utils/wocaAnalysis';

interface WocaCategoryRadarChartProps {
  categoryScores: WocaCategoryScores;
}

const chartConfig = {
  score: {
    label: "ציון ממוצע",
    color: "#2563eb",
  },
};

export const WocaCategoryRadarChart: React.FC<WocaCategoryRadarChartProps> = ({ categoryScores }) => {
  const chartData = [
    {
      category: 'הזדמנות',
      score: Math.round(categoryScores.opportunity * 10) / 10,
      fullMark: 5,
      color: WOCA_ZONE_COLORS.opportunity
    },
    {
      category: 'נוחות',
      score: Math.round(categoryScores.comfort * 10) / 10,
      fullMark: 5,
      color: WOCA_ZONE_COLORS.comfort
    },
    {
      category: 'אדישות',
      score: Math.round(categoryScores.apathy * 10) / 10,
      fullMark: 5,
      color: WOCA_ZONE_COLORS.apathy
    },
    {
      category: 'מלחמה',
      score: Math.round(categoryScores.war * 10) / 10,
      fullMark: 5,
      color: WOCA_ZONE_COLORS.war
    }
  ];

  return (
    <ChartContainer config={chartConfig} className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <PolarGrid />
          <PolarAngleAxis dataKey="category" />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 5]} 
            tick={{ fontSize: 10 }}
            tickCount={6}
          />
          <Radar
            name="ציון WOCA"
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
