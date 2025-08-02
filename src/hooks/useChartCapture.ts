import { useState } from 'react';
import html2canvas from 'html2canvas';

export const useChartCapture = () => {
  const [isCapturing, setIsCapturing] = useState(false);

  const captureChart = async (elementId: string): Promise<string> => {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    console.log(`📸 Capturing chart: ${elementId}`);
    
    // Wait for chart to fully render
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      height: element.offsetHeight,
      width: element.offsetWidth,
    });

    const base64Image = canvas.toDataURL('image/png');
    
    // Verify the image is not blank
    if (base64Image === 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==') {
      throw new Error(`Captured image for ${elementId} is blank`);
    }
    
    console.log(`✅ Successfully captured ${elementId}`);
    return base64Image;
  };

  const captureMultipleCharts = async (elementIds: string[]): Promise<Record<string, string>> => {
    setIsCapturing(true);
    const chartImages: Record<string, string> = {};
    
    try {
      for (const elementId of elementIds) {
        chartImages[elementId] = await captureChart(elementId);
      }
      console.log('📊 All charts captured successfully:', Object.keys(chartImages));
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