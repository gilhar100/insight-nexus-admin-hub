
import { RespondentData } from '@/hooks/useRespondentData';
import React from 'react';
import ReactDOM from 'react-dom/client';
// @ts-ignore
import html2pdf from 'html2pdf.js';

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

export const exportSalimaPDFReport = async (groupData: any, filename: string) => {
  const { SalimaPDFLayout } = await import('@/components/pdf/SalimaPDFLayout');
  
  // Create a temporary container
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.top = '-9999px';
  tempDiv.style.width = '210mm'; // A4 width
  tempDiv.style.backgroundColor = '#ffffff';
  document.body.appendChild(tempDiv);

  try {
    // Create React root and render the PDF layout
    const root = ReactDOM.createRoot(tempDiv);
    root.render(React.createElement(SalimaPDFLayout, { groupData }));

    // Wait for rendering
    await new Promise(resolve => setTimeout(resolve, 1000));

    const opt = {
      margin: 0.5,
      filename: filename,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { 
        scale: 1.5,
        useCORS: true,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        letterRendering: true,
        allowTaint: true,
        logging: false
      },
      jsPDF: { 
        unit: 'in', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      }
    };

    await html2pdf().from(tempDiv).set(opt).save();
    
    // Cleanup
    root.unmount();
  } finally {
    document.body.removeChild(tempDiv);
  }
};

export const exportWocaPDFReport = async (workshopData: any, wocaAnalysis: any, zoneDistribution: any, filename: string) => {
  const { WocaPDFLayout } = await import('@/components/pdf/WocaPDFLayout');
  
  // Create a temporary container
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.top = '-9999px';
  tempDiv.style.width = '210mm'; // A4 width
  tempDiv.style.backgroundColor = '#ffffff';
  document.body.appendChild(tempDiv);

  try {
    // Create React root and render the PDF layout
    const root = ReactDOM.createRoot(tempDiv);
    root.render(React.createElement(WocaPDFLayout, { workshopData, wocaAnalysis, zoneDistribution }));

    // Wait for rendering
    await new Promise(resolve => setTimeout(resolve, 1000));

    const opt = {
      margin: 0.5,
      filename: filename,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { 
        scale: 1.5,
        useCORS: true,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        letterRendering: true,
        allowTaint: true,
        logging: false
      },
      jsPDF: { 
        unit: 'in', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      }
    };

    await html2pdf().from(tempDiv).set(opt).save();
    
    // Cleanup
    root.unmount();
  } finally {
    document.body.removeChild(tempDiv);
  }
};
