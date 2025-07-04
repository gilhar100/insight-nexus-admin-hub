
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';

interface SalimaScoreDistributionChartProps {
  participants: Array<{
    dimension_s: number;
    dimension_l: number;
    dimension_i: number;
    dimension_m: number;
    dimension_a: number;
    dimension_a2: number;
  }>;
}

const DIMENSION_NAMES = {
  dimension_s: 'אסטרטגיה',
  dimension_l: 'למידה',
  dimension_i: 'השראה',
  dimension_m: 'משמעות',
  dimension_a: 'הסתגלות',   // dimension_a is adaptability
  dimension_a2: 'אותנטיות'  // dimension_a2 is authenticity
};

const SCORE_RANGES = [
  { min: 1, max: 2.9, label: '1.0-2.9' },
  { min: 3, max: 3.49, label: '3.0-3.49' },
  { min: 3.5, max: 3.99, label: '3.5-3.99' },
  { min: 4, max: 5, label: '4.0-5.0' }
];

export const SalimaScoreDistributionChart: React.FC<SalimaScoreDistributionChartProps> = ({ participants }) => {
  const chartData = SCORE_RANGES.map(range => {
    const rangeData: any = { range: range.label };

    Object.entries(DIMENSION_NAMES).forEach(([key, name]) => {
      const count = participants.filter(participant => {
        const score = participant[key as keyof typeof participant];
        return score >= range.min && score <= range.max;
      }).length;
      rangeData[name] = count;
    });

    return rangeData;
  });

  const COLORS = ['#3B82F6', '#10B981', '#EF4444', '#8B5CF6', '#F59E0B', '#EC4899'];

  return (
    <ChartContainer config={{}} className="h-96 presenter-mode:h-[500px]" dir="rtl">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="range" 
            tick={{ fontSize: 14, fontWeight: 'bold' }}
            label={{ 
              value: 'טווח ציונים', 
              position: 'insideBottom', 
              offset: -5,
              style: { fontSize: '16px', fontWeight: 'bold' }
            }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            label={{ 
              value: 'מספר משתתפים', 
              angle: -90, 
              position: 'insideLeft',
              style: { fontSize: '16px', fontWeight: 'bold' }
            }}
          />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-4 border rounded shadow-lg text-right">
                    <p className="font-bold text-lg">טווח: {label}</p>
                    {payload.map((entry, index) => (
                      <p key={index} style={{ color: entry.color }} className="text-base font-semibold">
                        {entry.dataKey}: {entry.value} משתתפים
                      </p>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend 
            wrapperStyle={{ 
              textAlign: 'right', 
              fontSize: '14px', 
              fontWeight: 'bold',
              paddingTop: '20px'
            }}
            formatter={(value) => <span className="presenter-mode:text-lg">{value}</span>}
          />
          {Object.values(DIMENSION_NAMES).map((dimension, index) => (
            <Bar 
              key={dimension}
              dataKey={dimension} 
              stackId="a" 
              fill={COLORS[index]}
              stroke="#000000"
              strokeWidth={0.5}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
