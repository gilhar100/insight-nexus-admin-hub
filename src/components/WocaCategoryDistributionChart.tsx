
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { WocaCategoryScores } from '@/utils/wocaAnalysis';

interface WocaCategoryDistributionChartProps {
  categoryScores: WocaCategoryScores;
  participantCount: number;
}

const chartConfig = {
  score: {
    label: "ציון ממוצע",
    color: "#2563eb",
  },
};

export const WocaCategoryDistributionChart: React.FC<WocaCategoryDistributionChartProps> = ({ 
  categoryScores, 
  participantCount 
}) => {
  const chartData = [
    {
      category: 'מלחמה',
      categoryEn: 'War',
      score: Math.round(categoryScores.War * 10) / 10,
      color: '#EF4444'
    },
    {
      category: 'אדישות',
      categoryEn: 'Apathy',
      score: Math.round(categoryScores.Apathy * 10) / 10,
      color: '#F59E0B'
    },
    {
      category: 'נוחות',
      categoryEn: 'Comfort',
      score: Math.round(categoryScores.Comfort * 10) / 10,
      color: '#3B82F6'
    },
    {
      category: 'הזדמנות',
      categoryEn: 'Opportunity',
      score: Math.round(categoryScores.Opportunity * 10) / 10,
      color: '#10B981'
    }
  ];

  return (
    <ChartContainer config={chartConfig} className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="category" 
            tick={{ fontSize: 12, fontFamily: 'Arial, sans-serif' }}
          />
          <YAxis 
            domain={[0, 5]}
            tick={{ fontSize: 10 }}
          />
          <ChartTooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 border rounded shadow-lg">
                    <p className="font-medium">{data.category}</p>
                    <p style={{ color: data.color }}>ציון: {data.score.toFixed(1)}</p>
                    <p className="text-sm text-gray-600">{participantCount} משתתפים</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar 
            dataKey="score" 
            radius={[4, 4, 0, 0]}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
