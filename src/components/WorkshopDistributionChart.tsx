
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
  console.log('Distribution Chart participants:', participants);
  
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

  // Convert to chart data and sort by count
  const chartData = Object.entries(zoneDistribution)
    .map(([zone, data]) => ({
      zone,
      count: data.count,
      color: data.color,
      percentage: Math.round((data.count / participants.length) * 100)
    }))
    .sort((a, b) => b.count - a.count);

  console.log('Chart data:', chartData);

  // Don't render if no data
  if (chartData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500">
        אין נתונים להצגה
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="zone" 
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <ChartTooltip 
            content={<ChartTooltipContent />}
            formatter={(value: any, name: any, props: any) => [
              `${value} משתתפים (${props.payload.percentage}%)`,
              'כמות'
            ]}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
