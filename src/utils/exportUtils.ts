
import { RespondentData } from '@/hooks/useRespondentData';
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

export const exportGroupInsightsToPDF = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found for PDF export');
    return;
  }

  const opt = {
    margin: 1,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0
    },
    jsPDF: { 
      unit: 'in', 
      format: 'a4', 
      orientation: 'portrait' 
    }
  };

  try {
    await html2pdf().from(element).set(opt).save();
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};
