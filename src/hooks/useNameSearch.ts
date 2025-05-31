
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface NameOption {
  id: string;
  name: string;
  email: string;
  source: 'survey' | 'colleague' | 'woca';
}

export const useNameSearch = (searchQuery: string) => {
  const [names, setNames] = useState<NameOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setNames([]);
      return;
    }

    const fetchNames = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Fetching names for query:', searchQuery);
        
        // Fetch from survey_responses table
        const { data: surveyData, error: surveyError } = await supabase
          .from('survey_responses')
          .select('id, user_name, user_email')
          .not('user_name', 'is', null)
          .not('user_email', 'is', null)
          .or(`user_name.ilike.%${searchQuery}%,user_email.ilike.%${searchQuery}%`)
          .limit(10);

        if (surveyError) {
          console.error('Survey fetch error:', surveyError);
        }

        // Fetch from colleague_survey_responses table
        const { data: colleagueData, error: colleagueError } = await supabase
          .from('colleague_survey_responses')
          .select('id, manager_name, evaluator_name, evaluator_email')
          .limit(20);

        if (colleagueError) {
          console.error('Colleague fetch error:', colleagueError);
        }

        // Fetch from woca table
        const { data: wocaData, error: wocaError } = await supabase
          .from('woca')
          .select('id, full_name, email')
          .not('full_name', 'is', null)
          .not('email', 'is', null)
          .or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
          .limit(10);

        if (wocaError) {
          console.error('WOCA fetch error:', wocaError);
        }

        // Combine and format results
        const allNames: NameOption[] = [];

        // Add survey responses
        if (surveyData) {
          surveyData.forEach(item => {
            allNames.push({
              id: item.id,
              name: item.user_name || '',
              email: item.user_email || '',
              source: 'survey'
            });
          });
        }

        // Add colleague responses (managers and evaluators)
        if (colleagueData) {
          colleagueData.forEach(item => {
            if (item.manager_name && item.manager_name.toLowerCase().includes(searchQuery.toLowerCase())) {
              allNames.push({
                id: `${item.id}-manager`,
                name: item.manager_name,
                email: '',
                source: 'colleague'
              });
            }
            if (item.evaluator_name && item.evaluator_email && 
                (item.evaluator_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 item.evaluator_email.toLowerCase().includes(searchQuery.toLowerCase()))) {
              allNames.push({
                id: `${item.id}-evaluator`,
                name: item.evaluator_name,
                email: item.evaluator_email,
                source: 'colleague'
              });
            }
          });
        }

        // Add WOCA responses
        if (wocaData) {
          wocaData.forEach(item => {
            allNames.push({
              id: item.id,
              name: item.full_name || '',
              email: item.email || '',
              source: 'woca'
            });
          });
        }

        // Remove duplicates based on name and email combination
        const uniqueNames = allNames.filter((name, index, self) => 
          index === self.findIndex(n => 
            n.name.toLowerCase() === name.name.toLowerCase() && 
            n.email.toLowerCase() === name.email.toLowerCase()
          )
        );

        console.log('Fetched names:', uniqueNames);
        setNames(uniqueNames);
      } catch (err) {
        console.error('Error fetching names:', err);
        setError('Failed to fetch names');
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchNames, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  return { names, isLoading, error };
};
