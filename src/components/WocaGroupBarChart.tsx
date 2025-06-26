
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { WocaCategoryScores } from '@/utils/wocaAnalysis';
import { WOCA_COLORS } from '@/utils/wocaColors';

interface WocaGroupBarChartProps {
  groupCategoryScores: WocaCategoryScores;
}

export const WocaGroupBarChart: React.FC<WocaGroupBarChartProps> = ({ groupCategoryScores }) => {
  console.log('📊 WocaGroupBarChart received groupCategoryScores:', groupCategoryScores);

  // Check if we have valid data
  if (!groupCategoryScores || typeof groupCategoryScores !== 'object') {
    console.error('❌ Invalid groupCategoryScores:', groupCategoryScores);
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <p className="text-gray-500">אין נתונים זמינים</p>
      </div>
    );
  }

  // Apply stronger nonlinear scaling to exaggerate differences while maintaining ratios
  const applyScaling = (value: number) => {
    if (typeof value !== 'number' || isNaN(value) || value <= 0) return 1; // Minimum value for visibility
    return Math.pow(value, 2.3) * 20; // Stronger exaggeration with multiplier for visual impact
  };

  // Prepare data in the specified order with Hebrew labels
  const data = [
    {
      zone: 'הזדמנות',
      value: applyScaling(groupCategoryScores.opportunity || 0),
      color: '#009E73'
    },
    {
      zone: 'נוחות', 
      value: applyScaling(groupCategoryScores.comfort || 0),
      color: '#F0E442'
    },
    {
      zone: 'אדישות',
      value: applyScaling(groupCategoryScores.apathy || 0),
      color: '#E69F00'
    },
    {
      zone: 'מלחמה',
      value: applyScaling(groupCategoryScores.war || 0),
      color: '#0072B2'
    }
  ];

  console.log('📊 WocaGroupBarChart processed data:', data);

  return (
    <div className="w-full h-96 animate-fade-in relative" dir="rtl">
      <style>{`
        @keyframes scale-in {
          0% {
            transform: scaleY(0);
            opacity: 0;
          }
          100% {
            transform: scaleY(1);
            opacity: 1;
          }
        }
        .bar-animation {
          transform-origin: bottom;
        }
      `}</style>
      
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 30, right: 20, left: 20, bottom: 80 }}
          barCategoryGap="4%"
          baseValue={0}
        >
          <XAxis 
            dataKey="zone" 
            axisLine={false}
            tickLine={false}
            tick={{ 
              fontSize: 16, 
              fill: '#000000', 
              fontWeight: 'bold',
              textAnchor: 'middle'
            }}
            height={80}
            interval={0}
          />
          <YAxis hide />
          <Bar 
            dataKey="value" 
            radius={[8, 8, 0, 0]}
            maxBarSize={100}
            style={{
              filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.15))',
            }}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                className="bar-animation"
                style={{
                  animation: `scale-in 0.8s ease-out ${index * 0.15}s both`
                }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
