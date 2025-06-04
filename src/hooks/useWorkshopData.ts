
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
  workshop_id: number | null;
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
        // First try workshop_id, then fall back to group_id
        const { data: workshopData, error: workshopError } = await supabase
          .from('woca_responses')
          .select('workshop_id, created_at')
          .not('workshop_id', 'is', null);

        const { data: groupData, error: groupError } = await supabase
          .from('woca_responses')
          .select('group_id, created_at')
          .not('group_id', 'is', null);

        if (workshopError && groupError) {
          throw workshopError || groupError;
        }

        // Group by workshop_id
        const workshopMap = new Map();
        
        // Process workshop_id data
        workshopData?.forEach(item => {
          if (item.workshop_id) {
            if (!workshopMap.has(item.workshop_id)) {
              workshopMap.set(item.workshop_id, {
                id: item.workshop_id,
                name: `סדנה ${item.workshop_id}`,
                participant_count: 0,
                date: item.created_at || 'Unknown'
              });
            }
            workshopMap.get(item.workshop_id).participant_count++;
          }
        });

        // Process group_id data (treat as workshop numbers)
        groupData?.forEach(item => {
          if (item.group_id) {
            const workshopNum = parseInt(item.group_id);
            if (!isNaN(workshopNum)) {
              if (!workshopMap.has(workshopNum)) {
                workshopMap.set(workshopNum, {
                  id: workshopNum,
                  name: `סדנה ${workshopNum}`,
                  participant_count: 0,
                  date: item.created_at || 'Unknown'
                });
              }
              workshopMap.get(workshopNum).participant_count++;
            }
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

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Search both workshop_id and group_id fields
        const { data: workshopData, error: workshopError } = await supabase
          .from('woca_responses')
          .select('*')
          .eq('workshop_id', workshopId);

        const { data: groupData, error: groupError } = await supabase
          .from('woca_responses')
          .select('*')
          .eq('group_id', workshopId.toString());

        if (workshopError && groupError) {
          throw workshopError || groupError;
        }

        // Combine both datasets
        const allData = [...(workshopData || []), ...(groupData || [])];

        const participants: WorkshopParticipant[] = allData?.map(item => ({
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
          created_at: item.created_at,
          workshop_id: item.workshop_id || parseInt(item.group_id || '0')
        })) || [];

        // Remove duplicates based on email
        const uniqueParticipants = participants.filter((participant, index, self) =>
          index === self.findIndex(p => p.email === participant.email)
        );

        // Calculate average score
        const validScores = uniqueParticipants
          .map(p => p.overall_score)
          .filter(score => score !== null) as number[];
        
        const average_score = validScores.length > 0 
          ? validScores.reduce((sum, score) => sum + score, 0) / validScores.length
          : 0;

        setWorkshopData({
          workshop_id: workshopId,
          participants: uniqueParticipants,
          participant_count: uniqueParticipants.length,
          average_score
        });

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [workshopId]);

  return { workshopData, workshops, isLoading, error };
};
