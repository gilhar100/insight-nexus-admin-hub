
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

  // Calculate statistics
  const mean = participantScores.reduce((sum, score) => sum + score, 0) / participantScores.length;
  const variance = participantScores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / participantScores.length;
  const stdDev = Math.sqrt(variance);

  // Ensure minimum standard deviation for visible curve
  const effectiveStdDev = Math.max(stdDev, 0.3);

  // Generate smooth bell curve data points
  const generateBellCurve = () => {
    const points = [];
    const min = 1;
    const max = 5;
    const step = (max - min) / 200; // High resolution for smooth curve

    for (let x = min; x <= max; x += step) {
      // Normal distribution formula
      const exponent = -0.5 * Math.pow((x - mean) / effectiveStdDev, 2);
      const coefficient = 1 / (effectiveStdDev * Math.sqrt(2 * Math.PI));
      const y = coefficient * Math.exp(exponent);
      
      points.push({ 
        slqScore: parseFloat(x.toFixed(3)), 
        density: y * 100 // Scale for better visibility
      });
    }
    return points;
  };

  const bellCurveData = generateBellCurve();

  // Find maximum density for Y-axis scaling
  const maxDensity = Math.max(...bellCurveData.map(point => point.density));
  const yAxisMax = Math.ceil(maxDensity * 1.2); // Add 20% padding

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
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="slqScore"
              domain={[1, 5]}
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
              domain={[0, yAxisMax]}
              tick={{ fontSize: 12, fill: '#64748b' }}
              label={{ 
                value: 'צפיפות', 
                angle: -90, 
                position: 'insideLeft', 
                style: { fontSize: '14px', fontWeight: 'bold', textAnchor: 'middle' } 
              }}
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-3 border rounded shadow-lg text-right">
                      <p className="text-blue-600 text-sm">
                        ציון SLQ: {typeof label === 'number' ? label.toFixed(2) : label}
                      </p>
                      <p className="text-gray-600 text-sm">
                        צפיפות: {payload[0].value?.toFixed(3)}
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
              connectNulls={false}
            />
            <ReferenceLine 
              x={averageScore} 
              stroke="#dc2626" 
              strokeWidth={3}
              strokeDasharray="8 4"
              label={{ 
                value: "ממוצע קבוצתי", 
                position: "top", 
                offset: 15,
                style: { 
                  fontWeight: 'bold', 
                  fontSize: '14px',
                  fill: '#dc2626',
                  textAnchor: 'middle'
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
