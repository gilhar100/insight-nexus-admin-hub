
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export type DataSourceType = 'self' | 'colleague' | 'combined';

interface DataSourceToggleProps {
  value: DataSourceType;
  onValueChange: (value: DataSourceType) => void;
  hasColleagueData: boolean;
}

export const DataSourceToggle: React.FC<DataSourceToggleProps> = ({
  value,
  onValueChange,
  hasColleagueData
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-right">
        <h3 className="text-lg font-semibold text-gray-900">מקור הנתונים</h3>
        <p className="text-sm text-gray-600">בחר את מקור הנתונים להצגה</p>
      </div>
      
      <Tabs value={value} onValueChange={onValueChange} className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="self" className="text-right">
            דוח עצמי
          </TabsTrigger>
          <TabsTrigger 
            value="colleague" 
            disabled={!hasColleagueData}
            className="text-right"
          >
            דוח קולגות
            {!hasColleagueData && <span className="text-xs block">(לא זמין)</span>}
          </TabsTrigger>
          <TabsTrigger 
            value="combined" 
            disabled={!hasColleagueData}
            className="text-right"
          >
            דוח משולב
            {!hasColleagueData && <span className="text-xs block">(לא זמין)</span>}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
