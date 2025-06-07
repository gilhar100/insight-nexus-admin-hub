
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

  // Custom label positioning to avoid overlaps
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value, name }: any) => {
    if (percent < 0.05) return null; // Don't show labels for very small segments
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.4; // Position outside the pie
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="#333" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          innerRadius={40}
          dataKey="value"
          labelLine={false}
          label={renderCustomLabel}
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
