
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
            averages
          });
        }
      } catch (err) {
        console.error('Error fetching group data:', err);
        toast({
          title: "Error loading group data",
          description: "Failed to load group statistics",
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
    console.log('Selected respondent:', nameOption);
  };

  const handleGroupSelect = (groupNumber: number) => {
    setSelectedGroup(groupNumber);
    setGroupSearchQuery(groupNumber.toString());
    // Clear individual selection when group is selected
    setSelectedRespondent('');
    setSelectedName('');
    setSelectedSource('');
    setSearchQuery('');
  };

  const handleAnalyzeResults = async () => {
    if (!selectedRespondent || !selectedSource) {
      toast({
        title: "No respondent selected",
        description: "Please select a respondent to analyze",
        variant: "destructive"
      });
      return;
    }

    await fetchRespondentData(selectedRespondent, selectedSource);
  };

  const handleExport = (format: 'json' | 'csv') => {
    if (!respondentData) {
      toast({
        title: "No data to export",
        description: "Please analyze a respondent first",
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
      title: "Export successful",
      description: `Report exported as ${format.toUpperCase()}`,
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
    { dimension: 'Strategy', score: respondentData.dimensions.strategy, color: '#3B82F6' },
    { dimension: 'Adaptability', score: respondentData.dimensions.adaptability, color: '#F59E0B' },
    { dimension: 'Learning', score: respondentData.dimensions.learning, color: '#10B981' },
    { dimension: 'Inspiration', score: respondentData.dimensions.inspiration, color: '#EF4444' },
    { dimension: 'Meaning', score: respondentData.dimensions.meaning, color: '#8B5CF6' },
    { dimension: 'Authenticity', score: respondentData.dimensions.authenticity, color: '#EC4899' }
  ] : [];

  // Prepare radar chart data for group
  const groupRadarChartData = groupData ? [
    { dimension: 'Strategy', score: groupData.averages.strategy, color: '#3B82F6' },
    { dimension: 'Adaptability', score: groupData.averages.adaptability, color: '#F59E0B' },
    { dimension: 'Learning', score: groupData.averages.learning, color: '#10B981' },
    { dimension: 'Inspiration', score: groupData.averages.inspiration, color: '#EF4444' },
    { dimension: 'Meaning', score: groupData.averages.meaning, color: '#8B5CF6' },
    { dimension: 'Authenticity', score: groupData.averages.authenticity, color: '#EC4899' }
  ] : [];

  const filteredGroups = availableGroups.filter(group => 
    group.toString().includes(groupSearchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Individual & Group Insights - SALIMA Model
            </h2>
            <p className="text-gray-600">
              Analyze individual responses or group statistics from the 90-question SALIMA survey
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <User className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Group Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Group Analysis
          </CardTitle>
          <CardDescription>
            Search and analyze group statistics by group number
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by group number..."
                value={groupSearchQuery}
                onChange={(e) => setGroupSearchQuery(e.target.value)}
                className="w-full"
              />
              {groupSearchQuery && filteredGroups.length > 0 && (
                <div className="mt-2 space-y-1">
                  {filteredGroups.slice(0, 5).map((groupNumber) => (
                    <Button
                      key={groupNumber}
                      variant="outline"
                      size="sm"
                      onClick={() => handleGroupSelect(groupNumber)}
                      className="mr-2 mb-1"
                    >
                      Group {groupNumber}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {selectedGroup && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                Selected: <span className="font-medium">Group {selectedGroup}</span>
                {groupData && <span className="ml-2">({groupData.participant_count} participants)</span>}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Individual Respondent Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Individual Analysis
          </CardTitle>
          <CardDescription>
            Search and select an individual from survey_responses or colleague_survey_responses tables (SALIMA data only)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Input
                placeholder="Search SALIMA respondents by name or email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.length >= 2) {
                    setIsDropdownOpen(true);
                  } else {
                    setIsDropdownOpen(false);
                  }
                }}
                onFocus={() => {
                  if (searchQuery.length >= 2) {
                    setIsDropdownOpen(true);
                  }
                }}
                className="w-full"
              />
              
              {/* Dropdown Results */}
              {isDropdownOpen && (searchQuery.length >= 2) && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border rounded-md shadow-lg max-h-80 overflow-y-auto">
                  <Command>
                    <CommandList>
                      {isLoading && (
                        <CommandEmpty>Searching...</CommandEmpty>
                      )}
                      {error && (
                        <CommandEmpty className="text-red-500">Error: {error}</CommandEmpty>
                      )}
                      {!isLoading && !error && names.length === 0 && (
                        <CommandEmpty>No SALIMA respondents found.</CommandEmpty>
                      )}
                      {names.length > 0 && (
                        <CommandGroup>
                          {names.map((nameOption) => (
                            <CommandItem
                              key={nameOption.id}
                              value={nameOption.name}
                              onSelect={() => handleNameSelect(nameOption)}
                              className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                            >
                              <div className="flex flex-col">
                                <span className="font-medium">{nameOption.name}</span>
                                {nameOption.email && (
                                  <span className="text-sm text-gray-500">{nameOption.email}</span>
                                )}
                              </div>
                              <Badge className={getSourceBadgeColor(nameOption.source)}>
                                {nameOption.source}
                              </Badge>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </div>
              )}
            </div>
            <Button 
              onClick={handleAnalyzeResults} 
              disabled={!selectedRespondent || isDataLoading}
            >
              {isDataLoading ? 'Analyzing...' : 'Analyze Results'}
            </Button>
          </div>
          {selectedName && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Selected: <span className="font-medium">{selectedName}</span>
                {selectedSource && <span className="ml-2">({selectedSource})</span>}
              </p>
            </div>
          )}
          {dataError && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg">
              <p className="text-sm text-red-800">Error: {dataError}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Group Results Section */}
      {groupData && (
        <>
          {/* Group Overall Score Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Group {groupData.group_number} - SALIMA Average Scores</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {groupData.participant_count} Participants
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="text-6xl font-bold text-green-600 mb-2">
                    {groupData.averages.overall.toFixed(1)}
                  </div>
                  <div className="text-lg text-gray-600">Average SLQ Score</div>
                  <div className="mt-4 text-sm text-gray-500">
                    Group average across all six SALIMA dimensions
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Group Dimension Scores */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Group Radar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Group Radar Chart - Six Dimensions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SalimaRadarChart data={groupRadarChartData} />
              </CardContent>
            </Card>

            {/* Group Intensity Bars */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Group Dimension Averages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {groupRadarChartData.map((dimension, index) => (
                    <SalimaIntensityBar
                      key={index}
                      dimension={dimension.dimension}
                      score={dimension.score}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Individual Results Section - Only show when respondent data is loaded */}
      {respondentData && (
        <>
          {/* Individual Overall Score Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>SALIMA Overall Score (SLQ)</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleExport('json')}>
                      Export as JSON
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('csv')}>
                      Export as CSV
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="text-6xl font-bold text-blue-600 mb-2">
                    {respondentData.overallScore.toFixed(1)}
                  </div>
                  <div className="text-lg text-gray-600">out of 5.0</div>
                  <div className="mt-4 text-sm text-gray-500">
                    Average across all six SALIMA dimensions
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Individual Dimension Scores */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Individual Radar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Radar Chart - Six Dimensions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SalimaRadarChart data={radarChartData} />
              </CardContent>
            </Card>

            {/* Individual Intensity Bars */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Dimension Intensity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {radarChartData.map((dimension, index) => (
                    <SalimaIntensityBar
                      key={index}
                      dimension={dimension.dimension}
                      score={dimension.score}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Individual AI-Generated Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis Summary</CardTitle>
              <CardDescription>
                Based on actual survey responses from {respondentData.source} data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Highest Scoring Dimensions</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    {radarChartData
                      .sort((a, b) => b.score - a.score)
                      .slice(0, 3)
                      .map((dim, idx) => (
                        <li key={idx}>• {dim.dimension}: {dim.score.toFixed(1)}/5.0</li>
                      ))}
                  </ul>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-2">Areas for Development</h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    {radarChartData
                      .sort((a, b) => a.score - b.score)
                      .slice(0, 3)
                      .map((dim, idx) => (
                        <li key={idx}>• {dim.dimension}: {dim.score.toFixed(1)}/5.0</li>
                      ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
