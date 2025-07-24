
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useWorkshopData } from '@/hooks/useWorkshopData';
import { analyzeWorkshopWoca } from '@/utils/wocaAnalysis';
import { PresenterMode } from '@/components/PresenterMode';
import { ParticipantSearch } from '@/components/ParticipantSearch';
import { WocaZoneSection } from '@/components/WocaZoneSection';
import { WocaChartsRow } from '@/components/WocaChartsRow';
import { OpportunityZoneSection } from '@/components/OpportunityZoneSection';
import { WocaZonesTable } from '@/components/WocaZonesTable';
import { GroupSelector } from '@/components/GroupSelector';
import { GroupInsightsHeader } from '@/components/GroupInsightsHeader';
import { InsufficientDataWarning } from '@/components/InsufficientDataWarning';

export const GroupWorkshopInsights: React.FC = () => {
  const [selectedGroupId, setSelectedGroupId] = useState<number | undefined>();
  const [showNames, setShowNames] = useState(false);
  const [isPresenterMode, setIsPresenterMode] = useState(false);
  
  const {
    workshopData,
    workshops,
    isLoading,
    error
  } = useWorkshopData(selectedGroupId);

  console.log('🏠 GroupWorkshopInsights render:', {
    selectedGroupId,
    isLoading,
    error,
    hasWorkshopData: !!workshopData,
    workshopsCount: workshops.length,
    workshopData: workshopData ? {
      participantCount: workshopData.participant_count,
      firstParticipant: workshopData.participants[0],
      groupCategoryScores: workshopData.groupCategoryScores
    } : null
  });

  const wocaAnalysis = workshopData ? analyzeWorkshopWoca(workshopData.participants, workshopData.workshop_id) : null;

  const handleGroupSelect = (value: string) => {
    const groupId = Number(value);
    console.log('🎯 Group selected:', groupId);
    setSelectedGroupId(groupId);
  };

  const exportWorkshopData = () => {
    if (!workshopData) return;
    const wocaAnalysis = analyzeWorkshopWoca(workshopData.participants, workshopData.workshop_id);
    const exportData = {
      group_id: workshopData.workshop_id,
      participant_count: workshopData.participant_count,
      woca_analysis: wocaAnalysis,
      analysis_date: new Date().toISOString(),
      participants: workshopData.participants.map(p => ({
        ...p,
        full_name: showNames ? p.full_name : `Participant ${workshopData.participants.indexOf(p) + 1}`
      }))
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `group-${workshopData.workshop_id}-woca-analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  console.log('🔍 WOCA Analysis results:', wocaAnalysis);

  const hasMinimumData = workshopData && workshopData.participants.length >= 3;

  const getZoneDistribution = () => {
    if (!wocaAnalysis?.groupZoneCounts) return { opportunity: 0, comfort: 0, apathy: 0, war: 0 };
    
    return {
      opportunity: wocaAnalysis.groupZoneCounts.opportunity,
      comfort: wocaAnalysis.groupZoneCounts.comfort,
      apathy: wocaAnalysis.groupZoneCounts.apathy,
      war: wocaAnalysis.groupZoneCounts.war
    };
  };

  const renderContent = () => (
    <div className={`space-y-6 ${isPresenterMode ? 'presenter-mode' : ''}`} dir="rtl">
      {/* Page Header */}
      {!isPresenterMode && <GroupInsightsHeader />}

      {/* Individual Search Bar */}
      {!isPresenterMode && <ParticipantSearch />}

      {/* Group Selection */}
      {!isPresenterMode && (
        <GroupSelector
          workshops={workshops}
          selectedGroupId={selectedGroupId}
          onGroupSelect={handleGroupSelect}
          error={error}
        />
      )}

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-base" style={{ color: '#000000' }}>טוען נתוני קבוצה...</div>
          </CardContent>
        </Card>
      )}

      {/* Insufficient Data Warning */}
      {workshopData && !hasMinimumData && (
        <InsufficientDataWarning participantCount={workshopData.participants.length} />
      )}

      {/* Results Section - Only show when group is selected and has minimum data */}
      {workshopData && wocaAnalysis && hasMinimumData && (
        <>
          {/* 1. WOCA Zone Description Section */}
          <WocaZoneSection
            wocaAnalysis={wocaAnalysis}
            isPresenterMode={isPresenterMode}
            showNames={showNames}
            onToggleNames={() => setShowNames(!showNames)}
            onExportData={exportWorkshopData}
          />

          {/* 2. Charts Section - Radar + Pie + Horizontal Bar */}
          <WocaChartsRow
            workshopData={{ ...workshopData, groupCategoryScores: workshopData.groupCategoryScores || wocaAnalysis.groupCategoryScores }}
            zoneDistribution={getZoneDistribution()}
            isPresenterMode={isPresenterMode}
          />

          {/* 3. WOCA Zones Matrix Table - Using frequency-based analysis */}
          <WocaZonesTable
            dominantZone={wocaAnalysis.groupDominantZoneByCount}
            isTie={wocaAnalysis.groupIsTieByCount}
            tiedCategories={wocaAnalysis.groupTiedCategoriesByCount}
            isPresenterMode={isPresenterMode}
          />

          {/* 4. Opportunity Zone Paragraph */}
          <OpportunityZoneSection isPresenterMode={isPresenterMode} />
        </>
      )}
    </div>
  );

  return (
    <PresenterMode 
      isPresenterMode={isPresenterMode} 
      onToggle={() => setIsPresenterMode(!isPresenterMode)}
    >
      {renderContent()}
    </PresenterMode>
  );
};
