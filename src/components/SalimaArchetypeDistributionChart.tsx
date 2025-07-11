
import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface ArchetypeData {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

interface SalimaArchetypeDistributionChartProps {
  participants: Array<{
    archetype_1_score: number | null;
    archetype_2_score: number | null;
    archetype_3_score: number | null;
  }>;
  isPresenterMode?: boolean;
}

const ARCHETYPE_NAMES = {
  1: 'מנהל ההזדמנות',
  2: 'המנהל המעצים', 
  3: 'המנהל הסקרן'
};

const ARCHETYPE_COLORS = {
  1: '#FF6B6B', // Red/Pink for מנהל ההזדמנות
  2: '#4ECDC4', // Teal for המנהל המעצים
  3: '#45B7D1'  // Blue for המנהל הסקרן
};

const chartConfig = {
  'מנהל ההזדמנות': {
    label: 'מנהל ההזדמנות',
    color: '#FF6B6B'
  },
  'המנהל המעצים': {
    label: 'המנהל המעצים',
    color: '#4ECDC4'
  },
  'המנהל הסקרן': {
    label: 'המנהל הסקרן',
    color: '#45B7D1'
  }
};

export const SalimaArchetypeDistributionChart: React.FC<SalimaArchetypeDistributionChartProps> = ({
  participants,
  isPresenterMode = false
}) => {
  const [viewMode, setViewMode] = useState<'count' | 'percentage'>('percentage');
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

  // Calculate archetype distribution
  const archetypeDistribution = React.useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0 };
    
    participants.forEach(participant => {
      const scores = [
        participant.archetype_1_score || 0,
        participant.archetype_2_score || 0,
        participant.archetype_3_score || 0
      ];
      
      // Find the archetype with the highest score
      const maxScore = Math.max(...scores);
      const dominantArchetype = scores.indexOf(maxScore) + 1;
      
      if (maxScore > 0) {
        counts[dominantArchetype as keyof typeof counts]++;
      }
    });

    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
    
    return Object.entries(counts).map(([archetype, count]) => ({
      name: ARCHETYPE_NAMES[parseInt(archetype) as keyof typeof ARCHETYPE_NAMES],
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      color: ARCHETYPE_COLORS[parseInt(archetype) as keyof typeof ARCHETYPE_COLORS]
    })).filter(item => item.count > 0);
  }, [participants]);

  // Find the most common archetype for summary
  const dominantArchetype = archetypeDistribution.reduce((prev, current) => 
    prev.count > current.count ? prev : current
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg text-right">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-gray-600">
            {viewMode === 'count' ? `${data.count} מנהלים` : `${data.percentage}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg text-right">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-gray-600">
            {viewMode === 'count' ? `${data.count} מנהלים` : `${data.percentage}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (archetypeDistribution.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        <p>אין נתוני ארכיטיפים זמינים עבור קבוצה זו</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <ToggleGroup type="single" value={chartType} onValueChange={(value) => value && setChartType(value as 'pie' | 'bar')}>
          <ToggleGroupItem value="pie" aria-label="תרשים עוגה">
            תרשים עוגה
          </ToggleGroupItem>
          <ToggleGroupItem value="bar" aria-label="תרשים עמודות">
            תרשים עמודות
          </ToggleGroupItem>
        </ToggleGroup>

        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'count' | 'percentage')}>
          <ToggleGroupItem value="percentage" aria-label="אחוזים">
            אחוזים
          </ToggleGroupItem>
          <ToggleGroupItem value="count" aria-label="מספרים מוחלטים">
            מספרים
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Chart */}
      <ChartContainer config={chartConfig} className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'pie' ? (
            <PieChart>
              <Pie
                data={archetypeDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey={viewMode}
              >
                {archetypeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<PieTooltip />} />
              <Legend 
                formatter={(value, entry) => (
                  <span style={{ color: entry.color, fontSize: isPresenterMode ? '16px' : '14px' }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          ) : (
            <BarChart data={archetypeDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
                tick={{ fontSize: isPresenterMode ? 14 : 12 }}
              />
              <YAxis tick={{ fontSize: isPresenterMode ? 14 : 12 }} />
              <ChartTooltip content={<CustomTooltip />} />
              <Bar dataKey={viewMode} fill="#8884d8">
                {archetypeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </ChartContainer>

      {/* Summary */}
      <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 text-right ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
        <h4 className={`font-bold text-blue-800 mb-2 ${isPresenterMode ? 'text-xl' : 'text-lg'}`}>
          סיכום התפלגות ארכיטיפים
        </h4>
        <p className="text-blue-700 leading-relaxed">
          הארכיטיפ הדומיננטי בקבוצה זו הוא <strong>{dominantArchetype.name}</strong> 
          ({dominantArchetype.percentage}% מהמנהלים). 
          {dominantArchetype.name === 'מנהל ההזדמנות' && 
            ' זהו סגנון מנהיגות הממוקד בזיהוי והניצול הזדמנויות עסקיות חדשות.'
          }
          {dominantArchetype.name === 'המנהל המעצים' && 
            ' זהו סגנון מנהיגות הממוקד בפיתוח והעצמת הצוות.'
          }
          {dominantArchetype.name === 'המנהל הסקרן' && 
            ' זהו סגנון מנהיגות הממוקד בלמידה מתמשכת וחדשנות.'
          }
        </p>
      </div>
    </div>
  );
};
