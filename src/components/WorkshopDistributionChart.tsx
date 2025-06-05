
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface WorkshopDistributionChartProps {
  participants: Array<{
    woca_zone: string;
    woca_zone_color: string;
  }>;
}

const chartConfig = {
  count: {
    label: "משתתפים",
    color: "#2563eb",
  },
};

export const WorkshopDistributionChart: React.FC<WorkshopDistributionChartProps> = ({ participants }) => {
  // Count participants by zone
  const zoneDistribution: Record<string, { count: number; color: string }> = {};
  
  participants.forEach(participant => {
    const zone = participant.woca_zone;
    if (zone) {
      if (!zoneDistribution[zone]) {
        zoneDistribution[zone] = {
          count: 0,
          color: participant.woca_zone_color || '#666666'
        };
      }
      zoneDistribution[zone].count++;
    }
  });

  // Convert to chart data
  const chartData = Object.entries(zoneDistribution).map(([zone, data]) => ({
    zone,
    count: data.count,
    color: data.color
  }));

  return (
    <ChartContainer config={chartConfig} className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="zone" />
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
