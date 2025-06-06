
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, PieChart, TrendingUp, Users } from 'lucide-react';
import { WocaZoneComparisonChart } from '@/components/WocaZoneComparisonChart';
import { WocaDistributionChart } from '@/components/WocaDistributionChart';
import { WocaZoneStatistics } from '@/components/WocaZoneStatistics';
import { WocaRadarChart } from '@/components/WocaRadarChart';
import { WocaGroupStatistics } from '@/components/WocaGroupStatistics';

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
  console.log('📊 ⚠️ CRITICAL WocaAnalyticsDashboard render:', { 
    viewMode, 
    workshopData: workshopData ? {
      workshop_id: workshopData.workshop_id,
      participant_count: workshopData.participant_count,
      hasParticipants: !!workshopData.participants,
      participantsLength: workshopData.participants?.length || 0,
      MEETS_THRESHOLD: workshopData.participant_count >= 3
    } : null,
    selectedParticipant: selectedParticipant?.id 
  });

  if (viewMode === 'individual' && selectedParticipant?.woca_scores) {
    console.log('📊 Rendering individual view for participant:', selectedParticipant.id);
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
    console.log('📊 ⚠️ CRITICAL: Rendering workshop view, checking participant count...', {
      participant_count: workshopData.participant_count,
      meetsThreshold: workshopData.participant_count >= 3,
      WILL_SHOW_ANALYTICS: workshopData.participant_count >= 3
    });

    // ⚠️ FIXED: Always show analytics if we have 3+ participants
    // The threshold check should be simple and direct
    if (workshopData.participant_count < 3) {
      console.log('📊 ⚠️ Still insufficient participants, showing placeholder');
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              סטטיסטיקות קבוצתיות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-8">
              <div className="text-gray-500 mb-4">
                <Users className="h-12 w-12 mx-auto mb-2" />
              </div>
              <div className="text-lg text-gray-600 mb-2">
                אין מספיק תגובות עדיין לחישוב תובנות ברמת הקבוצה
              </div>
              <div className="text-sm text-gray-500">
                נדרשות לפחות 3 תגובות לניתוח קבוצתי אמין
              </div>
              <div className="mt-4">
                <Badge variant="secondary">
                  {workshopData.participant_count} תגובות קיימות
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    console.log('📊 ⚠️ CRITICAL: Sufficient participants detected! Rendering FULL analytics for', workshopData.participant_count, 'participants');
    return (
      <div className="space-y-6">
        {/* Group Statistics - This should now render */}
        <WocaGroupStatistics workshopData={workshopData} />

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
      </div>
    );
  }

  console.log('📊 No data to render, returning null');
  return null;
};
