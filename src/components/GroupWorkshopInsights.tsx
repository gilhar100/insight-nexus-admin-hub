
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, BarChart3, Radar, Download, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const GroupWorkshopInsights: React.FC = () => {
  const [selectedWorkshop, setSelectedWorkshop] = useState<string>('');

  // Mock data for demonstration
  const mockWorkshops = [
    { id: '1', name: 'Leadership Development Q1', participants: 24, date: '2024-01-15' },
    { id: '2', name: 'Team Building Workshop', participants: 18, date: '2024-02-20' },
    { id: '3', name: 'Innovation Sprint', participants: 32, date: '2024-03-10' },
    { id: '4', name: 'Culture Assessment', participants: 45, date: '2024-03-25' }
  ];

  // WOCA Zone classification
  const getZoneInfo = (score: number) => {
    if (score >= 4.2) return { name: 'Opportunity Zone', color: 'opportunity', description: 'Innovation, Motivation, Inspiration' };
    if (score >= 3.4) return { name: 'Comfort Zone', color: 'comfort', description: 'Stability, Operationality, Conservatism' };
    if (score >= 2.6) return { name: 'Apathy Zone', color: 'apathy', description: 'Disengagement, Disconnection, Low Clarity' };
    return { name: 'War Zone', color: 'war', description: 'Conflict, Survival, Fear' };
  };

  const groupScore = 3.7; // Mock group average
  const zoneInfo = getZoneInfo(groupScore);

  const participantScores = [
    { name: 'Alice Johnson', score: 4.1 },
    { name: 'Bob Smith', score: 3.2 },
    { name: 'Carol Davis', score: 4.4 },
    { name: 'David Wilson', score: 3.8 },
    { name: 'Eva Martinez', score: 3.1 },
    { name: 'Frank Brown', score: 4.2 }
  ];

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
              <Select value={selectedWorkshop} onValueChange={setSelectedWorkshop}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a workshop" />
                </SelectTrigger>
                <SelectContent>
                  {mockWorkshops.map((workshop) => (
                    <SelectItem key={workshop.id} value={workshop.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{workshop.name}</span>
                        <span className="text-sm text-gray-500">
                          {workshop.participants} participants • {workshop.date}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="self-end" disabled={!selectedWorkshop}>
              Analyze Workshop
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section - Only show when workshop is selected */}
      {selectedWorkshop && (
        <>
          {/* WOCA Zone Classification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>WOCA Zone Classification</span>
                <Button variant="outline" size="sm">
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
                    className={`text-lg px-4 py-2 bg-${zoneInfo.color} text-white`}
                  >
                    {zoneInfo.name}
                  </Badge>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {groupScore.toFixed(1)}
                </div>
                <div className="text-lg text-gray-600 mb-4">
                  Group Average Score
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
                Individual scores and outlier identification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {participantScores.map((participant, index) => (
                  <div 
                    key={index} 
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm">{participant.name}</span>
                      <Badge 
                        variant={participant.score > 4.0 ? "default" : participant.score < 3.0 ? "destructive" : "secondary"}
                      >
                        {participant.score.toFixed(1)}
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${(participant.score / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Zone Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-opportunity-light border-opportunity">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-opportunity-dark mb-1">2</div>
                <div className="text-sm text-opportunity-dark">Opportunity Zone</div>
                <div className="text-xs text-gray-600">4.2-5.0</div>
              </CardContent>
            </Card>
            <Card className="bg-comfort-light border-comfort">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-comfort-dark mb-1">3</div>
                <div className="text-sm text-comfort-dark">Comfort Zone</div>
                <div className="text-xs text-gray-600">3.4-4.1</div>
              </CardContent>
            </Card>
            <Card className="bg-apathy-light border-apathy">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-apathy-dark mb-1">1</div>
                <div className="text-sm text-apathy-dark">Apathy Zone</div>
                <div className="text-xs text-gray-600">2.6-3.3</div>
              </CardContent>
            </Card>
            <Card className="bg-war-light border-war">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-war-dark mb-1">0</div>
                <div className="text-sm text-war-dark">War Zone</div>
                <div className="text-xs text-gray-600">1.0-2.5</div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};
