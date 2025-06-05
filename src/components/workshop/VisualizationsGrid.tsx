import React from 'react';
import { WocaAnalyticsDashboard } from '@/components/workshop/WocaAnalyticsDashboard';

interface VisualizationsGridProps {
  workshopData: any;
}

export const VisualizationsGrid: React.FC<VisualizationsGridProps> = ({ workshopData }) => {
  // This component is now replaced by WocaAnalyticsDashboard
  // Keep it for backward compatibility but delegate to the new dashboard
  return (
    <WocaAnalyticsDashboard
      viewMode="workshop"
      workshopData={workshopData}
    />
  );
};
