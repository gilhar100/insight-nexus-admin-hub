
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, BarChart3 } from 'lucide-react';
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
    <div className="space-y-6 bg-white" dir="rtl">
      {/* First Row - Large Pie Chart */}
      <Card className="bg-white border-gray-200">
        <CardHeader className="bg-white">
          <CardTitle className={`flex items-center justify-center text-center ${isPresenterMode ? 'text-xl' : 'text-lg'} text-gray-900`}>
            <PieChart className="h-5 w-5 ml-2" />
            התפלגות משתתפים לפי אזורים
          </CardTitle>
          {!isPresenterMode && (
            <CardDescription className="text-center text-base text-gray-700">
              חלוקת המשתתפים בין אזורי WOCA השונים
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="bg-white">
          <ZoneDistributionChart zoneDistribution={zoneDistribution} />
        </CardContent>
      </Card>

      {/* Second Row - Horizontal Bar Chart */}
      <Card className="bg-white border-gray-200">
        <CardHeader className="bg-white">
          <CardTitle className={`flex items-center text-right ${isPresenterMode ? 'text-xl' : 'text-lg'} text-gray-900`}>
            <BarChart3 className="h-5 w-5 ml-2" />
            עוצמת אזורי WOCA בקבוצה
          </CardTitle>
          {!isPresenterMode && (
            <CardDescription className="text-right text-base text-gray-700">
              השוואה ויזואלית של עוצמת האזורים השונים
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="bg-white">
          {workshopData?.groupCategoryScores ? (
            <WocaGroupBarChart groupCategoryScores={workshopData.groupCategoryScores} />
          ) : (
            <div className="text-center p-8 bg-white">
              <p className="text-gray-600">טוען נתוני קבוצה...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
