
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

  console.log('🔄 useWorkshopData called with workshopId:', workshopId);

  // Fetch specific workshop data when workshopId changes
  useEffect(() => {
    if (!workshopId) {
      console.log('🔄 No workshopId provided, clearing data');
      setWorkshopData(null);
      return;
    }

    const fetchData = async () => {
      console.log('🔄 Starting fetchData for workshopId:', workshopId);
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

        console.log('📊 Supabase query completed:', {
          error: wocaError,
          dataLength: wocaData?.length || 0,
          queryParams: { group_id: workshopId, survey_type: 'WOCA' }
        });

        if (wocaError) {
          console.error('❌ Error fetching WOCA data:', wocaError);
          throw wocaError;
        }

        console.log('📊 Raw WOCA query results:', {
          totalResults: wocaData?.length || 0,
          groupId: workshopId,
          sampleData: wocaData?.[0] ? {
            id: wocaData[0].id,
            full_name: wocaData[0].full_name,
            group_id: wocaData[0].group_id,
            hasQ1: wocaData[0].q1 !== null,
            hasQ36: wocaData[0].q36 !== null
          } : 'No data'
        });

        if (!wocaData || wocaData.length === 0) {
          console.log('⚠️ No WOCA data found for group_id:', workshopId);
          setError(`לא נמצאו נתוני WOCA עבור קבוצה ${workshopId}.`);
          setWorkshopData(null);
          return;
        }

        // Log all raw responses for debugging
        console.log('📝 All WOCA responses found:', wocaData.map(response => ({
          id: response.id,
          full_name: response.full_name,
          email: response.email,
          group_id: response.group_id,
          survey_type: response.survey_type,
          hasQ1: response.q1 !== null && response.q1 !== undefined,
          hasQ36: response.q36 !== null && response.q36 !== undefined,
          sampleQuestions: {
            q1: response.q1,
            q2: response.q2,
            q3: response.q3,
            q35: response.q35,
            q36: response.q36
          }
        })));

        // Process participants using question responses
        console.log('🔄 Processing participants...');
        const uniqueParticipants = processWorkshopParticipants(wocaData);
        
        console.log('🎯 Participants processing results:', {
          rawResponsesIn: wocaData.length,
          uniqueParticipantsOut: uniqueParticipants.length,
          groupAnalysisThreshold: 3,
          canProceedWithGroupAnalysis: uniqueParticipants.length >= 3
        });
        
        // Calculate workshop metrics 
        console.log('🔄 Calculating workshop metrics...');
        const processedWorkshopData = calculateWorkshopMetrics(uniqueParticipants, workshopId);
        
        console.log('🎯 Final workshop data summary:', {
          workshop_id: processedWorkshopData.workshop_id,
          participant_count: processedWorkshopData.participant_count,
          dominant_zone: processedWorkshopData.dominant_zone,
          zone_distribution: processedWorkshopData.zone_distribution,
          group_woca_averages: processedWorkshopData.group_woca_averages,
          meetsMinimumThreshold: processedWorkshopData.participant_count >= 3
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

  console.log('🔄 useWorkshopData returning:', {
    workshopData: workshopData ? {
      workshop_id: workshopData.workshop_id,
      participant_count: workshopData.participant_count
    } : null,
    workshops: workshops?.length || 0,
    isLoading,
    error: error || workshopsError
  });

  return { 
    workshopData, 
    workshops, 
    isLoading, 
    error: error || workshopsError 
  };
};

// Re-export types for backward compatibility
export type { WorkshopParticipant, WorkshopData, Workshop } from '@/types/workshop';
