
import React from 'react';
import { WocaCategoryRadarChart } from '@/components/WocaCategoryRadarChart';
import { useWocaAnalysis } from '@/hooks/useWocaAnalysis';

interface WocaRadarChartProps {
  participants: Array<{
    id: string;
    question_responses?: any;
    full_name: string;
  }>;
}

export const WocaRadarChart: React.FC<WocaRadarChartProps> = ({ participants }) => {
  // Use the new WOCA analysis hook to get category scores
  const { wocaAnalysis, isLoading, error } = useWocaAnalysis(participants, 1);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <span className="text-base" style={{ color: '#000000' }}>טוען ניתוח WOCA...</span>
      </div>
    );
  }

  if (error || !wocaAnalysis) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <span className="text-base" style={{ color: '#000000' }}>שגיאה בטעינת נתוני WOCA</span>
      </div>
    );
  }
  
  return (
    <WocaCategoryRadarChart categoryScores={wocaAnalysis.groupCategoryScores} />
  );
};
