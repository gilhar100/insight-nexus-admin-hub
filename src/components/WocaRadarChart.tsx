
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface WocaRadarChartProps {
  participants: Array<{
    scores: any;
    overall_score: number | null;
    question_responses?: any;
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
  const indicators = ['נכונות', 'הזדמנות', 'יכולת', 'חרדה'];
  
  const chartData = indicators.map(indicator => {
    const scores = participants
      .map(p => {
        if (!p.scores && !p.question_responses) return null;
        // Extract relevant scores based on indicator
        // This is a simplified mapping - you may need to adjust based on your actual score structure
        switch (indicator) {
          case 'נכונות':
            return p.scores?.willingness || p.overall_score;
          case 'הזדמנות':
            return p.scores?.opportunity || p.overall_score;
          case 'יכולת':
            return p.scores?.capability || p.overall_score;
          case 'חרדה':
            return p.scores?.anxiety || p.overall_score;
          default:
            return p.overall_score;
        }
      })
      .filter(score => score !== null) as number[];

    const average = scores.length > 0 
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length 
      : 0;

    return {
      indicator,
      average: Math.round(average * 10) / 10,
      fullMark: 5
    };
  });

  return (
    <ChartContainer config={chartConfig} className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <PolarGrid />
          <PolarAngleAxis 
            dataKey="indicator" 
            tick={{ fontSize: 12, fontFamily: 'Arial, sans-serif' }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 5]} 
            tick={{ fontSize: 10 }}
            tickCount={6}
          />
          <Radar
            name="WOCA ממוצע"
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
