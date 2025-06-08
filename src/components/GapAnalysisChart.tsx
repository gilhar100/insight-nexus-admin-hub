import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, PieChart, Pie } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
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
  const { opportunity = 0, comfort = 0, apathy = 0, war = 0 } = categoryScores;

  const barData = [
    { name: 'הזדמנות', value: opportunity, color: WOCA_ZONE_COLORS.opportunity },
    { name: 'נוחות', value: comfort, color: WOCA_ZONE_COLORS.comfort },
    { name: 'אדישות', value: apathy, color: WOCA_ZONE_COLORS.apathy },
    { name: 'מלחמה', value: war, color: WOCA_ZONE_COLORS.war },
  ];

  const radarData = [
    { dimension: 'הזדמנות', value: opportunity },
    { dimension: 'נוחות', value: comfort },
    { dimension: 'אדישות', value: apathy },
    { dimension: 'מלחמה', value: war },
  ];

  // Dynamic domain scaling to exaggerate visual difference without altering data
  const values = [opportunity, comfort, apathy, war];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const buffer = (max - min) * 0.5 || 0.5;

  return (
    <div className="w-full px-4 py-6 space-y-12">
      {/* Enhanced Gap Analysis Bar Chart */}
      <div className="max-w-3xl mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-center">השוואת ציונים לפי אזורים</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={barData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 60, bottom: 10 }}
            barCategoryGap={30}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              domain={[min - buffer, max + buffer]}
              tick={{ fontSize: 12 }}
            />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 14 }} width={100} />
            <Tooltip formatter={(value: number) => value.toFixed(2)} />
            <Legend />
            <Bar dataKey="value" radius={[0, 6, 6, 0]}>
              {barData.map((entry, index) => (
                <Cell key={`bar-cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Centered and Enlarged Radar Chart */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-4xl">
          <h3 className="text-xl font-semibold mb-4 text-center">מפת ציונים רדיאלית</h3>
          <ResponsiveContainer width="100%" height={500}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 14 }} />
              <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fontSize: 12 }} />
              <Radar name="Score" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              <Tooltip formatter={(value: number) => value.toFixed(2)} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart – clean and complete */}
      <div className="max-w-xl mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-center">התפלגות ציונים</h3>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={barData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              label={({ name }) => name}
            >
              {barData.map((entry, index) => (
                <Cell key={`cell-pie-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => value.toFixed(2)} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
