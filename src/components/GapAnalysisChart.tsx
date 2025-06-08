import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { WOCA_ZONE_COLORS } from '@/utils/wocaColors';

interface GapAnalysisChartProps {
  categoryScores: {
    opportunity: number;
    comfort: number;
    apathy: number;
    war: number;
  };
}

export const GapAnalysisChart: React.FC<GapAnalysisChartProps> = ({ categoryScores }) => {
  const opportunityScore = categoryScores?.opportunity ?? 0;
  const comfortScore = categoryScores?.comfort ?? 0;
  const apathyScore = categoryScores?.apathy ?? 0;
  const warScore = categoryScores?.war ?? 0;

  const data = [
    {
      name: 'מלחמה',
      delta: parseFloat((warScore - opportunityScore).toFixed(2)),
      color: WOCA_ZONE_COLORS.war
    },
    {
      name: 'אדישות',
      delta: parseFloat((apathyScore - opportunityScore).toFixed(2)),
      color: WOCA_ZONE_COLORS.apathy
    },
    {
      name: 'נוחות',
      delta: parseFloat((comfortScore - opportunityScore).toFixed(2)),
      color: WOCA_ZONE_COLORS.comfort
    },
    {
      name: 'הזדמנות',
      delta: 0,
      color: WOCA_ZONE_COLORS.opportunity
    }
  ].sort((a, b) => b.delta - a.delta); // Sort descending for better visual comparison

  const chartConfig = {
    delta: {
      label: "פער מהזדמנות",
    }
  };

  return (
    <div className="w-full overflow-x-auto p-4 mb-8">
      <div className="min-w-[700px] max-w-4xl mx-auto">
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              margin={{ top: 20, right: 30, left: 30, bottom: 30 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number"
                tick={{ fontSize: 12 }} 
                domain={[dataMin => Math.min(dataMin, -1), dataMax => Math.max(dataMax, 1)]}
              />
              <YAxis 
                type="category"
                dataKey="name" 
                tick={{ fontSize: 14 }} 
                width={100} 
              />
              <ChartTooltip 
                content={<ChartTooltipContent />} 
                formatter={(value: number, name: string) => [
                  value.toFixed(2), 
                  name === 'delta' ? 'פער מהזדמנות' : name
                ]} 
              />
              <Bar dataKey="delta" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};
