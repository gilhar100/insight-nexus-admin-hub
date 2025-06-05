
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface WocaRadarChartProps {
  participants: Array<{
    woca_scores: {
      war: number;
      opportunity: number;
      comfort: number;
      apathy: number;
    };
  }>;
}

const chartConfig = {
  average: {
    label: "ציון ממוצע",
    color: "#2563eb",
  },
};

export const WocaRadarChart: React.FC<WocaRadarChartProps> = ({ participants }) => {
  console.log('Radar Chart participants:', participants);
  
  // Calculate average scores for each WOCA parameter
  const parameters = [
    { key: 'war', label: 'מלחמה' },
    { key: 'opportunity', label: 'הזדמנות' },
    { key: 'comfort', label: 'נוחות' },
    { key: 'apathy', label: 'אדישות' }
  ];
  
  const chartData = parameters.map(parameter => {
    // Extract scores for this parameter, filtering out invalid values
    const scores = participants
      .map(p => p.woca_scores?.[parameter.key as keyof typeof p.woca_scores])
      .filter(score => score !== null && score !== undefined && score > 0) as number[];

    // Calculate average if we have valid scores, otherwise default to 0
    const average = scores.length > 0 
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length 
      : 0;

    return {
      parameter: parameter.label,
      average: Math.round(average * 100) / 100,
      fullMark: 5
    };
  });

  console.log('Radar chart data:', chartData);

  // Don't render if no valid data
  if (chartData.every(item => item.average === 0)) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500">
        אין נתונים להצגה
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <PolarGrid />
          <PolarAngleAxis dataKey="parameter" className="text-sm" />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 5]} 
            tick={{ fontSize: 10 }}
            tickCount={6}
          />
          <Radar
            name="ממוצע פרמטרי WOCA"
            dataKey="average"
            stroke="#2563eb"
            fill="#2563eb"
            fillOpacity={0.1}
            strokeWidth={2}
          />
          <ChartTooltip 
            content={<ChartTooltipContent />}
            formatter={(value: any) => [value?.toFixed(2), 'ציון ממוצע']}
          />
        </RadarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
