
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
  'אסטרטגיה': '#3B82F6', // Blue - Strategy
  'למידה': '#10B981',    // Green - Learning
  'השראה': '#EF4444',    // Red - Inspiration
  'הסתגלות': '#F59E0B',  // Orange - Adaptability
  'אותנטיות': '#EC4899', // Pink - Authenticity
  'משמעות': '#8B5CF6',   // Purple - Meaning
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
          <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 14, fontWeight: 'bold' }} />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 5]} 
            tick={{ fontSize: 12 }}
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
        </RadarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
