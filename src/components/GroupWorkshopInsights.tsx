
import React from 'react';
import { PresenterMode } from '@/components/PresenterMode';
import { PageHeader } from '@/components/workshop/PageHeader';
import { SearchAndSelection } from '@/components/workshop/SearchAndSelection';
import { ZoneClassification } from '@/components/workshop/ZoneClassification';
import { VisualizationsGrid } from '@/components/workshop/VisualizationsGrid';
import { ZoneAnalysisGrid } from '@/components/workshop/ZoneAnalysisGrid';
import { IndividualDetails } from '@/components/workshop/IndividualDetails';
import { WorkshopParameters } from '@/components/workshop/WorkshopParameters';
import { LoadingState } from '@/components/workshop/LoadingState';
import { useWorkshopInsights } from '@/hooks/useWorkshopInsights';
import { exportWorkshopData } from '@/utils/workshopExport';
import { getCurrentZoneInfo, getDisplayTitle, getZoneDistribution } from '@/utils/workshopZoneInfo';

export const GroupWorkshopInsights: React.FC = () => {
  const {
    selectedWorkshopId,
    selectedParticipant,
    showNames,
    presenterMode,
    viewMode,
    workshopData,
    workshops,
    isLoading,
    error,
    handleWorkshopSelect,
    handleParticipantSelect,
    toggleNames,
    togglePresenterMode,
    setPresenterMode
  } = useWorkshopInsights();

  const zoneDistribution = getZoneDistribution(workshopData);
  const currentData = viewMode === 'workshop' ? workshopData : selectedParticipant;
  const zoneInfo = getCurrentZoneInfo(viewMode, workshopData, selectedParticipant);

  const handleExport = () => {
    exportWorkshopData(viewMode, workshopData, selectedParticipant, showNames);
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

        {isLoading && <LoadingState />}

        {currentData && !isLoading && (
          <>
            <ZoneClassification
              zoneInfo={zoneInfo}
              viewMode={viewMode}
              workshopData={workshopData}
              selectedParticipant={selectedParticipant}
              showNames={showNames}
              onToggleNames={toggleNames}
              onPresenterMode={togglePresenterMode}
              onExport={handleExport}
            />

            <WorkshopParameters
              viewMode={viewMode}
              workshopData={workshopData}
              selectedParticipant={selectedParticipant}
            />

            {viewMode === 'workshop' && workshopData && (
              <>
                <VisualizationsGrid workshopData={workshopData} />
                <ZoneAnalysisGrid 
                  zoneDistribution={zoneDistribution} 
                  workshopData={workshopData} 
                />
              </>
            )}

            {viewMode === 'individual' && selectedParticipant && (
              <IndividualDetails 
                selectedParticipant={selectedParticipant}
                showNames={showNames}
              />
            )}
          </>
        )}
      </div>

      <PresenterMode 
        isOpen={presenterMode}
        onClose={() => setPresenterMode(false)}
        type="woca"
        data={currentData}
        title={getDisplayTitle(viewMode, workshopData, selectedParticipant)}
      />
    </>
  );
};
