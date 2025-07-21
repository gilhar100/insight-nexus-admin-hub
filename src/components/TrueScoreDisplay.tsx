
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { ColleagueComparisonData } from '@/hooks/useColleagueComparisonData';

interface TrueScoreDisplayProps {
  data: ColleagueComparisonData;
}

export const TrueScoreDisplay: React.FC<TrueScoreDisplayProps> = ({ data }) => {
  const trueScoreData = [
    {
      parameter: 'S',
      parameterName: 'אסטרטגיה',
      delta: data.trueScores.strategy
    },
    {
      parameter: 'A',
      parameterName: 'אדפטיביות',
      delta: data.trueScores.adaptability
    },
    {
      parameter: 'L',
      parameterName: 'למידה',
      delta: data.trueScores.learning
    },
    {
      parameter: 'I',
      parameterName: 'השראה',
      delta: data.trueScores.inspiration
    },
    {
      parameter: 'M',
      parameterName: 'משמעות',
      delta: data.trueScores.meaning
    },
    {
      parameter: 'A2',
      parameterName: 'אותנטיות',
      delta: data.trueScores.authenticity
    }
  ];

  const chartConfig = {
    delta: {
      label: "ציון אמת",
    }
  };

  const getBarColor = (delta: number) => {
    if (delta > 0) return '#10B981'; // Green for positive (colleagues rate higher)
    if (delta < 0) return '#EF4444'; // Red for negative (self-rates higher)
    return '#6B7280'; // Gray for neutral
  };

  return (
    <div className="space-y-6">
      {/* Numeric Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trueScoreData.map((item, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-2 ${
              item.delta > 0
                ? 'bg-green-50 border-green-200'
                : item.delta < 0
                ? 'bg-red-50 border-red-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {item.parameterName}
              </div>
              <div className="text-sm text-gray-600 mb-2">({item.parameter})</div>
              <div
                className={`text-2xl font-bold ${
                  item.delta > 0
                    ? 'text-green-600'
                    : item.delta < 0
                    ? 'text-red-600'
                    : 'text-gray-600'
                }`}
              >
                {item.delta > 0 ? '+' : ''}{item.delta.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <ChartContainer config={chartConfig} className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={trueScoreData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="parameter" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              domain={['dataMin - 0.2', 'dataMax + 0.2']}
            />
            <ChartTooltip 
              content={<ChartTooltipContent />}
              formatter={(value: number) => [
                `${value > 0 ? '+' : ''}${value.toFixed(2)}`, 
                'ציון אמת'
              ]}
              labelFormatter={(label: string, payload: any) => {
                const item = payload?.[0]?.payload;
                return item ? `${item.parameterName} (${label})` : label;
              }}
            />
            <Bar 
              dataKey="delta" 
              radius={[4, 4, 0, 0]}
            >
              {trueScoreData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.delta)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Legend */}
      <div className="flex justify-center space-x-8">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
          <span className="text-sm">קולגות מעריכים גבוה יותר</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
          <span className="text-sm">הערכה עצמית גבוהה יותר</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-500 rounded mr-2"></div>
          <span className="text-sm">הערכה זהה</span>
        </div>
      </div>
    </div>
  );
};
