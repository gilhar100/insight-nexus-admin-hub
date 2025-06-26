
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WorkshopData, WorkshopParticipant } from '@/types/workshopTypes';
import { transformParticipantData } from '@/utils/workshopDataUtils';
import { analyzeWorkshopWoca } from '@/utils/wocaAnalysis';

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
        console.log('🔄 Fetching data for group ID:', groupId);
        const { data, error } = await supabase
          .from('woca_responses')
          .select('*')
          .eq('group_id', groupId);

        if (error) throw error;

        console.log('📥 Raw group data from Supabase:', data);

        const participants: WorkshopParticipant[] = data?.map(transformParticipantData) || [];

        console.log('✅ Processed participants with question_responses:', participants);

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
        console.error('❌ Error fetching workshop data:', err);
        setError('Failed to fetch workshop data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkshopData();
  }, [groupId]);

  return { workshopData, isLoading, error };
};
