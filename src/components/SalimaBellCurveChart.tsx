
import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';

interface SalimaBellCurveChartProps {
  participants: Array<{
    dimension_s: number;
    dimension_l: number;
    dimension_i: number;
    dimension_m: number;
    dimension_a: number;
    dimension_a2: number;
  }>;
  averageScore: number;
}

const chartConfig = {
  participants: {
    label: "משתתפים",
    color: "#D32F2F",
  },
};

export const SalimaBellCurveChart: React.FC<SalimaBellCurveChartProps> = ({ participants, averageScore }) => {
  // Validate data
  if (!participants || participants.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-500">אין נתונים להצגה</p>
      </div>
    );
  }

  // Calculate individual SLQ scores
  const participantScores = participants.map(p => 
    (p.dimension_s + p.dimension_l + p.dimension_i + p.dimension_m + p.dimension_a + p.dimension_a2) / 6
  );

  console.log('Participant SLQ scores:', participantScores);
  console.log('Number of participants:', participantScores.length);
  console.log('Average score:', averageScore);

  // Create scatter plot data with vertical jitter to avoid overlap
  const scatterData = participantScores.map((score, index) => {
    // Apply jitter based on how many participants have similar scores
    const similarScores = participantScores.filter(s => Math.abs(s - score) < 0.1);
    const jitterIndex = similarScores.findIndex(s => Math.abs(s - score) < 0.01);
    const jitter = (jitterIndex * 0.15) - ((similarScores.length - 1) * 0.075); // Center the jitter
    
    return {
      slqScore: score,
      y: 1 + jitter, // Base y position with jitter
      participantIndex: index + 1,
      exactScore: score
    };
  });

  // Calculate axis ranges
  const minScore = Math.min(...participantScores);
  const maxScore = Math.max(...participantScores);
  const scoreRange = maxScore - minScore;
  const padding = Math.max(scoreRange * 0.1, 0.2); // At least 0.2 padding
  
  const xMin = Math.max(1, minScore - padding);
  const xMax = Math.min(5, maxScore + padding);

  return (
    <div className="w-full h-full relative">
      <ChartContainer config={chartConfig} className="h-full w-full" dir="rtl">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 40, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="slqScore"
              domain={[xMin, xMax]}
              type="number"
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickFormatter={(value) => value.toFixed(1)}
              label={{ 
                value: 'ציון SLQ', 
                position: 'insideBottom', 
                offset: -10, 
                style: { fontSize: '14px', fontWeight: 'bold', textAnchor: 'middle' } 
              }}
            />
            <YAxis 
              hide={true}
              domain={[0.5, 1.8]}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 border rounded shadow-lg text-right">
                      <p className="text-red-600 text-sm font-semibold">
                        משתתף
                      </p>
                      <p className="text-gray-600 text-sm">
                        ציון SLQ: {data.exactScore.toFixed(2)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Group average reference line */}
            <ReferenceLine 
              x={averageScore} 
              stroke="#2563eb" 
              strokeWidth={2} 
              strokeDasharray="5 5"
              label={{ 
                value: `ממוצע קבוצה: ${averageScore.toFixed(2)}`, 
                position: 'top',
                style: { fontSize: '12px', fill: '#2563eb', fontWeight: 'bold' }
              }}
            />
            {/* Individual participant dots */}
            <Scatter 
              data={scatterData}
              fill="#D32F2F"
              stroke="#D32F2F"
              strokeWidth={1}
              r={6}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </ChartContainer>
      
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center text-gray-600 text-sm">
        <p className="font-semibold mb-1">כל נקודה מייצגת ציון SLQ של משתתף אחד</p>
        <p className="text-xs">הקו המקווקו מציין את הממוצע הקבוצתי</p>
      </div>
    </div>
  );
};
