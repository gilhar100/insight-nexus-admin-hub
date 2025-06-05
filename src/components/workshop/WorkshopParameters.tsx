
import React from 'react';
import { WocaParameterDisplay } from '@/components/WocaParameterDisplay';

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
  if (viewMode === 'workshop' && workshopData) {
    return (
      <WocaParameterDisplay 
        scores={{
          war: workshopData.participants.reduce((sum: number, p: any) => sum + (p.woca_scores?.war || 0), 0) / workshopData.participants.length,
          opportunity: workshopData.participants.reduce((sum: number, p: any) => sum + (p.woca_scores?.opportunity || 0), 0) / workshopData.participants.length,
          comfort: workshopData.participants.reduce((sum: number, p: any) => sum + (p.woca_scores?.comfort || 0), 0) / workshopData.participants.length,
          apathy: workshopData.participants.reduce((sum: number, p: any) => sum + (p.woca_scores?.apathy || 0), 0) / workshopData.participants.length
        }}
        dominantZone={workshopData.dominant_zone}
        title="פרמטרי WOCA - ממוצע קבוצתי"
      />
    );
  }

  if (viewMode === 'individual' && selectedParticipant) {
    return (
      <WocaParameterDisplay 
        scores={selectedParticipant.woca_scores}
        dominantZone={selectedParticipant.woca_zone}
        title="פרמטרי WOCA - ניתוח אישי"
      />
    );
  }

  return null;
};
