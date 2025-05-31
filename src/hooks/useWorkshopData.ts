
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface WorkshopParticipant {
  id: string;
  full_name: string;
  email: string;
  overall_score: number | null;
  scores: any;
  organization: string | null;
  profession: string | null;
  age: string | null;
  gender: string | null;
  education: string | null;
  experience_years: number | null;
  created_at: string | null;
}

export interface WorkshopData {
  workshop_id: number;
  participants: WorkshopParticipant[];
  participant_count: number;
  average_score: number;
}

export interface Workshop {
  id: number;
  name: string;
  participant_count: number;
  date: string;
}

export const useWorkshopData = (workshopId?: number) => {
  const [workshopData, setWorkshopData] = useState<WorkshopData | null>(null);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all workshops for the dropdown
  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const { data, error } = await supabase
          .from('woca_responses')
          .select('workshop_id, created_at')
          .not('workshop_id', 'is', null);

        if (error) throw error;

        // Group by workshop_id and create workshop list
        const workshopMap = new Map();
        data?.forEach(item => {
          if (item.workshop_id) {
            if (!workshopMap.has(item.workshop_id)) {
              workshopMap.set(item.workshop_id, {
                id: item.workshop_id,
                name: `Workshop ${item.workshop_id}`,
                participant_count: 0,
                date: item.created_at || 'Unknown'
              });
            }
            workshopMap.get(item.workshop_id).participant_count++;
          }
        });

        setWorkshops(Array.from(workshopMap.values()));
      } catch (err) {
        console.error('Error fetching workshops:', err);
        setError('Failed to fetch workshops');
      }
    };

    fetchWorkshops();
  }, []);

  // Fetch specific workshop data when workshopId changes
  useEffect(() => {
    if (!workshopId) {
      setWorkshopData(null);
      return;
    }

    const fetchWorkshopData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('woca_responses')
          .select('*')
          .eq('workshop_id', workshopId);

        if (error) throw error;

        const participants: WorkshopParticipant[] = data?.map(item => ({
          id: item.id,
          full_name: item.full_name,
          email: item.email,
          overall_score: item.overall_score,
          scores: item.scores,
          organization: item.organization,
          profession: item.profession,
          age: item.age,
          gender: item.gender,
          education: item.education,
          experience_years: item.experience_years,
          created_at: item.created_at
        })) || [];

        // Calculate average score
        const validScores = participants
          .map(p => p.overall_score)
          .filter(score => score !== null) as number[];
        
        const average_score = validScores.length > 0 
          ? validScores.reduce((sum, score) => sum + score, 0) / validScores.length
          : 0;

        setWorkshopData({
          workshop_id: workshopId,
          participants,
          participant_count: participants.length,
          average_score
        });

      } catch (err) {
        console.error('Error fetching workshop data:', err);
        setError('Failed to fetch workshop data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkshopData();
  }, [workshopId]);

  return { workshopData, workshops, isLoading, error };
};
