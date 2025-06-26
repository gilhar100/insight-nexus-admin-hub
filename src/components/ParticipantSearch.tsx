
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { analyzeParticipantWoca } from '@/utils/wocaAnalysis';
import { Badge } from '@/components/ui/badge';
import { WOCA_ZONE_COLORS } from '@/utils/wocaColors';

interface ParticipantSearchProps {
  onParticipantSelect?: (participant: any) => void;
}

export const ParticipantSearch: React.FC<ParticipantSearchProps> = ({ onParticipantSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const searchParticipants = async (term: string) => {
    if (term.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('woca_responses')
        .select('*')
        .ilike('full_name', `%${term}%`)
        .limit(10);

      if (error) throw error;
      setSuggestions(data || []);
    } catch (error) {
      console.error('Error searching participants:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchParticipants(value);
  };

  const selectParticipant = (participant: any) => {
    setSelectedParticipant(participant);
    setSearchTerm(participant.full_name);
    setSuggestions([]);
    if (onParticipantSelect) {
      onParticipantSelect(participant);
    }
  };

  const getZoneInfo = (zone: string | null) => {
    const zoneNames = {
      opportunity: 'אזור ההזדמנות',
      comfort: 'אזור הנוחות',
      apathy: 'אזור האדישות',
      war: 'אזור המלחמה'
    };
    
    return {
      name: zone ? zoneNames[zone as keyof typeof zoneNames] || 'לא זוהה' : 'לא זוהה',
      color: zone ? WOCA_ZONE_COLORS[zone as keyof typeof WOCA_ZONE_COLORS] : '#6B7280'
    };
  };

  const renderParticipantInsights = () => {
    if (!selectedParticipant) return null;

    // Convert individual question columns to question_responses format
    const questionResponses: any = {};
    for (let i = 1; i <= 36; i++) {
      const qKey = `q${i}`;
      if (selectedParticipant[qKey] !== null && selectedParticipant[qKey] !== undefined) {
        questionResponses[qKey] = selectedParticipant[qKey];
      }
    }

    const analysis = analyzeParticipantWoca(
      { question_responses: questionResponses },
      selectedParticipant.full_name,
      selectedParticipant.id
    );

    const zoneInfo = getZoneInfo(analysis.dominantZone);

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            תובנות אישיות - {selectedParticipant.full_name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Dominant Zone */}
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              {analysis.isTie ? (
                <div>
                  <Badge variant="secondary" className="mb-2">תיקו</Badge>
                  <p className="text-gray-600">
                    תיקו בין: {analysis.tiedCategories.map(cat => getZoneInfo(cat).name).join(', ')}
                  </p>
                </div>
              ) : (
                <div>
                  <Badge 
                    variant="secondary" 
                    className="text-lg px-4 py-2 mb-4"
                    style={{ backgroundColor: zoneInfo.color, color: 'white' }}
                  >
                    {zoneInfo.name}
                  </Badge>
                </div>
              )}
            </div>

            {/* Category Scores */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">
                  {analysis.categoryScores.opportunity.toFixed(1)}
                </div>
                <div className="text-sm text-green-700">הזדמנות</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">
                  {analysis.categoryScores.comfort.toFixed(1)}
                </div>
                <div className="text-sm text-blue-700">נוחות</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-700">
                  {analysis.categoryScores.apathy.toFixed(1)}
                </div>
                <div className="text-sm text-yellow-700">אדישות</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-700">
                  {analysis.categoryScores.war.toFixed(1)}
                </div>
                <div className="text-sm text-red-700">מלחמה</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Search className="h-5 w-5 mr-2" />
          חיפוש משתתף
        </CardTitle>
        <CardDescription>
          יש להקליד לפחות שתי אותיות
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Input
            type="text"
            placeholder="הקלד שם משתתף..."
            value={searchTerm}
            onChange={handleInputChange}
            className="w-full"
            dir="rtl"
          />
          
          {isLoading && (
            <div className="absolute top-full left-0 right-0 p-2 bg-white border border-gray-200 rounded-md mt-1 z-10">
              <div className="text-gray-500 text-sm">מחפש...</div>
            </div>
          )}

          {suggestions.length > 0 && !isLoading && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md mt-1 max-h-60 overflow-y-auto z-10">
              {suggestions.map((participant) => (
                <div
                  key={participant.id}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  onClick={() => selectParticipant(participant)}
                >
                  <div className="font-medium">{participant.full_name}</div>
                  {participant.organization && (
                    <div className="text-sm text-gray-600">{participant.organization}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {renderParticipantInsights()}
      </CardContent>
    </Card>
  );
};
