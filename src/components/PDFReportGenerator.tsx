
import React, { useState } from 'react';
import { useGroupPDFTemplate } from '@/hooks/useGroupPDFTemplate';
import { usePDFExport } from '@/hooks/usePDFExport';
import { PDFExportControls } from '@/components/PDFExportControls';
import { GroupPDFTemplate } from '@/components/GroupPDFTemplate';
import { PDFChartsRenderer } from '@/components/PDFChartsRenderer';

export const PDFReportGenerator: React.FC = () => {
  const [groupNumber, setGroupNumber] = useState<number | null>(null);
  
  const {
    templateData,
    groupData,
    workshopData,
    isLoading,
    error,
  } = useGroupPDFTemplate(groupNumber);

  const {
    exportPDF,
    exportDOCX,
    isExporting,
    showTemplate,
    capturedImages,
  } = usePDFExport();

  const loadGroupData = async () => {
    if (!groupNumber) {
      return;
    }
    // Data loading is handled automatically by useGroupPDFTemplate
    console.log('Loading data for group:', groupNumber);
  };

  const handleExportPDF = async () => {
    if (!templateData) return;
    await exportPDF(templateData, !!groupData, !!workshopData);
  };

  const handleExportDOCX = async () => {
    if (!templateData) return;
    await exportDOCX(templateData, !!groupData, !!workshopData);
  };

  return (
    <div className="space-y-6 p-6">
      <PDFExportControls
        onGroupNumberChange={setGroupNumber}
        onLoadGroup={loadGroupData}
        onExportPDF={handleExportPDF}
        onExportDOCX={handleExportDOCX}
        isLoading={isLoading}
        isExporting={isExporting}
        hasData={!!(groupData || workshopData)}
        error={error}
      />

      {/* Dynamic PDF Template */}
      {templateData && (
        <GroupPDFTemplate
          templateData={templateData}
          chartImages={capturedImages}
          visible={showTemplate}
        />
      )}

      {/* Charts Renderer for Capture */}
      <PDFChartsRenderer
        groupData={groupData}
        workshopData={workshopData}
        templateData={templateData}
      />

      {/* Data Display */}
      {groupData && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">נתוני SALIMA שנטענו:</h3>
          <p>קבוצה: {groupData.group_number}</p>
          <p>משתתפים: {groupData.participant_count}</p>
          <p>ציון כללי: {groupData.averages.overall.toFixed(2)}</p>
        </div>
      )}

      {workshopData && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">נתוני WOCA שנטענו:</h3>
          <p>קבוצה: {workshopData.workshop_id}</p>
          <p>משתתפים: {workshopData.participant_count}</p>
          <p>ציון ממוצע: {workshopData.average_score.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};
