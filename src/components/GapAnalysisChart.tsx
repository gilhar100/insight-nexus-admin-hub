
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
  // Calculate deltas from opportunity (baseline)
  const opportunityScore = categoryScores.opportunity;
  
  const data = [
    {
      name: 'מלחמה',
      delta: categoryScores.war - opportunityScore,
      color: WOCA_ZONE_COLORS.war
    },
    {
      name: 'אדישות',
      delta: categoryScores.apathy - opportunityScore,
      color: WOCA_ZONE_COLORS.apathy
    },
    {
      name: 'נוחות',
      delta: categoryScores.comfort - opportunityScore,
      color: WOCA_ZONE_COLORS.comfort
    },
    {
      name: 'הזדמנות',
      delta: 0, // baseline
      color: WOCA_ZONE_COLORS.opportunity
    }
  ].sort((a, b) => a.delta - b.delta); // Sort by delta size (largest negative first)

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
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 14 }}
                interval={0}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                domain={['dataMin - 0.5', 'dataMax + 0.5']}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value: number, name: string) => [
                  value.toFixed(2), 
                  name === 'delta' ? 'פער מהזדמנות' : name
                ]}
              />
              <Bar 
                dataKey="delta" 
                radius={[4, 4, 0, 0]}
              >
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
