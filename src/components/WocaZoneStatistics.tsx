import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Users } from 'lucide-react';
import { WocaScores, ZONE_HEBREW_NAMES } from '@/utils/wocaScoring';
interface WocaZoneStatisticsProps {
  participants: Array<{
    woca_scores: WocaScores;
    woca_zone: string;
  }>;
  title?: string;
}
interface ZoneStats {
  average: number;
  median: number;
  standardDeviation: number;
  highest: number;
  lowest: number;
  dominantCount: number;
  dominantPercentage: number;
  tiedCount: number;
  tiedPercentage: number;
}
export const WocaZoneStatistics: React.FC<WocaZoneStatisticsProps> = ({
  participants,
  title = "ניתוח סטטיסטי פרמטרי WOCA"
}) => {
  console.log('📊 Calculating zone statistics for', participants.length, 'participants');
  const calculateZoneStats = (zoneKey: keyof WocaScores): ZoneStats => {
    const scores = participants.map(p => p.woca_scores[zoneKey]).filter(score => score > 0);
    if (scores.length === 0) {
      return {
        average: 0,
        median: 0,
        standardDeviation: 0,
        highest: 0,
        lowest: 0,
        dominantCount: 0,
        dominantPercentage: 0,
        tiedCount: 0,
        tiedPercentage: 0
      };
    }

    // Calculate basic statistics
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const sortedScores = [...scores].sort((a, b) => a - b);
    const median = sortedScores.length % 2 === 0 ? (sortedScores[sortedScores.length / 2 - 1] + sortedScores[sortedScores.length / 2]) / 2 : sortedScores[Math.floor(sortedScores.length / 2)];
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - average, 2), 0) / scores.length;
    const standardDeviation = Math.sqrt(variance);
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);

    // Count dominant zones
    const zoneName = ZONE_HEBREW_NAMES[zoneKey];
    const dominantCount = participants.filter(p => p.woca_zone === zoneName).length;
    const tiedCount = participants.filter(p => p.woca_zone.includes(zoneName) && p.woca_zone.includes('/')).length;
    return {
      average: Math.round(average * 100) / 100,
      median: Math.round(median * 100) / 100,
      standardDeviation: Math.round(standardDeviation * 100) / 100,
      highest: Math.round(highest * 100) / 100,
      lowest: Math.round(lowest * 100) / 100,
      dominantCount,
      dominantPercentage: Math.round(dominantCount / participants.length * 100),
      tiedCount,
      tiedPercentage: Math.round(tiedCount / participants.length * 100)
    };
  };
  const zoneStats = {
    war: calculateZoneStats('war'),
    opportunity: calculateZoneStats('opportunity'),
    comfort: calculateZoneStats('comfort'),
    apathy: calculateZoneStats('apathy')
  };
  const zoneColors = {
    war: '#EF4444',
    opportunity: '#10B981',
    comfort: '#3B82F6',
    apathy: '#F59E0B'
  };
  return <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(zoneStats).map(([zoneKey, stats]) => {
          const zoneName = ZONE_HEBREW_NAMES[zoneKey as keyof typeof ZONE_HEBREW_NAMES];
          const color = zoneColors[zoneKey as keyof typeof zoneColors];
          return <div key={zoneKey} className="p-4 border rounded-lg" style={{
            borderColor: color,
            backgroundColor: `${color}08`
          }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold" style={{
                color
              }}>
                    {zoneName}
                  </h3>
                  <Badge variant="secondary" style={{
                backgroundColor: color,
                color: 'white'
              }}>
                    {stats.average}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ממוצע:</span>
                    <span className="font-medium">{stats.average}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">חציון:</span>
                    <span className="font-medium">{stats.median}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">סטיית תקן:</span>
                    <span className="font-medium">{stats.standardDeviation}</span>
                  </div>
                  
                  
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-600">דומיננטי:</span>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-gray-500" />
                        <span className="font-medium">{stats.dominantCount}</span>
                        <span className="text-xs text-gray-500">({stats.dominantPercentage}%)</span>
                      </div>
                    </div>
                    {stats.tiedCount > 0 && <div className="flex items-center justify-between">
                        <span className="text-gray-600">קשור:</span>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-gray-500" />
                          <span className="font-medium">{stats.tiedCount}</span>
                          <span className="text-xs text-gray-500">({stats.tiedPercentage}%)</span>
                        </div>
                      </div>}
                  </div>
                </div>
              </div>;
        })}
        </div>
      </CardContent>
    </Card>;
};