
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import { HeatmapChart } from '@/components/HeatmapChart';

interface WocaHeatmapSectionProps {
  workshopData: any;
  isPresenterMode: boolean;
}

export const WocaHeatmapSection: React.FC<WocaHeatmapSectionProps> = ({
  workshopData,
  isPresenterMode
}) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className={`flex items-center text-right ${isPresenterMode ? 'text-2xl' : ''}`}>
          <BarChart3 className="h-5 w-5 ml-2" />
          מפת חום לפי שאלות
        </CardTitle>
        {!isPresenterMode && (
          <CardDescription className="text-right">
            ממוצע לכל שאלה לפי קטגוריית WOCA
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <HeatmapChart participants={workshopData.participants} />
      </CardContent>
    </Card>
  );
};
