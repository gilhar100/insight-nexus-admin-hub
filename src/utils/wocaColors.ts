
// WOCA category colors
export const WOCA_COLORS = {
  'הזדמנות': '#10B981', // Green - Opportunity
  'נוחות': '#3B82F6',   // Blue - Comfort  
  'אדישות': '#F59E0B',  // Orange - Apathy
  'מלחמה': '#EF4444'    // Red - War
};

export const WOCA_ZONE_COLORS = {
  opportunity: '#10B981', // Green
  comfort: '#3B82F6',     // Blue
  apathy: '#F59E0B',      // Orange
  war: '#EF4444'          // Red
};

export const getWocaZoneColor = (score: number): string => {
  if (score >= 4.2) return WOCA_ZONE_COLORS.opportunity;
  if (score >= 3.4) return WOCA_ZONE_COLORS.comfort;
  if (score >= 2.6) return WOCA_ZONE_COLORS.apathy;
  return WOCA_ZONE_COLORS.war;
};
