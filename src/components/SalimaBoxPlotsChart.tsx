
import React from 'react';
import { ResponsiveContainer, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Bar } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';

interface SalimaBoxPlotsChartProps {
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
  boxplot: {
    label: "טווח תשובות",
    color: "#3b82f6",
  },
};

export const SalimaBoxPlotsChart: React.FC<SalimaBoxPlotsChartProps> = ({ participants }) => {
  // Calculate box plot statistics
  const calculateBoxPlotStats = (values: number[]) => {
    const sorted = [...values].sort((a, b) => a - b);
    const n = sorted.length;
    const q1Index = Math.floor(n * 0.25);
    const medianIndex = Math.floor(n * 0.5);
    const q3Index = Math.floor(n * 0.75);
    
    return {
      min: sorted[0],
      q1: sorted[q1Index],
      median: sorted[medianIndex],
      q3: sorted[q3Index],
      max: sorted[n - 1]
    };
  };

  const dimensions = [
    { key: 'dimension_s', name: 'אסטרטגיה', values: participants.map(p => p.dimension_s) },
    { key: 'dimension_a', name: 'הסתגלות', values: participants.map(p => p.dimension_a) },
    { key: 'dimension_l', name: 'למידה', values: participants.map(p => p.dimension_l) },
    { key: 'dimension_i', name: 'השראה', values: participants.map(p => p.dimension_i) },
    { key: 'dimension_m', name: 'משמעות', values: participants.map(p => p.dimension_m) },
    { key: 'dimension_a2', name: 'אותנטיות', values: participants.map(p => p.dimension_a2) }
  ];

  const chartData = dimensions.map(dim => {
    const stats = calculateBoxPlotStats(dim.values);
    return {
      dimension: dim.name,
      ...stats,
      range: stats.max - stats.min
    };
  });

  return (
    <ChartContainer config={chartConfig} className="h-full w-full" dir="rtl">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="dimension" 
            tick={{ fontSize: 12, fontWeight: 'bold', fill: '#1e293b' }}
            textAnchor="middle"
            angle={-45}
            height={80}
          />
          <YAxis 
            domain={[0, 5]}
            tick={{ fontSize: 12, fill: '#64748b' }}
            label={{ value: 'ציון', angle: -90, position: 'insideLeft', style: { fontSize: '14px', fontWeight: 'bold' } }}
          />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 border rounded shadow-lg text-right">
                    <p className="font-semibold text-lg">{label}</p>
                    <p className="text-blue-600 text-sm">
                      טווח: {data.min.toFixed(1)}–{data.max.toFixed(1)}
                    </p>
                    <p className="text-blue-600 text-sm">
                      חציון: {data.median.toFixed(1)}
                    </p>
                    <p className="text-blue-600 text-sm">
                      רבעון ראשון: {data.q1.toFixed(1)}
                    </p>
                    <p className="text-blue-600 text-sm">
                      רבעון שלישי: {data.q3.toFixed(1)}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="range" fill="#3b82f6" fillOpacity={0.3} />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
