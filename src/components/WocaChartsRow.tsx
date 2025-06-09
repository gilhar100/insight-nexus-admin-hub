
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Radar, PieChart } from 'lucide-react';
import { WocaRadarChart } from '@/components/WocaRadarChart';
import { ZoneDistributionChart } from '@/components/ZoneDistributionChart';

interface WocaChartsRowProps {
  workshopData: any;
  zoneDistribution: {
    opportunity: number;
    comfort: number;
    apathy: number;
    war: number;
  };
  isPresenterMode: boolean;
}

export const WocaChartsRow: React.FC<WocaChartsRowProps> = ({
  workshopData,
  zoneDistribution,
  isPresenterMode
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Radar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center text-right ${isPresenterMode ? 'text-2xl' : ''}`}>
            <Radar className="h-5 w-5 ml-2" />
            מחוונים WOCA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <WocaRadarChart participants={workshopData.participants} />
        </CardContent>
      </Card>

      {/* Pie Chart - Zone Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center text-right ${isPresenterMode ? 'text-2xl' : ''}`}>
            <PieChart className="h-5 w-5 ml-2" />
            התפלגות משתתפים לפי אזורים
          </CardTitle>
          {!isPresenterMode && (
            <CardDescription className="text-right">
              חלוקת המשתתפים בין אזורי WOCA השונים
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <ZoneDistributionChart zoneDistribution={zoneDistribution} />
        </CardContent>
      </Card>
    </div>
  );
};
