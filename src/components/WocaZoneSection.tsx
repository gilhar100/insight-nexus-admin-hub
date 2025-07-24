import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Eye, EyeOff, FileText } from 'lucide-react';
import { WorkshopWocaAnalysis } from '@/utils/wocaAnalysis';
interface WocaZoneSectionProps {
  wocaAnalysis: WorkshopWocaAnalysis;
  isPresenterMode?: boolean;
  showNames: boolean;
  onToggleNames: () => void;
  onExportData: () => void;
  onExportToPDF?: () => void;
}
export const WocaZoneSection: React.FC<WocaZoneSectionProps> = ({
  wocaAnalysis,
  isPresenterMode = false,
  showNames,
  onToggleNames,
  onExportData,
  onExportToPDF
}) => {
  const getZoneDescription = (zone: string): string => {
    switch (zone) {
      case 'war':
        return 'אזור מלחמה - רמת לחץ גבוהה';
      case 'opportunity':
        return 'אזור הזדמנויות - צמיחה אפשרית';
      case 'comfort':
        return 'אזור נוחות - יציבות';
      case 'apathy':
        return 'אזור אדישות - חוסר מעורבות';
      default:
        return zone;
    }
  };
  const getZoneColor = (zone: string): string => {
    switch (zone) {
      case 'war':
        return '#ef4444';
      case 'opportunity':
        return '#22c55e';
      case 'comfort':
        return '#3b82f6';
      case 'apathy':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };
  const getZoneName = (zone: string): string => {
    switch (zone) {
      case 'war':
        return 'אזור המלחמה';
      case 'opportunity':
        return 'אזור ההזדמנות';
      case 'comfort':
        return 'אזור הנוחות';
      case 'apathy':
        return 'אזור האדישות';
      default:
        return 'לא זוהה';
    }
  };

  // Determine the dominant zone (using frequency-based approach)
  const dominantZone = wocaAnalysis.groupDominantZoneByCount;
  const isTie = wocaAnalysis.groupIsTieByCount;

  // Transform wocaAnalysis data into zoneData format
  const totalParticipants = wocaAnalysis.participantCount;
  const zoneData = [{
    zone: 'opportunity',
    count: wocaAnalysis.groupZoneCounts.opportunity,
    percentage: totalParticipants > 0 ? wocaAnalysis.groupZoneCounts.opportunity / totalParticipants * 100 : 0,
    color: getZoneColor('opportunity')
  }, {
    zone: 'comfort',
    count: wocaAnalysis.groupZoneCounts.comfort,
    percentage: totalParticipants > 0 ? wocaAnalysis.groupZoneCounts.comfort / totalParticipants * 100 : 0,
    color: getZoneColor('comfort')
  }, {
    zone: 'apathy',
    count: wocaAnalysis.groupZoneCounts.apathy,
    percentage: totalParticipants > 0 ? wocaAnalysis.groupZoneCounts.apathy / totalParticipants * 100 : 0,
    color: getZoneColor('apathy')
  }, {
    zone: 'war',
    count: wocaAnalysis.groupZoneCounts.war,
    percentage: totalParticipants > 0 ? wocaAnalysis.groupZoneCounts.war / totalParticipants * 100 : 0,
    color: getZoneColor('war')
  }];
  return <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className={`text-center ${isPresenterMode ? 'text-3xl' : 'text-xl'}`}>
            התפלגות לפי אזורי WOCA
          </CardTitle>
          {!isPresenterMode && <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onToggleNames} className="flex items-center gap-2">
                {showNames ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showNames ? 'הסתר שמות' : 'הצג שמות'}
              </Button>
              <Button variant="outline" size="sm" onClick={onExportData} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                ייצא נתונים
              </Button>
              {onExportToPDF && (
                <Button variant="outline" size="sm" onClick={onExportToPDF} className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  ייצא PDF
                </Button>
              )}
            </div>}
        </div>
      </CardHeader>
      <CardContent>
        {/* Dominant Zone Display */}
        <div className="mb-6 text-center">
          {isTie ? <div className="inline-block px-6 py-3 rounded-full bg-gray-200">
              <span className="text-lg font-semibold text-black">
                תיקו בין אזורים
              </span>
            </div> : dominantZone ? <div className="inline-block px-6 py-3 rounded-full" style={{
          backgroundColor: getZoneColor(dominantZone)
        }}>
              <span className="font-semibold text-black text-5xl">
                {getZoneName(dominantZone)}
              </span>
            </div> : <div className="inline-block px-6 py-3 rounded-full bg-gray-200">
              <span className="text-lg font-semibold text-black">
                לא זוהה אזור דומיננטי
              </span>
            </div>}
        </div>
      </CardContent>
    </Card>;
};