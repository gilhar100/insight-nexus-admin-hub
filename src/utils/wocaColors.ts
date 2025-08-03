
// WOCA category colors - Colorblind-friendly palette (Color Universal Design)
export const WOCA_COLORS = {
  'הזדמנות': '#009E73', // Green - Opportunity
  'נוחות': '#F0E442',   // Yellow - Comfort  
  'אדישות': '#E69F00',  // Orange - Apathy
  'מלחמה': '#0072B2'    // Blue - War
};

export const WOCA_ZONE_COLORS = {
  opportunity: '#009E73', // Green
  comfort: '#F0E442',     // Yellow
  apathy: '#E69F00',      // Orange
  war: '#0072B2'          // Blue
};

export const getWocaZoneColor = (score: number): string => {
  if (score >= 4.2) return WOCA_ZONE_COLORS.opportunity;
  if (score >= 3.4) return WOCA_ZONE_COLORS.comfort;
  if (score >= 2.6) return WOCA_ZONE_COLORS.apathy;
  return WOCA_ZONE_COLORS.war;
};
