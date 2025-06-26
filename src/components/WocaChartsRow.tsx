
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Radar, PieChart, BarChart3 } from 'lucide-react';
import { WocaRadarChart } from '@/components/WocaRadarChart';
import { ZoneDistributionChart } from '@/components/ZoneDistributionChart';
import { WocaGroupBarChart } from '@/components/WocaGroupBarChart';

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
  console.log('WocaChartsRow workshopData:', workshopData);
  console.log('WocaChartsRow groupCategoryScores:', workshopData?.groupCategoryScores);

  return (
    <div className="space-y-6" dir="rtl">
      {/* First Row - Radar + Pie Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className={`flex items-center text-right ${isPresenterMode ? 'text-xl' : 'text-lg'}`} style={{ color: '#000000' }}>
              <Radar className="h-5 w-5 ml-2" />
              פרופיל WOCA ארגוני
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WocaRadarChart participants={workshopData.participants} />
          </CardContent>
        </Card>

        {/* Pie Chart - Zone Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className={`flex items-center text-right ${isPresenterMode ? 'text-xl' : 'text-lg'}`} style={{ color: '#000000' }}>
              <PieChart className="h-5 w-5 ml-2" />
              התפלגות משתתפים לפי אזורים
            </CardTitle>
            {!isPresenterMode && (
              <CardDescription className="text-right text-base" style={{ color: '#000000' }}>
                חלוקת המשתתפים בין אזורי WOCA השונים
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <ZoneDistributionChart zoneDistribution={zoneDistribution} />
          </CardContent>
        </Card>
      </div>

      {/* Second Row - Horizontal Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center text-right ${isPresenterMode ? 'text-xl' : 'text-lg'}`} style={{ color: '#000000' }}>
            <BarChart3 className="h-5 w-5 ml-2" />
            עוצמת אזורי WOCA בקבוצה
          </CardTitle>
          {!isPresenterMode && (
            <CardDescription className="text-right text-base" style={{ color: '#000000' }}>
              השוואה ויזואלית של עוצמת האזורים השונים
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {workshopData?.groupCategoryScores ? (
            <WocaGroupBarChart groupCategoryScores={workshopData.groupCategoryScores} />
          ) : (
            <div className="text-center p-8">
              <p className="text-gray-500">טוען נתוני קבוצה...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
