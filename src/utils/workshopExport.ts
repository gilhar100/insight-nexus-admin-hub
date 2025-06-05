
export const exportWorkshopData = (
  viewMode: 'workshop' | 'individual',
  workshopData: any,
  selectedParticipant: any,
  showNames: boolean
) => {
  const dataToExport = viewMode === 'workshop' ? workshopData : selectedParticipant;
  if (!dataToExport) return;

  const exportData = {
    type: viewMode,
    ...(viewMode === 'workshop' ? {
      workshop_id: dataToExport.workshop_id,
      participant_count: dataToExport.participant_count,
      average_score: dataToExport.average_score,
      participants: dataToExport.participants.map((p: any) => ({
        ...p,
        full_name: showNames ? p.full_name : `Participant ${dataToExport.participants.indexOf(p) + 1}`
      }))
    } : {
      participant: {
        ...dataToExport,
        full_name: showNames ? dataToExport.full_name : 'Anonymous Participant'
      }
    }),
    analysis_date: new Date().toISOString()
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  const identifier = viewMode === 'workshop' 
    ? `workshop-${dataToExport.workshop_id}` 
    : `participant-${dataToExport.id}`;
  link.download = `woca-${identifier}-analysis-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
