
import { WorkshopParticipant } from '@/types/workshopTypes';

// Helper function to convert individual question columns to question_responses object
export const convertToQuestionResponses = (participant: any): any => {
  const questionResponses: any = {};
  for (let i = 1; i <= 36; i++) {
    const qKey = `q${i}`;
    if (participant[qKey] !== null && participant[qKey] !== undefined) {
      questionResponses[qKey] = participant[qKey];
    }
  }
  return questionResponses;
};

// Transform database participant data to WorkshopParticipant
export const transformParticipantData = (item: any): WorkshopParticipant => {
  // Convert individual question columns to question_responses format
  const questionResponses = convertToQuestionResponses(item);
  
  return {
    id: item.id,
    full_name: item.full_name,
    email: item.email,
    overall_score: item.overall_score,
    analyzed_score: item.analyzed_score || null,
    question_responses: questionResponses,
    organization: item.organization,
    profession: item.profession,
    age: item.age,
    gender: item.gender,
    education: item.education,
    experience_years: item.experience_years,
    created_at: item.created_at,
    // Include individual question fields
    q1: item.q1,
    q2: item.q2,
    q3: item.q3,
    q4: item.q4,
    q5: item.q5,
    q6: item.q6,
    q7: item.q7,
    q8: item.q8,
    q9: item.q9,
    q10: item.q10,
    q11: item.q11,
    q12: item.q12,
    q13: item.q13,
    q14: item.q14,
    q15: item.q15,
    q16: item.q16,
    q17: item.q17,
    q18: item.q18,
    q19: item.q19,
    q20: item.q20,
    q21: item.q21,
    q22: item.q22,
    q23: item.q23,
    q24: item.q24,
    q25: item.q25,
    q26: item.q26,
    q27: item.q27,
    q28: item.q28,
    q29: item.q29,
    q30: item.q30,
    q31: item.q31,
    q32: item.q32,
    q33: item.q33,
    q34: item.q34,
    q35: item.q35,
    q36: item.q36
  };
};
