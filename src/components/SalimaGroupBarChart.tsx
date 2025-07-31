
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface SalimaGroupBarChartProps {
  data: {
    dimension: string;
    score: number;
    color: string;
  }[];
}

const chartConfig = {
  score: {
    label: "ציון",
    color: "#2563eb",
  },
};

export const SalimaGroupBarChart: React.FC<SalimaGroupBarChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    dimension: item.dimension,
    score: item.score,
    fill: item.color
  }));

  return (
    <ChartContainer config={chartConfig} className="h-80 w-full" dir="rtl">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="dimension" 
            tick={{ fontSize: 14, fontWeight: 'bold' }}
            textAnchor="middle"
          />
          <YAxis 
            domain={[0, 5]} 
            tick={{ fontSize: 12 }}
            label={{ value: 'ציון', angle: -90, position: 'insideLeft', style: { fontSize: '14px', fontWeight: 'bold' } }}
          />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const value = payload[0].value;
                return (
                  <div className="bg-white p-3 border rounded shadow-lg text-right">
                    <p className="font-semibold text-lg">{label}</p>
                    <p className="text-blue-600 text-base">
                      ציון: {typeof value === 'number' ? value.toFixed(2) : value}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="score" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
