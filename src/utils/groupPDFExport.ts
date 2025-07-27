
import { GroupData } from '@/hooks/useGroupData';
import { WorkshopData } from '@/types/workshopTypes';
import { analyzeWorkshopWoca } from '@/utils/wocaAnalysis';

export interface GroupPDFData {
  groupNumber: number;
  salimaData?: GroupData;
  wocaData?: {
    workshopData: WorkshopData;
    wocaAnalysis: any;
  };
}

export const exportGroupInsightsPDF = async (data: GroupPDFData) => {
  const { default: html2pdf } = await import('html2pdf.js');
  const { GroupInsightsPDFLayout } = await import('@/components/pdf/GroupInsightsPDFLayout');
  const { createRoot } = await import('react-dom/client');
  const React = await import('react');

  // Create a temporary container
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '210mm';
  container.style.minHeight = '297mm';
  document.body.appendChild(container);

  // Render the PDF layout
  const root = createRoot(container);
  root.render(
    React.createElement(GroupInsightsPDFLayout, {
      groupNumber: data.groupNumber,
      salimaData: data.salimaData,
      wocaData: data.wocaData
    })
  );

  // Wait for rendering and charts to load
  await new Promise(resolve => setTimeout(resolve, 2000));

  const opt = {
    margin: [0.5, 0.5, 0.5, 0.5],
    filename: `group-${data.groupNumber}-insights-report-${new Date().toISOString().split('T')[0]}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      letterRendering: true,
      height: window.innerHeight,
      width: window.innerWidth
    },
    jsPDF: { 
      unit: 'in', 
      format: 'a4', 
      orientation: 'portrait',
      compress: true
    },
    pagebreak: { 
      mode: ['avoid-all', 'css', 'legacy'],
      before: '.page-break-before',
      after: '.page-break-after'
    }
  };

  try {
    await html2pdf().set(opt).from(container).save();
  } finally {
    // Clean up
    root.unmount();
    document.body.removeChild(container);
  }
};
