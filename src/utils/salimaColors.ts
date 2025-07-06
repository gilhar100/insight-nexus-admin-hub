
// SALIMA dimension colors - Exact colors from the design
export const SALIMA_COLORS = {
  'אסטרטגיה': '#FF9F7A',   // Strategy - Orange/Peach
  'למידה': '#7A9FFF',      // Learning - Blue  
  'השראה': '#FFA07A',      // Inspiration - Orange (similar to strategy)
  'הסתגלות': '#90EE90',    // Adaptability - Green
  'אותנטיות': '#FFD700',   // Authenticity - Yellow
  'משמעות': '#DDA0DD',     // Meaning - Light Purple
  // English fallbacks
  'Strategy': '#FF9F7A',
  'Learning': '#7A9FFF', 
  'Inspiration': '#FFA07A',
  'Adaptability': '#90EE90',
  'Authenticity': '#FFD700',
  'Meaning': '#DDA0DD'
};

export const getSalimaColor = (dimension: string): string => {
  return SALIMA_COLORS[dimension as keyof typeof SALIMA_COLORS] || '#6B7280';
};
