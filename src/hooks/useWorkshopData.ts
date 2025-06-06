
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WorkshopData } from '@/types/workshop';
import { useWorkshopsList } from '@/hooks/useWorkshopsList';
import { processWorkshopParticipants, calculateWorkshopMetrics } from '@/utils/workshopDataProcessor';

export const useWorkshopData = (workshopId?: number) => {
  const [workshopData, setWorkshopData] = useState<WorkshopData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use the separate workshops list hook
  const { workshops, error: workshopsError } = useWorkshopsList();

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
        console.log('🔍 Fetching WOCA responses for group_id:', workshopId, 'Type:', typeof workshopId);
        
        // Query for WOCA responses with the specified group_id, selecting only q1-q36 and basic info
        const { data: wocaData, error: wocaError } = await supabase
          .from('woca_responses')
          .select(`
            id,
            full_name,
            email,
            group_id,
            survey_type,
            created_at,
            organization,
            profession,
            age,
            gender,
            education,
            experience_years,
            overall_score,
            workshop_id,
            q1, q2, q3, q4, q5, q6, q7, q8, q9, q10,
            q11, q12, q13, q14, q15, q16, q17, q18, q19, q20,
            q21, q22, q23, q24, q25, q26, q27, q28, q29, q30,
            q31, q32, q33, q34, q35, q36
          `)
          .eq('group_id', workshopId)
          .eq('survey_type', 'WOCA')
          .order('created_at', { ascending: true });

        if (wocaError) {
          console.error('❌ Error fetching WOCA data:', wocaError);
          throw wocaError;
        }

        console.log('📊 Fetched WOCA responses:', wocaData?.length || 0, 'records for group', workshopId);
        console.log('📝 Raw WOCA data sample:', wocaData?.[0]);

        if (!wocaData || wocaData.length === 0) {
          console.log('⚠️ No WOCA data found for group_id:', workshopId);
          setError(`לא נמצאו נתוני WOCA עבור קבוצה ${workshopId}.`);
          setWorkshopData(null);
          return;
        }

        // Filter responses that have valid question responses (q1-q36)
        const responsesWithValidQuestions = wocaData.filter(response => {
          // Check if at least some questions have valid responses (1-5)
          const questionKeys = Array.from({ length: 36 }, (_, i) => `q${i + 1}`);
          const validQuestions = questionKeys.filter(key => {
            const value = response[key as keyof typeof response];
            return typeof value === 'number' && value >= 1 && value <= 5;
          });
          
          console.log(`👤 Response ${response.id} - Valid questions:`, validQuestions.length, 'out of 36');
          
          // Require at least 30 valid responses (allowing some missing)
          return validQuestions.length >= 30;
        });

        console.log('📈 Responses with valid question data:', responsesWithValidQuestions.length, 'out of', wocaData.length);

        if (responsesWithValidQuestions.length === 0) {
          console.log('⚠️ No responses with valid question data found for group_id:', workshopId);
          setError(`לא נמצאו תגובות עם נתוני שאלות תקינים עבור קבוצה ${workshopId}.`);
          setWorkshopData(null);
          return;
        }

        // Log each response for debugging
        responsesWithValidQuestions.forEach((response, index) => {
          console.log(`👤 Valid Response ${index + 1}:`, {
            id: response.id,
            full_name: response.full_name,
            email: response.email,
            group_id: response.group_id,
            sample_questions: {
              q1: response.q1,
              q2: response.q2,
              q3: response.q3
            }
          });
        });

        // Process participants using question responses
        const uniqueParticipants = processWorkshopParticipants(responsesWithValidQuestions);
        
        console.log('📈 Processing participants from question responses:', uniqueParticipants.length, 'unique participants from', responsesWithValidQuestions.length, 'valid responses');
        
        // Calculate workshop metrics 
        const processedWorkshopData = calculateWorkshopMetrics(uniqueParticipants, workshopId);
        
        console.log('🎯 Final workshop data summary:', {
          workshop_id: processedWorkshopData.workshop_id,
          participant_count: processedWorkshopData.participant_count,
          dominant_zone: processedWorkshopData.dominant_zone,
          zone_distribution: processedWorkshopData.zone_distribution,
          group_woca_averages: processedWorkshopData.group_woca_averages
        });
        
        setWorkshopData(processedWorkshopData);

      } catch (err) {
        console.error('❌ Error fetching workshop data:', err);
        setError('שגיאה בטעינת נתוני הסדנה');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [workshopId]);

  return { 
    workshopData, 
    workshops, 
    isLoading, 
    error: error || workshopsError 
  };
};

// Re-export types for backward compatibility
export type { WorkshopParticipant, WorkshopData, Workshop } from '@/types/workshop';
