
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Manager {
  id: string;
  name: string;
  email?: string;
}

export const useManagerSearch = (query: string) => {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query.length < 2) {
      setManagers([]);
      return;
    }

    const searchManagers = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Searching for managers with query:', query);
        
        const { data, error } = await supabase
          .from('survey_responses')
          .select('id, user_name, user_email')
          .ilike('user_name', `%${query}%`)
          .not('user_name', 'is', null)
          .limit(10);

        if (error) {
          console.error('Search error:', error);
          throw error;
        }

        console.log('Search results:', data);

        const managersData = data?.map(item => ({
          id: item.id,
          name: item.user_name || 'Unknown',
          email: item.user_email || undefined
        })) || [];

        setManagers(managersData);
      } catch (err) {
        console.error('Error searching managers:', err);
        setError('Failed to search managers');
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchManagers, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  return { managers, isLoading, error };
};
