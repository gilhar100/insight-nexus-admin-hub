
export const getCurrentZoneInfo = (
  viewMode: 'workshop' | 'individual',
  workshopData: any,
  selectedParticipant: any
) => {
  if (viewMode === 'workshop' && workshopData) {
    return {
      name: workshopData.dominant_zone,
      color: `bg-[${workshopData.dominant_zone_color}]`,
      description: `האזור התודעתי הדומיננטי של הקבוצה`
    };
  }
  if (viewMode === 'individual' && selectedParticipant) {
    return {
      name: selectedParticipant.woca_zone || 'לא זמין',
      color: `bg-[${selectedParticipant.woca_zone_color || '#666666'}]`,
      description: 'אזור תודעתי אישי'
    };
  }
  return { name: 'לא זמין', color: 'bg-gray-500', description: 'לא זמין' };
};

export const getDisplayTitle = (
  viewMode: 'workshop' | 'individual',
  workshopData: any,
  selectedParticipant: any
) => {
  if (viewMode === 'workshop' && workshopData) return `סדנה ${workshopData.workshop_id}`;
  if (viewMode === 'individual' && selectedParticipant) return selectedParticipant.full_name;
  return 'ניתוח WOCA';
};

export const getZoneDistribution = (workshopData: any) => {
  if (!workshopData) return {};
  return workshopData.zone_distribution;
};
