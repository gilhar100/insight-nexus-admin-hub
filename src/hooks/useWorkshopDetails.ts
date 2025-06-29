
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WorkshopData, WorkshopParticipant } from '@/types/workshopTypes';
import { analyzeWorkshopWoca } from '@/utils/wocaAnalysis';

// Transform woca_responses data to WorkshopParticipant format
const transformWocaParticipantData = (item: any): WorkshopParticipant => {
  // Create question_responses object from individual question columns
  const questionResponses: any = {};
  for (let i = 1; i <= 36; i++) {
    const qKey = `q${i}`;
    if (item[qKey] !== null && item[qKey] !== undefined) {
      questionResponses[qKey] = item[qKey];
    }
  }

  return {
    id: item.id,
    full_name: item.full_name || 'Anonymous',
    email: item.email || '',
    overall_score: item.overall_score || null,
    question_responses: questionResponses,
    organization: item.organization,
    profession: item.profession,
    age: item.age,
    gender: item.gender,
    education: item.education,
    experience_years: item.experience_years,
    created_at: item.created_at,
    // Include individual question fields
    q1: item.q1, q2: item.q2, q3: item.q3, q4: item.q4, q5: item.q5,
    q6: item.q6, q7: item.q7, q8: item.q8, q9: item.q9, q10: item.q10,
    q11: item.q11, q12: item.q12, q13: item.q13, q14: item.q14, q15: item.q15,
    q16: item.q16, q17: item.q17, q18: item.q18, q19: item.q19, q20: item.q20,
    q21: item.q21, q22: item.q22, q23: item.q23, q24: item.q24, q25: item.q25,
    q26: item.q26, q27: item.q27, q28: item.q28, q29: item.q29, q30: item.q30,
    q31: item.q31, q32: item.q32, q33: item.q33, q34: item.q34, q35: item.q35,
    q36: item.q36
  };
};

export const useWorkshopDetails = (groupId?: number) => {
  const [workshopData, setWorkshopData] = useState<WorkshopData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!groupId) {
      setWorkshopData(null);
      return;
    }

    const fetchWorkshopData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log('🔄 Fetching WOCA data for group ID:', groupId);
        const { data, error } = await supabase
          .from('woca_responses')
          .select('*')
          .eq('group_id', groupId);

        if (error) throw error;

        console.log('📥 Raw WOCA group data from Supabase:', data);

        if (!data || data.length === 0) {
          console.log('⚠️ No data found for group:', groupId);
          setWorkshopData(null);
          return;
        }

        const participants: WorkshopParticipant[] = data.map(transformWocaParticipantData);

        console.log('✅ Processed WOCA participants with question_responses:', participants);

        // Calculate WOCA analysis directly here
        const wocaAnalysis = analyzeWorkshopWoca(participants, groupId);
        console.log('🧮 WOCA Analysis calculated:', wocaAnalysis);

        // Calculate average score from WOCA analysis
        const average_score = wocaAnalysis.groupCategoryScores 
          ? (wocaAnalysis.groupCategoryScores.opportunity + 
             wocaAnalysis.groupCategoryScores.comfort + 
             wocaAnalysis.groupCategoryScores.apathy + 
             wocaAnalysis.groupCategoryScores.war) / 4
          : 0;

        setWorkshopData({
          workshop_id: groupId,
          participants,
          participant_count: participants.length,
          average_score,
          groupCategoryScores: wocaAnalysis.groupCategoryScores
        });

      } catch (err) {
        console.error('❌ Error fetching WOCA workshop data:', err);
        setError('Failed to fetch workshop data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkshopData();
  }, [groupId]);

  return { workshopData, isLoading, error };
};
