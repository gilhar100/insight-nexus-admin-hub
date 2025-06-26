
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { WocaCategoryScores } from '@/utils/wocaAnalysis';
import { WOCA_COLORS } from '@/utils/wocaColors';
import { CHART_MARGINS, CHART_DIMENSIONS, CHART_STYLES } from '@/utils/chartConfig';

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
    <div className="w-full" dir="rtl" style={{ height: CHART_DIMENSIONS.horizontalBarHeight }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="horizontal"
          margin={CHART_MARGINS.horizontalBar}
        >
          <XAxis type="number" hide />
          <YAxis 
            type="category" 
            dataKey="zone" 
            axisLine={false}
            tickLine={false}
            tick={{ ...CHART_STYLES.tickStyle, textAnchor: 'end' }}
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
