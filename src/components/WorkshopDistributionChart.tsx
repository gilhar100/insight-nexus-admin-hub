
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { getWocaZoneColor } from '@/utils/wocaColors';

interface WorkshopDistributionChartProps {
  participants: Array<{
    overall_score: number | null;
  }>;
}

const chartConfig = {
  count: {
    label: "Participants",
    color: "#2563eb",
  },
};

export const WorkshopDistributionChart: React.FC<WorkshopDistributionChartProps> = ({ participants }) => {
  // Create score ranges for distribution
  const scoreRanges = [
    { range: '1.0-1.5', min: 1.0, max: 1.5, count: 0 },
    { range: '1.6-2.0', min: 1.6, max: 2.0, count: 0 },
    { range: '2.1-2.5', min: 2.1, max: 2.5, count: 0 },
    { range: '2.6-3.0', min: 2.6, max: 3.0, count: 0 },
    { range: '3.1-3.5', min: 3.1, max: 3.5, count: 0 },
    { range: '3.6-4.0', min: 3.6, max: 4.0, count: 0 },
    { range: '4.1-4.5', min: 4.1, max: 4.5, count: 0 },
    { range: '4.6-5.0', min: 4.6, max: 5.0, count: 0 },
  ];

  // Count participants in each range
  participants.forEach(participant => {
    if (participant.overall_score !== null) {
      const score = participant.overall_score;
      const range = scoreRanges.find(r => score >= r.min && score <= r.max);
      if (range) {
        range.count++;
      }
    }
  });

  // Filter out ranges with no participants and add colors
  const chartData = scoreRanges
    .filter(range => range.count > 0)
    .map(range => ({
      ...range,
      color: getWocaZoneColor((range.min + range.max) / 2)
    }));

  return (
    <ChartContainer config={chartConfig} className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="count">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
