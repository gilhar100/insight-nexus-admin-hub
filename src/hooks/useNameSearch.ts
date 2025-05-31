
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface NameSearchResult {
  id: string;
  name: string;
  email?: string;
  source: 'survey' | 'colleague';
}

export const useNameSearch = (query: string) => {
  const [names, setNames] = useState<NameSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNames = async () => {
      if (query.length < 2) {
        setNames([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const allResults: NameSearchResult[] = [];

        // Search survey_responses table only (SALIMA data)
        console.log('Fetching from survey_responses...');
        const { data: surveyData, error: surveyError } = await supabase
          .from('survey_responses')
          .select('id, user_name, user_email')
          .or(`user_name.ilike.%${query}%,user_email.ilike.%${query}%`)
          .limit(10);

        if (surveyError) {
          console.error('Survey fetch error:', surveyError);
        } else if (surveyData) {
          surveyData.forEach(item => {
            if (item.user_name) {
              allResults.push({
                id: item.id,
                name: item.user_name,
                email: item.user_email || undefined,
                source: 'survey'
              });
            }
          });
        }

        // Search colleague_survey_responses table
        console.log('Fetching from colleague_survey_responses...');
        const { data: colleagueData, error: colleagueError } = await supabase
          .from('colleague_survey_responses')
          .select('id, manager_name, evaluator_name, evaluator_email')
          .or(`manager_name.ilike.%${query}%,evaluator_name.ilike.%${query}%,evaluator_email.ilike.%${query}%`)
          .limit(10);

        if (colleagueError) {
          console.error('Colleague fetch error:', colleagueError);
        } else if (colleagueData) {
          colleagueData.forEach(item => {
            if (item.manager_name) {
              allResults.push({
                id: item.id,
                name: item.manager_name,
                email: undefined,
                source: 'colleague'
              });
            }
            if (item.evaluator_name && item.evaluator_name !== item.manager_name) {
              allResults.push({
                id: `${item.id}-evaluator`,
                name: item.evaluator_name,
                email: item.evaluator_email || undefined,
                source: 'colleague'
              });
            }
          });
        }

        // Remove duplicates and sort
        const uniqueResults = allResults.filter((item, index, self) => 
          index === self.findIndex(t => t.name === item.name && t.email === item.email)
        );

        setNames(uniqueResults.slice(0, 20));
        console.log('Fetched names:', uniqueResults);
        
      } catch (err) {
        console.error('Error fetching names:', err);
        setError('Failed to fetch names');
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchNames, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return { names, isLoading, error };
};
