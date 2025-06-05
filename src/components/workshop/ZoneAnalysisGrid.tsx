
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ZoneAnalysisGridProps {
  zoneDistribution: Record<string, number>;
  workshopData: any;
}

export const ZoneAnalysisGrid: React.FC<ZoneAnalysisGridProps> = ({ zoneDistribution, workshopData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Object.entries(zoneDistribution).map(([zone, count]) => {
        const participant = workshopData.participants.find((p: any) => p.woca_zone === zone);
        const color = participant?.woca_zone_color || '#666666';
        
        return (
          <Card key={zone} className="border-2" style={{ borderColor: color }}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold mb-1" style={{ color }}>
                {count}
              </div>
              <div className="text-sm font-medium" style={{ color }}>
                {zone}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {Math.round((count / workshopData.participant_count) * 100)}%
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
