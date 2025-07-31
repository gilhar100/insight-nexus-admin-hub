
// WOCA category colors - More vivid palette for better PDF visibility
export const WOCA_COLORS = {
  'הזדמנות': '#00CC88', // Brighter Green - Opportunity
  'נוחות': '#FFE135',   // Brighter Yellow - Comfort  
  'אדישות': '#FF8C00',  // Brighter Orange - Apathy
  'מלחמה': '#1E88E5'    // Brighter Blue - War
};

export const WOCA_ZONE_COLORS = {
  opportunity: '#00CC88', // Brighter Green
  comfort: '#FFE135',     // Brighter Yellow
  apathy: '#FF8C00',      // Brighter Orange
  war: '#1E88E5'          // Brighter Blue
};

export const getWocaZoneColor = (score: number): string => {
  if (score >= 4.2) return WOCA_ZONE_COLORS.opportunity;
  if (score >= 3.4) return WOCA_ZONE_COLORS.comfort;
  if (score >= 2.6) return WOCA_ZONE_COLORS.apathy;
  return WOCA_ZONE_COLORS.war;
};
