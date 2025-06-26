
import { useState, useEffect } from 'react';

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
        
        const response = await fetch("https://lhmrghebdtcbhmgtbqfe.supabase.co/functions/v1/analyze_woca", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            participants,
            workshopId: workshopId || 1
          })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
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
