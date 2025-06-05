
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { calculateWocaScores, determineWocaZone } from '@/utils/wocaScoring';

export interface WocaParticipant {
  id: string;
  full_name: string;
  email: string;
  workshop_id: number | null;
  overall_score: number | null;
  woca_scores: any;
  woca_zone: string;
  woca_zone_color: string;
  organization: string | null;
  profession: string | null;
  age: string | null;
  gender: string | null;
  education: string | null;
  experience_years: number | null;
  created_at: string | null;
}

export const useWocaSearch = (searchQuery: string) => {
  const [participants, setParticipants] = useState<WocaParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setParticipants([]);
      return;
    }

    const searchParticipants = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('woca_responses')
          .select('*')
          .or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
          .limit(20);

        if (error) throw error;

        const mappedParticipants: WocaParticipant[] = data?.map(item => {
          // Calculate WOCA scores and zone for search results
          const wocaScores = calculateWocaScores(item.question_responses);
          const zoneResult = determineWocaZone(wocaScores);

          return {
            id: item.id,
            full_name: item.full_name,
            email: item.email,
            workshop_id: item.workshop_id,
            overall_score: item.overall_score,
            woca_scores: wocaScores,
            woca_zone: zoneResult.zone,
            woca_zone_color: zoneResult.color,
            organization: item.organization,
            profession: item.profession,
            age: item.age,
            gender: item.gender,
            education: item.education,
            experience_years: item.experience_years,
            created_at: item.created_at
          };
        }) || [];

        setParticipants(mappedParticipants);
      } catch (err) {
        console.error('Error searching participants:', err);
        setError('Failed to search participants');
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(searchParticipants, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return { participants, isLoading, error };
};
