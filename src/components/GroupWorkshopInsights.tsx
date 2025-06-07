import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, BarChart3, Radar, Download, TrendingUp, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useWorkshopData } from '@/hooks/useWorkshopData';
import { WorkshopDistributionChart } from '@/components/WorkshopDistributionChart';
import { WocaRadarChart } from '@/components/WocaRadarChart';
import { analyzeWorkshopWoca, getZoneDescription } from '@/utils/wocaAnalysis';
import { WOCA_ZONE_COLORS } from '@/utils/wocaColors';
import { PresenterMode } from '@/components/PresenterMode';
import { ZoneDescription } from '@/components/ZoneDescription';
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

  // WOCA Zone classification using new analysis
  const getZoneInfo = (zone: string | null) => {
    if (!zone) return {
      name: 'לא זוהה',
      color: 'bg-gray-500',
      description: 'לא ניתן לזהות אזור דומיננטי'
    };
    const zoneDesc = getZoneDescription(zone);
    const colorMap = {
      opportunity: 'bg-green-500',
      comfort: 'bg-blue-500',
      apathy: 'bg-yellow-500',
      war: 'bg-red-500'
    };
    return {
      name: zoneDesc.name,
      color: colorMap[zone as keyof typeof colorMap] || 'bg-gray-500',
      description: zoneDesc.description
    };
  };
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

  // Get WOCA analysis results
  const wocaAnalysis = workshopData ? analyzeWorkshopWoca(workshopData.participants, workshopData.workshop_id) : null;
  const zoneInfo = wocaAnalysis ? getZoneInfo(wocaAnalysis.groupDominantZone) : null;
  console.log('🔍 WOCA Analysis results:', wocaAnalysis);

  // Zone distribution calculation using new analysis
  const getZoneDistribution = () => {
    if (!wocaAnalysis) return {
      opportunity: 0,
      comfort: 0,
      apathy: 0,
      war: 0
    };
    return wocaAnalysis.participants.reduce((acc, participant) => {
      if (participant.dominantZone && !participant.isTie) {
        acc[participant.dominantZone as keyof typeof acc]++;
      }
      return acc;
    }, {
      opportunity: 0,
      comfort: 0,
      apathy: 0,
      war: 0
    });
  };
  const zoneDistribution = getZoneDistribution();

  // Check if we have enough data for analysis
  const hasMinimumData = workshopData && workshopData.participants.length >= 3;
  const renderContent = () => <div className={`space-y-6 ${isPresenterMode ? 'presenter-mode' : ''}`}>
      {/* Page Header */}
      {!isPresenterMode && <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
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
        </div>}

      {/* Group Selection */}
      {!isPresenterMode && <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              בחירת קבוצה
            </CardTitle>
            <CardDescription>
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
                    {workshops.map(workshop => <SelectItem key={workshop.id} value={workshop.id.toString()}>
                        <div className="flex flex-col">
                          <span className="font-medium">{workshop.name}</span>
                          <span className="text-sm text-gray-500">
                            {workshop.participant_count} משתתפים • {new Date(workshop.date).toLocaleDateString('he-IL')}
                          </span>
                        </div>
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {error && <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>}
          </CardContent>
        </Card>}

      {/* Loading State */}
      {isLoading && <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">טוען נתוני קבוצה...</div>
          </CardContent>
        </Card>}

      {/* Insufficient Data Warning */}
      {workshopData && !hasMinimumData && <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">אין מספיק תגובות עדיין לחישוב תובנות ברמת הקבוצה</h3>
            <p className="text-gray-600">נדרשות לפחות 3 תגובות לניתוח קבוצתי אמין</p>
            <p className="text-sm text-gray-500 mt-2">
              כרגע יש {workshopData.participants.length} תגובות
            </p>
          </CardContent>
        </Card>}

      {/* Results Section - Only show when group is selected and has minimum data */}
      {workshopData && wocaAnalysis && hasMinimumData && <>
          {/* WOCA Zone Classification */}
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center justify-between ${isPresenterMode ? 'text-3xl' : ''}`}>
                <span>סיווג אזור WOCA</span>
                {!isPresenterMode && <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowNames(!showNames)}>
                      {showNames ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                      {showNames ? 'הסתר שמות' : 'הצג שמות'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportWorkshopData}>
                      <Download className="h-4 w-4 mr-2" />
                      ייצא ניתוח
                    </Button>
                  </div>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-center ${isPresenterMode ? 'p-12' : 'p-8'}`}>
                {wocaAnalysis.groupIsTie ? <div className="mb-6">
                    <div className="flex items-center justify-center mb-4">
                      <AlertCircle className="h-6 w-6 text-yellow-500 mr-2" />
                      <span className={`font-semibold ${isPresenterMode ? 'text-2xl' : 'text-lg'}`}>תיקו בין אזורים</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {wocaAnalysis.groupTiedCategories.map(category => {
                  const categoryZoneInfo = getZoneInfo(category);
                  return <Badge key={category} variant="secondary" className={`px-3 py-1 ${categoryZoneInfo.color} text-white ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                            {categoryZoneInfo.name}
                          </Badge>;
                })}
                    </div>
                    <p className={`text-gray-600 mt-4 ${isPresenterMode ? 'text-xl' : ''}`}>
                      לא זוהה אזור תודעה דומיננטי עקב ציונים זהים
                    </p>
                  </div> : zoneInfo && <div className="mb-6">
                    <Badge variant="secondary" className={`px-4 py-2 ${zoneInfo.color} text-white ${isPresenterMode ? 'text-2xl' : 'text-lg'}`}>
                      {zoneInfo.name}
                    </Badge>
                    <div className={`mt-4 ${isPresenterMode ? 'text-2xl' : 'text-lg'} text-gray-600 mb-4`}>
                      אזור תודעה ארגונית ({wocaAnalysis.participantCount} משתתפים)
                    </div>
                    
                    {/* Category Scores Display */}
                    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 ${isPresenterMode ? 'gap-8' : ''}`}>
                      <div className="text-center">
                        <div className={`font-bold ${isPresenterMode ? 'text-4xl' : 'text-2xl'}`} style={{
                    color: WOCA_ZONE_COLORS.opportunity
                  }}>
                          {wocaAnalysis.groupCategoryScores.opportunity.toFixed(1)}
                        </div>
                        <div className={`text-gray-600 ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>הזדמנות</div>
                      </div>
                      <div className="text-center">
                        <div className={`font-bold ${isPresenterMode ? 'text-4xl' : 'text-2xl'}`} style={{
                    color: WOCA_ZONE_COLORS.comfort
                  }}>
                          {wocaAnalysis.groupCategoryScores.comfort.toFixed(1)}
                        </div>
                        <div className={`text-gray-600 ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>נוחות</div>
                      </div>
                      <div className="text-center">
                        <div className={`font-bold ${isPresenterMode ? 'text-4xl' : 'text-2xl'}`} style={{
                    color: WOCA_ZONE_COLORS.apathy
                  }}>
                          {wocaAnalysis.groupCategoryScores.apathy.toFixed(1)}
                        </div>
                        <div className={`text-gray-600 ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>אדישות</div>
                      </div>
                      <div className="text-center">
                        <div className={`font-bold ${isPresenterMode ? 'text-4xl' : 'text-2xl'}`} style={{
                    color: WOCA_ZONE_COLORS.war
                  }}>
                          {wocaAnalysis.groupCategoryScores.war.toFixed(1)}
                        </div>
                        <div className={`text-gray-600 ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>מלחמה</div>
                      </div>
                    </div>
                  </div>}
              </div>
            </CardContent>
          </Card>

          {/* Zone Description */}
          {!wocaAnalysis.groupIsTie && wocaAnalysis.groupDominantZone && <ZoneDescription zone={wocaAnalysis.groupDominantZone} isPresenterMode={isPresenterMode} />}

          {/* Visualizations */}
          {!isPresenterMode && <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Group Distribution Chart */}
              

              {/* Radar Chart Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle className="\u05DE\u05D1\u05D8 \u05E8\u05D3\u05D0\u05E8">
                    <Radar className="h-5 w-5 mr-2" />
                    מחוונים WOCA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <WocaRadarChart participants={workshopData.participants} />
                </CardContent>
              </Card>
            </div>}

          {/* Participant Summary */}
          {!isPresenterMode && <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  סקירת משתתפים
                </CardTitle>
                <CardDescription>
                  ציונים אישיים ודמוגרפיה {showNames ? '(שמות גלויים)' : '(אנונימי)'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wocaAnalysis.participants.map((participant, index) => <div key={participant.participantId} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm">
                          {showNames ? participant.participantName : `משתתף ${index + 1}`}
                        </span>
                        {participant.isTie ? <Badge variant="secondary">תיקו</Badge> : <Badge variant={participant.dominantZone === 'opportunity' ? "default" : participant.dominantZone === 'war' ? "destructive" : "secondary"}>
                            {participant.dominantZone ? getZoneInfo(participant.dominantZone).name : 'N/A'}
                          </Badge>}
                      </div>
                      
                      {/* Mini category scores */}
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>הזדמנות:</span>
                          <span className="font-medium">{participant.categoryScores.opportunity.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>נוחות:</span>
                          <span className="font-medium">{participant.categoryScores.comfort.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>אדישות:</span>
                          <span className="font-medium">{participant.categoryScores.apathy.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>מלחמה:</span>
                          <span className="font-medium">{participant.categoryScores.war.toFixed(1)}</span>
                        </div>
                      </div>
                      
                      {participant.isTie && <div className="mt-2 text-xs text-amber-600">
                          תיקו: {participant.tiedCategories.map(cat => getZoneInfo(cat).name).join(', ')}
                        </div>}
                    </div>)}
                </div>
              </CardContent>
            </Card>}

          {/* Zone Analysis */}
          {!isPresenterMode && <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-700 mb-1">{zoneDistribution.opportunity}</div>
                  <div className="text-sm text-green-700">אזור הזדמנות</div>
                  <div className="text-xs text-gray-600">חדשנות ומחוברות</div>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-700 mb-1">{zoneDistribution.comfort}</div>
                  <div className="text-sm text-blue-700">אזור נוחות</div>
                  <div className="text-xs text-gray-600">יציבות ושמרנות</div>
                </CardContent>
              </Card>
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-700 mb-1">{zoneDistribution.apathy}</div>
                  <div className="text-sm text-yellow-700">אזור אדישות</div>
                  <div className="text-xs text-gray-600">ניתוק וחוסר מעורבות</div>
                </CardContent>
              </Card>
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-700 mb-1">{zoneDistribution.war}</div>
                  <div className="text-sm text-red-700">אזור מלחמה</div>
                  <div className="text-xs text-gray-600">קונפליקט והישרדות</div>
                </CardContent>
              </Card>
            </div>}
        </>}
    </div>;
  return <PresenterMode isPresenterMode={isPresenterMode} onToggle={() => setIsPresenterMode(!isPresenterMode)}>
      {renderContent()}
    </PresenterMode>;
};