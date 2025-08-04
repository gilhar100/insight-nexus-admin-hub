
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type DataSourceType = 'self' | 'colleague' | 'combined';

export interface EnhancedRespondentData {
  id: string;
  name: string;
  email?: string;
  groupNumber?: number;
  selfReport: {
    strategy: number;
    adaptability: number;
    learning: number;
    inspiration: number;
    meaning: number;
    authenticity: number;
    overall: number;
  };
  colleagueReport?: {
    strategy: number;
    adaptability: number;
    learning: number;
    inspiration: number;
    meaning: number;
    authenticity: number;
    overall: number;
    responseCount: number;
  };
  combinedReport?: {
    strategy: number;
    adaptability: number;
    learning: number;
    inspiration: number;
    meaning: number;
    authenticity: number;
    overall: number;
  };
  rawData: any;
}

export const useEnhancedRespondentData = () => {
  const [data, setData] = useState<EnhancedRespondentData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearData = () => {
    setData(null);
    setError(null);
  };

  const fetchEnhancedRespondentData = async (respondentId: string, source: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (source !== 'survey') {
        throw new Error('Enhanced data only supports survey source');
      }

      // Fetch self-report data
      const { data: surveyData, error: surveyError } = await supabase
        .from('survey_responses')
        .select('*')
        .eq('id', respondentId)
        .single();

      if (surveyError) throw surveyError;
      
      if (!surveyData) {
        throw new Error('No survey data found');
      }

      const selfReport = {
        strategy: surveyData.dimension_s || 0,
        adaptability: surveyData.dimension_a || 0,  // dimension_a is adaptability
        learning: surveyData.dimension_l || 0,
        inspiration: surveyData.dimension_i || 0,
        meaning: surveyData.dimension_m || 0,
        authenticity: surveyData.dimension_a2 || 0,  // dimension_a2 is authenticity
        overall: surveyData.slq_score || 0,
      };

      let colleagueReport = undefined;
      let combinedReport = undefined;

      // Fetch colleague data using group_number from survey_responses matched against group_id in colleague_survey_responses
      if (surveyData.group_number) {
        const { data: colleagueData, error: colleagueError } = await supabase
          .from('colleague_survey_responses')
          .select('*')
          .eq('group_id', surveyData.group_number);

        if (!colleagueError && colleagueData && colleagueData.length > 0) {
          // First: Calculate colleague averages across all colleague responses
          const colleagueAverages = {
            strategy: colleagueData.reduce((sum, r) => sum + (r.dimension_s || 0), 0) / colleagueData.length,
            adaptability: colleagueData.reduce((sum, r) => sum + (r.dimension_a || 0), 0) / colleagueData.length,  // dimension_a is adaptability
            learning: colleagueData.reduce((sum, r) => sum + (r.dimension_l || 0), 0) / colleagueData.length,
            inspiration: colleagueData.reduce((sum, r) => sum + (r.dimension_i || 0), 0) / colleagueData.length,
            meaning: colleagueData.reduce((sum, r) => sum + (r.dimension_m || 0), 0) / colleagueData.length,
            authenticity: colleagueData.reduce((sum, r) => sum + (r.dimension_a2 || 0), 0) / colleagueData.length,  // dimension_a2 is authenticity
            overall: colleagueData.reduce((sum, r) => sum + (r.slq_score || 0), 0) / colleagueData.length,
            responseCount: colleagueData.length
          };

          colleagueReport = colleagueAverages;

          // Second: Calculate combined report as average between self-report and colleague averages
          combinedReport = {
            strategy: (selfReport.strategy + colleagueAverages.strategy) / 2,
            adaptability: (selfReport.adaptability + colleagueAverages.adaptability) / 2,
            learning: (selfReport.learning + colleagueAverages.learning) / 2,
            inspiration: (selfReport.inspiration + colleagueAverages.inspiration) / 2,
            meaning: (selfReport.meaning + colleagueAverages.meaning) / 2,
            authenticity: (selfReport.authenticity + colleagueAverages.authenticity) / 2,
            overall: (selfReport.overall + colleagueAverages.overall) / 2,
          };
        }
      }

      const enhancedData: EnhancedRespondentData = {
        id: surveyData.id,
        name: surveyData.user_name || 'Unknown',
        email: surveyData.user_email || undefined,
        groupNumber: surveyData.group_number || undefined,
        selfReport,
        colleagueReport,
        combinedReport,
        rawData: surveyData
      };

      setData(enhancedData);
    } catch (err) {
      console.error('Error fetching enhanced respondent data:', err);
      setError('Failed to fetch enhanced respondent data');
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, fetchEnhancedRespondentData, clearData };
};
