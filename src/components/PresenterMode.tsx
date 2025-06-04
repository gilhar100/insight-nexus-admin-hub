
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Maximize } from 'lucide-react';
import { SalimaRadarChart } from '@/components/SalimaRadarChart';
import { SalimaIntensityBar } from '@/components/SalimaIntensityBar';
import { WocaRadarChart } from '@/components/WocaRadarChart';
import { WorkshopDistributionChart } from '@/components/WorkshopDistributionChart';
import { Badge } from '@/components/ui/badge';
import { getHebrewZoneInfo } from '@/utils/wocaHebrewConstants';

interface PresenterModeProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'salima' | 'woca';
  data: any;
  title: string;
}

export const PresenterMode: React.FC<PresenterModeProps> = ({
  isOpen,
  onClose,
  type,
  data,
  title
}) => {
  if (!isOpen) return null;

  const getZoneInfo = (score: number) => {
    if (score >= 4.2) return { name: 'Opportunity Zone', color: 'bg-green-500', description: 'Innovation, Motivation, Inspiration' };
    if (score >= 3.4) return { name: 'Comfort Zone', color: 'bg-blue-500', description: 'Stability, Operationality, Conservatism' };
    if (score >= 2.6) return { name: 'Apathy Zone', color: 'bg-yellow-500', description: 'Disengagement, Disconnection, Low Clarity' };
    return { name: 'War Zone', color: 'bg-red-500', description: 'Conflict, Survival, Fear' };
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <h1 className="text-4xl font-bold mb-2">{title}</h1>
            <p className="text-xl opacity-90">
              {type === 'salima' ? 'ניתוח מנהיגות אישי' : 'ניתוח סדנה קבוצתי'}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="lg" 
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-8">
        {type === 'salima' && data && (
          <div className="space-y-8">
            {/* Overall Score */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="text-7xl font-bold text-blue-600 mb-4">
                    {data.overallScore.toFixed(1)}
                  </div>
                  <div className="text-2xl text-gray-600 mb-2">מנת מנהיגות SALIMA (SLQ)</div>
                  <div className="text-lg text-gray-500">מתוך 5.0</div>
                </div>
              </CardContent>
            </Card>

            {/* Dimensions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Radar Chart */}
              <Card className="h-96">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">שישה ממדי מנהיגות</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <SalimaRadarChart data={[
                    { dimension: 'אסטרטגיה', score: data.dimensions.strategy, color: '#3B82F6' },
                    { dimension: 'למידה', score: data.dimensions.learning, color: '#10B981' },
                    { dimension: 'השראה', score: data.dimensions.inspiration, color: '#EF4444' },
                    { dimension: 'משמעות', score: data.dimensions.meaning, color: '#8B5CF6' },
                    { dimension: 'הסתגלות', score: data.dimensions.adaptability, color: '#F59E0B' },
                    { dimension: 'אותנטיות', score: data.dimensions.authenticity, color: '#EC4899' }
                  ]} />
                </CardContent>
              </Card>

              {/* Intensity Bars */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-center">עוצמת הממדים</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { name: 'אסטרטגיה', score: data.dimensions.strategy },
                    { name: 'למידה', score: data.dimensions.learning },
                    { name: 'השראה', score: data.dimensions.inspiration },
                    { name: 'משמעות', score: data.dimensions.meaning },
                    { name: 'הסתגלות', score: data.dimensions.adaptability },
                    { name: 'אותנטיות', score: data.dimensions.authenticity }
                  ].map((dimension, index) => (
                    <SalimaIntensityBar
                      key={index}
                      dimension={dimension.name}
                      score={dimension.score}
                    />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {type === 'woca' && data && (
          <div className="space-y-8">
            {/* WOCA Zone */}
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-2">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="mb-6">
                    <Badge 
                      variant="secondary" 
                      className={`text-2xl px-6 py-3 ${getHebrewZoneInfo(data.average_score || data.overall_score || 0).color} text-white`}
                    >
                      {getHebrewZoneInfo(data.average_score || data.overall_score || 0).name}
                    </Badge>
                  </div>
                  <div className="text-6xl font-bold text-gray-900 mb-4">
                    {(data.average_score || data.overall_score || 0).toFixed(1)}
                  </div>
                  <div className="text-2xl text-gray-600 mb-4">
                    {data.participant_count ? 
                      `ציון ממוצע קבוצתי (${data.participant_count} משתתפים)` : 
                      'ציון אישי'
                    }
                  </div>
                  <p className="text-xl text-gray-500 mb-6">
                    {getHebrewZoneInfo(data.average_score || data.overall_score || 0).description}
                  </p>
                  
                  {/* Statistical explanation for groups */}
                  {data.participant_count && (
                    <div className="mt-8 bg-gray-50 p-6 rounded-lg text-right">
                      <h3 className="text-xl font-bold mb-4 text-gray-800">
                        האזור התודעתי הדומיננטי: {getHebrewZoneInfo(data.average_score).name}
                      </h3>
                      <div className="space-y-4 text-gray-700">
                        <p className="text-lg leading-relaxed">
                          {getHebrewZoneInfo(data.average_score).explanation}
                        </p>
                        <div className="border-t pt-4">
                          <h4 className="font-semibold mb-2">המלצות לפעולה:</h4>
                          <p className="leading-relaxed">
                            {getHebrewZoneInfo(data.average_score).recommendations}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Visualizations for groups */}
            {data.participants && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Distribution Chart */}
                <Card className="h-96">
                  <CardHeader>
                    <CardTitle className="text-2xl text-center">התפלגות ציונים</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <WorkshopDistributionChart participants={data.participants} />
                  </CardContent>
                </Card>

                {/* WOCA Radar */}
                <Card className="h-96">
                  <CardHeader>
                    <CardTitle className="text-2xl text-center">מדדי WOCA</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <WocaRadarChart participants={data.participants} />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
