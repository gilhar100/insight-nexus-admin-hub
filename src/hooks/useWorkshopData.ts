
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
        console.log('🔍 Fetching ALL WOCA responses for group_id:', workshopId);
        
        // Query for ALL WOCA responses with the specified group_id (REMOVED LIMIT completely)
        const { data: wocaData, error: wocaError } = await supabase
          .from('woca_responses')
          .select('*')
          .eq('group_id', workshopId)
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
          setError('לא נמצאו נתוני WOCA עבור קבוצה זו.');
          setWorkshopData(null);
          return;
        }

        // Log each response for debugging
        wocaData.forEach((response, index) => {
          console.log(`👤 Response ${index + 1}:`, {
            id: response.id,
            full_name: response.full_name,
            email: response.email,
            group_id: response.group_id,
            has_scores: !!(response.war_score || response.opportunity_score || response.comfort_score || response.apathy_score),
            has_questions: !!(response.q1 || response.q2 || response.q3),
            war_score: response.war_score,
            opportunity_score: response.opportunity_score,
            comfort_score: response.comfort_score,
            apathy_score: response.apathy_score
          });
        });

        // Check if we have enough responses for reliable group insights
        if (wocaData.length < 3) {
          console.log('⚠️ Insufficient responses for group analysis:', wocaData.length);
          setError(`נמצאו רק ${wocaData.length} תגובות. נדרשות לפחות 3 תגובות לניתוח קבוצתי אמין.`);
          setWorkshopData(null);
          return;
        }
        
        // Process ALL participants for group analysis
        const uniqueParticipants = processWorkshopParticipants(wocaData);
        
        console.log('📈 Processing ALL participants for group analysis:', uniqueParticipants.length, 'unique participants from', wocaData.length, 'total responses');
        
        // Calculate workshop metrics using ALL participants
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
