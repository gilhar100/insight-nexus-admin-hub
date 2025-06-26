
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';

interface WocaDemographicsSectionProps {
  wocaAnalysis: any;
  showNames: boolean;
  isPresenterMode: boolean;
}

export const WocaDemographicsSection: React.FC<WocaDemographicsSectionProps> = ({
  wocaAnalysis,
  showNames,
  isPresenterMode
}) => {
  const getZoneInfo = (zone: string | null) => {
    if (!zone) return { name: 'לא זוהה' };
    
    const zoneDescriptions = {
      opportunity: { name: 'הזדמנות' },
      comfort: { name: 'נוחות' },
      apathy: { name: 'אדישות' },
      war: { name: 'מלחמה' }
    };
    
    return zoneDescriptions[zone as keyof typeof zoneDescriptions] || { name: 'לא זוהה' };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className={`flex items-center text-right ${isPresenterMode ? 'text-2xl font-bold' : 'text-xl font-bold'}`} style={{ color: '#000000' }}>
          <TrendingUp className="h-5 w-5 ml-2" />
          סקירת משתתפים
        </CardTitle>
        {!isPresenterMode && (
          <CardDescription className="text-right text-base" style={{ color: '#000000' }}>
            ציונים אישיים ודמוגרפיה {showNames ? '(שמות גלויים)' : '(אנונימי)'}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" dir="rtl">
          {wocaAnalysis.participants.map((participant: any, index: number) => (
            <div key={participant.participantId} className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white">
              <div className="flex justify-between items-center mb-2">
                <Badge 
                  variant={
                    participant.dominantZone === 'opportunity' ? "default" : 
                    participant.dominantZone === 'war' ? "destructive" : 
                    "secondary"
                  }
                >
                  {participant.isTie ? 'תיקו' : (participant.dominantZone ? getZoneInfo(participant.dominantZone).name : 'N/A')}
                </Badge>
                <span className={`font-medium ${isPresenterMode ? 'text-lg' : 'text-base'}`} style={{ color: '#000000' }}>
                  {showNames ? participant.participantName : `משתתף ${index + 1}`}
                </span>
              </div>
              
              {/* Mini category scores with correct RTL alignment */}
              <div className={`space-y-1 text-right ${isPresenterMode ? 'text-base' : 'text-sm'}`} style={{ color: '#000000' }}>
                <div className="flex justify-between">
                  <span>הזדמנות:</span>
                  <span className="font-medium">{participant.categoryScores.opportunity.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span>נוחות:</span>
                  <span className="font-medium">{participant.categoryScores.comfort.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span>אדישות:</span>
                  <span className="font-medium">{participant.categoryScores.apathy.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span>מלחמה:</span>
                  <span className="font-medium">{participant.categoryScores.war.toFixed(1)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
