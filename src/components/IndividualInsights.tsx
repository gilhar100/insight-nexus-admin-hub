
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, BarChart3, Radar, Download, User, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNameSearch } from '@/hooks/useNameSearch';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export const IndividualInsights: React.FC = () => {
  const [selectedRespondent, setSelectedRespondent] = useState<string>('');
  const [selectedName, setSelectedName] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { names, isLoading, error } = useNameSearch(searchQuery);

  const salimaeDimensions = [
    { name: 'Strategy', score: 4.2, color: '#6366F1' },
    { name: 'Adaptability', score: 3.8, color: '#8B5CF6' },
    { name: 'Learning', score: 4.5, color: '#06B6D4' },
    { name: 'Inspiration', score: 3.9, color: '#F59E0B' },
    { name: 'Meaning', score: 4.1, color: '#10B981' },
    { name: 'Authenticity', score: 4.3, color: '#EC4899' }
  ];

  const overallScore = salimaeDimensions.reduce((sum, dim) => sum + dim.score, 0) / salimaeDimensions.length;

  const handleNameSelect = (nameOption: any) => {
    setSelectedName(nameOption.name);
    setSelectedRespondent(nameOption.id);
    setSearchQuery(nameOption.name);
    setIsDropdownOpen(false);
    console.log('Selected respondent:', nameOption);
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'survey': return 'bg-blue-100 text-blue-800';
      case 'colleague': return 'bg-green-100 text-green-800';
      case 'woca': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
            Search and select an individual from survey_responses, colleague_survey_responses, or woca tables
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
            <Button className="self-end" disabled={!selectedRespondent}>
              Analyze Results
            </Button>
          </div>
          {selectedName && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Selected: <span className="font-medium">{selectedName}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section - Only show when respondent is selected */}
      {selectedRespondent && (
        <>
          {/* Overall Score Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>SALIMA Overall Score (SLQ)</span>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="text-6xl font-bold text-blue-600 mb-2">
                    {overallScore.toFixed(1)}
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
            {/* Radar Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Radar className="h-5 w-5 mr-2" />
                  Radar Chart - Six Dimensions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center text-gray-500">
                    <Radar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Radar Chart will be implemented here</p>
                    <p className="text-sm">Comparing all six SALIMA dimensions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bar Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Dimension Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salimaeDimensions.map((dimension, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{dimension.name}</span>
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

          {/* Insights */}
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Insights</CardTitle>
              <CardDescription>
                Automatic analysis of strengths and growth areas based on individual patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Key Strengths</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Exceptional learning orientation (4.5/5.0)</li>
                    <li>• Strong authenticity in leadership style</li>
                    <li>• Well-developed strategic thinking capabilities</li>
                  </ul>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-2">Growth Opportunities</h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Adaptability could be enhanced (3.8/5.0)</li>
                    <li>• Consider developing inspirational leadership</li>
                    <li>• Focus on meaning-making in complex situations</li>
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
