
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Dot } from 'recharts';
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
  participants: {
    label: "משתתפים",
    color: "#ef4444",
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

  // Generate bell curve data points
  const generateBellCurve = () => {
    const points = [];
    const min = Math.max(0, mean - 3 * stdDev);
    const max = Math.min(5, mean + 3 * stdDev);
    const step = (max - min) / 100;

    for (let x = min; x <= max; x += step) {
      const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * 
                Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
      points.push({ 
        x: x, 
        y: y * 100, // Scale for visibility
        participants: participantScores.filter(score => Math.abs(score - x) < step * 2).length
      });
    }
    return points;
  };

  const bellCurveData = generateBellCurve();

  // Add participant markers to the curve data
  const dataWithParticipants = bellCurveData.map(point => {
    const nearbyParticipants = participantScores.filter(score => 
      Math.abs(score - point.x) < 0.1
    );
    return {
      ...point,
      participantCount: nearbyParticipants.length
    };
  });

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (payload.participantCount > 0) {
      return (
        <g>
          {Array.from({ length: Math.min(payload.participantCount, 5) }).map((_, index) => (
            <circle
              key={index}
              cx={cx}
              cy={cy + (index * 3)}
              r={2}
              fill="#ef4444"
              opacity={0.7}
            />
          ))}
        </g>
      );
    }
    return null;
  };

  return (
    <ChartContainer config={chartConfig} className="h-full w-full" dir="rtl">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={dataWithParticipants} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="x"
            domain={[0, 5]}
            type="number"
            tick={{ fontSize: 12, fill: '#64748b' }}
            label={{ value: 'ציון SLQ', position: 'insideBottom', offset: -10, style: { fontSize: '14px', fontWeight: 'bold' } }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#64748b' }}
            label={{ value: 'צפיפות', angle: -90, position: 'insideLeft', style: { fontSize: '14px', fontWeight: 'bold' } }}
          />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 border rounded shadow-lg text-right">
                    <p className="text-blue-600 text-sm">
                      ציון SLQ: {typeof label === 'number' ? label.toFixed(2) : label}
                    </p>
                    {data.participantCount > 0 && (
                      <p className="text-red-600 text-sm">
                        משתתפים באזור: {data.participantCount}
                      </p>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          <Line 
            type="monotone" 
            dataKey="y" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={<CustomDot />}
            name="התפלגות נורמלית"
          />
          <ReferenceLine 
            x={averageScore} 
            stroke="#dc2626" 
            strokeWidth={2}
            strokeDasharray="5 5"
            label={{ value: "ממוצע קבוצה", position: "top" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
