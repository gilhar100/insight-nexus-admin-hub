
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ScatterChart, Scatter, ComposedChart } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { getSalimaColor } from '@/utils/salimaColors';

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

  // Calculate statistics
  const mean = participantScores.reduce((sum, score) => sum + score, 0) / participantScores.length;
  const variance = participantScores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / participantScores.length;
  const stdDev = Math.sqrt(variance);

  // Ensure minimum standard deviation for visible curve
  const effectiveStdDev = Math.max(stdDev, 0.5);

  // Create a dynamic range centered around the group average
  const minScore = Math.min(...participantScores);
  const maxScore = Math.max(...participantScores);
  const range = Math.max(maxScore - minScore, 2); // Minimum range of 2
  const padding = range * 0.3; // Add 30% padding
  
  const xMin = Math.max(1, averageScore - range/2 - padding);
  const xMax = Math.min(5, averageScore + range/2 + padding);

  // Generate smooth bell curve data points using kernel density estimation
  const generateBellCurve = () => {
    const points = [];
    const step = (xMax - xMin) / 100; // Increased resolution for smoother curve

    for (let x = xMin; x <= xMax; x += step) {
      // Calculate kernel density estimation at point x
      let density = 0;
      const bandwidth = effectiveStdDev * 0.8; // Smoothing bandwidth
      
      participantScores.forEach(score => {
        // Gaussian kernel
        const u = (x - score) / bandwidth;
        density += Math.exp(-0.5 * u * u) / Math.sqrt(2 * Math.PI);
      });
      
      density = density / (participantScores.length * bandwidth);
      
      points.push({ 
        slqScore: parseFloat(x.toFixed(3)), 
        density: density * 10 // Scale for better visibility
      });
    }
    return points;
  };

  const bellCurveData = generateBellCurve();

  // Create participant dots data for scatter plot
  const participantDots = participantScores.map((score, index) => ({
    slqScore: score,
    y: -0.2, // Position below x-axis
    participantIndex: index + 1,
    exactScore: score
  }));

  // Find maximum density for Y-axis scaling
  const maxDensity = Math.max(...bellCurveData.map(point => point.density));
  const yAxisMax = Math.ceil(maxDensity * 1.3); // Add 30% padding

  return (
    <div className="w-full h-full relative">
      <ChartContainer config={chartConfig} className="h-full w-full" dir="rtl">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={bellCurveData} margin={{ top: 40, right: 30, left: 20, bottom: 80 }}>
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
              domain={[-0.5, yAxisMax]}
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
                  // Check if this is a participant dot
                  const isParticipantDot = payload.some(p => p.dataKey === 'y');
                  
                  if (isParticipantDot) {
                    const participantData = payload.find(p => p.payload.exactScore !== undefined);
                    if (participantData) {
                      return (
                        <div className="bg-white p-3 border rounded shadow-lg text-right">
                          <p className="text-red-600 text-sm font-semibold">
                            משתתף #{participantData.payload.participantIndex}
                          </p>
                          <p className="text-gray-600 text-sm">
                            ציון SLQ: {participantData.payload.exactScore.toFixed(2)}
                          </p>
                        </div>
                      );
                    }
                  }

                  // Regular curve tooltip
                  const formatLabel = (labelValue: any): string => {
                    if (typeof labelValue === 'number') {
                      return labelValue.toFixed(2);
                    }
                    if (typeof labelValue === 'string') {
                      const parsed = parseFloat(labelValue);
                      return isNaN(parsed) ? '0.00' : parsed.toFixed(2);
                    }
                    return '0.00';
                  };

                  const formatValue = (value: any): string => {
                    if (typeof value === 'number') {
                      return value.toFixed(3);
                    }
                    if (typeof value === 'string') {
                      const parsed = parseFloat(value);
                      return isNaN(parsed) ? '0.000' : parsed.toFixed(3);
                    }
                    return '0.000';
                  };

                  return (
                    <div className="bg-white p-3 border rounded shadow-lg text-right">
                      <p className="text-blue-600 text-sm">
                        ציון SLQ: {formatLabel(label)}
                      </p>
                      <p className="text-gray-600 text-sm">
                        צפיפות: {formatValue(payload[0].value)}
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
            {/* Individual participant dots */}
            <Scatter 
              data={participantDots}
              fill="#D32F2F"
              shape="circle"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartContainer>
      
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center text-gray-600 text-sm">
        <p className="font-semibold mb-1">הנקודות האדומות מייצגות את ציוני המנהיגות של המשתתפים השונים</p>
        <p className="text-xs">העבירי עכבר מעל נקודה לצפייה בפרטים</p>
      </div>
    </div>
  );
};
