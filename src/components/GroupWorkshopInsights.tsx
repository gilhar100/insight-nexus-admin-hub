
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, BarChart3, Radar, Download, TrendingUp, Eye, EyeOff, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useWorkshopData } from '@/hooks/useWorkshopData';
import { WorkshopDistributionChart } from '@/components/WorkshopDistributionChart';
import { WocaCategoryRadarChart } from '@/components/WocaCategoryRadarChart';
import { WocaCategoryDistributionChart } from '@/components/WocaCategoryDistributionChart';
import { analyzeWorkshopWoca, ZONE_DIAGNOSIS } from '@/utils/wocaAnalysis';

export const GroupWorkshopInsights: React.FC = () => {
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<number | undefined>();
  const [showNames, setShowNames] = useState(false);
  const { workshopData, workshops, isLoading, error } = useWorkshopData(selectedWorkshopId);

  // Perform WOCA analysis
  const wocaAnalysis = workshopData ? analyzeWorkshopWoca(workshopData.participants) : null;

  // WOCA Zone classification
  const getZoneInfo = (score: number) => {
    if (score >= 4.2) return { name: 'Opportunity Zone', color: 'bg-green-500', description: 'Innovation, Motivation, Inspiration' };
    if (score >= 3.4) return { name: 'Comfort Zone', color: 'bg-blue-500', description: 'Stability, Operationality, Conservatism' };
    if (score >= 2.6) return { name: 'Apathy Zone', color: 'bg-yellow-500', description: 'Disengagement, Disconnection, Low Clarity' };
    return { name: 'War Zone', color: 'bg-red-500', description: 'Conflict, Survival, Fear' };
  };

  const handleWorkshopSelect = (value: string) => {
    setSelectedWorkshopId(Number(value));
  };

  const exportWorkshopData = () => {
    if (!workshopData || !wocaAnalysis) return;

    const exportData = {
      workshop_id: workshopData.workshop_id,
      participant_count: workshopData.participant_count,
      average_score: workshopData.average_score,
      woca_analysis: {
        category_scores: wocaAnalysis.categoryScores,
        leading_category: wocaAnalysis.leadingCategory,
        diagnosis: wocaAnalysis.diagnosis,
        recommendations: wocaAnalysis.recommendations,
        strengths: wocaAnalysis.strengths,
        weaknesses: wocaAnalysis.weaknesses
      },
      analysis_date: new Date().toISOString(),
      participants: workshopData.participants.map(p => ({
        ...p,
        full_name: showNames ? p.full_name : `Participant ${workshopData.participants.indexOf(p) + 1}`
      }))
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `woca-workshop-${workshopData.workshop_id}-analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Zone distribution calculation
  const getZoneDistribution = () => {
    if (!workshopData) return { opportunity: 0, comfort: 0, apathy: 0, war: 0 };
    
    return workshopData.participants.reduce((acc, participant) => {
      if (participant.overall_score === null) return acc;
      
      const score = participant.overall_score;
      if (score >= 4.2) acc.opportunity++;
      else if (score >= 3.4) acc.comfort++;
      else if (score >= 2.6) acc.apathy++;
      else acc.war++;
      
      return acc;
    }, { opportunity: 0, comfort: 0, apathy: 0, war: 0 });
  };

  const zoneDistribution = getZoneDistribution();
  const groupScore = workshopData?.average_score || 0;
  const zoneInfo = getZoneInfo(groupScore);

  const leadingZoneInfo = wocaAnalysis ? ZONE_DIAGNOSIS[wocaAnalysis.leadingCategory] : null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              תובנות קבוצתיות - מודל WOCA
            </h2>
            <p className="text-gray-600">
              ניתוח דינמיקה קבוצתית ויעילות סדנה באמצעות סקר WOCA בן 36 שאלות
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Workshop Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            בחירת סדנה
          </CardTitle>
          <CardDescription>
            בחר סדנה מטבלת woca_responses לניתוח דינמיקה קבוצתית
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={selectedWorkshopId?.toString()} onValueChange={handleWorkshopSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר סדנה" />
                </SelectTrigger>
                <SelectContent>
                  {workshops.map((workshop) => (
                    <SelectItem key={workshop.id} value={workshop.id.toString()}>
                      <div className="flex flex-col">
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
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section - Only show when workshop is selected */}
      {isLoading && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">טוען נתוני סדנה...</div>
          </CardContent>
        </Card>
      )}

      {workshopData && wocaAnalysis && !isLoading && (
        <>
          {/* Hebrew Diagnosis Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <FileText className="h-5 w-5 ml-2" />
                  אבחון WOCA - {leadingZoneInfo?.title}
                </span>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowNames(!showNames)}
                  >
                    {showNames ? <EyeOff className="h-4 w-4 ml-2" /> : <Eye className="h-4 w-4 ml-2" />}
                    {showNames ? 'הסתר שמות' : 'הצג שמות'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportWorkshopData}>
                    <Download className="h-4 w-4 ml-2" />
                    יצא ניתוח
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="mb-4">
                    <Badge 
                      variant="secondary" 
                      className="text-lg px-4 py-2 bg-blue-600 text-white"
                    >
                      {leadingZoneInfo?.title}
                    </Badge>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto" dir="rtl">
                    {leadingZoneInfo?.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-green-700">נקודות חוזק</h4>
                    <ul className="space-y-2" dir="rtl">
                      {wocaAnalysis.strengths.map((strength, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <span className="w-2 h-2 bg-green-500 rounded-full ml-2"></span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-red-700">תחומי שיפור</h4>
                    <ul className="space-y-2" dir="rtl">
                      {wocaAnalysis.weaknesses.map((weakness, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <span className="w-2 h-2 bg-red-500 rounded-full ml-2"></span>
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg text-blue-700">המלצות לפעולה</h4>
                  <ul className="space-y-2" dir="rtl">
                    {wocaAnalysis.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-blue-500 rounded-full ml-2"></span>
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* WOCA Category Radar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Radar className="h-5 w-5 ml-2" />
                  מכ"ם קטגוריות WOCA
                </CardTitle>
                <CardDescription>השוואת ציונים בין ארבעת אזורי WOCA</CardDescription>
              </CardHeader>
              <CardContent>
                <WocaCategoryRadarChart categoryScores={wocaAnalysis.categoryScores} />
              </CardContent>
            </Card>

            {/* WOCA Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 ml-2" />
                  התפלגות קטגוריות WOCA
                </CardTitle>
                <CardDescription>ציונים ממוצעים לכל קטגוריה</CardDescription>
              </CardHeader>
              <CardContent>
                <WocaCategoryDistributionChart 
                  categoryScores={wocaAnalysis.categoryScores} 
                  participantCount={wocaAnalysis.participantCount}
                />
              </CardContent>
            </Card>

            {/* Overall Score Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 ml-2" />
                  התפלגות ציונים כללית
                </CardTitle>
              </CardHeader>
              <CardContent>
                <WorkshopDistributionChart participants={workshopData.participants} />
              </CardContent>
            </Card>

            {/* Category Scores Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 ml-2" />
                  סיכום ציונים לפי קטגוריה
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(wocaAnalysis.categoryScores).map(([category, score]) => {
                    const hebrewNames = {
                      War: 'מלחמה',
                      Apathy: 'אדישות', 
                      Comfort: 'נוחות',
                      Opportunity: 'הזדמנות'
                    };
                    const colors = {
                      War: 'bg-red-500',
                      Apathy: 'bg-yellow-500',
                      Comfort: 'bg-blue-500', 
                      Opportunity: 'bg-green-500'
                    };
                    
                    return (
                      <div key={category} className="flex items-center justify-between p-3 border rounded">
                        <span className="font-medium">{hebrewNames[category as keyof typeof hebrewNames]}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-full bg-gray-200 rounded-full h-2 min-w-[100px]">
                            <div
                              className={`h-2 rounded-full ${colors[category as keyof typeof colors]}`}
                              style={{ width: `${(score / 5) * 100}%` }}
                            />
                          </div>
                          <span className="font-bold text-lg min-w-[40px]">{score.toFixed(1)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Participant Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Participant Overview
              </CardTitle>
              <CardDescription>
                Individual scores and demographics {showNames ? '(Names visible)' : '(Anonymous)'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workshopData.participants.map((participant, index) => (
                  <div 
                    key={participant.id} 
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm">
                        {showNames ? participant.full_name : `Participant ${index + 1}`}
                      </span>
                      <Badge 
                        variant={
                          participant.overall_score && participant.overall_score > 4.0 
                            ? "default" 
                            : participant.overall_score && participant.overall_score < 3.0 
                            ? "destructive" 
                            : "secondary"
                        }
                      >
                        {participant.overall_score?.toFixed(1) || 'N/A'}
                      </Badge>
                    </div>
                    {participant.overall_score && (
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                          className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                          style={{ width: `${(participant.overall_score / 5) * 100}%` }}
                        />
                      </div>
                    )}
                    <div className="text-xs text-gray-500 space-y-1">
                      {participant.organization && <div>Org: {participant.organization}</div>}
                      {participant.profession && <div>Role: {participant.profession}</div>}
                      {participant.experience_years && <div>Experience: {participant.experience_years} years</div>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Zone Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-700 mb-1">{zoneDistribution.opportunity}</div>
                <div className="text-sm text-green-700">Opportunity Zone</div>
                <div className="text-xs text-gray-600">4.2-5.0</div>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-700 mb-1">{zoneDistribution.comfort}</div>
                <div className="text-sm text-blue-700">Comfort Zone</div>
                <div className="text-xs text-gray-600">3.4-4.1</div>
              </CardContent>
            </Card>
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-700 mb-1">{zoneDistribution.apathy}</div>
                <div className="text-sm text-yellow-700">Apathy Zone</div>
                <div className="text-xs text-gray-600">2.6-3.3</div>
              </CardContent>
            </Card>
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-700 mb-1">{zoneDistribution.war}</div>
                <div className="text-sm text-red-700">War Zone</div>
                <div className="text-xs text-gray-600">1.0-2.5</div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};
