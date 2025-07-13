

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

interface ArchetypeData {
  archetype: string;
  count: number;
  percentage: number;
}

interface ArchetypeDistributionResponse {
  group_number: number;
  total: number;
  distribution: ArchetypeData[];
}

interface ArchetypeDistributionChartProps {
  groupNumber: number;
  isPresenterMode?: boolean;
}

const chartConfig = {
  count: {
    label: "מספר",
    color: "#2563eb",
  },
};

export const ArchetypeDistributionChart: React.FC<ArchetypeDistributionChartProps> = ({
  groupNumber,
  isPresenterMode = false
}) => {
  const [data, setData] = useState<ArchetypeDistributionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArchetypeData = async () => {
      if (!groupNumber) {
        console.log('❌ No group number provided');
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const url = `https://lhmrghebdtcbhmgtbqfe.functions.supabase.co/getArchetypeDistribution?group_number=${groupNumber}`;
        console.log('🔄 Fetching archetype data from URL:', url);
        
        const response = await fetch(url);
        
        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ HTTP error:', response.status, errorText);
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
        
        const result = await response.json();
        console.log('📊 Archetype data received:', result);
        
        if (result.error) {
          console.error('❌ API error:', result.error);
          setError(result.error);
          setData(null);
        } else {
          setData(result);
          setError(null);
        }
      } catch (err) {
        console.error('❌ Error fetching archetype data:', err);
        const errorMessage = err instanceof Error ? err.message : 'שגיאה בטעינת נתוני הארכיטיפים';
        setError(errorMessage);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchArchetypeData();
  }, [groupNumber]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription className="text-right">
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!data || data.distribution.length === 0) {
    return (
      <div className="text-center py-8">
        <p className={`text-gray-600 ${isPresenterMode ? 'text-xl' : 'text-base'}`}>
          לא נמצאו נתונים על ארכיטיפים בקבוצה זו
        </p>
      </div>
    );
  }

  const chartData = data.distribution.map(item => ({
    archetype: item.archetype,
    count: item.count,
    percentage: item.percentage,
    fill: "#2563eb"
  }));

  // Calculate spacing and positioning based on number of archetypes
  const archetypeCount = chartData.length;
  const isSingleArchetype = archetypeCount === 1;
  const barCategoryGap = isSingleArchetype ? "60%" : archetypeCount === 2 ? "20%" : "4%";
  const maxBarSize = isSingleArchetype ? 120 : archetypeCount === 2 ? 100 : 80;
  
  // Adjust margins for better centering
  const chartMargins = isSingleArchetype 
    ? { top: 20, right: 80, left: 80, bottom: 60 }
    : { top: 20, right: 30, left: 20, bottom: 60 };

  // Calculate Y-axis domain with increments of 5
  const maxCount = Math.max(...chartData.map(item => item.count));
  const yAxisMax = Math.ceil(maxCount / 5) * 5 + 5; // Round up to next 5 and add buffer

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen py-8" dir="rtl">
      <div className={`text-center mb-6 ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
        <p className="text-gray-600">
          סה"כ משתתפים: <span className="font-bold">{data.total}</span>
        </p>
      </div>
      
      <div className="w-full max-w-6xl">
        <ChartContainer config={chartConfig} className={isPresenterMode ? "h-[600px]" : "h-[500px]"}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              margin={chartMargins}
              barCategoryGap={barCategoryGap}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(0,0,0,0.1)"
                horizontal={true}
                vertical={isSingleArchetype}
              />
              <XAxis 
                dataKey="archetype" 
                tick={{ 
                  fontSize: isPresenterMode ? 16 : 12, 
                  fontWeight: 'bold',
                  fill: '#1f2937'
                }}
                textAnchor="middle"
                interval={0}
                angle={isSingleArchetype ? 0 : archetypeCount <= 2 ? -10 : -20}
                height={isSingleArchetype ? 60 : 80}
                axisLine={{ stroke: 'rgba(0,0,0,0.2)' }}
                tickLine={{ stroke: 'rgba(0,0,0,0.2)' }}
              />
              <YAxis 
                domain={[0, yAxisMax]}
                ticks={Array.from({ length: Math.floor(yAxisMax / 5) + 1 }, (_, i) => i * 5)}
                tick={{ fontSize: isPresenterMode ? 14 : 12 }}
                label={{ 
                  value: 'מספר משתתפים', 
                  angle: -90, 
                  position: 'insideLeft', 
                  style: { 
                    fontSize: isPresenterMode ? '16px' : '14px', 
                    fontWeight: 'bold',
                    fill: '#374151'
                  } 
                }}
                axisLine={{ stroke: 'rgba(0,0,0,0.2)' }}
                tickLine={{ stroke: 'rgba(0,0,0,0.2)' }}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg text-right">
                        <p className={`font-semibold text-gray-800 ${isPresenterMode ? 'text-lg' : 'text-base'}`}>
                          {label}
                        </p>
                        <p className={`text-blue-600 ${isPresenterMode ? 'text-base' : 'text-sm'}`}>
                          מספר: {data.count}
                        </p>
                        <p className={`text-green-600 ${isPresenterMode ? 'text-base' : 'text-sm'}`}>
                          אחוז: {data.percentage}%
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="count" 
                radius={[4, 4, 0, 0]}
                maxBarSize={maxBarSize}
                fill="#2563eb"
                stroke={isSingleArchetype ? "rgba(37, 99, 235, 0.3)" : "none"}
                strokeWidth={isSingleArchetype ? 1 : 0}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

