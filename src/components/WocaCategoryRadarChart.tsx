
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
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
      categoryEn: 'Opportunity',
      score: Math.round(categoryScores.Opportunity * 10) / 10,
      fullMark: 5
    },
    {
      category: 'נוחות',
      categoryEn: 'Comfort',
      score: Math.round(categoryScores.Comfort * 10) / 10,
      fullMark: 5
    },
    {
      category: 'אדישות',
      categoryEn: 'Apathy',
      score: Math.round(categoryScores.Apathy * 10) / 10,
      fullMark: 5
    },
    {
      category: 'מלחמה',
      categoryEn: 'War',
      score: Math.round(categoryScores.War * 10) / 10,
      fullMark: 5
    }
  ];

  return (
    <ChartContainer config={chartConfig} className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <PolarGrid />
          <PolarAngleAxis 
            dataKey="category" 
            tick={{ fontSize: 12, fontFamily: 'Arial, sans-serif' }}
          />
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
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <ChartTooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 border rounded shadow-lg">
                    <p className="font-medium">{data.category}</p>
                    <p className="text-blue-600">ציון: {data.score.toFixed(1)}</p>
                  </div>
                );
              }
              return null;
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
