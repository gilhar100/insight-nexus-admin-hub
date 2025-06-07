
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WOCA_ZONE_COLORS } from '@/utils/wocaColors';

interface GapAnalysisChartProps {
  groupCategoryScores: {
    opportunity: number;
    comfort: number;
    apathy: number;
    war: number;
  };
}

export const GapAnalysisChart: React.FC<GapAnalysisChartProps> = ({ 
  groupCategoryScores 
}) => {
  const opportunityScore = groupCategoryScores.opportunity;
  
  const data = [
    {
      name: 'הזדמנות',
      score: groupCategoryScores.opportunity * 20,
      delta: 0,
      color: WOCA_ZONE_COLORS.opportunity
    },
    {
      name: 'נוחות',
      score: groupCategoryScores.comfort * 20,
      delta: (groupCategoryScores.comfort - opportunityScore) * 20,
      color: WOCA_ZONE_COLORS.comfort
    },
    {
      name: 'אדישות',
      score: groupCategoryScores.apathy * 20,
      delta: (groupCategoryScores.apathy - opportunityScore) * 20,
      color: WOCA_ZONE_COLORS.apathy
    },
    {
      name: 'מלחמה',
      score: groupCategoryScores.war * 20,
      delta: (groupCategoryScores.war - opportunityScore) * 20,
      color: WOCA_ZONE_COLORS.war
    }
  ].sort((a, b) => b.score - a.score);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-lg text-right" dir="rtl">
          <p className="font-semibold">{label}</p>
          <p>ציון ממוצע: {data.score.toFixed(1)}%</p>
          {data.delta !== 0 && (
            <p className={data.delta > 0 ? 'text-green-600' : 'text-red-600'}>
              פער מהזדמנות: {data.delta > 0 ? '+' : ''}{data.delta.toFixed(1)}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          tick={{ textAnchor: 'middle' }}
        />
        <YAxis 
          domain={[0, 100]}
          label={{ value: 'ציון (%)', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="score" 
          fill={(entry) => entry.color}
          radius={[4, 4, 0, 0]}
        >
          {data.map((entry, index) => (
            <Bar key={`bar-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
