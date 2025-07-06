
import React from 'react';
import { getSalimaColor } from '@/utils/salimaColors';

interface SalimaIntensityBarProps {
  dimension: string;
  score: number;
  maxScore?: number;
}

export const SalimaIntensityBar: React.FC<SalimaIntensityBarProps> = ({ 
  dimension, 
  score, 
  maxScore = 5 
}) => {
  const baseColor = getSalimaColor(dimension);
  const intensity = Math.min(score / maxScore, 1);
  const percentage = (score / maxScore) * 100;
  
  // Calculate opacity based on score intensity
  const opacity = Math.max(0.3, intensity);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium" style={{ color: baseColor }}>
          {dimension}
        </span>
        <span className="text-sm text-gray-600">{score.toFixed(1)}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
        <div
          className="h-3 rounded-full transition-all duration-500"
          style={{
            backgroundColor: baseColor,
            opacity: opacity,
            width: `${percentage}%`
          }}
        />
        {/* Intensity overlay gradient */}
        <div 
          className="absolute top-0 left-0 h-3 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${baseColor}40 0%, ${baseColor} ${percentage}%)`,
            width: `${percentage}%`
          }}
        />
      </div>
    </div>
  );
};
