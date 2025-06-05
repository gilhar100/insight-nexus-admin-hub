
import { calculateWocaScores, determineWocaZone } from '@/utils/wocaScoring';
import { WorkshopParticipant, WorkshopData } from '@/types/workshop';

export const processWorkshopParticipants = (rawData: any[]): WorkshopParticipant[] => {
  // Log the first response to check question_responses field
  if (rawData.length > 0) {
    console.log('Sample question_responses:', rawData[0].question_responses);
  }

  const participants: WorkshopParticipant[] = rawData?.map(item => {
    // Calculate WOCA scores using the method from wocaScoring.ts
    const wocaScores = calculateWocaScores(item.question_responses);
    const zoneResult = determineWocaZone(wocaScores);

    return {
      id: item.id,
      full_name: item.full_name,
      email: item.email,
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
  return participants.filter((participant, index, self) =>
    index === self.findIndex(p => p.email === participant.email)
  );
};

export const calculateWorkshopMetrics = (participants: WorkshopParticipant[], workshopId: number): WorkshopData => {
  // Calculate zone distribution
  const zoneDistribution: Record<string, number> = {};
  participants.forEach(participant => {
    const zone = participant.woca_zone;
    zoneDistribution[zone] = (zoneDistribution[zone] || 0) + 1;
  });

  // Find dominant zone
  const dominantZoneEntry = Object.entries(zoneDistribution)
    .reduce((max, current) => current[1] > max[1] ? current : max, ['', 0]);
  
  const dominantZone = dominantZoneEntry[0] || 'לא זמין';
  const dominantZoneColor = participants.find(p => p.woca_zone === dominantZone)?.woca_zone_color || '#666666';

  // Calculate average score (fallback for existing functionality)
  const validScores = participants
    .map(p => p.overall_score)
    .filter(score => score !== null) as number[];
  
  const average_score = validScores.length > 0 
    ? validScores.reduce((sum, score) => sum + score, 0) / validScores.length
    : 0;

  return {
    workshop_id: workshopId,
    participants,
    participant_count: participants.length,
    average_score,
    zone_distribution: zoneDistribution,
    dominant_zone: dominantZone,
    dominant_zone_color: dominantZoneColor
  };
};
