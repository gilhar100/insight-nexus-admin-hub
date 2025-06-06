
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
        
        // Query for ALL WOCA responses with the specified group_id (no LIMIT)
        const { data: wocaData, error: wocaError } = await supabase
          .from('woca_responses')
          .select('*')
          .eq('group_id', workshopId)
          .eq('survey_type', 'WOCA');

        if (wocaError) {
          console.error('❌ Error fetching WOCA data:', wocaError);
          throw wocaError;
        }

        console.log('📊 Fetched ALL WOCA responses:', wocaData?.length || 0, 'records for group', workshopId);

        if (!wocaData || wocaData.length === 0) {
          console.log('⚠️ No WOCA data found for group_id:', workshopId);
          setWorkshopData(null);
          return;
        }

        // Check if we have enough responses for reliable group insights
        if (wocaData.length < 3) {
          console.log('⚠️ Insufficient responses for group analysis:', wocaData.length);
          setError('אין מספיק נתונים להצגת תובנות קבוצתיות.');
          setWorkshopData(null);
          return;
        }
        
        // Process ALL participants for group analysis
        const uniqueParticipants = processWorkshopParticipants(wocaData);
        
        console.log('📈 Processing ALL participants for group analysis:', uniqueParticipants.length);
        
        // Calculate workshop metrics using ALL participants
        const processedWorkshopData = calculateWorkshopMetrics(uniqueParticipants, workshopId);
        
        setWorkshopData(processedWorkshopData);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('שגיאה בטעינת הנתונים');
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
