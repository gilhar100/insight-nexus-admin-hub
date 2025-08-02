import { useState } from 'react';
import { downloadGroupReportPDF } from '@/utils/downloadGroupReportPDF';
import { downloadGroupReportDOCX } from '@/utils/downloadGroupReportDOCX';
import { useChartCapture } from './useChartCapture';
import { PDFTemplateData } from './useGroupPDFTemplate';

export const usePDFExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [capturedImages, setCapturedImages] = useState<Record<string, string>>({});
  const { captureMultipleCharts } = useChartCapture();

  const exportPDF = async (templateData: PDFTemplateData, hasGroupData: boolean, hasWorkshopData: boolean) => {
    setIsExporting(true);
    
    try {
      console.log('🚀 Starting PDF export for group:', templateData.groupNumber);
      
      const chartIds: string[] = [];
      if (hasGroupData) {
        chartIds.push('radar-chart', 'archetype-chart');
      }
      if (hasWorkshopData) {
        chartIds.push('woca-bar', 'woca-pie');
      }
      
      const chartImages = await captureMultipleCharts(chartIds);
      setCapturedImages(chartImages);
      setShowTemplate(true);
      
      // Wait for template to render
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const filename = `Group_Report_${templateData.groupNumber}.pdf`;
      await downloadGroupReportPDF('pdf-template-root', filename);
      
      console.log('✅ PDF export completed successfully!');
    } catch (err) {
      console.error('❌ PDF Export Error:', err);
      throw err;
    } finally {
      setIsExporting(false);
    }
  };

  const exportDOCX = async (templateData: PDFTemplateData, hasGroupData: boolean, hasWorkshopData: boolean) => {
    setIsExporting(true);
    
    try {
      console.log('🚀 Starting DOCX export for group:', templateData.groupNumber);
      
      const chartIds: string[] = [];
      if (hasGroupData) {
        chartIds.push('radar-chart', 'archetype-chart');
      }
      if (hasWorkshopData) {
        chartIds.push('woca-bar', 'woca-pie');
      }
      
      const chartImages = await captureMultipleCharts(chartIds);
      
      const docxData = {
        groupNumber: templateData.groupNumber,
        participantCount: templateData.participantCount,
        salimaScore: templateData.salimaScore,
        strongestDimension: templateData.strongestDimension,
        weakestDimension: templateData.weakestDimension,
        wocaZoneLabel: templateData.wocaZoneLabel,
        wocaScore: templateData.wocaScore,
        wocaParticipantCount: templateData.wocaParticipantCount,
        chartImages,
      };
      
      const filename = `Group_Report_${templateData.groupNumber}.docx`;
      await downloadGroupReportDOCX(docxData, filename);
      
      console.log('✅ DOCX export completed successfully!');
    } catch (err) {
      console.error('❌ DOCX Export Error:', err);
      throw err;
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportPDF,
    exportDOCX,
    isExporting,
    showTemplate,
    capturedImages,
    setShowTemplate,
  };
};