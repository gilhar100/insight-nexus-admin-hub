
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';

interface SalimaDimensionPieChartProps {
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
  dimension_a: 'אותנטיות',
  dimension_a2: 'הסתגלות'
};

const COLORS = ['#3B82F6', '#10B981', '#EF4444', '#8B5CF6', '#EC4899', '#F59E0B'];

export const SalimaDimensionPieChart: React.FC<SalimaDimensionPieChartProps> = ({ participants }) => {
  // Calculate strongest dimension for each participant
  const dimensionCounts = {
    'אסטרטגיה': 0,
    'למידה': 0,
    'השראה': 0,
    'משמעות': 0,
    'אותנטיות': 0,
    'הסתגלות': 0
  };

  participants.forEach(participant => {
    const scores = {
      dimension_s: participant.dimension_s,
      dimension_l: participant.dimension_l,
      dimension_i: participant.dimension_i,
      dimension_m: participant.dimension_m,
      dimension_a: participant.dimension_a,
      dimension_a2: participant.dimension_a2
    };

    // Find the dimension with highest score
    const maxDimension = Object.entries(scores).reduce((a, b) => 
      scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b
    )[0] as keyof typeof DIMENSION_NAMES;

    dimensionCounts[DIMENSION_NAMES[maxDimension]]++;
  });

  const chartData = Object.entries(dimensionCounts)
    .filter(([_, count]) => count > 0)
    .map(([dimension, count]) => ({
      name: dimension,
      value: count,
      percentage: ((count / participants.length) * 100).toFixed(1)
    }));

  return (
    <ChartContainer config={{}} className="h-80" dir="rtl">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) => `${name} (${percentage}%)`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 border rounded shadow-lg text-right">
                    <p className="font-semibold">{data.name}</p>
                    <p>משתתפים: {data.value}</p>
                    <p>אחוז: {data.percentage}%</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend 
            wrapperStyle={{ textAlign: 'right' }}
            formatter={(value) => value}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
