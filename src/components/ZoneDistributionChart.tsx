
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
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const chartConfig = {
    value: {
      label: "מספר משתתפים",
    }
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name }: any) => {
    if (value === 0) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';

    return (
      <text
        x={x}
        y={y}
        fill="#000000"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={16}
        fontWeight="600"
        style={{ direction: 'rtl' }}
      >
        {`${value} (${percentage}%)`}
      </text>
    );
  };

  const CustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex justify-center mt-6" dir="rtl">
        <div className="flex flex-wrap gap-6 justify-center">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center">
              <div
                className="w-4 h-4 rounded-full ml-3"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-lg font-semibold" style={{ color: '#000000' }}>
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (total === 0) {
    return (
      <div className="flex justify-center items-center h-[500px]" style={{ color: '#000000' }}>
        <span className="text-xl">אין נתונים להצגה</span>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center w-full" dir="rtl">
      <div className="max-w-4xl w-full mx-auto">
        <ChartContainer config={chartConfig} className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number, name: string) => [
                  total > 0 ? `${value} משתתפים (${((value / total) * 100).toFixed(1)}%)` : `${value} משתתפים`,
                  name
                ]}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #ccc', 
                  borderRadius: '4px',
                  color: '#000000',
                  fontSize: '16px',
                  direction: 'rtl'
                }}
                labelStyle={{ color: '#000000', fontSize: '16px' }}
              />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};
