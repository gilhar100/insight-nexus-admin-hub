
export const CHART_MARGINS = {
  radar: { top: 40, right: 40, bottom: 40, left: 40 },
  horizontalBar: { top: 20, right: 30, left: 80, bottom: 20 },
  verticalBar: { top: 20, right: 30, left: 20, bottom: 5 }
};

export const CHART_DIMENSIONS = {
  horizontalBarHeight: 264, // h-64 equivalent
  radarHeight: 500,
  pieHeight: 300
};

export const CHART_STYLES = {
  tickStyle: { fontSize: 14, fill: '#000000' },
  labelStyle: { fontSize: 14, fontWeight: 'bold' as const },
  tooltipStyle: { 
    backgroundColor: 'white', 
    border: '1px solid #ccc', 
    borderRadius: '4px',
    color: '#000000',
    fontSize: '14px',
    direction: 'rtl' as const
  }
};
