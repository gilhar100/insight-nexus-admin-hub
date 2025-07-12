
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
        const url = `https://lhmrghebdtcbhmgtbqfe.supabase.co/functions/v1/getArchetypeDistribution?group_number=${groupNumber}`;
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

  return (
    <div className="space-y-4" dir="rtl">
      <div className={`text-center ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
        <p className="text-gray-600">
          סה"כ משתתפים: <span className="font-bold">{data.total}</span>
        </p>
      </div>
      
      <ChartContainer config={chartConfig} className={isPresenterMode ? "h-96" : "h-80"}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="archetype" 
              tick={{ fontSize: isPresenterMode ? 16 : 12, fontWeight: 'bold' }}
              textAnchor="middle"
              interval={0}
              angle={-45}
              height={80}
            />
            <YAxis 
              tick={{ fontSize: isPresenterMode ? 14 : 12 }}
              label={{ 
                value: 'מספר משתתפים', 
                angle: -90, 
                position: 'insideLeft', 
                style: { fontSize: isPresenterMode ? '16px' : '14px', fontWeight: 'bold' } 
              }}
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 border rounded shadow-lg text-right">
                      <p className={`font-semibold ${isPresenterMode ? 'text-lg' : 'text-base'}`}>
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
            <Bar dataKey="count" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};
