
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, PieChart, TrendingUp, Users } from 'lucide-react';
import { WocaZoneComparisonChart } from '@/components/WocaZoneComparisonChart';
import { WocaDistributionChart } from '@/components/WocaDistributionChart';
import { WocaZoneStatistics } from '@/components/WocaZoneStatistics';
import { WocaRadarChart } from '@/components/WocaRadarChart';

interface WocaAnalyticsDashboardProps {
  viewMode: 'workshop' | 'individual';
  workshopData?: any;
  selectedParticipant?: any;
}

export const WocaAnalyticsDashboard: React.FC<WocaAnalyticsDashboardProps> = ({
  viewMode,
  workshopData,
  selectedParticipant
}) => {
  console.log('📊 Rendering WOCA Analytics Dashboard:', { viewMode, workshopData, selectedParticipant });

  if (viewMode === 'individual' && selectedParticipant?.woca_scores) {
    return (
      <div className="space-y-6">
        {/* Individual Zone Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              השוואת ציוני אזורי תודעה - ניתוח אישי
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WocaZoneComparisonChart 
              scores={selectedParticipant.woca_scores}
            />
          </CardContent>
        </Card>

        {/* Individual Zone Assignment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              סיווג אזור תודעתי אישי
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6">
              <Badge 
                variant="secondary" 
                className="text-lg px-4 py-2 text-white mb-4"
                style={{ backgroundColor: selectedParticipant.woca_zone_color }}
              >
                {selectedParticipant.woca_zone}
              </Badge>
              <div className="text-lg text-gray-600">
                מבוסס על הציון הממוצע הגבוה ביותר בפרמטרי WOCA
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (viewMode === 'workshop' && workshopData) {
    // Calculate group average scores
    const groupScores = {
      war: workshopData.participants.reduce((sum: number, p: any) => sum + (p.woca_scores?.war || 0), 0) / workshopData.participants.length,
      opportunity: workshopData.participants.reduce((sum: number, p: any) => sum + (p.woca_scores?.opportunity || 0), 0) / workshopData.participants.length,
      comfort: workshopData.participants.reduce((sum: number, p: any) => sum + (p.woca_scores?.comfort || 0), 0) / workshopData.participants.length,
      apathy: workshopData.participants.reduce((sum: number, p: any) => sum + (p.woca_scores?.apathy || 0), 0) / workshopData.participants.length
    };

    return (
      <div className="space-y-6">
        {/* Group Zone Comparison Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              השוואת ציוני אזורי תודעה - ממוצע קבוצתי
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WocaZoneComparisonChart 
              scores={groupScores}
              title={`ממוצע קבוצתי - ${workshopData.participant_count} משתתפים`}
            />
          </CardContent>
        </Card>

        {/* Distribution Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart Distribution */}
          <WocaDistributionChart 
            participants={workshopData.participants}
            title="התפלגות משתתפים - תצוגת עמודות"
          />
          
          {/* Pie Chart Distribution */}
          <WocaDistributionChart 
            participants={workshopData.participants}
            showPieChart={true}
            title="התפלגות משתתפים - תצוגת עוגה"
          />
        </div>

        {/* Statistical Analysis */}
        <WocaZoneStatistics 
          participants={workshopData.participants}
        />

        {/* Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              פרמטרי WOCA - תצוגת רדאר
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WocaRadarChart participants={workshopData.participants} />
          </CardContent>
        </Card>

        {/* Group Zone Assignment Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              סיכום אזור תודעתי קבוצתי
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6">
              <Badge 
                variant="secondary" 
                className="text-lg px-4 py-2 text-white mb-4"
                style={{ backgroundColor: workshopData.dominant_zone_color }}
              >
                {workshopData.dominant_zone}
              </Badge>
              <div className="text-lg text-gray-600 mb-2">
                {workshopData.group_zone_result?.description || 'האזור התודעתי הדומיננטי בקבוצה'}
              </div>
              <div className="text-sm text-gray-500">
                מבוסס על ממוצע ציוני הקבוצה ב-{workshopData.participant_count} משתתפים
              </div>
              
              {workshopData.group_zone_result?.explanation && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg text-right">
                  <p className="text-blue-800 text-sm">
                    {workshopData.group_zone_result.explanation}
                  </p>
                </div>
              )}
              
              {workshopData.group_zone_result?.recommendations && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg text-right">
                  <h4 className="font-semibold text-green-800 mb-2">המלצות:</h4>
                  <p className="text-green-700 text-sm">
                    {workshopData.group_zone_result.recommendations}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};
