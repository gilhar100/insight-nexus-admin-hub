
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Maximize } from 'lucide-react';
import { SalimaRadarChart } from '@/components/SalimaRadarChart';
import { SalimaIntensityBar } from '@/components/SalimaIntensityBar';
import { WocaRadarChart } from '@/components/WocaRadarChart';
import { WorkshopDistributionChart } from '@/components/WorkshopDistributionChart';
import { Badge } from '@/components/ui/badge';

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
              {type === 'salima' ? 'Individual Leadership Analysis' : 'Group Workshop Analysis'}
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
                  <div className="text-2xl text-gray-600 mb-2">SALIMA Leadership Quotient (SLQ)</div>
                  <div className="text-lg text-gray-500">out of 5.0</div>
                </div>
              </CardContent>
            </Card>

            {/* Dimensions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Radar Chart */}
              <Card className="h-96">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Six Leadership Dimensions</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <SalimaRadarChart data={[
                    { dimension: 'Strategy', score: data.dimensions.strategy, color: '#3B82F6' },
                    { dimension: 'Learning', score: data.dimensions.learning, color: '#10B981' },
                    { dimension: 'Inspiration', score: data.dimensions.inspiration, color: '#EF4444' },
                    { dimension: 'Meaning', score: data.dimensions.meaning, color: '#8B5CF6' },
                    { dimension: 'Adaptability', score: data.dimensions.adaptability, color: '#F59E0B' },
                    { dimension: 'Authenticity', score: data.dimensions.authenticity, color: '#EC4899' }
                  ]} />
                </CardContent>
              </Card>

              {/* Intensity Bars */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Dimension Intensity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { name: 'Strategy', score: data.dimensions.strategy },
                    { name: 'Learning', score: data.dimensions.learning },
                    { name: 'Inspiration', score: data.dimensions.inspiration },
                    { name: 'Meaning', score: data.dimensions.meaning },
                    { name: 'Adaptability', score: data.dimensions.adaptability },
                    { name: 'Authenticity', score: data.dimensions.authenticity }
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
                      className={`text-2xl px-6 py-3 ${getZoneInfo(data.average_score).color} text-white`}
                    >
                      {getZoneInfo(data.average_score).name}
                    </Badge>
                  </div>
                  <div className="text-6xl font-bold text-gray-900 mb-4">
                    {data.average_score.toFixed(1)}
                  </div>
                  <div className="text-2xl text-gray-600 mb-4">
                    Group Average Score ({data.participant_count} participants)
                  </div>
                  <p className="text-xl text-gray-500">
                    {getZoneInfo(data.average_score).description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Distribution Chart */}
              <Card className="h-96">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Score Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <WorkshopDistributionChart participants={data.participants} />
                </CardContent>
              </Card>

              {/* WOCA Radar */}
              <Card className="h-96">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">WOCA Indicators</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <WocaRadarChart participants={data.participants} />
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
