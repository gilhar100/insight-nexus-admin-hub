
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, BarChart3, Radar, Download, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useWorkshopData } from '@/hooks/useWorkshopData';

export const GroupWorkshopInsights: React.FC = () => {
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<number | undefined>();
  const { workshopData, workshops, isLoading, error } = useWorkshopData(selectedWorkshopId);

  // WOCA Zone classification
  const getZoneInfo = (score: number) => {
    if (score >= 4.2) return { name: 'Opportunity Zone', color: 'bg-green-500', description: 'Innovation, Motivation, Inspiration' };
    if (score >= 3.4) return { name: 'Comfort Zone', color: 'bg-blue-500', description: 'Stability, Operationality, Conservatism' };
    if (score >= 2.6) return { name: 'Apathy Zone', color: 'bg-yellow-500', description: 'Disengagement, Disconnection, Low Clarity' };
    return { name: 'War Zone', color: 'bg-red-500', description: 'Conflict, Survival, Fear' };
  };

  const handleWorkshopSelect = (value: string) => {
    setSelectedWorkshopId(Number(value));
  };

  const exportWorkshopData = () => {
    if (!workshopData) return;

    const exportData = {
      workshop_id: workshopData.workshop_id,
      participant_count: workshopData.participant_count,
      average_score: workshopData.average_score,
      analysis_date: new Date().toISOString(),
      participants: workshopData.participants
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `workshop-${workshopData.workshop_id}-analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Zone distribution calculation
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
  const groupScore = workshopData?.average_score || 0;
  const zoneInfo = getZoneInfo(groupScore);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Group Workshop Insights - WOCA Model
            </h2>
            <p className="text-gray-600">
              Analyze group dynamics and workshop effectiveness using the 36-question WOCA survey
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Workshop Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Select Workshop
          </CardTitle>
          <CardDescription>
            Choose a workshop from the woca_responses table to analyze group dynamics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={selectedWorkshopId?.toString()} onValueChange={handleWorkshopSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a workshop" />
                </SelectTrigger>
                <SelectContent>
                  {workshops.map((workshop) => (
                    <SelectItem key={workshop.id} value={workshop.id.toString()}>
                      <div className="flex flex-col">
                        <span className="font-medium">{workshop.name}</span>
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

      {/* Results Section - Only show when workshop is selected */}
      {isLoading && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">Loading workshop data...</div>
          </CardContent>
        </Card>
      )}

      {workshopData && !isLoading && (
        <>
          {/* WOCA Zone Classification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>WOCA Zone Classification</span>
                <Button variant="outline" size="sm" onClick={exportWorkshopData}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Analysis
                </Button>
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
                  {groupScore.toFixed(1)}
                </div>
                <div className="text-lg text-gray-600 mb-4">
                  Group Average Score ({workshopData.participant_count} participants)
                </div>
                <p className="text-gray-500 max-w-md mx-auto">
                  {zoneInfo.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Visualizations */}
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
                <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Distribution Chart will be implemented here</p>
                    <p className="text-sm">Showing response variation across participants</p>
                  </div>
                </div>
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
                <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center text-gray-500">
                    <Radar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Radar Chart will be implemented here</p>
                    <p className="text-sm">Comparing WOCA indicators across group</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Participant Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Participant Overview
              </CardTitle>
              <CardDescription>
                Individual scores and demographics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workshopData.participants.map((participant) => (
                  <div 
                    key={participant.id} 
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm">{participant.full_name}</span>
                      <Badge 
                        variant={
                          participant.overall_score && participant.overall_score > 4.0 
                            ? "default" 
                            : participant.overall_score && participant.overall_score < 3.0 
                            ? "destructive" 
                            : "secondary"
                        }
                      >
                        {participant.overall_score?.toFixed(1) || 'N/A'}
                      </Badge>
                    </div>
                    {participant.overall_score && (
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                          className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                          style={{ width: `${(participant.overall_score / 5) * 100}%` }}
                        />
                      </div>
                    )}
                    <div className="text-xs text-gray-500 space-y-1">
                      {participant.organization && <div>Org: {participant.organization}</div>}
                      {participant.profession && <div>Role: {participant.profession}</div>}
                      {participant.experience_years && <div>Experience: {participant.experience_years} years</div>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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
    </div>
  );
};
