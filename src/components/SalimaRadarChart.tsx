
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface SalimaRadarChartProps {
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

// SALIMA dimension colors
const SALIMA_COLORS = {
  'אסטרטגיה': '#3B82F6', // Blue
  'למידה': '#10B981', // Green
  'השראה': '#EF4444', // Red
  'הסתגלות': '#F59E0B', // Orange
  'אותנטיות': '#EC4899', // Pink
  'משמעות': '#8B5CF6', // Purple
  // English fallbacks
  'Strategy': '#3B82F6',
  'Learning': '#10B981',
  'Inspiration': '#EF4444',
  'Adaptability': '#F59E0B',
  'Authenticity': '#EC4899',
  'Meaning': '#8B5CF6'
};

export const SalimaRadarChart: React.FC<SalimaRadarChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    dimension: item.dimension,
    score: item.score,
    fullMark: 5,
    color: SALIMA_COLORS[item.dimension as keyof typeof SALIMA_COLORS] || item.color
  }));

  return (
    <ChartContainer config={chartConfig} className="h-80" dir="rtl">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <PolarGrid />
          <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12 }} />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 5]} 
            tick={{ fontSize: 10 }}
            tickCount={6}
          />
          <Radar
            name="ציון SALIMA"
            dataKey="score"
            stroke="#2563eb"
            fill="#2563eb"
            fillOpacity={0.1}
            strokeWidth={2}
          />
          <ChartTooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 border rounded shadow-lg text-right">
                    <p className="font-semibold">{label}</p>
                    <p className="text-blue-600">
                      ציון: {payload[0].value?.toFixed(2)}
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
