
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { BarChart3, PieChart as PieChartIcon, Percent, Hash } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ArchetypeData {
  archetype: string;
  count: number;
  percentage: number;
  color: string;
}

interface GroupArchetypeChartProps {
  groupNumber: number;
}

const ARCHETYPE_COLORS = {
  'מנהל ההזדמנות': '#10B981',
  'המנהל הסקרן': '#3B82F6',
  'המנהל המעצים': '#F59E0B',
  'opportunity leader': '#10B981',
  'curious leader': '#3B82F6',
  'empowering leader': '#F59E0B',
};

const ARCHETYPE_LABELS: Record<string, string> = {
  'מנהל ההזדמנות': 'מנהל ההזדמנות',
  'המנהל הסקרן': 'המנהל הסקרן',
  'המנהל המעצים': 'המנהל המעצים',
  'opportunity leader': 'מנהל ההזדמנות',
  'curious leader': 'המנהל הסקרן',
  'empowering leader': 'המנהל המעצים',
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

export const GroupArchetypeChart: React.FC<GroupArchetypeChartProps> = ({ groupNumber }) => {
  const [data, setData] = useState<ArchetypeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [viewMode, setViewMode] = useState<'count' | 'percentage'>('count');
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');

  useEffect(() => {
    const fetchArchetypeData = async () => {
      if (!groupNumber) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching archetype data for group:', groupNumber);
        
        // Fetch all participants in the group
        const { data: participants, error: participantsError } = await supabase
          .from('survey_responses')
          .select('dominant_archetype')
          .eq('group_number', groupNumber)
          .eq('survey_type', 'manager');

        if (participantsError) {
          console.error('Error fetching participants:', participantsError);
          throw participantsError;
        }

        console.log('Raw participants data:', participants);
        
        if (!participants || participants.length === 0) {
          console.log('No participants found for group:', groupNumber);
          setData([]);
          setTotalParticipants(0);
          return;
        }

        setTotalParticipants(participants.length);

        // Filter participants with valid archetypes
        const participantsWithArchetypes = participants.filter(p => {
          const archetype = p.dominant_archetype;
          return archetype && 
                 archetype.trim() !== '' && 
                 archetype.toLowerCase() !== 'null' &&
                 archetype.toLowerCase() !== 'undefined';
        });

        console.log('Participants with valid archetypes:', participantsWithArchetypes);

        if (participantsWithArchetypes.length === 0) {
          setData([]);
          return;
        }

        // Count archetypes
        const archetypeCounts = participantsWithArchetypes.reduce((acc, participant) => {
          const rawArchetype = participant.dominant_archetype?.toString().trim();
          if (!rawArchetype) return acc;
          
          // Use the mapped label if available, otherwise use the raw value
          const displayLabel = ARCHETYPE_LABELS[rawArchetype] || rawArchetype;
          console.log('Processing archetype:', rawArchetype, '-> mapped to:', displayLabel);
          
          acc[displayLabel] = (acc[displayLabel] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        console.log('Final archetype counts:', archetypeCounts);

        // Convert to chart data
        const chartData: ArchetypeData[] = Object.entries(archetypeCounts).map(([archetype, count]) => ({
          archetype,
          count,
          percentage: Math.round((count / participantsWithArchetypes.length) * 100),
          color: ARCHETYPE_COLORS[archetype as keyof typeof ARCHETYPE_COLORS] || '#6B7280'
        }));

        setData(chartData);

      } catch (err) {
        console.error('Error fetching archetype data:', err);
        setError('Failed to fetch archetype data');
      } finally {
        setLoading(false);
      }
    };

    fetchArchetypeData();
  }, [groupNumber]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div dir="rtl" className="bg-white p-3 border rounded shadow-lg text-right">
          <p className="font-semibold text-lg">{label}</p>
          <p className="text-blue-600 text-base">מספר משתתפים: {data.count}</p>
          <p className="text-green-600 text-base">אחוז: {data.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p>טוען נתוני ארכיטיפים...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>שגיאה: {error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>אין נתוני ארכיטיפים להצגה</p>
        <p className="text-sm mt-2">
          נמצאו {totalParticipants} משתתפים בקבוצה, אך אף אחד מהם לא מוגדר עם ארכיטיפ דומיננטי
        </p>
      </div>
    );
  }

  const dominantArchetype = data.length > 0 
    ? data.reduce((prev, current) => (prev.count > current.count ? prev : current)) 
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="flex gap-2">
          <Button variant={chartType === 'bar' ? 'default' : 'outline'} size="sm" onClick={() => setChartType('bar')}>
            <BarChart3 className="w-4 h-4 mr-2" />תרשים עמודות
          </Button>
          <Button variant={chartType === 'pie' ? 'default' : 'outline'} size="sm" onClick={() => setChartType('pie')}>
            <PieChartIcon className="w-4 h-4 mr-2" />תרשים עוגה
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant={viewMode === 'count' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('count')}>
            <Hash className="w-4 h-4 mr-2" />מספר מוחלט
          </Button>
          <Button variant={viewMode === 'percentage' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('percentage')}>
            <Percent className="w-4 h-4 mr-2" />אחוז
          </Button>
        </div>
      </div>

      <ChartContainer config={chartConfig} className="h-96" dir="rtl">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="archetype" tick={{ fontSize: 12, fontWeight: 'bold' }} textAnchor="middle" interval={0} />
              <YAxis tick={{ fontSize: 12 }} label={{ value: viewMode === 'count' ? 'מספר משתתפים' : 'אחוז (%)', angle: -90, position: 'insideLeft', style: { fontSize: '14px', fontWeight: 'bold' } }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey={viewMode}>
                {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Bar>
            </BarChart>
          ) : (
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" labelLine={false} label={({ archetype, value }) => `${archetype}: ${value}${viewMode === 'percentage' ? '%' : ''}`} outerRadius={120} fill="#8884d8" dataKey={viewMode}>
                {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          )}
        </ResponsiveContainer>
      </ChartContainer>

      {dominantArchetype && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-right">
          <h4 className="font-semibold text-blue-800 mb-2">סיכום התפלגות הארכיטיפים</h4>
          <p className="text-blue-700">
            הארכיטיפ הדומיננטי בקבוצה הוא <strong>{dominantArchetype.archetype}</strong> עם {dominantArchetype.count} משתתפים ({dominantArchetype.percentage}%).
          </p>
          <p className="text-blue-600 text-sm mt-2">
            {dominantArchetype.archetype === 'מנהל ההזדמנות' && 'קבוצה זו מאופיינת במנהיגות חדשנית הרואה הזדמנויות בכל מקום ופועלת ליצירת שינוי חיובי.'}
            {dominantArchetype.archetype === 'המנהל הסקרן' && 'קבוצה זו מאופיינת במנהיגות חקרנית הרואה בלמידה מתמשכת ובפיתוח אישי כמפתח להצלחה.'}
            {dominantArchetype.archetype === 'המנהל המעצים' && 'קבוצה זו מאופיינת במנהיגות מעצימה הרואה בפיתוח האחרים ובמתן כלים כמפתח להצלחה ארגונית.'}
          </p>
        </div>
      )}
    </div>
  );
};
