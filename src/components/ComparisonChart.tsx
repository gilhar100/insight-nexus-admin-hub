
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { ColleagueComparisonData } from '@/hooks/useColleagueComparisonData';

interface ComparisonChartProps {
  data: ColleagueComparisonData;
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({ data }) => {
  const chartData = [
    {
      parameter: 'S',
      parameterName: 'אסטרטגיה',
      self: data.selfReport.strategy,
      colleagues: data.colleagueAverages.strategy
    },
    {
      parameter: 'A',
      parameterName: 'אדפטיביות',
      self: data.selfReport.adaptability,
      colleagues: data.colleagueAverages.adaptability
    },
    {
      parameter: 'L',
      parameterName: 'למידה',
      self: data.selfReport.learning,
      colleagues: data.colleagueAverages.learning
    },
    {
      parameter: 'I',
      parameterName: 'השראה',
      self: data.selfReport.inspiration,
      colleagues: data.colleagueAverages.inspiration
    },
    {
      parameter: 'M',
      parameterName: 'משמעות',
      self: data.selfReport.meaning,
      colleagues: data.colleagueAverages.meaning
    },
    {
      parameter: 'A2',
      parameterName: 'אותנטיות',
      self: data.selfReport.authenticity,
      colleagues: data.colleagueAverages.authenticity
    }
  ];

  const chartConfig = {
    self: {
      label: "הערכה עצמית",
    },
    colleagues: {
      label: "ממוצע קולגות",
    }
  };

  return (
    <ChartContainer config={chartConfig} className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="parameter" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            domain={[0, 5]}
          />
          <ChartTooltip 
            content={<ChartTooltipContent />}
            formatter={(value: number, name: string, props: any) => [
              value.toFixed(2), 
              name === 'self' ? 'הערכה עצמית' : 'ממוצע קולגות'
            ]}
            labelFormatter={(label: string, payload: any) => {
              const item = payload?.[0]?.payload;
              return item ? `${item.parameterName} (${label})` : label;
            }}
          />
          <Legend 
            formatter={(value: string) => value === 'self' ? 'הערכה עצמית' : 'ממוצע קולגות'}
          />
          <Bar 
            dataKey="self" 
            fill="#3B82F6" 
            name="self"
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="colleagues" 
            fill="#F59E0B" 
            name="colleagues"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
