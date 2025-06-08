
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
  const buffer = (max - min) * 0.5 || 0.5;

  return (
    <div className="w-full px-4 py-6">
      {/* Enhanced Gap Analysis Bar Chart without X-axis numbers and without Legend */}
      <div className="max-w-3xl mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-center">השוואת ציונים לפי אזורים</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={barData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 60, bottom: 10 }}
            barCategoryGap={30}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              domain={[min - buffer, max + buffer]}
              tick={false}
              axisLine={false}
              tickLine={false}
            />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 14 }} width={100} />
            <Tooltip formatter={(value: number) => value.toFixed(2)} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]}>
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
