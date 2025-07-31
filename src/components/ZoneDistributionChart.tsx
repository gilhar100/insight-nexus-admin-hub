
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { WOCA_ZONE_COLORS } from '@/utils/wocaColors';
import { ZoneExplanationDialog } from './ZoneExplanationDialog';

interface ZoneDistributionChartProps {
  zoneDistribution: {
    opportunity: number;
    comfort: number;
    apathy: number;
    war: number;
  };
}

export const ZoneDistributionChart: React.FC<ZoneDistributionChartProps> = ({ zoneDistribution }) => {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const data = [
    {
      name: 'הזדמנות',
      value: zoneDistribution.opportunity,
      color: WOCA_ZONE_COLORS.opportunity,
      zone: 'opportunity'
    },
    {
      name: 'נוחות',
      value: zoneDistribution.comfort,
      color: WOCA_ZONE_COLORS.comfort,
      zone: 'comfort'
    },
    {
      name: 'אדישות',
      value: zoneDistribution.apathy,
      color: WOCA_ZONE_COLORS.apathy,
      zone: 'apathy'
    },
    {
      name: 'מלחמה',
      value: zoneDistribution.war,
      color: WOCA_ZONE_COLORS.war,
      zone: 'war'
    }
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const chartConfig = {
    value: {
      label: "מספר משתתפים",
    }
  };

  const handleCellClick = (data: any) => {
    setSelectedZone(data.zone);
    setIsDialogOpen(true);
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name }: any) => {
    if (value === 0) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.8;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';

    return (
      <text
        x={x}
        y={y}
        fill="#1f2937"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={20}
        fontWeight="bold"
        style={{ 
          direction: 'rtl',
          textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
        }}
      >
        {`${value} (${percentage}%)`}
      </text>
    );
  };

  const CustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex justify-center mt-8" dir="rtl">
        <div className="flex flex-wrap gap-8 justify-center">
          {payload.map((entry: any, index: number) => (
            <div 
              key={index} 
              className="flex items-center cursor-pointer hover:bg-gray-100 p-3 rounded transition-colors"
              onClick={() => {
                const zoneData = data.find(d => d.name === entry.value);
                if (zoneData) {
                  handleCellClick(zoneData);
                }
              }}
            >
              <div
                className="w-6 h-6 rounded-full ml-3 border-2 border-white shadow-sm"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xl font-bold text-gray-900">
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
      <div className="flex justify-center items-center h-[500px] bg-white">
        <span className="text-xl text-gray-600">אין נתונים להצגה</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center items-center w-full bg-white" dir="rtl">
        <div className="max-w-4xl w-full mx-auto">
          <ChartContainer config={chartConfig} className="h-[600px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={180}
                  fill="#8884d8"
                  dataKey="value"
                  onClick={handleCellClick}
                  style={{ cursor: 'pointer' }}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      style={{ cursor: 'pointer' }}
                      stroke="#ffffff"
                      strokeWidth={3}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    total > 0 ? `${value} משתתפים (${((value / total) * 100).toFixed(1)}%)` : `${value} משתתפים`,
                    name
                  ]}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '8px',
                    color: '#1f2937',
                    fontSize: '16px',
                    direction: 'rtl',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  labelStyle={{ color: '#1f2937', fontSize: '16px', fontWeight: 'bold' }}
                />
                <Legend content={<CustomLegend />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
      
      <ZoneExplanationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        zone={selectedZone}
      />
    </>
  );
};
