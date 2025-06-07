
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ZoneDescription } from '@/components/ZoneDescription';
import { WOCA_ZONE_COLORS, getWocaZoneColor } from '@/utils/wocaColors';
import { analyzeIndividualWoca } from '@/utils/wocaAnalysis';

export const IndividualSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [individualData, setIndividualData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    setIndividualData(null);

    try {
      // Search by ID or email
      const { data, error } = await supabase
        .from('woca_responses')
        .select('*')
        .or(`id.eq.${searchQuery},email.ilike.%${searchQuery}%`)
        .limit(1)
        .single();

      if (error || !data) {
        setError('לא נמצאה תגובה עם המזהה או האימייל שהוזן');
        return;
      }

      // Analyze individual WOCA data
      const analysis = analyzeIndividualWoca(data);
      setIndividualData({
        ...data,
        analysis
      });

    } catch (err) {
      console.error('Error searching individual:', err);
      setError('שגיאה בחיפוש התגובה');
    } finally {
      setIsLoading(false);
    }
  };

  const getDominantZone = () => {
    if (!individualData?.analysis) return null;
    
    const scores = individualData.analysis.zoneScores;
    let maxZone = 'opportunity';
    let maxScore = scores.opportunity;

    if (scores.comfort > maxScore) {
      maxZone = 'comfort';
      maxScore = scores.comfort;
    }
    if (scores.apathy > maxScore) {
      maxZone = 'apathy';
      maxScore = scores.apathy;
    }
    if (scores.war > maxScore) {
      maxZone = 'war';
      maxScore = scores.war;
    }

    return maxZone;
  };

  const getZoneNameInHebrew = (zone: string) => {
    const zoneNames = {
      opportunity: 'הזדמנות',
      comfort: 'נוחות',
      apathy: 'אדישות',
      war: 'מלחמה'
    };
    return zoneNames[zone as keyof typeof zoneNames] || zone;
  };

  const dominantZone = getDominantZone();

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-right">
            <User className="h-5 w-5 ml-2" />
            חיפוש תוצאות אישיות
          </CardTitle>
          <CardDescription className="text-right">
            הזן מזהה תגובה או כתובת אימייל לצפייה בתוצאות אישיות
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button 
              onClick={handleSearch} 
              disabled={!searchQuery.trim() || isLoading}
              className="shrink-0"
            >
              {isLoading ? 'מחפש...' : 'חפש'}
            </Button>
            <Input
              placeholder="מזהה תגובה או כתובת אימייל..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="text-right"
              dir="rtl"
            />
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-800 text-right">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Individual Results */}
      {individualData && (
        <div className="space-y-6">
          {/* Dominant Zone */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                אזור דומינטי: {getZoneNameInHebrew(dominantZone)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div 
                  className="inline-block px-6 py-3 rounded-lg text-white font-bold text-xl"
                  style={{ backgroundColor: WOCA_ZONE_COLORS[dominantZone as keyof typeof WOCA_ZONE_COLORS] }}
                >
                  {(individualData.analysis.zoneScores[dominantZone] * 20).toFixed(1)}%
                </div>
              </div>
              
              {/* Zone Scores */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {Object.entries(individualData.analysis.zoneScores).map(([zone, score]) => (
                  <div key={zone} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-right">{getZoneNameInHebrew(zone)}</div>
                    <div 
                      className="text-2xl font-bold"
                      style={{ color: WOCA_ZONE_COLORS[zone as keyof typeof WOCA_ZONE_COLORS] }}
                    >
                      {(score * 20).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Zone Description */}
          <ZoneDescription zone={dominantZone} />
        </div>
      )}
    </div>
  );
};
