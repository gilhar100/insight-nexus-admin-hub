import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface NameOption {
  id: string;
  name: string;
  email?: string;
  source: 'survey' | 'colleague';
  groupNumber?: number;
}

export const useNameSearch = (query: string) => {
  const [names, setNames] = useState<NameOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setNames([]);
      return;
    }

    const searchNames = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log('🔍 Searching for:', query);

        const isNumeric = /^\d+$/.test(query.trim());

        const [surveyResult, colleagueResult] = await Promise.all([
          isNumeric
            ? supabase
                .from('survey_responses')
                .select('id, user_name, user_email, group_number')
                .eq('group_number', parseInt(query.trim()))
                .limit(10)
            : supabase
                .from('survey_responses')
                .select('id, user_name, user_email, group_number')
                .or(`user_name.ilike.%${query}%,user_email.ilike.%${query}%`)
                .limit(10),
          isNumeric
            ? supabase
                .from('colleague_survey_responses')
                .select('id, manager_name, evaluator_name, evaluator_email, group_id')
                .eq('group_id', parseInt(query.trim()))
                .limit(10)
            : supabase
                .from('colleague_survey_responses')
                .select('id, manager_name, evaluator_name, evaluator_email, group_id')
                .or(`manager_name.ilike.%${query}%,evaluator_name.ilike.%${query}%,evaluator_email.ilike.%${query}%`)
                .limit(10)
        ]);

        if (surveyResult.error) throw surveyResult.error;
        if (colleagueResult.error) throw colleagueResult.error;

        const surveyNames: NameOption[] = (surveyResult.data || []).map(item => ({
          id: item.id,
          name: item.user_name || 'לא ידוע',
          email: item.user_email || undefined,
          source: 'survey',
          groupNumber: item.group_number || undefined
        }));

        const colleagueNames: NameOption[] = (colleagueResult.data || []).map(item => ({
          id: item.id,
          name: item.manager_name || 'לא ידוע',
          email: item.evaluator_email || undefined,
          source: 'colleague',
          groupNumber: item.group_id || undefined
        }));

        setNames([...surveyNames, ...colleagueNames]);
      } catch (err: any) {
        console.error('❌ Name search failed:', err);
        setError('חיפוש נכשל. ודא שיש לך הרשאות מתאימות.');
        setNames([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(searchNames, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return { names, isLoading, error };
};