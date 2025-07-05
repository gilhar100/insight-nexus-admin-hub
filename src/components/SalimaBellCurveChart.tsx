
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
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
  curve: {
    label: "התפלגות",
    color: "#3b82f6",
  },
};

export const SalimaBellCurveChart: React.FC<SalimaBellCurveChartProps> = ({ participants, averageScore }) => {
  // Calculate individual SLQ scores
  const participantScores = participants.map(p => 
    (p.dimension_s + p.dimension_l + p.dimension_i + p.dimension_m + p.dimension_a + p.dimension_a2) / 6
  );

  // Calculate standard deviation
  const mean = participantScores.reduce((sum, score) => sum + score, 0) / participantScores.length;
  const variance = participantScores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / participantScores.length;
  const stdDev = Math.sqrt(variance);

  // Generate bell curve data points - wider range and more points for smoother curve
  const generateBellCurve = () => {
    const points = [];
    const min = 1;
    const max = 5;
    const step = (max - min) / 500; // More points for smoother curve

    for (let x = min; x <= max; x += step) {
      const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * 
                Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
      points.push({ 
        slqScore: x, 
        density: y * 200 // Increased scaling for better visibility
      });
    }
    return points;
  };

  const bellCurveData = generateBellCurve();

  // Custom component to render tick marks for individual scores
  const CustomTicks = () => {
    return (
      <g>
        {participantScores.map((score, index) => {
          // Calculate x position based on the chart's domain (1 to 5)
          const xPercent = ((score - 1) / (5 - 1)) * 100;
          return (
            <line
              key={index}
              x1={`${xPercent}%`}
              y1="90%"
              x2={`${xPercent}%`}
              y2="85%"
              stroke="#dc2626"
              strokeWidth={2}
            />
          );
        })}
      </g>
    );
  };

  return (
    <div className="w-full h-full relative">
      <ChartContainer config={chartConfig} className="h-full w-full" dir="rtl">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={bellCurveData} margin={{ top: 40, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="slqScore"
              domain={[1, 5]}
              type="number"
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickFormatter={(value) => value.toFixed(1)}
              label={{ value: 'ציון SLQ', position: 'insideBottom', offset: -10, style: { fontSize: '14px', fontWeight: 'bold' } }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#64748b' }}
              label={{ value: 'צפיפות', angle: -90, position: 'insideLeft', style: { fontSize: '14px', fontWeight: 'bold' } }}
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-3 border rounded shadow-lg text-right">
                      <p className="text-blue-600 text-sm">
                        ציון SLQ: {typeof label === 'number' ? label.toFixed(2) : label}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line 
              type="monotone" 
              dataKey="density" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={false}
              name="התפלגות נורמלית"
            />
            <ReferenceLine 
              x={averageScore} 
              stroke="#dc2626" 
              strokeWidth={3}
              strokeDasharray="5 5"
              label={{ 
                value: "ממוצע קבוצתי", 
                position: "top", 
                offset: 10,
                style: { 
                  fontWeight: 'bold', 
                  fontSize: '14px',
                  fill: '#dc2626'
                } 
              }}
            />
            <CustomTicks />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
      
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center text-gray-600 text-sm">
        <p>הקווים האדומים מייצגים את הציונים האישיים של חברי הקבוצה</p>
      </div>
    </div>
  );
};
