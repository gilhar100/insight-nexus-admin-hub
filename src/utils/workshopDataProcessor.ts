
import { calculateWocaScoresFromDatabase, determineWocaZone, calculateGroupZone } from '@/utils/wocaScoring';
import { WorkshopParticipant, WorkshopData } from '@/types/workshop';

export const processWorkshopParticipants = (rawData: any[]): WorkshopParticipant[] => {
  console.log('🔄 Processing workshop participants:', rawData.length, 'total responses');
  
  // Log the first response to check data structure
  if (rawData.length > 0) {
    console.log('📝 Sample participant data structure:', {
      id: rawData[0].id,
      full_name: rawData[0].full_name,
      email: rawData[0].email,
      survey_type: rawData[0].survey_type,
      group_id: rawData[0].group_id,
      hasPreCalculatedScores: !!(rawData[0].war_score || rawData[0].opportunity_score || rawData[0].comfort_score || rawData[0].apathy_score),
      hasQuestionColumns: !!(rawData[0].q1 || rawData[0].q2 || rawData[0].q3)
    });
  }

  const participants: WorkshopParticipant[] = rawData?.map((item, index) => {
    console.log(`👤 Processing participant ${index + 1}:`, item.full_name || item.email || `ID: ${item.id}`);
    
    // Calculate WOCA scores using the method that handles both database columns and question responses
    const wocaScores = calculateWocaScoresFromDatabase(item);
    const zoneResult = determineWocaZone(wocaScores);

    console.log(`✅ Participant ${item.full_name || item.email || item.id} - Zone: ${zoneResult.zone}, Scores:`, wocaScores);

    return {
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
  }) || [];

  // Remove duplicates based on email to avoid counting same person multiple times
  const uniqueParticipants = participants.filter((participant, index, self) =>
    index === self.findIndex(p => p.email === participant.email)
  );

  console.log('🎯 Processed unique participants for group analysis:', uniqueParticipants.length, 'from', rawData.length, 'total responses');
  return uniqueParticipants;
};

export const calculateWorkshopMetrics = (participants: WorkshopParticipant[], workshopId: number): WorkshopData => {
  console.log('📊 Calculating workshop metrics for GROUP', workshopId, 'with', participants.length, 'unique participants');
  
  // Calculate zone distribution across ALL participants
  const zoneDistribution: Record<string, number> = {};
  participants.forEach(participant => {
    const zone = participant.woca_zone;
    zoneDistribution[zone] = (zoneDistribution[zone] || 0) + 1;
    console.log(`📈 Zone count update: ${zone} = ${zoneDistribution[zone]}`);
  });

  console.log('📊 Final group zone distribution:', zoneDistribution);

  // Calculate group zone using ALL participants
  const groupZoneResult = calculateGroupZone(participants);

  console.log('🏆 Workshop group zone result:', groupZoneResult.zone, 'based on', participants.length, 'participants');

  // Calculate average score across all participants (fallback for existing functionality)
  const validScores = participants
    .map(p => p.overall_score)
    .filter(score => score !== null) as number[];
  
  const average_score = validScores.length > 0 
    ? validScores.reduce((sum, score) => sum + score, 0) / validScores.length
    : 0;

  // Calculate group average WOCA scores for additional insights
  const groupWocaAverages = {
    war: participants.reduce((sum, p) => sum + (p.woca_scores?.war || 0), 0) / participants.length,
    opportunity: participants.reduce((sum, p) => sum + (p.woca_scores?.opportunity || 0), 0) / participants.length,
    comfort: participants.reduce((sum, p) => sum + (p.woca_scores?.comfort || 0), 0) / participants.length,
    apathy: participants.reduce((sum, p) => sum + (p.woca_scores?.apathy || 0), 0) / participants.length
  };

  console.log('📈 Group WOCA averages:', groupWocaAverages);

  const result = {
    workshop_id: workshopId,
    participants,
    participant_count: participants.length,
    average_score,
    zone_distribution: zoneDistribution,
    dominant_zone: groupZoneResult.zone,
    dominant_zone_color: groupZoneResult.color,
    group_zone_result: groupZoneResult,
    group_woca_averages: groupWocaAverages // Add this for additional group insights
  };

  console.log('🎯 Final workshop data for group', workshopId, ':', {
    participant_count: result.participant_count,
    dominant_zone: result.dominant_zone,
    zone_distribution: result.zone_distribution
  });
  
  return result;
};
