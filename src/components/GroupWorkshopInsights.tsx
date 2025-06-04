
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Users, BarChart3, Radar, Download, TrendingUp, Eye, EyeOff, Maximize, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useWorkshopData } from '@/hooks/useWorkshopData';
import { useWocaSearch } from '@/hooks/useWocaSearch';
import { WorkshopDistributionChart } from '@/components/WorkshopDistributionChart';
import { WocaRadarChart } from '@/components/WocaRadarChart';
import { PresenterMode } from '@/components/PresenterMode';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

export const GroupWorkshopInsights: React.FC = () => {
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<number | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [showNames, setShowNames] = useState(false);
  const [presenterMode, setPresenterMode] = useState(false);
  const [viewMode, setViewMode] = useState<'workshop' | 'individual'>('workshop');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const { workshopData, workshops, isLoading, error } = useWorkshopData(selectedWorkshopId);
  const { participants: searchResults, isLoading: isSearchLoading } = useWocaSearch(searchQuery);

  // WOCA Zone classification
  const getZoneInfo = (score: number) => {
    if (score >= 4.2) return { name: 'Opportunity Zone', color: 'bg-green-500', description: 'Innovation, Motivation, Inspiration' };
    if (score >= 3.4) return { name: 'Comfort Zone', color: 'bg-blue-500', description: 'Stability, Operationality, Conservatism' };
    if (score >= 2.6) return { name: 'Apathy Zone', color: 'bg-yellow-500', description: 'Disengagement, Disconnection, Low Clarity' };
    return { name: 'War Zone', color: 'bg-red-500', description: 'Conflict, Survival, Fear' };
  };

  const handleWorkshopSelect = (value: string) => {
    setSelectedWorkshopId(Number(value));
    setSelectedParticipant(null);
    setViewMode('workshop');
  };

  const handleParticipantSelect = (participant: any) => {
    setSelectedParticipant(participant);
    setSelectedWorkshopId(undefined);
    setViewMode('individual');
    setSearchQuery(participant.full_name);
    setIsDropdownOpen(false);
  };

  const exportWorkshopData = () => {
    const dataToExport = viewMode === 'workshop' ? workshopData : selectedParticipant;
    if (!dataToExport) return;

    const exportData = {
      type: viewMode,
      ...(viewMode === 'workshop' ? {
        workshop_id: dataToExport.workshop_id,
        participant_count: dataToExport.participant_count,
        average_score: dataToExport.average_score,
        participants: dataToExport.participants.map((p: any) => ({
          ...p,
          full_name: showNames ? p.full_name : `Participant ${dataToExport.participants.indexOf(p) + 1}`
        }))
      } : {
        participant: {
          ...dataToExport,
          full_name: showNames ? dataToExport.full_name : 'Anonymous Participant'
        }
      }),
      analysis_date: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    const identifier = viewMode === 'workshop' 
      ? `workshop-${dataToExport.workshop_id}` 
      : `participant-${dataToExport.id}`;
    link.download = `woca-${identifier}-analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Zone distribution calculation for workshop
  const getZoneDistribution = () => {
    if (!workshopData) return { opportunity: 0, comfort: 0, apathy: 0, war: 0 };
    
    return workshopData.participants.reduce((acc, participant) => {
      if (participant.overall_score === null) return acc;
      
      const score = participant.overall_score;
      if (score >= 4.2) acc.opportunity++;
      else if (score >= 3.4) acc.comfort++;
      else if (score >= 2.6) acc.apathy++;
      else acc.war++;
      
      return acc;
    }, { opportunity: 0, comfort: 0, apathy: 0, war: 0 });
  };

  const zoneDistribution = getZoneDistribution();
  const currentData = viewMode === 'workshop' ? workshopData : selectedParticipant;
  const currentScore = viewMode === 'workshop' 
    ? workshopData?.average_score || 0 
    : selectedParticipant?.overall_score || 0;
  const zoneInfo = getZoneInfo(currentScore);

  const getDisplayTitle = () => {
    if (viewMode === 'workshop' && workshopData) return `Workshop ${workshopData.workshop_id}`;
    if (viewMode === 'individual' && selectedParticipant) return selectedParticipant.full_name;
    return 'WOCA Analysis';
  };

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                WOCA Analysis Dashboard
              </h2>
              <p className="text-gray-600">
                Search by individual participant or analyze workshop groups using the 36-question WOCA survey
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Search & Select
            </CardTitle>
            <CardDescription>
              Search for individual participants or select a workshop number for group analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search for individuals */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Individual Participant</label>
                <div className="relative">
                  <Input
                    placeholder="Search WOCA participants by name or email..."
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
                  
                  {/* Search Results Dropdown */}
                  {isDropdownOpen && searchQuery.length >= 2 && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                      <Command>
                        <CommandList>
                          {isSearchLoading && (
                            <CommandEmpty>Searching...</CommandEmpty>
                          )}
                          {!isSearchLoading && searchResults.length === 0 && (
                            <CommandEmpty>No participants found.</CommandEmpty>
                          )}
                          {searchResults.length > 0 && (
                            <CommandGroup>
                              {searchResults.map((participant) => (
                                <CommandItem
                                  key={participant.id}
                                  onSelect={() => handleParticipantSelect(participant)}
                                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium">{participant.full_name}</span>
                                    <span className="text-sm text-gray-500">{participant.email}</span>
                                    {participant.workshop_id && (
                                      <span className="text-xs text-blue-600">Workshop {participant.workshop_id}</span>
                                    )}
                                  </div>
                                  <Badge>
                                    {participant.overall_score?.toFixed(1) || 'N/A'}
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
              </div>

              <div className="text-center text-gray-500">OR</div>

              {/* Workshop selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Workshop Number</label>
                <Select value={selectedWorkshopId?.toString()} onValueChange={handleWorkshopSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a workshop for group analysis" />
                  </SelectTrigger>
                  <SelectContent>
                    {workshops.map((workshop) => (
                      <SelectItem key={workshop.id} value={workshop.id.toString()}>
                        <div className="flex flex-col">
                          <span className="font-medium">Workshop {workshop.id}</span>
                          <span className="text-sm text-gray-500">
                            {workshop.participant_count} participants • {new Date(workshop.date).toLocaleDateString()}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {isLoading && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-500">Loading data...</div>
            </CardContent>
          </Card>
        )}

        {currentData && !isLoading && (
          <>
            {/* WOCA Zone Classification */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>WOCA Zone Classification</span>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setPresenterMode(true)}
                    >
                      <Maximize className="h-4 w-4 mr-2" />
                      Presenter Mode
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowNames(!showNames)}
                    >
                      {showNames ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                      {showNames ? 'Hide Names' : 'Show Names'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportWorkshopData}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Analysis
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-8">
                  <div className="mb-6">
                    <Badge 
                      variant="secondary" 
                      className={`text-lg px-4 py-2 ${zoneInfo.color} text-white`}
                    >
                      {zoneInfo.name}
                    </Badge>
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {currentScore.toFixed(1)}
                  </div>
                  <div className="text-lg text-gray-600 mb-4">
                    {viewMode === 'workshop' 
                      ? `Group Average Score (${workshopData?.participant_count} participants)`
                      : 'Individual Score'
                    }
                  </div>
                  <p className="text-gray-500 max-w-md mx-auto">
                    {zoneInfo.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Visualizations */}
            {viewMode === 'workshop' && workshopData && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Group Distribution Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2" />
                        Score Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <WorkshopDistributionChart participants={workshopData.participants} />
                    </CardContent>
                  </Card>

                  {/* Radar Chart Comparison */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Radar className="h-5 w-5 mr-2" />
                        WOCA Indicators Radar
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <WocaRadarChart participants={workshopData.participants} />
                    </CardContent>
                  </Card>
                </div>

                {/* Zone Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-700 mb-1">{zoneDistribution.opportunity}</div>
                      <div className="text-sm text-green-700">Opportunity Zone</div>
                      <div className="text-xs text-gray-600">4.2-5.0</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-700 mb-1">{zoneDistribution.comfort}</div>
                      <div className="text-sm text-blue-700">Comfort Zone</div>
                      <div className="text-xs text-gray-600">3.4-4.1</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-700 mb-1">{zoneDistribution.apathy}</div>
                      <div className="text-sm text-yellow-700">Apathy Zone</div>
                      <div className="text-xs text-gray-600">2.6-3.3</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-red-50 border-red-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-red-700 mb-1">{zoneDistribution.war}</div>
                      <div className="text-sm text-red-700">War Zone</div>
                      <div className="text-xs text-gray-600">1.0-2.5</div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            {/* Individual participant details */}
            {viewMode === 'individual' && selectedParticipant && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Participant Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div><strong>Name:</strong> {showNames ? selectedParticipant.full_name : 'Anonymous'}</div>
                      <div><strong>Email:</strong> {showNames ? selectedParticipant.email : 'Hidden'}</div>
                      {selectedParticipant.organization && (
                        <div><strong>Organization:</strong> {selectedParticipant.organization}</div>
                      )}
                      {selectedParticipant.profession && (
                        <div><strong>Profession:</strong> {selectedParticipant.profession}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      {selectedParticipant.workshop_id && (
                        <div><strong>Workshop:</strong> {selectedParticipant.workshop_id}</div>
                      )}
                      {selectedParticipant.age && (
                        <div><strong>Age:</strong> {selectedParticipant.age}</div>
                      )}
                      {selectedParticipant.experience_years && (
                        <div><strong>Experience:</strong> {selectedParticipant.experience_years} years</div>
                      )}
                      {selectedParticipant.created_at && (
                        <div><strong>Survey Date:</strong> {new Date(selectedParticipant.created_at).toLocaleDateString()}</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      {/* Presenter Mode */}
      <PresenterMode 
        isOpen={presenterMode}
        onClose={() => setPresenterMode(false)}
        type="woca"
        data={currentData}
        title={getDisplayTitle()}
      />
    </>
  );
};
