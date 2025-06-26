
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { WocaCategoryScores } from '@/utils/wocaAnalysis';
import { WOCA_COLORS } from '@/utils/wocaColors';

interface WocaGroupBarChartProps {
  groupCategoryScores: WocaCategoryScores;
}

export const WocaGroupBarChart: React.FC<WocaGroupBarChartProps> = ({ groupCategoryScores }) => {
  console.log('WocaGroupBarChart received groupCategoryScores:', groupCategoryScores);

  // Check if we have valid data
  if (!groupCategoryScores || typeof groupCategoryScores !== 'object') {
    console.error('Invalid groupCategoryScores:', groupCategoryScores);
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <p className="text-gray-500">אין נתונים זמינים</p>
      </div>
    );
  }

  // Apply nonlinear scaling to exaggerate differences while maintaining ratios
  const applyScaling = (value: number) => {
    if (typeof value !== 'number' || isNaN(value)) return 0;
    return Math.pow(value, 1.5);
  };

  const data = [
    {
      zone: 'הזדמנות',
      value: applyScaling(groupCategoryScores.opportunity || 0),
      color: WOCA_COLORS['הזדמנות']
    },
    {
      zone: 'נוחות', 
      value: applyScaling(groupCategoryScores.comfort || 0),
      color: WOCA_COLORS['נוחות']
    },
    {
      zone: 'אדישות',
      value: applyScaling(groupCategoryScores.apathy || 0),
      color: WOCA_COLORS['אדישות']
    },
    {
      zone: 'מלחמה',
      value: applyScaling(groupCategoryScores.war || 0),
      color: WOCA_COLORS['מלחמה']
    }
  ];

  console.log('WocaGroupBarChart processed data:', data);

  return (
    <div className="w-full" style={{ height: '256px' }} dir="rtl">
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
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
