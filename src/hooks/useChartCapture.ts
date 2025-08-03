
import { useState } from 'react';

export const useChartCapture = () => {
  const [isCapturing, setIsCapturing] = useState(false);

  const captureChart = async (elementId: string): Promise<string> => {
    // For server-side PDF generation, we don't need to capture individual charts
    // The entire layout will be sent as HTML to the server
    console.log(`📸 Chart capture not needed for server-side PDF: ${elementId}`);
    return `placeholder-${elementId}`;
  };

  const captureMultipleCharts = async (elementIds: string[]): Promise<Record<string, string>> => {
    setIsCapturing(true);
    const chartImages: Record<string, string> = {};
    
    try {
      for (const elementId of elementIds) {
        chartImages[elementId] = await captureChart(elementId);
      }
      console.log('📊 Chart capture placeholders created:', Object.keys(chartImages));
      return chartImages;
    } finally {
      setIsCapturing(false);
    }
  };

  return {
    captureChart,
    captureMultipleCharts,
    isCapturing,
  };
};
