
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WocaScores, WOCA_ZONE_EXPLANATIONS, IDEAL_ZONE_EXPLANATION } from '@/utils/wocaScoring';
import { TrendingUp, Target } from 'lucide-react';

interface WocaParameterDisplayProps {
  scores: WocaScores;
  dominantZone: string;
  title?: string;
}

export const WocaParameterDisplay: React.FC<WocaParameterDisplayProps> = ({ 
  scores, 
  dominantZone,
  title = "פרמטרי WOCA" 
}) => {
  const parameters = [
    { 
      key: 'war' as keyof WocaScores, 
      name: 'מלחמה', 
      color: '#EF4444',
      explanation: WOCA_ZONE_EXPLANATIONS.war
    },
    { 
      key: 'opportunity' as keyof WocaScores, 
      name: 'הזדמנות', 
      color: '#10B981',
      explanation: WOCA_ZONE_EXPLANATIONS.opportunity
    },
    { 
      key: 'comfort' as keyof WocaScores, 
      name: 'נוחות', 
      color: '#3B82F6',
      explanation: WOCA_ZONE_EXPLANATIONS.comfort
    },
    { 
      key: 'apathy' as keyof WocaScores, 
      name: 'אדישות', 
      color: '#F59E0B',
      explanation: WOCA_ZONE_EXPLANATIONS.apathy
    }
  ];

  // Find the highest score to highlight dominant zone(s)
  const maxScore = Math.max(scores.war, scores.opportunity, scores.comfort, scores.apathy);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parameters.map((parameter) => {
              const score = scores[parameter.key];
              const isDominant = Math.abs(score - maxScore) < 0.01 && score > 0;
              
              return (
                <div 
                  key={parameter.key}
                  className={`p-4 border rounded-lg ${isDominant ? 'border-2 shadow-md' : 'border-gray-200'}`}
                  style={{ 
                    borderColor: isDominant ? parameter.color : undefined,
                    backgroundColor: isDominant ? `${parameter.color}08` : undefined
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg" style={{ color: parameter.color }}>
                      {parameter.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary"
                        style={{ 
                          backgroundColor: parameter.color, 
                          color: 'white',
                          fontSize: '0.9rem',
                          padding: '4px 8px'
                        }}
                      >
                        {score.toFixed(2)}
                      </Badge>
                      {isDominant && (
                        <Badge variant="outline" className="text-xs">
                          דומיננטי
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {parameter.explanation.description}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Ideal Zone Explanation */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center text-green-800">
            <Target className="h-5 w-5 mr-2" />
            {IDEAL_ZONE_EXPLANATION.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-700 leading-relaxed">
            {IDEAL_ZONE_EXPLANATION.content}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
