import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, PieChart, Pie, Tooltip, Legend } from 'recharts';
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

  const barData = [
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
  ];

  const pieData = [
    {
      name: 'הזדמנות',
      value: opportunityScore,
      color: WOCA_ZONE_COLORS.opportunity
    },
    {
      name: 'נוחות',
      value: comfortScore,
      color: WOCA_ZONE_COLORS.comfort
    },
    {
      name: 'אדישות',
      value: apathyScore,
      color: WOCA_ZONE_COLORS.apathy
    },
    {
      name: 'מלחמה',
      value: warScore,
      color: WOCA_ZONE_COLORS.war
    }
  ];

  const chartConfig = {
    delta: {
      label: "פער מהזדמנות",
    }
  };

  return (
    <div className="w-full p-4 mb-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <ChartContainer config={chartConfig} className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={barData} 
              margin={{ top: 20, right: 30, left: 30, bottom: 30 }}
              layout="vertical"
              barCategoryGap={20}
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
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="w-full h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                label={({ name }) => name}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-pie-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => value.toFixed(2)} />
              <Legend layout="horizontal" align="center" verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
