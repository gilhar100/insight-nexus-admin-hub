
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ZoneDescription } from '@/components/ZoneDescription';
import { WOCA_ZONE_COLORS } from '@/utils/wocaColors';
import { analyzeIndividualWoca } from '@/utils/wocaAnalysis';

export const ParticipantSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Search for participants when query changes
  useEffect(() => {
    const searchParticipants = async () => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('woca_responses')
          .select('id, full_name, email')
          .ilike('full_name', `%${searchQuery}%`)
          .limit(10);

        if (error) throw error;
        setSuggestions(data || []);
      } catch (err) {
        console.error('Error searching participants:', err);
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(searchParticipants, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSelectParticipant = async (participant: any) => {
    setIsLoading(true);
    setSearchQuery(participant.full_name);
    setSuggestions([]);

    try {
      // Get full participant data
      const { data, error } = await supabase
        .from('woca_responses')
        .select('*')
        .eq('id', participant.id)
        .single();

      if (error || !data) {
        console.error('Error fetching participant:', error);
        return;
      }

      // Analyze individual WOCA data
      const analysis = analyzeIndividualWoca(data);
      setSelectedParticipant({
        ...data,
        analysis
      });
    } catch (err) {
      console.error('Error loading participant:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getDominantZone = () => {
    if (!selectedParticipant?.analysis) return null;
    
    const scores = selectedParticipant.analysis.zoneScores;
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
    <div className="space-y-6" dir="rtl">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-right">
            <User className="h-5 w-5 ml-2" />
            חפש משתתף
          </CardTitle>
          <CardDescription className="text-right">
            הקלד לפחות שתי אותיות
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Input
              placeholder="חפש לפי שם..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-right"
              dir="rtl"
            />
            
            {/* Suggestions dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {suggestions.map((participant) => (
                  <div
                    key={participant.id}
                    className="p-3 hover:bg-gray-50 cursor-pointer text-right border-b last:border-b-0"
                    onClick={() => handleSelectParticipant(participant)}
                  >
                    <div className="font-medium">{participant.full_name}</div>
                    <div className="text-sm text-gray-600">{participant.email}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Individual Results */}
      {selectedParticipant && dominantZone && (
        <div className="space-y-6">
          {/* Dominant Zone */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                אזור דומיננטי: {getZoneNameInHebrew(dominantZone)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div 
                  className="inline-block px-6 py-3 rounded-lg text-white font-bold text-xl"
                  style={{ backgroundColor: WOCA_ZONE_COLORS[dominantZone as keyof typeof WOCA_ZONE_COLORS] }}
                >
                  {selectedParticipant.analysis.zoneScores[dominantZone] ? 
                    (Number(selectedParticipant.analysis.zoneScores[dominantZone]) * 20).toFixed(1) : '0.0'}%
                </div>
              </div>
              
              {/* Zone Scores */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {Object.entries(selectedParticipant.analysis.zoneScores).map(([zone, score]) => (
                  <div key={zone} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-right">{getZoneNameInHebrew(zone)}</div>
                    <div 
                      className="text-2xl font-bold"
                      style={{ color: WOCA_ZONE_COLORS[zone as keyof typeof WOCA_ZONE_COLORS] }}
                    >
                      {(Number(score) * 20).toFixed(1)}%
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
