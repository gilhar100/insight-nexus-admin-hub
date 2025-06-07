
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface WorkshopParticipant {
  id: string;
  full_name: string;
  email: string;
  overall_score: number | null;
  question_responses?: any;
  organization: string | null;
  profession: string | null;
  age: string | null;
  gender: string | null;
  education: string | null;
  experience_years: number | null;
  created_at: string | null;
  // Add the individual question fields
  q1?: number | null;
  q2?: number | null;
  q3?: number | null;
  q4?: number | null;
  q5?: number | null;
  q6?: number | null;
  q7?: number | null;
  q8?: number | null;
  q9?: number | null;
  q10?: number | null;
  q11?: number | null;
  q12?: number | null;
  q13?: number | null;
  q14?: number | null;
  q15?: number | null;
  q16?: number | null;
  q17?: number | null;
  q18?: number | null;
  q19?: number | null;
  q20?: number | null;
  q21?: number | null;
  q22?: number | null;
  q23?: number | null;
  q24?: number | null;
  q25?: number | null;
  q26?: number | null;
  q27?: number | null;
  q28?: number | null;
  q29?: number | null;
  q30?: number | null;
  q31?: number | null;
  q32?: number | null;
  q33?: number | null;
  q34?: number | null;
  q35?: number | null;
  q36?: number | null;
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

// Helper function to convert individual question columns to question_responses object
const convertToQuestionResponses = (participant: any): any => {
  const questionResponses: any = {};
  for (let i = 1; i <= 36; i++) {
    const qKey = `q${i}`;
    if (participant[qKey] !== null && participant[qKey] !== undefined) {
      questionResponses[qKey] = participant[qKey];
    }
  }
  return questionResponses;
};

export const useWorkshopData = (groupId?: number) => {
  const [workshopData, setWorkshopData] = useState<WorkshopData | null>(null);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all groups for the dropdown (treating group_id as workshop_id)
  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        console.log('🔄 Fetching workshops/groups...');
        const { data, error } = await supabase
          .from('woca_responses')
          .select('group_id, created_at')
          .not('group_id', 'is', null);

        if (error) throw error;

        console.log('📥 Raw groups data:', data);

        // Group by group_id and create workshop list
        const workshopMap = new Map();
        data?.forEach(item => {
          if (item.group_id) {
            if (!workshopMap.has(item.group_id)) {
              workshopMap.set(item.group_id, {
                id: item.group_id,
                name: `סדנה ${item.group_id}`,
                participant_count: 0,
                date: item.created_at || 'Unknown'
              });
            }
            workshopMap.get(item.group_id).participant_count++;
          }
        });

        const workshopsList = Array.from(workshopMap.values());
        console.log('🏢 Processed workshops:', workshopsList);
        setWorkshops(workshopsList);
      } catch (err) {
        console.error('❌ Error fetching workshops:', err);
        setError('Failed to fetch workshops');
      }
    };

    fetchWorkshops();
  }, []);

  // Fetch specific group data when groupId changes
  useEffect(() => {
    if (!groupId) {
      setWorkshopData(null);
      return;
    }

    const fetchWorkshopData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log('🔄 Fetching data for group ID:', groupId);
        const { data, error } = await supabase
          .from('woca_responses')
          .select('*')
          .eq('group_id', groupId);

        if (error) throw error;

        console.log('📥 Raw group data from Supabase:', data);

        const participants: WorkshopParticipant[] = data?.map(item => {
          // Convert individual question columns to question_responses format
          const questionResponses = convertToQuestionResponses(item);
          
          return {
            id: item.id,
            full_name: item.full_name,
            email: item.email,
            overall_score: item.overall_score,
            question_responses: questionResponses,
            organization: item.organization,
            profession: item.profession,
            age: item.age,
            gender: item.gender,
            education: item.education,
            experience_years: item.experience_years,
            created_at: item.created_at,
            // Include individual question fields
            q1: item.q1,
            q2: item.q2,
            q3: item.q3,
            q4: item.q4,
            q5: item.q5,
            q6: item.q6,
            q7: item.q7,
            q8: item.q8,
            q9: item.q9,
            q10: item.q10,
            q11: item.q11,
            q12: item.q12,
            q13: item.q13,
            q14: item.q14,
            q15: item.q15,
            q16: item.q16,
            q17: item.q17,
            q18: item.q18,
            q19: item.q19,
            q20: item.q20,
            q21: item.q21,
            q22: item.q22,
            q23: item.q23,
            q24: item.q24,
            q25: item.q25,
            q26: item.q26,
            q27: item.q27,
            q28: item.q28,
            q29: item.q29,
            q30: item.q30,
            q31: item.q31,
            q32: item.q32,
            q33: item.q33,
            q34: item.q34,
            q35: item.q35,
            q36: item.q36
          };
        }) || [];

        console.log('✅ Processed participants with question_responses:', participants);

        // Calculate average score (we'll compute this from the WOCA analysis)
        const average_score = 0; // Will be calculated by WOCA analysis

        setWorkshopData({
          workshop_id: groupId,
          participants,
          participant_count: participants.length,
          average_score
        });

      } catch (err) {
        console.error('❌ Error fetching workshop data:', err);
        setError('Failed to fetch workshop data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkshopData();
  }, [groupId]);

  return { workshopData, workshops, isLoading, error };
};
