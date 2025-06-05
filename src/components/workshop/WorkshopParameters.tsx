
import React from 'react';
import { WocaAnalyticsDashboard } from '@/components/workshop/WocaAnalyticsDashboard';

interface WorkshopParametersProps {
  viewMode: 'workshop' | 'individual';
  workshopData?: any;
  selectedParticipant?: any;
}

export const WorkshopParameters: React.FC<WorkshopParametersProps> = ({
  viewMode,
  workshopData,
  selectedParticipant
}) => {
  return (
    <WocaAnalyticsDashboard
      viewMode={viewMode}
      workshopData={workshopData}
      selectedParticipant={selectedParticipant}
    />
  );
};
