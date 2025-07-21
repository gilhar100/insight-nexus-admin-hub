
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';

interface SalimaGroupRadarChartProps {
  averages: {
    strategy: number;
    learning: number;
    inspiration: number;
    meaning: number;
    authenticity: number;
    adaptability: number;
    overall: number;
  };
}

const chartConfig = {
  score: {
    label: "ממוצע קבוצתי",
    color: "#2563eb",
  },
};

export const SalimaGroupRadarChart: React.FC<SalimaGroupRadarChartProps> = ({ averages }) => {
  const chartData = [
    { dimension: 'אסטרטגיה', score: averages.strategy },
    { dimension: 'אדפטיביות', score: averages.adaptability },
    { dimension: 'למידה', score: averages.learning },
    { dimension: 'השראה', score: averages.inspiration },
    { dimension: 'משמעות', score: averages.meaning },
    { dimension: 'אותנטיות', score: averages.authenticity }
  ];

  return (
    <ChartContainer config={chartConfig} className="h-full w-full" dir="rtl">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <PolarGrid />
          <PolarAngleAxis 
            dataKey="dimension" 
            tick={{ fontSize: 14, fontWeight: 'bold', fill: '#1e293b' }}
            className="text-right"
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 5]} 
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickCount={6}
          />
          <Radar
            name="ממוצע קבוצתי"
            dataKey="score"
            stroke="#2563eb"
            fill="#2563eb"
            fillOpacity={0.2}
            strokeWidth={3}
          />
          <ChartTooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const value = payload[0].value;
                return (
                  <div className="bg-white p-3 border rounded shadow-lg text-right">
                    <p className="font-semibold text-lg">{label}</p>
                    <p className="text-blue-600 text-base">
                      ממוצע קבוצתי: {typeof value === 'number' ? value.toFixed(2) : value}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
