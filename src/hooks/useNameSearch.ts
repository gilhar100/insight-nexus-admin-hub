
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface NameOption {
  id: string;
  name: string;
  email?: string;
  source: string;
  groupNumber?: number;
}

export const useNameSearch = (query: string) => {
  const [names, setNames] = useState<NameOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query.length < 2) {
      setNames([]);
      return;
    }

    const searchNames = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Searching for names with query:', query);
        
        // Check if query is numeric (could be group_number)
        const isNumeric = /^\d+$/.test(query.trim());
        
        // Search in survey_responses table
        let surveyQuery = supabase
          .from('survey_responses')
          .select('id, user_name, user_email, group_number')
          .limit(10);

        if (isNumeric) {
          // Search by group_number if query is numeric
          surveyQuery = surveyQuery.eq('group_number', parseInt(query.trim()));
        } else {
          // Search by name and email
          surveyQuery = surveyQuery.or(`user_name.ilike.%${query}%,user_email.ilike.%${query}%`);
        }

        // Search in colleague_survey_responses table
        let colleagueQuery = supabase
          .from('colleague_survey_responses')
          .select('id, manager_name, evaluator_name, evaluator_email, group_id')
          .limit(10);

        if (isNumeric) {
          // Search by group_id if query is numeric
          colleagueQuery = colleagueQuery.eq('group_id', parseInt(query.trim()));
        } else {
          // Search by names and email
          colleagueQuery = colleagueQuery.or(`manager_name.ilike.%${query}%,evaluator_name.ilike.%${query}%,evaluator_email.ilike.%${query}%`);
        }

        const [surveyResult, colleagueResult] = await Promise.all([
          surveyQuery,
          colleagueQuery
        ]);

        if (surveyResult.error) {
          console.error('Survey search error:', surveyResult.error);
          throw surveyResult.error;
        }

        if (colleagueResult.error) {
          console.error('Colleague search error:', colleagueResult.error);
          throw colleagueResult.error;
        }

        console.log('Survey results:', surveyResult.data);
        console.log('Colleague results:', colleagueResult.data);

        const surveyNames: NameOption[] = surveyResult.data?.map(item => ({
          id: item.id,
          name: item.user_name || 'Unknown',
          email: item.user_email || undefined,
          source: 'survey',
          groupNumber: item.group_number || undefined
        })) || [];

        const colleagueNames: NameOption[] = colleagueResult.data?.map(item => ({
          id: item.id,
          name: item.manager_name || 'Unknown',
          email: item.evaluator_email || undefined,
          source: 'colleague',
          groupNumber: item.group_id || undefined
        })) || [];

        const allNames = [...surveyNames, ...colleagueNames];
        setNames(allNames);
      } catch (err) {
        console.error('Error searching names:', err);
        setError('Failed to search names');
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchNames, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  return { names, isLoading, error };
};
