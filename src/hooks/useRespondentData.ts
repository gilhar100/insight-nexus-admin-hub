
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface RespondentData {
  id: string;
  name: string;
  email?: string;
  source: 'survey' | 'colleague' | 'woca';
  dimensions: {
    strategy: number;
    adaptability: number;
    learning: number;
    inspiration: number;
    meaning: number;
    authenticity: number;
  };
  overallScore: number;
  rawData: any;
}

export const useRespondentData = () => {
  const [data, setData] = useState<RespondentData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRespondentData = async (respondentId: string, source: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let respondentData: RespondentData | null = null;

      if (source === 'survey') {
        const { data: surveyData, error: surveyError } = await supabase
          .from('survey_responses')
          .select('*')
          .eq('id', respondentId)
          .single();

        if (surveyError) throw surveyError;
        
        if (surveyData) {
          respondentData = {
            id: surveyData.id,
            name: surveyData.user_name || 'Unknown',
            email: surveyData.user_email || undefined,
            source: 'survey',
            dimensions: {
              strategy: surveyData.dimension_s || surveyData.strategy || 0,
              adaptability: surveyData.dimension_a2 || 0,
              learning: surveyData.dimension_l || 0,
              inspiration: surveyData.dimension_i || 0,
              meaning: surveyData.dimension_m || 0,
              authenticity: surveyData.dimension_a || 0,
            },
            overallScore: surveyData.slq_score || 0,
            rawData: surveyData
          };
        }
      } else if (source === 'colleague') {
        const { data: colleagueData, error: colleagueError } = await supabase
          .from('colleague_survey_responses')
          .select('*')
          .eq('id', respondentId.replace('-evaluator', ''))
          .single();

        if (colleagueError) throw colleagueError;
        
        if (colleagueData) {
          const isEvaluator = respondentId.includes('-evaluator');
          respondentData = {
            id: respondentId,
            name: isEvaluator ? (colleagueData.evaluator_name || 'Unknown') : colleagueData.manager_name,
            email: isEvaluator ? colleagueData.evaluator_email : undefined,
            source: 'colleague',
            dimensions: {
              strategy: colleagueData.dimension_s || 0,
              adaptability: colleagueData.dimension_a2 || 0,
              learning: colleagueData.dimension_l || 0,
              inspiration: colleagueData.dimension_i || 0,
              meaning: colleagueData.dimension_m || 0,
              authenticity: colleagueData.dimension_a || 0,
            },
            overallScore: colleagueData.slq_score || 0,
            rawData: colleagueData
          };
        }
      }

      setData(respondentData);
    } catch (err) {
      console.error('Error fetching respondent data:', err);
      setError('Failed to fetch respondent data');
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, fetchRespondentData };
};
