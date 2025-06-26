
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface WocaAnalysisResult {
  groupCategoryScores: {
    war: number;
    opportunity: number;
    comfort: number;
    apathy: number;
  };
  groupDominantZone: string | null;
  groupIsTie: boolean;
  groupTiedCategories: string[];
  participants: Array<{
    categoryScores: {
      war: number;
      opportunity: number;
      comfort: number;
      apathy: number;
    };
    dominantZone: string | null;
    isTie: boolean;
    tiedCategories: string[];
    participantName: string;
    participantId: string;
  }>;
  workshopId?: number;
  participantCount?: number;
}

export const useWocaAnalysis = (participants: any[], workshopId?: number) => {
  const [wocaAnalysis, setWocaAnalysis] = useState<WocaAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!participants || participants.length === 0) {
      setWocaAnalysis(null);
      return;
    }

    const analyzeWoca = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log('🔄 Calling WOCA analysis edge function...');
        
        const { data, error } = await supabase.functions.invoke('analyze_woca', {
          body: {
            participants,
            workshopId: workshopId || 1
          }
        });

        if (error) {
          console.error('❌ Edge function error:', error);
          throw error;
        }

        console.log('✅ WOCA analysis received:', data);
        setWocaAnalysis(data);
      } catch (err) {
        console.error('❌ Error calling WOCA analysis:', err);
        setError(err instanceof Error ? err.message : 'Failed to analyze WOCA data');
      } finally {
        setIsLoading(false);
      }
    };

    analyzeWoca();
  }, [participants, workshopId]);

  return { wocaAnalysis, isLoading, error };
};
