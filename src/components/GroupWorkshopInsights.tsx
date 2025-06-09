
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, AlertCircle } from 'lucide-react';
import { useWorkshopData } from '@/hooks/useWorkshopData';
import { analyzeWorkshopWoca } from '@/utils/wocaAnalysis';
import { PresenterMode } from '@/components/PresenterMode';
import { ParticipantSearch } from '@/components/ParticipantSearch';
import { WocaZoneSection } from '@/components/WocaZoneSection';
import { WocaChartsRow } from '@/components/WocaChartsRow';
import { WocaHeatmapSection } from '@/components/WocaHeatmapSection';
import { OpportunityZoneSection } from '@/components/OpportunityZoneSection';
import { WocaDemographicsSection } from '@/components/WocaDemographicsSection';

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
      firstParticipant: workshopData.participants[0]
    } : null
  });

  // Get WOCA analysis results
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

  // Check if we have enough data for analysis
  const hasMinimumData = workshopData && workshopData.participants.length >= 3;

  // Calculate zone distribution for pie chart
  const getZoneDistribution = () => {
    if (!wocaAnalysis) return { opportunity: 0, comfort: 0, apathy: 0, war: 0 };
    
    const distribution = { opportunity: 0, comfort: 0, apathy: 0, war: 0 };
    wocaAnalysis.participants.forEach(participant => {
      if (participant.dominantZone && !participant.isTie) {
        distribution[participant.dominantZone as keyof typeof distribution]++;
      }
    });
    
    return distribution;
  };

  const renderContent = () => (
    <div className={`space-y-6 ${isPresenterMode ? 'presenter-mode' : ''}`} dir="rtl">
      {/* Page Header */}
      {!isPresenterMode && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                ניתוח קבוצתי - מודל WOCA
              </h2>
              <p className="text-gray-600">
                ניתוח דינמיקה קבוצתי ואפקטיביות הסדנה באמצעות 36 שאלות מודל WOCA
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      )}

      {/* Individual Search Bar */}
      {!isPresenterMode && <ParticipantSearch />}

      {/* Group Selection */}
      {!isPresenterMode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-right">
              <Users className="h-5 w-5 ml-2" />
              בחירת קבוצה
            </CardTitle>
            <CardDescription className="text-right">
              בחר קבוצה מטבלת woca_responses לניתוח דינמיקה קבוצתית
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Select value={selectedGroupId?.toString()} onValueChange={handleGroupSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר קבוצה" />
                  </SelectTrigger>
                  <SelectContent>
                    {workshops.map(workshop => (
                      <SelectItem key={workshop.id} value={workshop.id.toString()}>
                        <div className="flex flex-col text-right">
                          <span className="font-medium">{workshop.name}</span>
                          <span className="text-sm text-gray-500">
                            {workshop.participant_count} משתתפים • {new Date(workshop.date).toLocaleDateString('he-IL')}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm text-right">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">טוען נתוני קבוצה...</div>
          </CardContent>
        </Card>
      )}

      {/* Insufficient Data Warning */}
      {workshopData && !hasMinimumData && (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">אין מספיק תגובות עדיין לחישוב תובנות ברמת הקבוצה</h3>
            <p className="text-gray-600">נדרשות לפחות 3 תגובות לניתוח קבוצתי אמין</p>
            <p className="text-sm text-gray-500 mt-2">
              כרגע יש {workshopData.participants.length} תגובות
            </p>
          </CardContent>
        </Card>
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

          {/* 2. Charts Row - Radar + Pie Side-by-Side */}
          <WocaChartsRow
            workshopData={workshopData}
            zoneDistribution={getZoneDistribution()}
            isPresenterMode={isPresenterMode}
          />

          {/* 3. Heatmap Chart - Full Width */}
          <WocaHeatmapSection
            workshopData={workshopData}
            isPresenterMode={isPresenterMode}
          />

          {/* 4. Opportunity Zone Paragraph */}
          <OpportunityZoneSection isPresenterMode={isPresenterMode} />

          {/* 5. Demographics Section */}
          <WocaDemographicsSection
            wocaAnalysis={wocaAnalysis}
            showNames={showNames}
            isPresenterMode={isPresenterMode}
          />
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
