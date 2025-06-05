
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, EyeOff, Eye, Maximize } from 'lucide-react';

interface ZoneClassificationProps {
  zoneInfo: {
    name: string;
    color: string;
    description: string;
  };
  viewMode: 'workshop' | 'individual';
  workshopData?: any;
  selectedParticipant?: any;
  showNames: boolean;
  onToggleNames: () => void;
  onPresenterMode: () => void;
  onExport: () => void;
}

export const ZoneClassification: React.FC<ZoneClassificationProps> = ({
  zoneInfo,
  viewMode,
  workshopData,
  selectedParticipant,
  showNames,
  onToggleNames,
  onPresenterMode,
  onExport
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>סיווג אזור תודעתי WOCA</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onPresenterMode}>
              <Maximize className="h-4 w-4 mr-2" />
              מצב מציג
            </Button>
            <Button variant="outline" size="sm" onClick={onToggleNames}>
              {showNames ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showNames ? 'הסתר שמות' : 'הצג שמות'}
            </Button>
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              יצא ניתוח
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center p-8">
          <div className="mb-6">
            <Badge 
              variant="secondary" 
              className={`text-lg px-4 py-2 ${zoneInfo.color} text-white`}
            >
              {zoneInfo.name}
            </Badge>
          </div>
          {viewMode === 'workshop' && workshopData && (
            <>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                האזור התודעתי הדומיננטי
              </div>
              <div className="text-lg text-gray-600 mb-4">
                מבוסס על הפרמטר עם הציון הממוצע הגבוה ביותר
              </div>
              <div className="text-lg text-gray-600 mb-4">
                {workshopData.participant_count} משתתפים
              </div>
            </>
          )}
          {viewMode === 'individual' && selectedParticipant && (
            <>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {zoneInfo.name}
              </div>
              <div className="text-lg text-gray-600 mb-4">
                אזור תודעתי אישי
              </div>
            </>
          )}
          <p className="text-gray-500 max-w-md mx-auto">
            {zoneInfo.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
