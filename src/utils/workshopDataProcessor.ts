
import { calculateWocaScoresFromDatabase, determineWocaZone, calculateGroupZone } from '@/utils/wocaScoring';
import { WorkshopParticipant, WorkshopData } from '@/types/workshop';

export const processWorkshopParticipants = (rawData: any[]): WorkshopParticipant[] => {
  console.log('🔄 Processing workshop participants:', rawData.length, 'participants');
  
  // Log the first response to check data structure
  if (rawData.length > 0) {
    console.log('📝 Sample participant data structure:', {
      id: rawData[0].id,
      full_name: rawData[0].full_name,
      email: rawData[0].email,
      survey_type: rawData[0].survey_type,
      hasPreCalculatedScores: !!(rawData[0].war_score || rawData[0].opportunity_score || rawData[0].comfort_score || rawData[0].apathy_score),
      hasQuestionColumns: !!(rawData[0].q1 || rawData[0].q2 || rawData[0].q3),
      hasJsonResponses: !!rawData[0].question_responses
    });
  }

  const participants: WorkshopParticipant[] = rawData?.map((item, index) => {
    console.log(`👤 Processing participant ${index + 1}:`, item.full_name || item.email);
    
    // Calculate WOCA scores using the improved method that handles database columns
    const wocaScores = calculateWocaScoresFromDatabase(item);
    const zoneResult = determineWocaZone(wocaScores);

    console.log(`✅ Participant ${item.full_name || item.email} - Zone: ${zoneResult.zone}, Scores:`, wocaScores);

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

  // Remove duplicates based on email
  const uniqueParticipants = participants.filter((participant, index, self) =>
    index === self.findIndex(p => p.email === participant.email)
  );

  console.log('🎯 Processed unique participants:', uniqueParticipants.length);
  return uniqueParticipants;
};

export const calculateWorkshopMetrics = (participants: WorkshopParticipant[], workshopId: number): WorkshopData => {
  console.log('📊 Calculating workshop metrics for', participants.length, 'participants');
  
  // Calculate zone distribution
  const zoneDistribution: Record<string, number> = {};
  participants.forEach(participant => {
    const zone = participant.woca_zone;
    zoneDistribution[zone] = (zoneDistribution[zone] || 0) + 1;
    console.log(`📈 Zone count update: ${zone} = ${zoneDistribution[zone]}`);
  });

  console.log('📊 Final zone distribution:', zoneDistribution);

  // Calculate group zone using the new logic
  const groupZoneResult = calculateGroupZone(participants);

  console.log('🏆 Workshop group zone:', groupZoneResult.zone, 'with description:', groupZoneResult.description);

  // Calculate average score (fallback for existing functionality)
  const validScores = participants
    .map(p => p.overall_score)
    .filter(score => score !== null) as number[];
  
  const average_score = validScores.length > 0 
    ? validScores.reduce((sum, score) => sum + score, 0) / validScores.length
    : 0;

  const result = {
    workshop_id: workshopId,
    participants,
    participant_count: participants.length,
    average_score,
    zone_distribution: zoneDistribution,
    dominant_zone: groupZoneResult.zone,
    dominant_zone_color: groupZoneResult.color,
    group_zone_result: groupZoneResult
  };

  console.log('🎯 Final workshop data:', result);
  return result;
};
