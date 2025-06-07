
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { WOCA_ZONE_COLORS } from '@/utils/wocaColors';

interface ZoneDistributionChartProps {
  zoneDistribution: {
    opportunity: number;
    comfort: number;
    apathy: number;
    war: number;
  };
}

export const ZoneDistributionChart: React.FC<ZoneDistributionChartProps> = ({ 
  zoneDistribution 
}) => {
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
    },
  ].filter(item => item.value > 0);

  const total = Object.values(zoneDistribution).reduce((sum, val) => sum + val, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / total) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 border rounded shadow-lg text-right" dir="rtl">
          <p className="font-semibold">{data.name}</p>
          <p>משתתפים: {data.value}</p>
          <p>אחוז: {percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          dataKey="value"
          label={({ name, value, percent }) => 
            `${name}: ${value} (${(percent * 100).toFixed(1)}%)`
          }
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
};
