
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useWorkshopData } from '@/hooks/useWorkshopData';
import { PresenterMode } from '@/components/PresenterMode';
import { WocaParameterDisplay } from '@/components/WocaParameterDisplay';
import { PageHeader } from '@/components/workshop/PageHeader';
import { SearchAndSelection } from '@/components/workshop/SearchAndSelection';
import { ZoneClassification } from '@/components/workshop/ZoneClassification';
import { VisualizationsGrid } from '@/components/workshop/VisualizationsGrid';
import { ZoneAnalysisGrid } from '@/components/workshop/ZoneAnalysisGrid';
import { IndividualDetails } from '@/components/workshop/IndividualDetails';

export const GroupWorkshopInsights: React.FC = () => {
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<number | undefined>();
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [showNames, setShowNames] = useState(false);
  const [presenterMode, setPresenterMode] = useState(false);
  const [viewMode, setViewMode] = useState<'workshop' | 'individual'>('workshop');
  
  const { workshopData, workshops, isLoading, error } = useWorkshopData(selectedWorkshopId);

  const handleWorkshopSelect = (value: string) => {
    setSelectedWorkshopId(Number(value));
    setSelectedParticipant(null);
    setViewMode('workshop');
  };

  const handleParticipantSelect = (participant: any) => {
    setSelectedParticipant(participant);
    setSelectedWorkshopId(undefined);
    setViewMode('individual');
  };

  const exportWorkshopData = () => {
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

  // Zone distribution calculation for workshop using new method
  const getZoneDistribution = () => {
    if (!workshopData) return {};
    return workshopData.zone_distribution;
  };

  const zoneDistribution = getZoneDistribution();
  const currentData = viewMode === 'workshop' ? workshopData : selectedParticipant;
  
  // For workshop view, use dominant zone; for individual, calculate from their WOCA scores
  const getCurrentZoneInfo = () => {
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

  const zoneInfo = getCurrentZoneInfo();

  const getDisplayTitle = () => {
    if (viewMode === 'workshop' && workshopData) return `סדנה ${workshopData.workshop_id}`;
    if (viewMode === 'individual' && selectedParticipant) return selectedParticipant.full_name;
    return 'ניתוח WOCA';
  };

  return (
    <>
      <div className="space-y-6">
        <PageHeader />

        <SearchAndSelection
          workshops={workshops}
          selectedWorkshopId={selectedWorkshopId}
          onWorkshopSelect={handleWorkshopSelect}
          onParticipantSelect={handleParticipantSelect}
          error={error}
        />

        {/* Loading state */}
        {isLoading && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-500">טוען נתונים...</div>
            </CardContent>
          </Card>
        )}

        {/* Results Section */}
        {currentData && !isLoading && (
          <>
            <ZoneClassification
              zoneInfo={zoneInfo}
              viewMode={viewMode}
              workshopData={workshopData}
              selectedParticipant={selectedParticipant}
              showNames={showNames}
              onToggleNames={() => setShowNames(!showNames)}
              onPresenterMode={() => setPresenterMode(true)}
              onExport={exportWorkshopData}
            />

            {/* WOCA Parameters Display */}
            {viewMode === 'workshop' && workshopData && (
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
            )}

            {viewMode === 'individual' && selectedParticipant && (
              <WocaParameterDisplay 
                scores={selectedParticipant.woca_scores}
                dominantZone={selectedParticipant.woca_zone}
                title="פרמטרי WOCA - ניתוח אישי"
              />
            )}

            {/* Visualizations */}
            {viewMode === 'workshop' && workshopData && (
              <>
                <VisualizationsGrid workshopData={workshopData} />
                <ZoneAnalysisGrid 
                  zoneDistribution={zoneDistribution} 
                  workshopData={workshopData} 
                />
              </>
            )}

            {/* Individual participant details */}
            {viewMode === 'individual' && selectedParticipant && (
              <IndividualDetails 
                selectedParticipant={selectedParticipant}
                showNames={showNames}
              />
            )}
          </>
        )}
      </div>

      {/* Presenter Mode */}
      <PresenterMode 
        isOpen={presenterMode}
        onClose={() => setPresenterMode(false)}
        type="woca"
        data={currentData}
        title={getDisplayTitle()}
      />
    </>
  );
};
