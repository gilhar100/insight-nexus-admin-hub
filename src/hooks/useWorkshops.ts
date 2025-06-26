
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Workshop } from '@/types/workshopTypes';

export const useWorkshops = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  return { workshops, error };
};
