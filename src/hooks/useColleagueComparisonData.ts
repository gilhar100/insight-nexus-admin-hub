
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
      console.log('Fetching data for manager:', { managerId, managerName });
      
      // Fetch manager's self-report
      const { data: selfData, error: selfError } = await supabase
        .from('survey_responses')
        .select('*')
        .eq('id', managerId)
        .single();

      if (selfError) {
        console.error('Self report error:', selfError);
        throw selfError;
      }

      console.log('Self report data:', selfData);

      // Fetch colleague evaluations for this manager
      const { data: colleagueData, error: colleagueError } = await supabase
        .from('colleague_survey_responses')
        .select('*')
        .eq('manager_name', managerName);

      if (colleagueError) {
        console.error('Colleague data error:', colleagueError);
        throw colleagueError;
      }

      console.log('Colleague data:', colleagueData);

      if (!selfData) {
        throw new Error('Manager data not found');
      }

      const selfReport = {
        strategy: Number(selfData.dimension_s) || 0,
        adaptability: Number(selfData.dimension_a2) || 0,
        learning: Number(selfData.dimension_l) || 0,
        inspiration: Number(selfData.dimension_i) || 0,
        meaning: Number(selfData.dimension_m) || 0,
        authenticity: Number(selfData.dimension_a) || 0,
      };

      console.log('Processed self report:', selfReport);

      const colleagueResponses = colleagueData?.map(item => ({
        id: item.id,
        evaluatorName: item.evaluator_name || undefined,
        strategy: Number(item.dimension_s) || 0,
        adaptability: Number(item.dimension_a2) || 0,
        learning: Number(item.dimension_l) || 0,
        inspiration: Number(item.dimension_i) || 0,
        meaning: Number(item.dimension_m) || 0,
        authenticity: Number(item.dimension_a) || 0,
      })) || [];

      console.log('Processed colleague responses:', colleagueResponses);

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

      console.log('Colleague averages:', colleagueAverages);

      // Calculate True Scores (Colleague Avg - Self Report)
      const trueScores = {
        strategy: Number((colleagueAverages.strategy - selfReport.strategy).toFixed(2)),
        adaptability: Number((colleagueAverages.adaptability - selfReport.adaptability).toFixed(2)),
        learning: Number((colleagueAverages.learning - selfReport.learning).toFixed(2)),
        inspiration: Number((colleagueAverages.inspiration - selfReport.inspiration).toFixed(2)),
        meaning: Number((colleagueAverages.meaning - selfReport.meaning).toFixed(2)),
        authenticity: Number((colleagueAverages.authenticity - selfReport.authenticity).toFixed(2)),
      };

      console.log('True scores:', trueScores);

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
