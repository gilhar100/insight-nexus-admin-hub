
import { calculateWocaScores, determineWocaZone, calculateGroupZone } from '@/utils/wocaScoring';
import { WorkshopParticipant, WorkshopData } from '@/types/workshop';

export const processWorkshopParticipants = (rawData: any[]): WorkshopParticipant[] => {
  console.log('🔄 Processing workshop participants from q1-q36 data:', {
    totalResponses: rawData.length,
    responseIds: rawData.map(r => r.id),
    responseNames: rawData.map(r => r.full_name || r.email)
  });
  
  // Log the data structure for debugging
  if (rawData.length > 0) {
    console.log('📝 Sample response data structure:', {
      id: rawData[0].id,
      full_name: rawData[0].full_name,
      email: rawData[0].email,
      survey_type: rawData[0].survey_type,
      group_id: rawData[0].group_id,
      sampleQuestions: {
        q1: rawData[0].q1,
        q2: rawData[0].q2,
        q3: rawData[0].q3,
        q35: rawData[0].q35,
        q36: rawData[0].q36
      },
      allQuestionsPreview: Array.from({ length: 36 }, (_, i) => {
        const key = `q${i + 1}`;
        return { [key]: rawData[0][key] };
      }).slice(0, 10)
    });
  }

  const participants: WorkshopParticipant[] = rawData?.map((item, index) => {
    console.log(`👤 Processing participant ${index + 1}:`, {
      name: item.full_name || item.email || `ID: ${item.id}`,
      group_id: item.group_id,
      email: item.email,
      id: item.id
    });
    
    // Calculate WOCA scores from q1-q36 question responses
    const wocaScores = calculateWocaScores(item);
    console.log(`📊 Calculated WOCA scores for ${item.full_name || item.email}:`, wocaScores);
    
    const zoneResult = determineWocaZone(wocaScores);
    console.log(`🎯 Zone determination for ${item.full_name || item.email}:`, {
      zone: zoneResult.zone,
      color: zoneResult.color,
      scores: wocaScores
    });

    const participant = {
      id: item.id,
      full_name: item.full_name || 'משתתף אנונימי',
      email: item.email || `participant_${item.id}@unknown.com`,
      overall_score: item.overall_score,
      woca_scores: wocaScores,
      woca_zone: zoneResult.zone,
      woca_zone_color: zoneResult.color,
      organization: item.organization,
      profession: item.profession,
      age: item.age,
      gender: item.gender,
      education: item.education,
      experience_years: item.experience_years,
      created_at: item.created_at,
      workshop_id: item.workshop_id || parseInt(item.group_id || '0')
    };

    console.log(`✅ Created participant object:`, {
      id: participant.id,
      name: participant.full_name,
      email: participant.email,
      hasValidScores: Object.values(participant.woca_scores).some(score => score > 0),
      zone: participant.woca_zone
    });

    return participant;
  }) || [];

  console.log('🔍 All processed participants before deduplication:', participants.map(p => ({
    id: p.id,
    name: p.full_name,
    email: p.email,
    hasValidScores: Object.values(p.woca_scores).some(score => score > 0)
  })));

  // Remove duplicates based on email to avoid counting same person multiple times
  const uniqueParticipants = participants.filter((participant, index, self) =>
    index === self.findIndex(p => p.email === participant.email)
  );

  console.log('🎯 Final unique participants after deduplication:', {
    originalCount: participants.length,
    uniqueCount: uniqueParticipants.length,
    removedDuplicates: participants.length - uniqueParticipants.length,
    participants: uniqueParticipants.map(p => ({
      id: p.id,
      name: p.full_name,
      email: p.email,
      scores: p.woca_scores,
      zone: p.woca_zone
    }))
  });
  
  return uniqueParticipants;
};

export const calculateWorkshopMetrics = (participants: WorkshopParticipant[], workshopId: number): WorkshopData => {
  console.log('📊 Calculating workshop metrics for GROUP', workshopId, 'with', participants.length, 'unique participants');
  
  // Verify we have valid participants with scores
  const participantsWithScores = participants.filter(p => {
    const hasValidScores = p.woca_scores && 
      (p.woca_scores.war > 0 || p.woca_scores.opportunity > 0 || p.woca_scores.comfort > 0 || p.woca_scores.apathy > 0);
    
    console.log(`📈 Participant ${p.full_name} scores check:`, {
      scores: p.woca_scores,
      hasValidScores,
      totalScore: p.woca_scores ? Object.values(p.woca_scores).reduce((sum, val) => sum + val, 0) : 0
    });
    
    return hasValidScores;
  });
  
  console.log('📈 Participants validation summary:', {
    totalParticipants: participants.length,
    participantsWithValidScores: participantsWithScores.length,
    minimumRequired: 3,
    canProceedWithGroupAnalysis: participantsWithScores.length >= 3,
    participantDetails: participantsWithScores.map(p => ({
      name: p.full_name,
      scores: p.woca_scores,
      zone: p.woca_zone
    }))
  });
  
  if (participantsWithScores.length === 0) {
    console.warn('⚠️ No participants with valid WOCA scores found');
  }
  
  // Calculate zone distribution across ALL participants with scores
  const zoneDistribution: Record<string, number> = {};
  participantsWithScores.forEach(participant => {
    const zone = participant.woca_zone;
    zoneDistribution[zone] = (zoneDistribution[zone] || 0) + 1;
    console.log(`📈 Zone count update: ${zone} = ${zoneDistribution[zone]} (participant: ${participant.full_name})`);
  });

  console.log('📊 Final group zone distribution:', zoneDistribution);

  // Calculate group zone using ALL participants with scores
  const groupZoneResult = calculateGroupZone(participantsWithScores);

  console.log('🏆 Workshop group zone result:', {
    zone: groupZoneResult.zone,
    basedOnParticipants: participantsWithScores.length,
    details: groupZoneResult
  });

  // Calculate average score across all participants (fallback for existing functionality)
  const validScores = participants
    .map(p => p.overall_score)
    .filter(score => score !== null) as number[];
  
  const average_score = validScores.length > 0 
    ? validScores.reduce((sum, score) => sum + score, 0) / validScores.length
    : 0;

  // Calculate group average WOCA scores
  const groupWocaAverages = {
    war: participantsWithScores.reduce((sum, p) => sum + (p.woca_scores?.war || 0), 0) / Math.max(participantsWithScores.length, 1),
    opportunity: participantsWithScores.reduce((sum, p) => sum + (p.woca_scores?.opportunity || 0), 0) / Math.max(participantsWithScores.length, 1),
    comfort: participantsWithScores.reduce((sum, p) => sum + (p.woca_scores?.comfort || 0), 0) / Math.max(participantsWithScores.length, 1),
    apathy: participantsWithScores.reduce((sum, p) => sum + (p.woca_scores?.apathy || 0), 0) / Math.max(participantsWithScores.length, 1)
  };

  console.log('📈 Group WOCA averages calculated:', {
    basedOnParticipants: participantsWithScores.length,
    averages: groupWocaAverages,
    participantContributions: participantsWithScores.map(p => ({
      name: p.full_name,
      scores: p.woca_scores
    }))
  });

  const result = {
    workshop_id: workshopId,
    participants: participants, // Keep all participants
    participant_count: participants.length,
    average_score,
    zone_distribution: zoneDistribution,
    dominant_zone: groupZoneResult.zone,
    dominant_zone_color: groupZoneResult.color,
    group_zone_result: groupZoneResult,
    group_woca_averages: groupWocaAverages
  };

  console.log('🎯 Final workshop data for group', workshopId, ':', {
    total_participants: result.participant_count,
    participants_with_scores: participantsWithScores.length,
    dominant_zone: result.dominant_zone,
    zone_distribution: result.zone_distribution,
    group_averages: result.group_woca_averages,
    meetsMinimumThreshold: result.participant_count >= 3
  });
  
  return result;
};
