import React from 'react';
import { SalimaGroupRadarChart } from './SalimaGroupRadarChart';
import { SalimaArchetypeDistributionChart } from './SalimaArchetypeDistributionChart';
import { WocaGroupBarChart } from './WocaGroupBarChart';
import { ZoneDistributionChart } from './ZoneDistributionChart';
import { GroupData } from '@/hooks/useGroupData';
import { WorkshopData } from '@/types/workshopTypes';
import { PDFTemplateData } from '@/hooks/useGroupPDFTemplate';

interface PDFChartsRendererProps {
  groupData?: GroupData;
  workshopData?: WorkshopData;
  templateData?: PDFTemplateData;
}

export const PDFChartsRenderer: React.FC<PDFChartsRendererProps> = ({
  groupData,
  workshopData,
  templateData,
}) => {
  return (
    <div className="fixed -top-[10000px] left-0 bg-white" style={{ width: '1000px' }}>
      {groupData && (
        <>
          <div id="radar-chart" className="w-full bg-white p-8" style={{ height: '600px' }}>
            <SalimaGroupRadarChart averages={groupData.averages} />
          </div>
          <div id="archetype-chart" className="w-full bg-white p-8" style={{ height: '900px' }}>
            <SalimaArchetypeDistributionChart participants={groupData.participants} />
          </div>
        </>
      )}
      
      {workshopData && templateData?.wocaAnalysis && (
        <>
          <div id="woca-bar" className="w-full bg-white p-8" style={{ height: '600px' }}>
            <WocaGroupBarChart groupCategoryScores={templateData.wocaAnalysis.groupCategoryScores} />
          </div>
          <div id="woca-pie" className="w-full bg-white p-8" style={{ height: '600px' }}>
            <ZoneDistributionChart 
              zoneDistribution={{
                opportunity: templateData.wocaAnalysis.groupZoneCounts.opportunity,
                comfort: templateData.wocaAnalysis.groupZoneCounts.comfort,
                apathy: templateData.wocaAnalysis.groupZoneCounts.apathy,
                war: templateData.wocaAnalysis.groupZoneCounts.war,
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};