import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, BarChart3, Download, User, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNameSearch } from '@/hooks/useNameSearch';
import { useRespondentData } from '@/hooks/useRespondentData';
import { Badge } from '@/components/ui/badge';
import { SalimaRadarChart } from '@/components/SalimaRadarChart';
import { SalimaIntensityBar } from '@/components/SalimaIntensityBar';
import { exportSalimaReport, exportSalimaReportCSV } from '@/utils/exportUtils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SalimaGroupBarChart } from '@/components/SalimaGroupBarChart';
import { SalimaDimensionPieChart } from '@/components/SalimaDimensionPieChart';
import { SalimaScoreDistributionChart } from '@/components/SalimaScoreDistributionChart';

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Group search states
  const [groupSearchQuery, setGroupSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [availableGroups, setAvailableGroups] = useState<number[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);

  const { names, isLoading, error } = useNameSearch(searchQuery);
  const { data: respondentData, isLoading: isDataLoading, error: dataError, fetchRespondentData } = useRespondentData();
  const { toast } = useToast();

  // Fetch available groups on component mount
  useEffect(() => {
    const fetchAvailableGroups = async () => {
      try {
        const { data, error } = await supabase
          .from('survey_responses')
          .select('group_number')
          .not('group_number', 'is', null)
          .order('group_number');

        if (error) throw error;

        const uniqueGroups = [...new Set(data?.map(item => item.group_number).filter(Boolean))] as number[];
        setAvailableGroups(uniqueGroups.sort((a, b) => a - b));
      } catch (err) {
        console.error('Error fetching groups:', err);
      }
    };

    fetchAvailableGroups();
  }, []);

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
            overall: data.reduce((sum, item) => sum + (item.slq_score || 0), 0) / data.length,
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

  const handleNameSelect = (nameOption: any) => {
    setSelectedName(nameOption.name);
    setSelectedRespondent(nameOption.id);
    setSelectedSource(nameOption.source);
    setSearchQuery(nameOption.name);
    setIsDropdownOpen(false);
    // Clear group selection when individual is selected
    setSelectedGroup(null);
    setGroupSearchQuery('');
    console.log('Selected respondent:', nameOption);
  };

  const handleGroupSelect = (groupNumber: number) => {
    setSelectedGroup(groupNumber);
    setGroupSearchQuery(`קבוצה ${groupNumber}`);
    // Clear individual selection when group is selected
    setSelectedRespondent('');
    setSelectedName('');
    setSelectedSource('');
    setSearchQuery('');
    setIsDropdownOpen(false);
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

    await fetchRespondentData(selectedRespondent, selectedSource);
  };

  const handleExport = (format: 'json' | 'csv') => {
    if (!respondentData) {
      toast({
        title: "אין נתונים לייצוא",
        description: "אנא נתח נבדק קודם",
        variant: "destructive"
      });
      return;
    }

    if (format === 'json') {
      exportSalimaReport(respondentData);
    } else {
      exportSalimaReportCSV(respondentData);
    }

    toast({
      title: "ייצוא הושלם בהצלחה",
      description: `הדוח יוצא כקובץ ${format.toUpperCase()}`,
    });
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'survey': return 'bg-blue-100 text-blue-800';
      case 'colleague': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Prepare radar chart data for individual
  const radarChartData = respondentData ? [
    { dimension: 'אסטרטגיה', score: respondentData.dimensions.strategy, color: '#3B82F6' },
    { dimension: 'הסתגלות', score: respondentData.dimensions.adaptability, color: '#F59E0B' },
    { dimension: 'למידה', score: respondentData.dimensions.learning, color: '#10B981' },
    { dimension: 'השראה', score: respondentData.dimensions.inspiration, color: '#EF4444' },
    { dimension: 'משמעות', score: respondentData.dimensions.meaning, color: '#8B5CF6' },
    { dimension: 'אותנטיות', score: respondentData.dimensions.authenticity, color: '#EC4899' }
  ] : [];

  // Prepare radar chart data for group
  const groupRadarChartData = groupData ? [
    { dimension: 'אסטרטגיה', score: groupData.averages.strategy, color: '#3B82F6' },
    { dimension: 'הסתגלות', score: groupData.averages.adaptability, color: '#F59E0B' },
    { dimension: 'למידה', score: groupData.averages.learning, color: '#10B981' },
    { dimension: 'השראה', score: groupData.averages.inspiration, color: '#EF4444' },
    { dimension: 'משמעות', score: groupData.averages.meaning, color: '#8B5CF6' },
    { dimension: 'אותנטיות', score: groupData.averages.authenticity, color: '#EC4899' }
  ] : [];

  const filteredGroups = availableGroups.filter(group => 
    group.toString().includes(groupSearchQuery.replace('קבוצה ', ''))
  );

  return (
    <div className="space-y-6" dir="rtl">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div className="text-right">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              תובנות אישיות ו
