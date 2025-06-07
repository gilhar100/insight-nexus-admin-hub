
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
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
  
  // Create data with deltas and sort by gap size
  const data = [
    {
      name: 'הזדמנות',
      score: 0, // Reference point
      delta: 0,
      originalScore: opportunityScore * 20,
      color: WOCA_ZONE_COLORS.opportunity,
      isReference: true
    },
    {
      name: 'נוחות',
      score: (groupCategoryScores.comfort - opportunityScore) * 20,
      delta: (groupCategoryScores.comfort - opportunityScore) * 20,
      originalScore: groupCategoryScores.comfort * 20,
      color: WOCA_ZONE_COLORS.comfort,
      isReference: false
    },
    {
      name: 'אדישות',
      score: (groupCategoryScores.apathy - opportunityScore) * 20,
      delta: (groupCategoryScores.apathy - opportunityScore) * 20,
      originalScore: groupCategoryScores.apathy * 20,
      color: WOCA_ZONE_COLORS.apathy,
      isReference: false
    },
    {
      name: 'מלחמה',
      score: (groupCategoryScores.war - opportunityScore) * 20,
      delta: (groupCategoryScores.war - opportunityScore) * 20,
      originalScore: groupCategoryScores.war * 20,
      color: WOCA_ZONE_COLORS.war,
      isReference: false
    }
  ].sort((a, b) => {
    // Opportunity always at top
    if (a.isReference) return -1;
    if (b.isReference) return 1;
    // Sort others by gap size (largest negative gap first)
    return a.score - b.score;
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-lg text-right" dir="rtl">
          <p className="font-semibold">{label}</p>
          <p>ציון ממוצע: {data.originalScore.toFixed(1)}%</p>
          {!data.isReference && (
            <p className={data.delta > 0 ? 'text-green-600' : 'text-red-600'}>
              פער מהזדמנות: {data.delta > 0 ? '+' : ''}{data.delta.toFixed(1)}%
            </p>
          )}
          {data.isReference && (
            <p className="text-blue-600">נקודת ייחוס</p>
          )}
        </div>
      );
    }
    return null;
  };

  const CustomLabel = (props: any) => {
    const { value, x, y, width, height, payload } = props;
    if (payload.isReference) {
      return (
        <text
          x={x + width / 2}
          y={y - 5}
          textAnchor="middle"
          fill="#333"
          fontSize="12"
          fontWeight="bold"
        >
          {`${payload.originalScore.toFixed(1)}%`}
        </text>
      );
    }
    return (
      <text
        x={x + width / 2}
        y={value < 0 ? y + height + 15 : y - 5}
        textAnchor="middle"
        fill="#333"
        fontSize="12"
        fontWeight="bold"
      >
        {value.toFixed(1)}%
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 30, right: 30, left: 20, bottom: 30 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          tick={{ textAnchor: 'middle' }}
        />
        <YAxis 
          domain={['dataMin - 5', 'dataMax + 5']}
          label={{ value: 'פער (%)', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="score" 
          radius={[4, 4, 0, 0]}
        >
          <LabelList content={<CustomLabel />} />
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
