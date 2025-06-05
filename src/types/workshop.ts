
import { WocaScores } from '@/utils/wocaScoring';

export interface WorkshopParticipant {
  id: string;
  full_name: string;
  email: string;
  overall_score: number | null;
  woca_scores: WocaScores;
  woca_zone: string;
  woca_zone_color: string;
  organization: string | null;
  profession: string | null;
  age: string | null;
  gender: string | null;
  education: string | null;
  experience_years: number | null;
  created_at: string | null;
  workshop_id: number | null;
}

export interface WorkshopData {
  workshop_id: number;
  participants: WorkshopParticipant[];
  participant_count: number;
  average_score: number;
  zone_distribution: Record<string, number>;
  dominant_zone: string;
  dominant_zone_color: string;
}

export interface Workshop {
  id: number;
  name: string;
  participant_count: number;
  date: string;
}
