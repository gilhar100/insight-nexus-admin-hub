
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Target, Download, Eye, EyeOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { WOCA_ZONE_COLORS } from '@/utils/wocaColors';

interface WocaZoneSectionProps {
  wocaAnalysis: any;
  isPresenterMode: boolean;
  showNames: boolean;
  onToggleNames: () => void;
  onExportData: () => void;
}

const getZoneNameInHebrew = (zone: string): string => {
  const zoneMap: Record<string, string> = {
    'opportunity': 'הזדמנות',
    'comfort': 'נוחות', 
    'apathy': 'אדישות',
    'war': 'מלחמה'
  };
  return zoneMap[zone] || zone;
};

const getZoneDescription = (zone: string): string => {
  const descriptions: Record<string, string> = {
    'opportunity': 'אזור של חדשנות, צמיחה והתפתחות. הקבוצה מוכנה לקחת סיכונים מחושבים ולחקור הזדמנויות חדשות.',
    'comfort': 'אזור של יציבות וביטחון. הקבוצה מרוצה מהמצב הנוכחי ומעדיפה לשמור על השגרה.',
    'apathy': 'אזור של חוסר מעורבות ואדישות. הקבוצה חסרת מוטיבציה ועניין בשינוי או התפתחות.',
    'war': 'אזור של מתח וקונפליקט. הקבוצה חווה קשיים פנימיים ומאבקים שמקשים על התקדמות.'
  };
  return descriptions[zone] || 'תיאור לא זמין';
};

export const WocaZoneSection: React.FC<WocaZoneSectionProps> = ({
  wocaAnalysis,
  isPresenterMode,
  showNames,
  onToggleNames,
  onExportData
}) => {
  if (!wocaAnalysis) return null;

  const dominantZone = wocaAnalysis.dominantZone;
  const dominantZoneHebrew = getZoneNameInHebrew(dominantZone);
  const zoneColor = WOCA_ZONE_COLORS[dominantZone as keyof typeof WOCA_ZONE_COLORS];
  const zoneDescription = getZoneDescription(dominantZone);
  const participantCount = Number(wocaAnalysis.groupZoneCounts[dominantZone] || 0);
  const totalParticipants = Object.values(wocaAnalysis.groupZoneCounts).reduce((sum: number, count) => sum + Number(count), 0);

  return (
    <Card className={isPresenterMode ? 'presenter-card' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className={`flex items-center text-right ${isPresenterMode ? 'text-xl' : 'text-lg'}`} style={{ color: '#000000' }}>
            <Target className="h-5 w-5 ml-2" />
            אזור התודעה הארגונית הדומיננטי של הקבוצה
          </CardTitle>
          {!isPresenterMode && (
            <div className="flex gap-2">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  id="show-names"
                  checked={showNames}
                  onCheckedChange={onToggleNames}
                />
                <Label htmlFor="show-names" className="flex items-center">
                  {showNames ? <Eye className="h-4 w-4 ml-1" /> : <EyeOff className="h-4 w-4 ml-1" />}
                  הצג שמות
                </Label>
              </div>
              <Button onClick={onExportData} variant="outline" size="sm">
                <Download className="h-4 w-4 ml-2" />
                ייצא נתונים
              </Button>
            </div>
          )}
        </div>
        {!isPresenterMode && (
          <CardDescription className="text-right text-base" style={{ color: '#000000' }}>
            זיהוי האזור בו נמצא הכי הרבה משתתפים בקבוצה
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Zone Badge and Count */}
        <div className="text-center space-y-4">
          <Badge 
            className={`text-xl px-6 py-3 font-bold text-white ${isPresenterMode ? 'text-3xl px-8 py-4' : ''}`}
            style={{ backgroundColor: zoneColor }}
          >
            אזור {dominantZoneHebrew}
          </Badge>
          
          <div className={`${isPresenterMode ? 'text-2xl' : 'text-lg'} font-semibold`} style={{ color: '#000000' }}>
            {participantCount} מתוך {totalParticipants} משתתפים ({Math.round((participantCount / totalParticipants) * 100)}%)
          </div>
        </div>

        {/* Zone Description */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <p className={`text-right leading-relaxed ${isPresenterMode ? 'text-xl' : 'text-base'}`} style={{ color: '#000000' }}>
            {zoneDescription}
          </p>
        </div>

        {/* Distribution by Zones */}
        {isPresenterMode && (
          <div className="mt-8">
            <h3 className="text-center text-2xl font-bold mb-6" style={{ color: '#000000' }}>
              התפלגות משתתפים לפי אזורים:
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {Object.entries(wocaAnalysis.groupZoneCounts).map(([zone, count]) => {
                const zoneHebrew = getZoneNameInHebrew(zone);
                const color = WOCA_ZONE_COLORS[zone as keyof typeof WOCA_ZONE_COLORS];
                const numericCount = Number(count);
                const percentage = totalParticipants > 0 ? Math.round((numericCount / totalParticipants) * 100) : 0;
                
                return (
                  <div key={zone} className="text-center">
                    <div 
                      className="text-6xl font-bold mb-2"
                      style={{ color }}
                    >
                      {numericCount}
                    </div>
                    <div className="text-xl font-semibold" style={{ color: '#000000' }}>
                      אזור {zoneHebrew}
                    </div>
                    <div className="text-lg" style={{ color: '#000000' }}>
                      {percentage}% משתתפים
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Detailed breakdown for non-presenter mode */}
        {!isPresenterMode && (
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(wocaAnalysis.groupZoneCounts).map(([zone, count]) => {
              const zoneHebrew = getZoneNameInHebrew(zone);
              const color = WOCA_ZONE_COLORS[zone as keyof typeof WOCA_ZONE_COLORS];
              const numericCount = Number(count);
              const percentage = totalParticipants > 0 ? Math.round((numericCount / totalParticipants) * 100) : 0;
              
              return (
                <div key={zone} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full ml-2"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-medium" style={{ color: '#000000' }}>אזור {zoneHebrew}</span>
                  </div>
                  <div className="text-sm" style={{ color: '#000000' }}>
                    {numericCount} ({percentage}%)
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
