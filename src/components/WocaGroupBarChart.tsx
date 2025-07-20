
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { WocaCategoryScores } from '@/utils/wocaAnalysis';
import { WOCA_ZONE_COLORS } from '@/utils/wocaColors';
import { ZoneExplanationDialog } from './ZoneExplanationDialog';

interface WocaGroupBarChartProps {
  groupCategoryScores: WocaCategoryScores;
}

export const WocaGroupBarChart: React.FC<WocaGroupBarChartProps> = ({ groupCategoryScores }) => {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  console.log('📊 WocaGroupBarChart received groupCategoryScores:', groupCategoryScores);

  // Check if we have valid data
  if (!groupCategoryScores || typeof groupCategoryScores !== 'object') {
    console.error('❌ Invalid groupCategoryScores:', groupCategoryScores);
    return (
      <div className="w-full h-[600px] flex items-center justify-center">
        <p className="text-gray-500">אין נתונים זמינים</p>
      </div>
    );
  }

  // Apply stronger nonlinear scaling to exaggerate differences while maintaining ratios
  const applyScaling = (value: number) => {
    if (typeof value !== 'number' || isNaN(value) || value <= 0) return 1; // Minimum value for visibility
    return Math.pow(value, 2.3) * 20; // Stronger exaggeration with multiplier for visual impact
  };

  // Prepare data in the specified order with Hebrew labels and matching colors
  const data = [
    {
      zone: 'הזדמנות',
      value: applyScaling(groupCategoryScores.opportunity || 0),
      originalValue: groupCategoryScores.opportunity || 0,
      color: WOCA_ZONE_COLORS.opportunity,
      zoneKey: 'opportunity'
    },
    {
      zone: 'נוחות', 
      value: applyScaling(groupCategoryScores.comfort || 0),
      originalValue: groupCategoryScores.comfort || 0,
      color: WOCA_ZONE_COLORS.comfort,
      zoneKey: 'comfort'
    },
    {
      zone: 'אדישות',
      value: applyScaling(groupCategoryScores.apathy || 0),
      originalValue: groupCategoryScores.apathy || 0,
      color: WOCA_ZONE_COLORS.apathy,
      zoneKey: 'apathy'
    },
    {
      zone: 'מלחמה',
      value: applyScaling(groupCategoryScores.war || 0),
      originalValue: groupCategoryScores.war || 0,
      color: WOCA_ZONE_COLORS.war,
      zoneKey: 'war'
    }
  ];

  // Find the strongest zone (highest original value)
  const strongestZone = data.reduce((max, zone) => 
    zone.originalValue > max.originalValue ? zone : max
  );

  console.log('📊 WocaGroupBarChart processed data:', data);
  console.log('🏆 Strongest zone:', strongestZone);

  const handleBarClick = (data: any) => {
    setSelectedZone(data.zoneKey);
    setIsDialogOpen(true);
  };

  const getBarOpacity = (zoneKey: string) => {
    return zoneKey === strongestZone.zoneKey ? 1 : 0.5;
  };

  const getBarStyle = (zoneKey: string) => {
    const isStrongest = zoneKey === strongestZone.zoneKey;
    return {
      filter: isStrongest 
        ? 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.15)) drop-shadow(0 0 0 2px rgba(0, 0, 0, 0.1))'
        : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
      cursor: 'pointer'
    };
  };

  return (
    <>
      <div className="w-full space-y-4" dir="rtl">
        {/* Title and Subtitle */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-gray-800">
            עוצמת אזורי תודעה ארגונית לפי ציון
          </h3>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
            הגרף הזה מייצג את עוצמת אזורי התודעה השונים על פי הממוצע הקבוצתי - לא על פי שיוך קבוצתי לאזור תודעה
          </p>
        </div>

        {/* Chart - Made taller */}
        <div className="w-full h-[600px] animate-fade-in relative">
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
                onClick={handleBarClick}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    fillOpacity={getBarOpacity(entry.zoneKey)}
                    className="bar-animation"
                    style={{
                      animation: `scale-in 0.8s ease-out ${index * 0.15}s both`,
                      cursor: 'pointer',
                      ...getBarStyle(entry.zoneKey)
                    }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Warning Note */}
        <div className="text-center">
          <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3 max-w-2xl mx-auto">
            ⚠️ <strong>הערה:</strong> גרף זה מייצג ציונים ממוצעים, לא התפלגות אזורי תודעה בין המשתתפים
          </p>
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
