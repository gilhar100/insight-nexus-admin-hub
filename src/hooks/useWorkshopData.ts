
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
  group_id: string | null;
}

export interface WorkshopData {
  workshop_id?: number;
  group_id?: string;
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

export interface Group {
  id: string;
  name: string;
  participant_count: number;
  date: string;
}

export const useWorkshopData = (workshopId?: number, groupId?: string) => {
  const [workshopData, setWorkshopData] = useState<WorkshopData | null>(null);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all workshops and groups for the dropdown
  useEffect(() => {
    const fetchWorkshopsAndGroups = async () => {
      try {
        const { data, error } = await supabase
          .from('woca_responses')
          .select('workshop_id, group_id, created_at')
          .not('workshop_id', 'is', null);

        if (error) throw error;

        // Group by workshop_id
        const workshopMap = new Map();
        const groupMap = new Map();
        
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

          if (item.group_id) {
            if (!groupMap.has(item.group_id)) {
              groupMap.set(item.group_id, {
                id: item.group_id,
                name: `Group ${item.group_id}`,
                participant_count: 0,
                date: item.created_at || 'Unknown'
              });
            }
            groupMap.get(item.group_id).participant_count++;
          }
        });

        setWorkshops(Array.from(workshopMap.values()));
        setGroups(Array.from(groupMap.values()));
      } catch (err) {
        console.error('Error fetching workshops and groups:', err);
        setError('Failed to fetch workshops and groups');
      }
    };

    fetchWorkshopsAndGroups();
  }, []);

  // Fetch specific workshop or group data when workshopId or groupId changes
  useEffect(() => {
    if (!workshopId && !groupId) {
      setWorkshopData(null);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let query = supabase.from('woca_responses').select('*');
        
        if (workshopId) {
          query = query.eq('workshop_id', workshopId);
        }
        
        if (groupId) {
          query = query.eq('group_id', groupId);
        }

        const { data, error } = await query;

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
          created_at: item.created_at,
          group_id: item.group_id
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
          group_id: groupId,
          participants,
          participant_count: participants.length,
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
  }, [workshopId, groupId]);

  return { workshopData, workshops, groups, isLoading, error };
};
