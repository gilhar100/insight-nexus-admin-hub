import React from 'react';
import SalimaResultsViewer from '@/components/SalimaResultsViewer';
import { mapRawDataToResultsViewerProps } from '@/lib/mapRawDataToResultsViewerProps';
import { EnhancedRespondentData } from '@/hooks/useEnhancedRespondentData';
import { DataSourceType } from '@/components/DataSourceToggle';

interface IndividualResultsProps {
  respondentData: EnhancedRespondentData;
  isPresenterMode: boolean;
  activeDataSource: DataSourceType;
  onDataSourceChange: (source: DataSourceType) => void;
}

export const IndividualResults: React.FC<IndividualResultsProps> = ({
  respondentData,
}) => {
  if (!respondentData || !respondentData.rawData || !respondentData.selfReport) {
    return (
      <div className="p-6 text-center text-gray-600">
        לא נמצאו נתונים להצגה.
      </div>
    );
  }

  const enrichedRow = {
    ...respondentData.rawData,
    dimension_s: respondentData.selfReport.strategy,
    dimension_a: respondentData.selfReport.adaptability,
    dimension_l: respondentData.selfReport.learning,
    dimension_i: respondentData.selfReport.inspiration,
    dimension_m: respondentData.selfReport.meaning,
    dimension_a2: respondentData.selfReport.authenticity,
    survey_id: respondentData.id,
  };

  return (
    <div className="p-6">
      <SalimaResultsViewer {...mapRawDataToResultsViewerProps(enrichedRow)} />
    </div>
  );
};