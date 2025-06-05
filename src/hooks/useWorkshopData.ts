
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
        
        // Process participants using utility function
        const uniqueParticipants = processWorkshopParticipants(allData);
        
        // Calculate workshop metrics using utility function
        const processedWorkshopData = calculateWorkshopMetrics(uniqueParticipants, workshopId);
        
        setWorkshopData(processedWorkshopData);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data');
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
