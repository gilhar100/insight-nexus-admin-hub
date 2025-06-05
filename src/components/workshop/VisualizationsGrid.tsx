
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Radar } from 'lucide-react';
import { WorkshopDistributionChart } from '@/components/WorkshopDistributionChart';
import { WocaRadarChart } from '@/components/WocaRadarChart';

interface VisualizationsGridProps {
  workshopData: any;
}

export const VisualizationsGrid: React.FC<VisualizationsGridProps> = ({ workshopData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

      {/* Radar Chart Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Radar className="h-5 w-5 mr-2" />
            פרמטרי WOCA - ממוצע
          </CardTitle>
        </CardHeader>
        <CardContent>
          <WocaRadarChart participants={workshopData.participants} />
        </CardContent>
      </Card>
    </div>
  );
};
