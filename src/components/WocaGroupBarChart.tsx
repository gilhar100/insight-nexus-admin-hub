
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { WocaCategoryScores } from '@/utils/wocaAnalysis';
import { WOCA_COLORS } from '@/utils/wocaColors';

interface WocaGroupBarChartProps {
  groupCategoryScores: WocaCategoryScores;
}

export const WocaGroupBarChart: React.FC<WocaGroupBarChartProps> = ({ groupCategoryScores }) => {
  console.log('📊 WocaGroupBarChart received groupCategoryScores:', groupCategoryScores);

  // Check if we have valid data
  if (!groupCategoryScores || typeof groupCategoryScores !== 'object') {
    console.error('❌ Invalid groupCategoryScores:', groupCategoryScores);
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <p className="text-gray-500">אין נתונים זמינים</p>
      </div>
    );
  }

  // Apply nonlinear scaling to exaggerate differences while maintaining ratios
  const applyScaling = (value: number) => {
    if (typeof value !== 'number' || isNaN(value) || value <= 0) return 0.1; // Minimum value for visibility
    return Math.pow(value, 1.5);
  };

  // Prepare data in the specified order with Hebrew labels
  const data = [
    {
      zone: 'הזדמנות',
      value: applyScaling(groupCategoryScores.opportunity || 0),
      color: '#009E73'
    },
    {
      zone: 'נוחות', 
      value: applyScaling(groupCategoryScores.comfort || 0),
      color: '#F0E442'
    },
    {
      zone: 'אדישות',
      value: applyScaling(groupCategoryScores.apathy || 0),
      color: '#E69F00'
    },
    {
      zone: 'מלחמה',
      value: applyScaling(groupCategoryScores.war || 0),
      color: '#0072B2'
    }
  ];

  console.log('📊 WocaGroupBarChart processed data:', data);

  return (
    <div className="w-full h-80" dir="rtl">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          barCategoryGap="20%"
        >
          <XAxis 
            dataKey="zone" 
            axisLine={false}
            tickLine={false}
            tick={{ 
              fontSize: 16, 
              fill: '#1f2937', 
              fontWeight: 'bold',
              textAnchor: 'middle'
            }}
            height={60}
          />
          <YAxis hide />
          <Bar 
            dataKey="value" 
            radius={[4, 4, 0, 0]}
            maxBarSize={120}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
