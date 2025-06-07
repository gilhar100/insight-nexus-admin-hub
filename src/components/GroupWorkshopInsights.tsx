
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, BarChart3, TrendingUp } from 'lucide-react';
import { useWorkshopData } from '@/hooks/useWorkshopData';
import { WocaRadarChart } from '@/components/WocaRadarChart';
import { ZoneDistributionChart } from '@/components/ZoneDistributionChart';
import { GapAnalysisChart } from '@/components/GapAnalysisChart';
import { PresenterMode } from '@/components/PresenterMode';
import { ZoneDescription } from '@/components/ZoneDescription';
import { ParticipantSearch } from '@/components/ParticipantSearch';
import { analyzeWorkshopWoca } from '@/utils/wocaAnalysis';
import { WOCA_ZONE_COLORS } from '@/utils/wocaColors';

export const GroupWorkshopInsights: React.FC = () => {
  const [selectedWorkshop, setSelectedWorkshop] = useState<number | undefined>();
  const [isPresenterMode, setIsPresenterMode] = useState(false);
  const { workshopData, workshops, isLoading, error } = useWorkshopData(selectedWorkshop);

  // Analyze WOCA data if we have participants
  const wocaAnalysis = workshopData?.participants.length 
    ? analyzeWorkshopWoca(workshopData.participants, selectedWorkshop || 1)
    : null;

  const getDominantZone = () => {
    if (!wocaAnalysis) return 'opportunity';
    
    const scores = wocaAnalysis.groupCategoryScores;
    let maxZone = 'opportunity';
    let maxScore = scores.opportunity;

    if (scores.comfort > maxScore) {
      maxZone = 'comfort';
      maxScore = scores.comfort;
    }
    if (scores.apathy > maxScore) {
      maxZone = 'apathy';
      maxScore = scores.apathy;
    }
    if (scores.war > maxScore) {
      maxZone = 'war';
      maxScore = scores.war;
    }

    return maxZone;
  };

  const getZoneNameInHebrew = (zone: string) => {
    const zoneNames = {
      opportunity: 'הזדמנות',
      comfort: 'נוחות',
      apathy: 'אדישות',
      war: 'מלחמה'
    };
    return zoneNames[zone as keyof typeof zoneNames] || zone;
  };

  const dominantZone = getDominantZone();

  const content = (
    <div className="space-y-6" dir="rtl">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div className="text-right">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              ניתוח קבוצתי - מודל WOCA
            </h2>
            <p className="text-gray-600">
              ניתוח תוצאות הסדנה על פי 36 השאלות במודל WOCA
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Workshop Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">בחירת סדנה לניתוח</CardTitle>
          <CardDescription className="text-right">
            בחר סדנה מהרשימה לצפייה בתוצאות הקבוצתיות
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedWorkshop?.toString()} onValueChange={(value) => setSelectedWorkshop(Number(value))}>
            <SelectTrigger className="text-right" dir="rtl">
              <SelectValue placeholder="בחר סדנה..." />
            </SelectTrigger>
            <SelectContent>
              {workshops.map((workshop) => (
                <SelectItem key={workshop.id} value={workshop.id.toString()}>
                  {workshop.name} ({workshop.participant_count} משתתפים)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-800 text-right">שגיאה: {error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Individual Search - separate from group insights */}
      <ParticipantSearch />

      {/* Group Analysis Results */}
      {workshopData && wocaAnalysis && (
        <>
          {/* Group Summary - REMOVED PERCENTAGE */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                אזור דומינטי של הקבוצה: {getZoneNameInHebrew(dominantZone)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div 
                  className="inline-block px-8 py-4 rounded-lg text-white font-bold text-3xl"
                  style={{ backgroundColor: WOCA_ZONE_COLORS[dominantZone as keyof typeof WOCA_ZONE_COLORS] }}
                >
                  {(wocaAnalysis.groupCategoryScores[dominantZone] * 20).toFixed(1)}%
                </div>
                <p className="mt-2 text-gray-600">
                  {workshopData.participant_count} משתתפים בסדנה
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Zone Description */}
          <ZoneDescription zone={dominantZone} isPresenterMode={isPresenterMode} />

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Zone Distribution Chart - FIXED OVERLAPPING TEXT */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-center text-right">
                  <BarChart3 className="h-5 w-5 ml-2" />
                  התפלגות משתתפים לפי אזורים
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ZoneDistributionChart zoneDistribution={wocaAnalysis.zoneDistribution} />
              </CardContent>
            </Card>

            {/* Gap Analysis Chart - FIXED DELTA CALCULATIONS */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-center text-right">
                  <TrendingUp className="h-5 w-5 ml-2" />
                  ניתוח פערים מאזור ההזדמנות
                </CardTitle>
              </CardHeader>
              <CardContent>
                <GapAnalysisChart groupCategoryScores={wocaAnalysis.groupCategoryScores} />
              </CardContent>
            </Card>

            {/* Radar Chart - ENLARGED AND CENTERED */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-center text-right">
                  <BarChart3 className="h-5 w-5 ml-2" />
                  תרשים רדאר - ציונים ממוצעים לפי אזור
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="w-full max-w-4xl">
                  <WocaRadarChart participants={workshopData.participants} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* REMOVED "תובנות עיקריות" SECTION */}
        </>
      )}
    </div>
  );

  return (
    <PresenterMode 
      isPresenterMode={isPresenterMode} 
      onToggle={() => setIsPresenterMode(!isPresenterMode)}
    >
      {content}
    </PresenterMode>
  );
};
