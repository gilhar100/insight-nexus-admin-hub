
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Workshop } from '@/types/workshop';

export const useWorkshopsList = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        // First try workshop_id, then fall back to group_id
        const { data: workshopData, error: workshopError } = await supabase
          .from('woca_responses')
          .select('workshop_id, created_at')
          .not('workshop_id', 'is', null);

        const { data: groupData, error: groupError } = await supabase
          .from('woca_responses')
          .select('group_id, created_at')
          .not('group_id', 'is', null);

        if (workshopError && groupError) {
          throw workshopError || groupError;
        }

        // Group by workshop_id
        const workshopMap = new Map();
        
        // Process workshop_id data
        workshopData?.forEach(item => {
          if (item.workshop_id) {
            if (!workshopMap.has(item.workshop_id)) {
              workshopMap.set(item.workshop_id, {
                id: item.workshop_id,
                name: `סדנה ${item.workshop_id}`,
                participant_count: 0,
                date: item.created_at || 'Unknown'
              });
            }
            workshopMap.get(item.workshop_id).participant_count++;
          }
        });

        // Process group_id data (treat as workshop numbers)
        groupData?.forEach(item => {
          if (item.group_id) {
            const workshopNum = parseInt(item.group_id);
            if (!isNaN(workshopNum)) {
              if (!workshopMap.has(workshopNum)) {
                workshopMap.set(workshopNum, {
                  id: workshopNum,
                  name: `סדנה ${workshopNum}`,
                  participant_count: 0,
                  date: item.created_at || 'Unknown'
                });
              }
              workshopMap.get(workshopNum).participant_count++;
            }
          }
        });

        setWorkshops(Array.from(workshopMap.values()));
      } catch (err) {
        console.error('Error fetching workshops:', err);
        setError('Failed to fetch workshops');
      }
    };

    fetchWorkshops();
  }, []);

  return { workshops, error };
};
