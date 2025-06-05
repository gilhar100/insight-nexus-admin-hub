
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

interface WocaDistributionChartProps {
  participants: Array<{
    woca_zone: string;
    woca_zone_color: string;
  }>;
  showPieChart?: boolean;
  title?: string;
}

const chartConfig = {
  count: {
    label: "משתתפים",
    color: "#2563eb",
  },
};

export const WocaDistributionChart: React.FC<WocaDistributionChartProps> = ({ 
  participants, 
  showPieChart = false,
  title = "התפלגות משתתפים לפי אזורי תודעה"
}) => {
  console.log('📊 Creating distribution chart for', participants.length, 'participants');

  // Count participants by zone, handling tied zones
  const zoneDistribution: Record<string, { count: number; color: string }> = {};
  
  participants.forEach(participant => {
    const zones = participant.woca_zone.split('/');
    
    zones.forEach(zone => {
      const trimmedZone = zone.trim();
      if (trimmedZone) {
        if (!zoneDistribution[trimmedZone]) {
          zoneDistribution[trimmedZone] = {
            count: 0,
            color: participant.woca_zone_color || '#666666'
          };
        }
        // For tied zones, count each participant for each zone they're tied in
        zoneDistribution[trimmedZone].count += zones.length > 1 ? 0.5 : 1;
      }
    });
  });

  // Convert to chart data
  const chartData = Object.entries(zoneDistribution)
    .map(([zone, data]) => ({
      zone,
      count: Math.round(data.count * 10) / 10, // Round to 1 decimal place
      color: data.color,
      percentage: Math.round((data.count / participants.length) * 100)
    }))
    .sort((a, b) => b.count - a.count);

  console.log('Distribution chart data:', chartData);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-gray-500">
            אין נתונים להצגה
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showPieChart) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            {title} - תצוגת עוגה
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="count"
                  label={({ zone, percentage }) => `${zone} (${percentage}%)`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any, name: any, props: any) => [
                    `${value} משתתפים (${props.payload.percentage}%)`,
                    'כמות'
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="zone" 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                label={{ value: 'מספר משתתפים', angle: -90, position: 'insideLeft' }}
              />
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
      </CardContent>
    </Card>
  );
};
