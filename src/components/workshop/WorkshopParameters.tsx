
import React from 'react';
import { WocaZoneComparisonChart } from '@/components/WocaZoneComparisonChart';

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
    // Calculate group average scores
    const groupScores = {
      war: workshopData.participants.reduce((sum: number, p: any) => sum + (p.woca_scores?.war || 0), 0) / workshopData.participants.length,
      opportunity: workshopData.participants.reduce((sum: number, p: any) => sum + (p.woca_scores?.opportunity || 0), 0) / workshopData.participants.length,
      comfort: workshopData.participants.reduce((sum: number, p: any) => sum + (p.woca_scores?.comfort || 0), 0) / workshopData.participants.length,
      apathy: workshopData.participants.reduce((sum: number, p: any) => sum + (p.woca_scores?.apathy || 0), 0) / workshopData.participants.length
    };

    return (
      <WocaZoneComparisonChart 
        scores={groupScores}
        title="השוואת ציוני אזורי תודעה - ממוצע קבוצתי"
      />
    );
  }

  if (viewMode === 'individual' && selectedParticipant?.woca_scores) {
    return (
      <WocaZoneComparisonChart 
        scores={selectedParticipant.woca_scores}
        title="השוואת ציוני אזורי תודעה - ניתוח אישי"
      />
    );
  }

  return null;
};
