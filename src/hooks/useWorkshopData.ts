
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
        console.log('🔍 Fetching ALL WOCA responses for group_id:', workshopId, 'Type:', typeof workshopId);
        
        // Query for ALL WOCA responses with the specified group_id as INTEGER
        const { data: wocaData, error: wocaError } = await supabase
          .from('woca_responses')
          .select('*')
          .eq('group_id', workshopId) // group_id is treated as integer
          .eq('survey_type', 'WOCA')
          .order('created_at', { ascending: true }); // Order by creation time

        if (wocaError) {
          console.error('❌ Error fetching WOCA data:', wocaError);
          throw wocaError;
        }

        console.log('📊 Fetched ALL WOCA responses:', wocaData?.length || 0, 'records for group', workshopId);
        console.log('📝 Raw WOCA data sample:', wocaData?.[0]);

        if (!wocaData || wocaData.length === 0) {
          console.log('⚠️ No WOCA data found for group_id:', workshopId);
          setError(`לא נמצאו נתוני WOCA עבור קבוצה ${workshopId}.`);
          setWorkshopData(null);
          return;
        }

        // Filter responses that have valid WOCA scores (not null)
        const responsesWithScores = wocaData.filter(response => {
          const hasValidScores = 
            response.war_score !== null || 
            response.opportunity_score !== null || 
            response.comfort_score !== null || 
            response.apathy_score !== null;
          
          console.log(`👤 Response ${response.id} - Valid scores:`, hasValidScores, {
            war: response.war_score,
            opportunity: response.opportunity_score,
            comfort: response.comfort_score,
            apathy: response.apathy_score
          });
          
          return hasValidScores;
        });

        console.log('📈 Responses with valid WOCA scores:', responsesWithScores.length, 'out of', wocaData.length);

        if (responsesWithScores.length === 0) {
          console.log('⚠️ No responses with valid WOCA scores found for group_id:', workshopId);
          setError(`לא נמצאו תגובות עם ציוני WOCA תקינים עבור קבוצה ${workshopId}.`);
          setWorkshopData(null);
          return;
        }

        // Log each response for debugging
        responsesWithScores.forEach((response, index) => {
          console.log(`👤 Valid Response ${index + 1}:`, {
            id: response.id,
            full_name: response.full_name,
            email: response.email,
            group_id: response.group_id,
            war_score: response.war_score,
            opportunity_score: response.opportunity_score,
            comfort_score: response.comfort_score,
            apathy_score: response.apathy_score
          });
        });

        // Process ALL participants with valid scores for group analysis
        const uniqueParticipants = processWorkshopParticipants(responsesWithScores);
        
        console.log('📈 Processing participants with valid scores:', uniqueParticipants.length, 'unique participants from', responsesWithScores.length, 'valid responses');
        
        // Calculate workshop metrics using participants with valid scores
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
