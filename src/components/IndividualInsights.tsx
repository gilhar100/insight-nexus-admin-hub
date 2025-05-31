
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, BarChart3, Download, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNameSearch } from '@/hooks/useNameSearch';
import { useRespondentData } from '@/hooks/useRespondentData';
import { Badge } from '@/components/ui/badge';
import { SalimaRadarChart } from '@/components/SalimaRadarChart';
import { exportSalimaReport, exportSalimaReportCSV } from '@/utils/exportUtils';
import { useToast } from '@/hooks/use-toast';
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

export const IndividualInsights: React.FC = () => {
  const [selectedRespondent, setSelectedRespondent] = useState<string>('');
  const [selectedName, setSelectedName] = useState<string>('');
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { names, isLoading, error } = useNameSearch(searchQuery);
  const { data: respondentData, isLoading: isDataLoading, error: dataError, fetchRespondentData } = useRespondentData();
  const { toast } = useToast();

  const handleNameSelect = (nameOption: any) => {
    setSelectedName(nameOption.name);
    setSelectedRespondent(nameOption.id);
    setSelectedSource(nameOption.source);
    setSearchQuery(nameOption.name);
    setIsDropdownOpen(false);
    console.log('Selected respondent:', nameOption);
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
      case 'woca': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Prepare radar chart data
  const radarChartData = respondentData ? [
    { dimension: 'Strategy', score: respondentData.dimensions.strategy, color: '#6366F1' },
    { dimension: 'Adaptability', score: respondentData.dimensions.adaptability, color: '#8B5CF6' },
    { dimension: 'Learning', score: respondentData.dimensions.learning, color: '#06B6D4' },
    { dimension: 'Inspiration', score: respondentData.dimensions.inspiration, color: '#F59E0B' },
    { dimension: 'Meaning', score: respondentData.dimensions.meaning, color: '#10B981' },
    { dimension: 'Authenticity', score: respondentData.dimensions.authenticity, color: '#EC4899' }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Individual Insights - SALIMA Model
            </h2>
            <p className="text-gray-600">
              Analyze individual responses to the 90-question SALIMA survey across six key dimensions
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <User className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Respondent Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Select Respondent
          </CardTitle>
          <CardDescription>
            Search and select an individual from survey_responses, colleague_survey_responses, or woca_responses tables
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Input
                placeholder="Search respondents by name or email..."
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
                        <CommandEmpty>No respondents found.</CommandEmpty>
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

      {/* Results Section - Only show when respondent data is loaded */}
      {respondentData && (
        <>
          {/* Overall Score Summary */}
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

          {/* Dimension Scores */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Radar Chart */}
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

            {/* Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Dimension Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {radarChartData.map((dimension, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{dimension.dimension}</span>
                        <span className="text-sm text-gray-600">{dimension.score.toFixed(1)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            backgroundColor: dimension.color,
                            width: `${(dimension.score / 5) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI-Generated Insights */}
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
