
import { useState, useEffect } from 'react';
import { useGroupData } from '@/hooks/useGroupData';
import { useWorkshopData } from '@/hooks/useWorkshopData';
import { analyzeWorkshopWoca } from '@/utils/wocaAnalysis';
import { getHebrewZoneName } from '@/utils/wocaZoneMapping';

export interface PDFTemplateData {
  groupNumber: number;
  participantCount: number;
  salimaScore: number;
  strongestDimension: { name: string; score: number };
  weakestDimension: { name: string; score: number };
  wocaZoneLabel: string;
  wocaScore: number;
  wocaParticipantCount: number;
  wocaAnalysis?: any;
}

export const useGroupPDFTemplate = (groupNumber: number | null) => {
  const [templateData, setTemplateData] = useState<PDFTemplateData | null>(null);
  
  const { data: groupData, isLoading: salimaLoading, error: salimaError } = useGroupData(groupNumber || 0);
  const { workshopData, isLoading: wocaLoading, error: wocaError } = useWorkshopData(groupNumber || 0);

  useEffect(() => {
    if (!groupData || !workshopData || !groupNumber) {
      setTemplateData(null);
      return;
    }

    const wocaAnalysis = analyzeWorkshopWoca(workshopData.participants, workshopData.workshop_id);
    
    const strongestDimension = Object.entries(groupData.averages)
      .filter(([key]) => key !== 'overall')
      .reduce((max, [key, value]) => 
        value > max.score ? { name: key, score: value } : max, 
        { name: '', score: 0 }
      );
    
    const weakestDimension = Object.entries(groupData.averages)
      .filter(([key]) => key !== 'overall')
      .reduce((min, [key, value]) => 
        value < min.score ? { name: key, score: value } : min, 
        { name: '', score: 5 }
      );

    // Convert English zone name to Hebrew
    const hebrewZoneLabel = getHebrewZoneName(wocaAnalysis.groupDominantZoneByCount || 'opportunity');

    setTemplateData({
      groupNumber: groupData.group_number,
      participantCount: groupData.participant_count,
      salimaScore: groupData.averages.overall,
      strongestDimension,
      weakestDimension,
      wocaZoneLabel: hebrewZoneLabel,
      wocaScore: workshopData.average_score,
      wocaParticipantCount: workshopData.participant_count,
      wocaAnalysis,
    });
  }, [groupData, workshopData, groupNumber]);

  return {
    templateData,
    groupData,
    workshopData,
    isLoading: salimaLoading || wocaLoading,
    error: salimaError || wocaError,
  };
};
