
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Manager {
  id: string;
  name: string;
  email?: string;
  groupNumber?: number;
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
        
        // Check if query is numeric (could be group_number)
        const isNumeric = /^\d+$/.test(query.trim());
        
        let supabaseQuery = supabase
          .from('survey_responses')
          .select('id, user_name, user_email, group_number')
          .not('user_name', 'is', null)
          .limit(10);

        if (isNumeric) {
          // Search by group_number if query is numeric
          supabaseQuery = supabaseQuery.eq('group_number', parseInt(query.trim()));
        } else {
          // Search by name and email using OR condition
          supabaseQuery = supabaseQuery.or(`user_name.ilike.%${query}%,user_email.ilike.%${query}%`);
        }

        const { data, error } = await supabaseQuery;

        if (error) {
          console.error('Search error:', error);
          throw error;
        }

        console.log('Search results:', data);

        const managersData = data?.map(item => ({
          id: item.id,
          name: item.user_name || 'Unknown',
          email: item.user_email || undefined,
          groupNumber: item.group_number || undefined
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
