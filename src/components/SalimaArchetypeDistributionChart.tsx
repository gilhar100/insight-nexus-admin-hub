
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { BarChart3, PieChart as PieChartIcon, Percent, Hash } from 'lucide-react';

interface ArchetypeDistributionData {
  archetype: string;
  count: number;
  percentage: number;
  color: string;
}

interface SalimaArchetypeDistributionChartProps {
  participants: Array<{
    dominant_archetype: string | null | undefined;
  }>;
}

const ARCHETYPE_COLORS = {
  'מנהל ההזדמנות': '#10B981', // Green
  'המנהל הסקרן': '#3B82F6', // Blue  
  'המנהל המעצים': '#F59E0B', // Orange
  'Opportunity Leader': '#10B981',
  'Curious Leader': '#3B82F6',
  'Empowering Leader': '#F59E0B'
};

const ARCHETYPE_LABELS = {
  'מנהל ההזדמנות': 'מנהל ההזדמנות',
  'המנהל הסקרן': 'המנהל הסקרן', 
  'המנהל המעצים': 'המנהל המעצים',
  'Opportunity Leader': 'מנהל ההזדמנות',
  'Curious Leader': 'המנהל הסקרן',
  'Empowering Leader': 'המנהל המעצים'
};

const chartConfig = {
  count: {
    label: "מספר משתתפים",
    color: "#2563eb",
  },
  percentage: {
    label: "אחוז",
    color: "#16a34a",
  },
};

export const SalimaArchetypeDistributionChart: React.FC<SalimaArchetypeDistributionChartProps> = ({ participants }) => {
  const [viewMode, setViewMode] = useState<'count' | 'percentage'>('count');
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');

  if (!participants || participants.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>אין נתונים להצגה</p>
      </div>
    );
  }

  // Count archetypes - filter out null/undefined values
  const archetypeCounts = participants.reduce((acc, participant) => {
    const archetype = participant.dominant_archetype;
    if (archetype) {
      const hebrewLabel = ARCHETYPE_LABELS[archetype] || archetype;
      acc[hebrewLabel] = (acc[hebrewLabel] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const totalParticipants = participants.filter(p => p.dominant_archetype).length;

  // If no participants have archetypes, show empty state
  if (totalParticipants === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>אין נתוני ארכיטיפים להצגה</p>
      </div>
    );
  }

  // Prepare chart data
  const chartData: ArchetypeDistributionData[] = Object.entries(archetypeCounts).map(([archetype, count]) => ({
    archetype,
    count,
    percentage: Math.round((count / totalParticipants) * 100),
    color: ARCHETYPE_COLORS[archetype] || '#6B7280'
  }));

  // Find dominant archetype for summary
  const dominantArchetype = chartData.reduce((prev, current) => 
    prev.count > current.count ? prev : current
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-lg text-right">
          <p className="font-semibold text-lg">{label}</p>
          <p className="text-blue-600 text-base">
            מספר משתתפים: {data.count}
          </p>
          <p className="text-green-600 text-base">
            אחוז: {data.percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="flex gap-2">
          <Button
            variant={chartType === 'bar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('bar')}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            תרשים עמודות
          </Button>
          <Button
            variant={chartType === 'pie' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('pie')}
          >
            <PieChartIcon className="w-4 h-4 mr-2" />
            תרשים עוגה
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'count' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('count')}
          >
            <Hash className="w-4 h-4 mr-2" />
            מספר מוחלט
          </Button>
          <Button
            variant={viewMode === 'percentage' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('percentage')}
          >
            <Percent className="w-4 h-4 mr-2" />
            אחוז
          </Button>
        </div>
      </div>

      {/* Chart */}
      <ChartContainer config={chartConfig} className="h-96" dir="rtl">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="archetype" 
                tick={{ fontSize: 12, fontWeight: 'bold' }}
                textAnchor="middle"
                interval={0}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                label={{ 
                  value: viewMode === 'count' ? 'מספר משתתפים' : 'אחוז (%)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fontSize: '14px', fontWeight: 'bold' }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey={viewMode}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ archetype, value }) => `${archetype}: ${value}${viewMode === 'percentage' ? '%' : ''}`}
                outerRadius={120}
                fill="#8884d8"
                dataKey={viewMode}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          )}
        </ResponsiveContainer>
      </ChartContainer>

      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-right">
        <h4 className="font-semibold text-blue-800 mb-2">סיכום התפלגות הארכיטיפים</h4>
        <p className="text-blue-700">
          הארכיטיפ הדומיננטי בקבוצה הוא <strong>{dominantArchetype.archetype}</strong> עם {dominantArchetype.count} משתתפים ({dominantArchetype.percentage}% מהקבוצה).
        </p>
        <p className="text-blue-600 text-sm mt-2">
          {dominantArchetype.archetype === 'מנהל ההזדמנות' && 
            'קבוצה זו מאופיינת במנהיגות חדשנית הרואה הזדמנויות בכל מקום ופועלת ליצירת שינוי חיובי.'
          }
          {dominantArchetype.archetype === 'המנהל הסקרן' && 
            'קבוצה זו מאופיינת במנהיגות חקרנית הרואה בלמידה מתמשכת ובפיתוח אישי כמפתח להצלחה.'
          }
          {dominantArchetype.archetype === 'המנהל המעצים' && 
            'קבוצה זו מאופיינת במנהיגות מעצימה הרואה בפיתוח האחרים ובמתן כלים כמפתח להצלחה ארגונית.'
          }
        </p>
      </div>
    </div>
  );
};
