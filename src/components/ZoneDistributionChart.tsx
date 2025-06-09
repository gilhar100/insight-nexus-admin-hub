
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { WOCA_ZONE_COLORS } from '@/utils/wocaColors';

interface ZoneDistributionChartProps {
  zoneDistribution: {
    opportunity: number;
    comfort: number;
    apathy: number;
    war: number;
  };
}

export const ZoneDistributionChart: React.FC<ZoneDistributionChartProps> = ({ zoneDistribution }) => {
  const data = [
    {
      name: 'הזדמנות',
      value: zoneDistribution.opportunity,
      color: WOCA_ZONE_COLORS.opportunity
    },
    {
      name: 'נוחות',
      value: zoneDistribution.comfort,
      color: WOCA_ZONE_COLORS.comfort
    },
    {
      name: 'אדישות',
      value: zoneDistribution.apathy,
      color: WOCA_ZONE_COLORS.apathy
    },
    {
      name: 'מלחמה',
      value: zoneDistribution.war,
      color: WOCA_ZONE_COLORS.war
    }
  ].filter(item => item.value > 0); // Only show zones with participants

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const chartConfig = {
    value: {
      label: "מספר משתתפים",
    }
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name }: any) => {
    if (value === 0) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.3;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const percentage = ((value / total) * 100).toFixed(1);

    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="500"
      >
        {`${value} (${percentage}%)`}
      </text>
    );
  };

  if (total === 0) {
    return (
      <div className="flex justify-center items-center h-[300px] text-gray-500">
        אין נתונים להצגה
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center w-full">
      <div className="max-w-lg w-full mx-auto">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `${value} משתתפים (${((value / total) * 100).toFixed(1)}%)`,
                  name
                ]}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: '14px', textAlign: 'center' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};
