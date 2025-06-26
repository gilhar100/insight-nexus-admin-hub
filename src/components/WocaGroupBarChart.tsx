
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { WocaCategoryScores } from '@/utils/wocaAnalysis';
import { WOCA_COLORS } from '@/utils/wocaColors';

interface WocaGroupBarChartProps {
  groupCategoryScores: WocaCategoryScores;
}

export const WocaGroupBarChart: React.FC<WocaGroupBarChartProps> = ({ groupCategoryScores }) => {
  // Apply nonlinear scaling to exaggerate differences while maintaining ratios
  const applyScaling = (value: number) => Math.pow(value, 1.5);

  const data = [
    {
      zone: 'הזדמנות',
      value: applyScaling(groupCategoryScores.opportunity),
      color: WOCA_COLORS['הזדמנות']
    },
    {
      zone: 'נוחות', 
      value: applyScaling(groupCategoryScores.comfort),
      color: WOCA_COLORS['נוחות']
    },
    {
      zone: 'אדישות',
      value: applyScaling(groupCategoryScores.apathy),
      color: WOCA_COLORS['אדישות']
    },
    {
      zone: 'מלחמה',
      value: applyScaling(groupCategoryScores.war),
      color: WOCA_COLORS['מלחמה']
    }
  ];

  return (
    <div className="w-full h-64" dir="rtl">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="horizontal"
          margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
        >
          <XAxis type="number" hide />
          <YAxis 
            type="category" 
            dataKey="zone" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 14, fill: '#000000', textAnchor: 'end' }}
            width={70}
          />
          <Bar 
            dataKey="value" 
            fill={(entry) => entry.color}
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
