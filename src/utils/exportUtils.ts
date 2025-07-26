
import { RespondentData } from '@/hooks/useRespondentData';

export const exportSalimaReport = (respondentData: RespondentData) => {
  const reportData = {
    respondent: {
      name: respondentData.name,
      email: respondentData.email,
      source: respondentData.source,
      id: respondentData.id
    },
    salima_scores: {
      strategy: respondentData.dimensions.strategy,
      adaptability: respondentData.dimensions.adaptability,
      learning: respondentData.dimensions.learning,
      inspiration: respondentData.dimensions.inspiration,
      meaning: respondentData.dimensions.meaning,
      authenticity: respondentData.dimensions.authenticity,
      overall_slq_score: respondentData.overallScore
    },
    analysis_date: new Date().toISOString(),
    raw_data: respondentData.rawData
  };

  const dataStr = JSON.stringify(reportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `salima-report-${respondentData.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportSalimaReportCSV = (respondentData: RespondentData) => {
  const csvData = [
    ['Field', 'Value'],
    ['Name', respondentData.name],
    ['Email', respondentData.email || ''],
    ['Source', respondentData.source],
    ['Strategy Score', respondentData.dimensions.strategy.toString()],
    ['Adaptability Score', respondentData.dimensions.adaptability.toString()],
    ['Learning Score', respondentData.dimensions.learning.toString()],
    ['Inspiration Score', respondentData.dimensions.inspiration.toString()],
    ['Meaning Score', respondentData.dimensions.meaning.toString()],
    ['Authenticity Score', respondentData.dimensions.authenticity.toString()],
    ['Overall SLQ Score', respondentData.overallScore.toString()],
    ['Analysis Date', new Date().toISOString()]
  ];

  const csvContent = csvData.map(row => row.join(',')).join('\n');
  const dataBlob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `salima-report-${respondentData.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Combined PDF Report Export
export const exportCombinedPDFReport = async (data: {
  groupId: number;
  salimaData: any;
  wocaData: any;
}) => {
  const { default: html2pdf } = await import('html2pdf.js');
  const { CombinedPDFLayout } = await import('@/components/pdf/CombinedPDFLayout');
  const { createRoot } = await import('react-dom/client');
  const React = await import('react');

  // Create a temporary container
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  document.body.appendChild(container);

  // Render the PDF layout
  const root = createRoot(container);
  root.render(
    React.createElement(CombinedPDFLayout, {
      groupId: data.groupId,
      salimaData: data.salimaData,
      wocaData: data.wocaData
    })
  );

  // Wait for rendering
  await new Promise(resolve => setTimeout(resolve, 1000));

  const opt = {
    margin: [0.5, 0.5, 0.5, 0.5],
    filename: `group-${data.groupId}-combined-report-${new Date().toISOString().split('T')[0]}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      letterRendering: true
    },
    jsPDF: { 
      unit: 'in', 
      format: 'a4', 
      orientation: 'landscape',
      compress: true
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  try {
    await html2pdf().set(opt).from(container).save();
  } finally {
    // Clean up
    root.unmount();
    document.body.removeChild(container);
  }
};

// SALIMA Group PDF Report Export
export const exportSalimaGroupPDFReport = async (groupData: any) => {
  const { default: html2pdf } = await import('html2pdf.js');
  const { SalimaPDFLayout } = await import('@/components/pdf/SalimaPDFLayout');
  const { createRoot } = await import('react-dom/client');
  const React = await import('react');

  // Create a temporary container
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  document.body.appendChild(container);

  // Render the PDF layout
  const root = createRoot(container);
  root.render(
    React.createElement(SalimaPDFLayout, {
      groupData: groupData
    })
  );

  // Wait for rendering
  await new Promise(resolve => setTimeout(resolve, 1000));

  const opt = {
    margin: [0.5, 0.5, 0.5, 0.5],
    filename: `salima-group-report-${groupData.group_number}-${new Date().toISOString().split('T')[0]}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      letterRendering: true
    },
    jsPDF: { 
      unit: 'in', 
      format: 'a4', 
      orientation: 'portrait',
      compress: true
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  try {
    await html2pdf().set(opt).from(container).save();
  } finally {
    // Clean up
    root.unmount();
    document.body.removeChild(container);
  }
};

// WOCA Group PDF Report Export
export const exportWocaGroupPDFReport = async (wocaData: any) => {
  const { default: html2pdf } = await import('html2pdf.js');
  const { WocaPDFLayout } = await import('@/components/pdf/WocaPDFLayout');
  const { createRoot } = await import('react-dom/client');
  const React = await import('react');

  // Create a temporary container
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  document.body.appendChild(container);

  // Render the PDF layout
  const root = createRoot(container);
  root.render(
    React.createElement(WocaPDFLayout, {
      wocaData: wocaData
    })
  );

  // Wait for rendering
  await new Promise(resolve => setTimeout(resolve, 1000));

  const opt = {
    margin: [0.5, 0.5, 0.5, 0.5],
    filename: `woca-group-report-${wocaData.workshopData.workshop_id}-${new Date().toISOString().split('T')[0]}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      letterRendering: true
    },
    jsPDF: { 
      unit: 'in', 
      format: 'a4', 
      orientation: 'portrait',
      compress: true
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  try {
    await html2pdf().set(opt).from(container).save();
  } finally {
    // Clean up
    root.unmount();
    document.body.removeChild(container);
  }
};
