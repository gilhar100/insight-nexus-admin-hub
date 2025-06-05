
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { WocaScores, ZONE_HEBREW_NAMES } from '@/utils/wocaScoring';

interface WocaZoneComparisonChartProps {
  scores: WocaScores;
  title?: string;
}

const chartConfig = {
  score: {
    label: "ציון ממוצע",
    color: "#2563eb",
  },
};

const ZONE_COLORS = {
  war: '#EF4444',
  opportunity: '#10B981',
  comfort: '#3B82F6',
  apathy: '#F59E0B'
};

export const WocaZoneComparisonChart: React.FC<WocaZoneComparisonChartProps> = ({ 
  scores, 
  title = "השוואת ציוני אזורי תודעה" 
}) => {
  console.log('Zone Comparison Chart scores:', scores);

  // Convert scores to chart data
  const chartData = Object.entries(scores).map(([key, value]) => ({
    zone: ZONE_HEBREW_NAMES[key as keyof typeof ZONE_HEBREW_NAMES],
    score: Number(value.toFixed(2)),
    color: ZONE_COLORS[key as keyof typeof ZONE_COLORS],
    key: key
  })).sort((a, b) => b.score - a.score); // Sort by score descending

  console.log('Chart data:', chartData);

  // Don't render if no valid data
  if (chartData.every(item => item.score === 0)) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500">
        אין נתונים להצגה
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center">{title}</h3>
      <ChartContainer config={chartConfig} className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="zone" 
              className="text-xs"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              domain={[0, 5]}
              label={{ value: 'ציון ממוצע', angle: -90, position: 'insideLeft' }}
            />
            <ChartTooltip 
              content={<ChartTooltipContent />}
              formatter={(value: any, name: any, props: any) => [
                `${value}`,
                'ציון ממוצע'
              ]}
              labelFormatter={(label: any) => `אזור ${label}`}
            />
            <Bar dataKey="score" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};
