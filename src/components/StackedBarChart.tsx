
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { analyzeWorkshopWoca } from '@/utils/wocaAnalysis';
import { WOCA_ZONE_COLORS } from '@/utils/wocaColors';

interface StackedBarChartProps {
  participants: Array<{
    id: string;
    question_responses?: any;
    full_name: string;
  }>;
}

export const StackedBarChart: React.FC<StackedBarChartProps> = ({ participants }) => {
  // Analyze participants to get category scores
  const wocaAnalysis = analyzeWorkshopWoca(participants, 1);
  
  // Transform data for stacked bar chart
  const chartData = wocaAnalysis.participants.map((participant, index) => ({
    name: `משתתף ${index + 1}`,
    הזדמנות: participant.categoryScores.opportunity,
    נוחות: participant.categoryScores.comfort,
    אדישות: participant.categoryScores.apathy,
    מלחמה: participant.categoryScores.war,
  }));

  const chartConfig = {
    הזדמנות: {
      label: 'הזדמנות',
      color: WOCA_ZONE_COLORS.opportunity,
    },
    נוחות: {
      label: 'נוחות',
      color: WOCA_ZONE_COLORS.comfort,
    },
    אדישות: {
      label: 'אדישות',
      color: WOCA_ZONE_COLORS.apathy,
    },
    מלחמה: {
      label: 'מלחמה',
      color: WOCA_ZONE_COLORS.war,
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            domain={[0, 5]}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="הזדמנות" stackId="a" fill={WOCA_ZONE_COLORS.opportunity} />
          <Bar dataKey="נוחות" stackId="a" fill={WOCA_ZONE_COLORS.comfort} />
          <Bar dataKey="אדישות" stackId="a" fill={WOCA_ZONE_COLORS.apathy} />
          <Bar dataKey="מלחמה" stackId="a" fill={WOCA_ZONE_COLORS.war} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
