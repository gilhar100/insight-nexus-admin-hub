
import React from 'react';
import { GroupPDFExportLayout } from './GroupPDFExportLayout';
import { PDFTemplateData } from '@/hooks/useGroupPDFTemplate';

interface GroupPDFTemplateProps {
  templateData: PDFTemplateData;
  chartImages: Record<string, string>;
  visible: boolean;
}

export const GroupPDFTemplate: React.FC<GroupPDFTemplateProps> = ({
  templateData,
  chartImages,
  visible,
}) => {
  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none" style={{ zIndex: -1 }}>
      <GroupPDFExportLayout
        pdfImages={chartImages}
        groupNumber={templateData.groupNumber}
        participantCount={templateData.participantCount}
        salimaScore={templateData.salimaScore}
        strongestDimension={templateData.strongestDimension}
        weakestDimension={templateData.weakestDimension}
        wocaZoneLabel={templateData.wocaZoneLabel}
        wocaScore={templateData.wocaScore}
        wocaParticipantCount={templateData.wocaParticipantCount}
      />
    </div>
  );
};
