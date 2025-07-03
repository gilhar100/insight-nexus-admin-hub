
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ZoneData {
  zone: string;
  count: number;
  percentage: number;
  color: string;
}

interface WocaZoneSectionProps {
  zoneData: ZoneData[];
  isPresenterMode?: boolean;
}

export const WocaZoneSection: React.FC<WocaZoneSectionProps> = ({ 
  zoneData, 
  isPresenterMode = false 
}) => {
  const getZoneDescription = (zone: string): string => {
    switch (zone) {
      case 'War':
        return 'אזור מלחמה - רמת לחץ גבוהה';
      case 'Opportunity':
        return 'אזור הזדמנויות - צמיחה אפשרית';
      case 'Comfort':
        return 'אזור נוחות - יציבות';
      case 'Apathy':
        return 'אזור אדישות - חוסר מעורבות';
      default:
        return zone;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className={`text-center ${isPresenterMode ? 'text-3xl' : 'text-xl'}`}>
          התפלגות לפי אזורי WOCA
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {zoneData.map((zone, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center space-x-4">
                <div 
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: zone.color }}
                />
                <div>
                  <div className={`font-semibold ${isPresenterMode ? 'text-xl' : ''}`}>
                    {getZoneDescription(zone.zone)}
                  </div>
                  <div className={`text-gray-600 ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                    {zone.count} משתתפים
                  </div>
                </div>
              </div>
              <div className={`font-bold ${isPresenterMode ? 'text-2xl' : 'text-lg'}`}>
                {Number(zone.percentage).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
