
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { DataSourceType } from '@/hooks/useEnhancedRespondentData';
import { getSalimaColor } from '@/utils/salimaColors';

interface ChartDataPoint {
  dimension: string;
  self?: number;
  colleague?: number;
  combined?: number;
  fullMark: number;
}

interface EnhancedSalimaRadarChartProps {
  selfData: {
    strategy: number;
    adaptability: number;
    learning: number;
    inspiration: number;
    meaning: number;
    authenticity: number;
  };
  colleagueData?: {
    strategy: number;
    adaptability: number;
    learning: number;
    inspiration: number;
    meaning: number;
    authenticity: number;
  };
  combinedData?: {
    strategy: number;
    adaptability: number;
    learning: number;
    inspiration: number;
    meaning: number;
    authenticity: number;
  };
  activeDataSource: DataSourceType;
}

const chartConfig = {
  self: {
    label: "דוח עצמי",
    color: "#3B82F6",
  },
  colleague: {
    label: "דוח קולגות",
    color: "#EF4444",
  },
  combined: {
    label: "דוח משולב",
    color: "#10B981",
  },
};

export const EnhancedSalimaRadarChart: React.FC<EnhancedSalimaRadarChartProps> = ({ 
  selfData, 
  colleagueData, 
  combinedData, 
  activeDataSource 
}) => {
  const chartData: ChartDataPoint[] = [
    {
      dimension: 'אסטרטגיה',
      self: selfData.strategy,
      colleague: colleagueData?.strategy,
      combined: combinedData?.strategy,
      fullMark: 5
    },
    {
      dimension: 'למידה',
      self: selfData.learning,
      colleague: colleagueData?.learning,
      combined: combinedData?.learning,
      fullMark: 5
    },
    {
      dimension: 'השראה',
      self: selfData.inspiration,
      colleague: colleagueData?.inspiration,
      combined: combinedData?.inspiration,
      fullMark: 5
    },
    {
      dimension: 'הסתגלות',
      self: selfData.adaptability,
      colleague: colleagueData?.adaptability,
      combined: combinedData?.adaptability,
      fullMark: 5
    },
    {
      dimension: 'אותנטיות',
      self: selfData.authenticity,
      colleague: colleagueData?.authenticity,
      combined: combinedData?.authenticity,
      fullMark: 5
    },
    {
      dimension: 'משמעות',
      self: selfData.meaning,
      colleague: colleagueData?.meaning,
      combined: combinedData?.meaning,
      fullMark: 5
    }
  ];

  const renderRadars = () => {
    const radars = [];
    
    if (activeDataSource === 'self' || activeDataSource === 'combined') {
      radars.push(
        <Radar
          key="self"
          name="דוח עצמי"
          dataKey="self"
          stroke="#3B82F6"
          fill="#3B82F6"
          fillOpacity={0.1}
          strokeWidth={2}
        />
      );
    }
    
    if (activeDataSource === 'colleague' && colleagueData) {
      radars.push(
        <Radar
          key="colleague"
          name="דוח קולגות"
          dataKey="colleague"
          stroke="#EF4444"
          fill="#EF4444"
          fillOpacity={0.1}
          strokeWidth={2}
        />
      );
    }
    
    if (activeDataSource === 'combined' && combinedData) {
      radars.push(
        <Radar
          key="combined"
          name="דוח משולב"
          dataKey="combined"
          stroke="#10B981"
          fill="#10B981"
          fillOpacity={0.1}
          strokeWidth={2}
        />
      );
    }

    // Show comparison when colleague data is available and not in single mode
    if (colleagueData && (activeDataSource === 'colleague' || activeDataSource === 'combined')) {
      if (activeDataSource === 'colleague') {
        // Show both self and colleague for comparison
        radars.push(
          <Radar
            key="self-comparison"
            name="דוח עצמי (השוואה)"
            dataKey="self"
            stroke="#3B82F6"
            fill="transparent"
            strokeWidth={1}
            strokeDasharray="5 5"
          />
        );
      }
    }
    
    return radars;
  };

  return (
    <ChartContainer config={chartConfig} className="h-80" dir="rtl">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <PolarGrid />
          <PolarAngleAxis 
            dataKey="dimension" 
            tick={{ fontSize: 14, fontWeight: 'bold' }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 5]} 
            tick={{ fontSize: 12 }}
            tickCount={6}
          />
          {renderRadars()}
          <ChartTooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 border rounded shadow-lg text-right">
                    <p className="font-semibold text-lg" style={{ color: getSalimaColor(label || '') }}>
                      {label}
                    </p>
                    {payload.map((entry, index) => (
                      <p key={index} style={{ color: entry.color }} className="text-base">
                        {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
                      </p>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
