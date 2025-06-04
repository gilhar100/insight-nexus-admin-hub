
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { WOCA_INDICATORS_HEBREW } from '@/utils/wocaHebrewConstants';

interface WocaRadarChartProps {
  participants: Array<{
    scores: any;
    overall_score: number | null;
  }>;
}

const chartConfig = {
  average: {
    label: "ציון ממוצע",
    color: "#2563eb",
  },
};

export const WocaRadarChart: React.FC<WocaRadarChartProps> = ({ participants }) => {
  // Calculate average scores for each WOCA indicator
  const indicators = [
    { key: 'willingness', label: WOCA_INDICATORS_HEBREW.willingness },
    { key: 'opportunity', label: WOCA_INDICATORS_HEBREW.opportunity },
    { key: 'capability', label: WOCA_INDICATORS_HEBREW.capability },
    { key: 'anxiety', label: WOCA_INDICATORS_HEBREW.anxiety }
  ];
  
  const chartData = indicators.map(indicator => {
    const scores = participants
      .map(p => {
        if (!p.scores) return null;
        return p.scores[indicator.key] || p.overall_score;
      })
      .filter(score => score !== null) as number[];

    const average = scores.length > 0 
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length 
      : 0;

    return {
      indicator: indicator.label,
      average: Math.round(average * 10) / 10,
      fullMark: 5
    };
  });

  return (
    <ChartContainer config={chartConfig} className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <PolarGrid />
          <PolarAngleAxis dataKey="indicator" />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 5]} 
            tick={{ fontSize: 10 }}
            tickCount={6}
          />
          <Radar
            name="ממוצע WOCA"
            dataKey="average"
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
