import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { archetypeExplanations } from '@/utils/archetypeDescriptions';

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

// Dynamic color mapping based on archetype names
const getArchetypeColor = (archetype: string): string => {
  if (archetype.includes("הזדמנות")) {
    return "#9C27B0"; // Purple for Opportunity Leader
  } else if (archetype.includes("סקרן")) {
    return "#FF9800"; // Orange for Curious Leader
  } else if (archetype.includes("מעצים")) {
    return "#4CAF50"; // Green for Empowering Leader
  }
  return "#6B7280"; // Default gray for unknown archetypes
};

export const ArchetypeDistributionChart: React.FC<ArchetypeDistributionChartProps> = ({
  groupNumber,
  isPresenterMode = false
}) => {
  const [data, setData] = useState<ArchetypeDistributionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);

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

  const handleBarClick = (data: any) => {
    if (data && data.archetype) {
      setSelectedArchetype(data.archetype);
    }
  };

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
    fill: getArchetypeColor(item.archetype)
  }));

  // Calculate spacing and positioning based on number of archetypes
  const archetypeCount = chartData.length;
  const isSingleArchetype = archetypeCount === 1;
  const barCategoryGap = isSingleArchetype ? "60%" : archetypeCount === 2 ? "20%" : "4%";
  const maxBarSize = isSingleArchetype ? 100 : archetypeCount === 2 ? 80 : 60;
  
  // Adjust margins for better centering
  const chartMargins = isSingleArchetype 
    ? { top: 40, right: 80, left: 80, bottom: 80 }
    : { top: 40, right: 30, left: 20, bottom: 80 };

  // Dynamic Y-axis calculation using the maximum count + 5
  const maxCount = Math.max(...chartData.map(item => item.count));
  const yAxisMax = maxCount + 5;

  return (
    <>
      <div className="w-full flex flex-col items-center justify-center min-h-screen py-8" dir="rtl">
        <div className={`text-center mb-8 ${isPresenterMode ? 'text-2xl' : 'text-xl'}`}>
          <h2 className="font-bold text-gray-800">התפלגות סגנון מנהיגות</h2>
        </div>
        
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
                  angle={0}
                  height={80}
                  axisLine={{ stroke: 'rgba(0,0,0,0.2)' }}
                  tickLine={{ stroke: 'rgba(0,0,0,0.2)' }}
                />
                <YAxis 
                  domain={[0, yAxisMax]}
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
                      const barColor = getArchetypeColor(data.archetype);
                      return (
                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg text-right">
                          <p className={`font-semibold text-gray-800 ${isPresenterMode ? 'text-lg' : 'text-base'}`}>
                            {label}
                          </p>
                          <p className={`${isPresenterMode ? 'text-base' : 'text-sm'}`} style={{ color: barColor }}>
                            מספר: {data.count}
                          </p>
                          <p className={`${isPresenterMode ? 'text-base' : 'text-sm'}`} style={{ color: barColor }}>
                            אחוז: {data.percentage}%
                          </p>
                          <p className={`text-gray-500 text-xs mt-1`}>
                            לחץ לפרטים נוספים
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
                  onClick={handleBarClick}
                  style={{ cursor: 'pointer' }}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.fill}
                      style={{ cursor: 'pointer' }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>

      <Dialog open={!!selectedArchetype} onOpenChange={() => setSelectedArchetype(null)}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right text-xl font-bold">
              {selectedArchetype && archetypeExplanations[selectedArchetype]?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="text-right leading-relaxed text-gray-700">
            {selectedArchetype && archetypeExplanations[selectedArchetype]?.description}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
