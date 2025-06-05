
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Radar, TrendingUp } from 'lucide-react';
import { WorkshopDistributionChart } from '@/components/WorkshopDistributionChart';
import { WocaRadarChart } from '@/components/WocaRadarChart';
import { WocaZoneComparisonChart } from '@/components/WocaZoneComparisonChart';

interface VisualizationsGridProps {
  workshopData: any;
}

export const VisualizationsGrid: React.FC<VisualizationsGridProps> = ({ workshopData }) => {
  // Calculate group average scores for the comparison chart
  const groupScores = {
    war: workshopData.participants.reduce((sum: number, p: any) => sum + (p.woca_scores?.war || 0), 0) / workshopData.participants.length,
    opportunity: workshopData.participants.reduce((sum: number, p: any) => sum + (p.woca_scores?.opportunity || 0), 0) / workshopData.participants.length,
    comfort: workshopData.participants.reduce((sum: number, p: any) => sum + (p.woca_scores?.comfort || 0), 0) / workshopData.participants.length,
    apathy: workshopData.participants.reduce((sum: number, p: any) => sum + (p.woca_scores?.apathy || 0), 0) / workshopData.participants.length
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Zone Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            השוואת ציוני אזורי תודעה
          </CardTitle>
        </CardHeader>
        <CardContent>
          <WocaZoneComparisonChart scores={groupScores} />
        </CardContent>
      </Card>

      {/* Group Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            התפלגות אזורים תודעתיים
          </CardTitle>
        </CardHeader>
        <CardContent>
          <WorkshopDistributionChart participants={workshopData.participants} />
        </CardContent>
      </Card>

      {/* Radar Chart spans full width */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Radar className="h-5 w-5 mr-2" />
            פרמטרי WOCA - ממוצע קבוצתי (תצוגת רדאר)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <WocaRadarChart participants={workshopData.participants} />
        </CardContent>
      </Card>
    </div>
  );
};
