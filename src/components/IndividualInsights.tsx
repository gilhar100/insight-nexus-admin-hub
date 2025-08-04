
import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { useEnhancedRespondentData, DataSourceType } from '@/hooks/useEnhancedRespondentData';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PresenterMode } from '@/components/PresenterMode';
import { GroupSearch } from '@/components/GroupSearch';
import { IndividualSearch } from '@/components/IndividualSearch';
import { GroupResults } from '@/components/GroupResults';
import { IndividualResults } from '@/components/IndividualResults';

interface GroupData {
  group_number: number;
  participant_count: number;
  averages: {
    strategy: number;
    learning: number;
    inspiration: number;
    meaning: number;
    authenticity: number;
    adaptability: number;
    overall: number;
  };
  participants: Array<{
    dimension_s: number;
    dimension_l: number;
    dimension_i: number;
    dimension_m: number;
    dimension_a: number;
    dimension_a2: number;
  }>;
}

export const IndividualInsights: React.FC = () => {
  const [selectedRespondent, setSelectedRespondent] = useState<string>('');
  const [selectedName, setSelectedName] = useState<string>('');
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPresenterMode, setIsPresenterMode] = useState(false);
  const [activeDataSource, setActiveDataSource] = useState<DataSourceType>('self');

  // Group search states
  const [groupSearchQuery, setGroupSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);

  const {
    data: respondentData,
    isLoading: isDataLoading,
    error: dataError,
    fetchEnhancedRespondentData,
    clearData
  } = useEnhancedRespondentData();

  const { toast } = useToast();

  const handleNameSelect = (nameOption: any) => {
    setSelectedName(nameOption.name);
    setSelectedRespondent(nameOption.id);
    setSelectedSource(nameOption.source);
    setSearchQuery(nameOption.name);
    setActiveDataSource('self'); // Reset to self when selecting new respondent
    
    // Clear group selection and data when individual is selected
    setSelectedGroup(null);
    setGroupSearchQuery('');
    setGroupData(null);
    
    console.log('Selected respondent:', nameOption);
  };

  const handleGroupSelect = (groupNumber: number) => {
    setSelectedGroup(groupNumber);
    setGroupSearchQuery(`קבוצה ${groupNumber}`);
    
    // Clear individual selection and data when group is selected
    setSelectedRespondent('');
    setSelectedName('');
    setSelectedSource('');
    setSearchQuery('');
    setActiveDataSource('self');
    
    // Clear individual respondent data
    if (clearData) {
      clearData();
    }
    
    console.log('Selected group:', groupNumber);
  };

  const handleGroupClearSelection = () => {
    setSelectedGroup(null);
    setGroupSearchQuery('');
    setGroupData(null);
  };

  const handleAnalyzeResults = async () => {
    if (!selectedRespondent || !selectedSource) {
      toast({
        title: "לא נבחר נבדק",
        description: "אנא בחר נבדק לניתוח",
        variant: "destructive"
      });
      return;
    }
    
    // Clear group data when analyzing individual results
    setSelectedGroup(null);
    setGroupSearchQuery('');
    setGroupData(null);
    
    await fetchEnhancedRespondentData(selectedRespondent, selectedSource);
  };

  // Fetch group data when a group is selected
  useEffect(() => {
    if (!selectedGroup) {
      setGroupData(null);
      return;
    }

    const fetchGroupData = async () => {
      setIsLoadingGroups(true);
      try {
        const { data, error } = await supabase
          .from('survey_responses')
          .select('dimension_s, dimension_l, dimension_i, dimension_m, dimension_a, dimension_a2, slq_score')
          .eq('group_number', selectedGroup)
          .eq('survey_type', 'manager');

        if (error) throw error;

        if (data && data.length > 0) {
          const averages = {
            strategy: data.reduce((sum, item) => sum + (item.dimension_s || 0), 0) / data.length,
            learning: data.reduce((sum, item) => sum + (item.dimension_l || 0), 0) / data.length,
            inspiration: data.reduce((sum, item) => sum + (item.dimension_i || 0), 0) / data.length,
            meaning: data.reduce((sum, item) => sum + (item.dimension_m || 0), 0) / data.length,
            authenticity: data.reduce((sum, item) => sum + (item.dimension_a || 0), 0) / data.length,
            adaptability: data.reduce((sum, item) => sum + (item.dimension_a2 || 0), 0) / data.length,
            overall: data.reduce((sum, item) => sum + (item.slq_score || 0), 0) / data.length
          };

          setGroupData({
            group_number: selectedGroup,
            participant_count: data.length,
            averages,
            participants: data
          });
        }
      } catch (err) {
        console.error('Error fetching group data:', err);
        toast({
          title: "שגיאה בטעינת נתוני הקבוצה",
          description: "נכשל בטעינת סטטיסטיקות הקבוצה",
          variant: "destructive"
        });
      } finally {
        setIsLoadingGroups(false);
      }
    };

    fetchGroupData();
  }, [selectedGroup, toast]);

  const content = (
    <div className={`space-y-8${isPresenterMode ? ' presenter-mode' : ''}`} dir="rtl">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="flex items-center justify-between">
          <div className="text-right">
            <h2 className={`text-3xl font-bold text-gray-900 mb-4 ${isPresenterMode ? 'text-5xl' : ''}`}>
              תובנות קבוצתיות - שאלון מנהיגות 
            </h2>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg">
            <User className={`h-10 w-10 text-blue-600 ${isPresenterMode ? 'h-16 w-16' : ''}`} />
          </div>
        </div>
      </div>

      {/* Group Search Section - Hidden in presenter mode */}
      {!isPresenterMode && (
        <GroupSearch
          selectedGroup={selectedGroup}
          groupSearchQuery={groupSearchQuery}
          onGroupSelect={handleGroupSelect}
          onGroupSearchChange={setGroupSearchQuery}
          onClearSelection={handleGroupClearSelection}
          groupData={groupData}
        />
      )}

      {/* Individual Respondent Selection - Hidden in presenter mode */}
      {!isPresenterMode && (
        <IndividualSearch
          selectedRespondent={selectedRespondent}
          selectedName={selectedName}
          selectedSource={selectedSource}
          searchQuery={searchQuery}
          isDataLoading={isDataLoading}
          dataError={dataError}
          onNameSelect={handleNameSelect}
          onSearchQueryChange={setSearchQuery}
          onAnalyzeResults={handleAnalyzeResults}
        />
      )}

      {/* Group Results Section - Only show when group is selected and no individual data */}
      {groupData && !respondentData && (
        <GroupResults
          groupData={groupData}
          isPresenterMode={isPresenterMode}
        />
      )}

      {/* Individual Results Section - Only show when respondent data exists and no group data */}
      {respondentData && !groupData && (
        <IndividualResults
          respondentData={respondentData}
          isPresenterMode={isPresenterMode}
          activeDataSource={activeDataSource}
          onDataSourceChange={setActiveDataSource}
        />
      )}
    </div>
  );

  return (
    <PresenterMode isPresenterMode={isPresenterMode} onToggle={() => setIsPresenterMode(!isPresenterMode)}>
      {content}
    </PresenterMode>
  );
};
