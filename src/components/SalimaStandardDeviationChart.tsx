
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';

interface SalimaStandardDeviationChartProps {
  participants: Array<{
    dimension_s: number;
    dimension_l: number;
    dimension_i: number;
    dimension_m: number;
    dimension_a: number;
    dimension_a2: number;
  }>;
}

const chartConfig = {
  deviation: {
    label: "סטיית תקן",
    color: "#f59e0b",
  },
};

export const SalimaStandardDeviationChart: React.FC<SalimaStandardDeviationChartProps> = ({ participants }) => {
  // Calculate standard deviation for each dimension
  const calculateStdDev = (values: number[]) => {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  };

  const dimensions = [
    { key: 'dimension_s', name: 'אסטרטגיה', values: participants.map(p => p.dimension_s) },
    { key: 'dimension_a', name: 'הסתגלות', values: participants.map(p => p.dimension_a) },
    { key: 'dimension_l', name: 'למידה', values: participants.map(p => p.dimension_l) },
    { key: 'dimension_i', name: 'השראה', values: participants.map(p => p.dimension_i) },
    { key: 'dimension_m', name: 'משמעות', values: participants.map(p => p.dimension_m) },
    { key: 'dimension_a2', name: 'אותנטיות', values: participants.map(p => p.dimension_a2) }
  ];

  const chartData = dimensions.map(dim => ({
    dimension: dim.name,
    deviation: calculateStdDev(dim.values)
  }));

  // Find highest deviation for highlighting
  const maxDeviation = Math.max(...chartData.map(d => d.deviation));
  const highestDeviationDimension = chartData.find(d => d.deviation === maxDeviation)?.dimension;

  return (
    <div className="w-full h-full">
      <ChartContainer config={chartConfig} className="h-full w-full" dir="rtl">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="dimension" 
              tick={{ fontSize: 12, fontWeight: 'bold', fill: '#1e293b' }}
              textAnchor="middle"
              angle={-45}
              height={80}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#64748b' }}
              label={{ value: 'סטיית תקן', angle: -90, position: 'insideLeft', style: { fontSize: '14px', fontWeight: 'bold' } }}
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const value = payload[0].value;
                  return (
                    <div className="bg-white p-3 border rounded shadow-lg text-right">
                      <p className="font-semibold text-lg">{label}</p>
                      <p className="text-orange-600 text-base">
                        סטיית תקן: {typeof value === 'number' ? value.toFixed(2) : value}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="deviation">
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill="#f59e0b"
                  stroke={entry.dimension === highestDeviationDimension ? "#dc2626" : "none"}
                  strokeWidth={entry.dimension === highestDeviationDimension ? 2 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
      <p className="text-center text-gray-600 mt-2 text-sm">
        הממד עם הפיזור הרחב ביותר הוא <strong>{highestDeviationDimension}</strong> – סימן לפערים בתפיסות או בהתנהלות.
      </p>
    </div>
  );
};
