
import React from 'react';
import { WocaCategoryRadarChart } from '@/components/WocaCategoryRadarChart';
import { analyzeWorkshopWoca } from '@/utils/wocaAnalysis';

interface WocaRadarChartProps {
  participants: Array<{
    id: string;
    question_responses?: any;
    full_name: string;
  }>;
}

export const WocaRadarChart: React.FC<WocaRadarChartProps> = ({ participants }) => {
  // Use the new WOCA analysis to get category scores
  const wocaAnalysis = analyzeWorkshopWoca(participants, 1); // Workshop ID doesn't matter for this calculation
  
  return (
    <WocaCategoryRadarChart categoryScores={wocaAnalysis.groupCategoryScores} />
  );
};
