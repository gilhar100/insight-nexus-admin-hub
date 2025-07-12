
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface GroupData {
  group_number: number;
  participant_count: number;
  averages: {
    strategy: number;
    learning: number;
    inspiration: number;
    meaning: number;
    authenticity: number;
    adaptability: number;
    overall: number;
  };
  participants: Array<{
    dimension_s: number;
    dimension_l: number;
    dimension_i: number;
    dimension_m: number;
    dimension_a: number;
    dimension_a2: number;
    dominant_archetype?: string;
  }>;
}

export const useGroupData = (groupNumber: number) => {
  const [data, setData] = useState<GroupData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroupData = async () => {
      if (!groupNumber) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Fetching data for group number:', groupNumber);
        
        // First, let's test if we can fetch archetype data directly
        const { data: archetypeTest, error: archetypeError } = await supabase
          .from('survey_responses')
          .select('dominant_archetype')
          .eq('group_number', groupNumber)
          .eq('survey_type', 'manager');
          
        console.log('Archetype test query result:', archetypeTest);
        console.log('Archetype test error:', archetypeError);
        
        // Fetch participants data - EXPLICITLY include dominant_archetype field
        const { data: participants, error: participantsError } = await supabase
          .from('survey_responses')
          .select(`
            dimension_s, 
            dimension_l, 
            dimension_i, 
            dimension_m, 
            dimension_a, 
            dimension_a2, 
            slq_score, 
            dominant_archetype,
            archetype_1_score,
            archetype_2_score,
            archetype_3_score
          `)
          .eq('group_number', groupNumber)
          .eq('survey_type', 'manager');

        if (participantsError) {
          console.error('Participants error:', participantsError);
          throw participantsError;
        }

        console.log('Raw Supabase response:', participants);
        console.log('First participant raw:', participants?.[0]);
        console.log('Participants with archetype:', participants?.filter(p => p.dominant_archetype && p.dominant_archetype.trim() !== ''));
        console.log('Raw archetype values:', participants?.map(p => ({ 
          archetype: p.dominant_archetype, 
          type: typeof p.dominant_archetype,
          keys: Object.keys(p)
        })));
        console.log('Group number being fetched:', groupNumber, 'Type:', typeof groupNumber);

        if (!participants || participants.length === 0) {
          console.log('No participants found for group:', groupNumber);
          setData(null);
          return;
        }

        // Calculate averages for all participants (not just those with archetypes)
        const totalParticipants = participants.length;
        const sums = participants.reduce((acc, p) => ({
          strategy: acc.strategy + (p.dimension_s || 0),
          learning: acc.learning + (p.dimension_l || 0),
          inspiration: acc.inspiration + (p.dimension_i || 0),
          meaning: acc.meaning + (p.dimension_m || 0),
          authenticity: acc.authenticity + (p.dimension_a || 0),
          adaptability: acc.adaptability + (p.dimension_a2 || 0),
          overall: acc.overall + (p.slq_score || 0),
        }), {
          strategy: 0,
          learning: 0,
          inspiration: 0,
          meaning: 0,
          authenticity: 0,
          adaptability: 0,
          overall: 0,
        });

        const averages = {
          strategy: sums.strategy / totalParticipants,
          learning: sums.learning / totalParticipants,
          inspiration: sums.inspiration / totalParticipants,
          meaning: sums.meaning / totalParticipants,
          authenticity: sums.authenticity / totalParticipants,
          adaptability: sums.adaptability / totalParticipants,
          overall: sums.overall / totalParticipants,
        };

        // Map all participants, ensuring dominant_archetype is properly passed through
        const participantData = participants.map(p => ({
          dimension_s: p.dimension_s || 0,
          dimension_l: p.dimension_l || 0,
          dimension_i: p.dimension_i || 0,
          dimension_m: p.dimension_m || 0,
          dimension_a: p.dimension_a || 0,
          dimension_a2: p.dimension_a2 || 0,
          dominant_archetype: p.dominant_archetype, // Pass through exactly as received from DB
        }));

        const groupData: GroupData = {
          group_number: groupNumber,
          participant_count: totalParticipants,
          averages,
          participants: participantData,
        };

        console.log('Final group data:', groupData);
        console.log('Participants with valid archetypes in final data:', 
          groupData.participants.filter(p => p.dominant_archetype && typeof p.dominant_archetype === 'string' && p.dominant_archetype.trim() !== '' && p.dominant_archetype !== 'null').length
        );
        
        setData(groupData);
      } catch (err) {
        console.error('Error fetching group data:', err);
        setError('Failed to fetch group data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupData();
  }, [groupNumber]);

  return { data, isLoading, error };
};
