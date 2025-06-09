
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { WOCA_ZONE_COLORS } from '@/utils/wocaColors';

interface GapAnalysisChartProps {
  categoryScores: {
    opportunity: number;
    comfort: number;
    apathy: number;
    war: number;
  };
}

export const GapAnalysisChart: React.FC<GapAnalysisChartProps> = ({ categoryScores }) => {
  const { opportunity = 0, comfort = 0, apathy = 0, war = 0 } = categoryScores;

  const barData = [
    { name: 'הזדמנות', value: opportunity, color: WOCA_ZONE_COLORS.opportunity },
    { name: 'נוחות', value: comfort, color: WOCA_ZONE_COLORS.comfort },
    { name: 'אדישות', value: apathy, color: WOCA_ZONE_COLORS.apathy },
    { name: 'מלחמה', value: war, color: WOCA_ZONE_COLORS.war },
  ];

  const values = [opportunity, comfort, apathy, war];
  const min = Math.min(...values);
  const max = Math.max(...values);
  
  // Ensure we have a reasonable domain even if all values are the same
  const domainMin = min > 0 ? Math.max(0, min - 0.5) : 0;
  const domainMax = max > 0 ? max + 0.5 : 5;

  return (
    <div className="w-full px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-center text-right">השוואת ציונים לפי אזורים</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={barData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 80, bottom: 10 }}
            barCategoryGap={20}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              domain={[domainMin, domainMax]}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              tick={{ fontSize: 14, textAnchor: 'end' }} 
              width={70}
            />
            <Tooltip 
              formatter={(value: number) => [value.toFixed(2), 'ציון']}
              labelFormatter={(label) => `אזור: ${label}`}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
              {barData.map((entry, index) => (
                <Cell key={`bar-cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
