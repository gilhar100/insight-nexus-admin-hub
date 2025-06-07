
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ColleagueComparisonData {
  managerId: string;
  managerName: string;
  selfReport: {
    strategy: number;
    adaptability: number;
    learning: number;
    inspiration: number;
    meaning: number;
    authenticity: number;
  };
  colleagueResponses: Array<{
    id: string;
    evaluatorName?: string;
    strategy: number;
    adaptability: number;
    learning: number;
    inspiration: number;
    meaning: number;
    authenticity: number;
  }>;
  colleagueAverages: {
    strategy: number;
    adaptability: number;
    learning: number;
    inspiration: number;
    meaning: number;
    authenticity: number;
  };
  trueScores: {
    strategy: number;
    adaptability: number;
    learning: number;
    inspiration: number;
    meaning: number;
    authenticity: number;
  };
}

export const useColleagueComparisonData = () => {
  const [data, setData] = useState<ColleagueComparisonData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComparisonData = async (managerId: string, managerName: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch manager's self-report
      const { data: selfData, error: selfError } = await supabase
        .from('survey_responses')
        .select('*')
        .eq('id', managerId)
        .single();

      if (selfError) throw selfError;

      // Fetch colleague evaluations for this manager
      const { data: colleagueData, error: colleagueError } = await supabase
        .from('colleague_survey_responses')
        .select('*')
        .eq('manager_name', managerName);

      if (colleagueError) throw colleagueError;

      if (!selfData) {
        throw new Error('Manager data not found');
      }

      const selfReport = {
        strategy: selfData.dimension_s || 0,
        adaptability: selfData.dimension_a2 || 0,
        learning: selfData.dimension_l || 0,
        inspiration: selfData.dimension_i || 0,
        meaning: selfData.dimension_m || 0,
        authenticity: selfData.dimension_a || 0,
      };

      const colleagueResponses = colleagueData?.map(item => ({
        id: item.id,
        evaluatorName: item.evaluator_name || undefined,
        strategy: item.dimension_s || 0,
        adaptability: item.dimension_a2 || 0,
        learning: item.dimension_l || 0,
        inspiration: item.dimension_i || 0,
        meaning: item.dimension_m || 0,
        authenticity: item.dimension_a || 0,
      })) || [];

      // Calculate colleague averages
      const colleagueAverages = {
        strategy: 0,
        adaptability: 0,
        learning: 0,
        inspiration: 0,
        meaning: 0,
        authenticity: 0,
      };

      if (colleagueResponses.length > 0) {
        colleagueAverages.strategy = colleagueResponses.reduce((sum, r) => sum + r.strategy, 0) / colleagueResponses.length;
        colleagueAverages.adaptability = colleagueResponses.reduce((sum, r) => sum + r.adaptability, 0) / colleagueResponses.length;
        colleagueAverages.learning = colleagueResponses.reduce((sum, r) => sum + r.learning, 0) / colleagueResponses.length;
        colleagueAverages.inspiration = colleagueResponses.reduce((sum, r) => sum + r.inspiration, 0) / colleagueResponses.length;
        colleagueAverages.meaning = colleagueResponses.reduce((sum, r) => sum + r.meaning, 0) / colleagueResponses.length;
        colleagueAverages.authenticity = colleagueResponses.reduce((sum, r) => sum + r.authenticity, 0) / colleagueResponses.length;
      }

      // Calculate True Scores (Colleague Avg - Self Report)
      const trueScores = {
        strategy: colleagueAverages.strategy - selfReport.strategy,
        adaptability: colleagueAverages.adaptability - selfReport.adaptability,
        learning: colleagueAverages.learning - selfReport.learning,
        inspiration: colleagueAverages.inspiration - selfReport.inspiration,
        meaning: colleagueAverages.meaning - selfReport.meaning,
        authenticity: colleagueAverages.authenticity - selfReport.authenticity,
      };

      const comparisonData: ColleagueComparisonData = {
        managerId,
        managerName,
        selfReport,
        colleagueResponses,
        colleagueAverages,
        trueScores
      };

      setData(comparisonData);
    } catch (err) {
      console.error('Error fetching comparison data:', err);
      setError('שגיאה בטעינת נתוני השוואה');
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, fetchComparisonData };
};
