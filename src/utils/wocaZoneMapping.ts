
// WOCA zone mappings for Hebrew display
export const WOCA_ZONE_HEBREW_NAMES = {
  'opportunity': 'אזור ההזדמנות',
  'comfort': 'אזור הנוחות', 
  'apathy': 'אזור האדישות',
  'war': 'אזור המלחמה',
  'Opportunity': 'אזור ההזדמנות',
  'Comfort': 'אזור הנוחות',
  'Apathy': 'אזור האדישות', 
  'War': 'אזור המלחמה'
};

export const getHebrewZoneName = (englishZone: string): string => {
  return WOCA_ZONE_HEBREW_NAMES[englishZone as keyof typeof WOCA_ZONE_HEBREW_NAMES] || englishZone;
};

export const ZONE_WIN_LOSE_LABELS = {
  'אזור ההזדמנות': 'WIN/WIN',
  'אזור הנוחות': 'LOSE/LOSE', 
  'אזור האדישות': 'LOSE/LOSE',
  'אזור המלחמה': 'WIN/LOSE'
};
