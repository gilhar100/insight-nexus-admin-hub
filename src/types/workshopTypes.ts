
export interface WorkshopParticipant {
  id: string;
  full_name: string;
  email: string;
  overall_score: number | null;
  question_responses?: any;
  organization: string | null;
  profession: string | null;
  age: string | null;
  gender: string | null;
  education: string | null;
  experience_years: number | null;
  created_at: string | null;
  // Add the individual question fields
  q1?: number | null;
  q2?: number | null;
  q3?: number | null;
  q4?: number | null;
  q5?: number | null;
  q6?: number | null;
  q7?: number | null;
  q8?: number | null;
  q9?: number | null;
  q10?: number | null;
  q11?: number | null;
  q12?: number | null;
  q13?: number | null;
  q14?: number | null;
  q15?: number | null;
  q16?: number | null;
  q17?: number | null;
  q18?: number | null;
  q19?: number | null;
  q20?: number | null;
  q21?: number | null;
  q22?: number | null;
  q23?: number | null;
  q24?: number | null;
  q25?: number | null;
  q26?: number | null;
  q27?: number | null;
  q28?: number | null;
  q29?: number | null;
  q30?: number | null;
  q31?: number | null;
  q32?: number | null;
  q33?: number | null;
  q34?: number | null;
  q35?: number | null;
  q36?: number | null;
}

export interface WorkshopData {
  workshop_id: number;
  participants: WorkshopParticipant[];
  participant_count: number;
  average_score: number;
  // Add WOCA analysis results directly to workshop data
  groupCategoryScores?: {
    opportunity: number;
    comfort: number;
    apathy: number;
    war: number;
  };
}

export interface Workshop {
  id: number;
  name: string;
  participant_count: number;
  date: string;
}
