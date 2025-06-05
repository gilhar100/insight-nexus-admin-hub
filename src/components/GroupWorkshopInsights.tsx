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
import { getHebrewZoneInfo, CHART_LABELS_HEBREW } from '@/utils/wocaHebrewConstants';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { WocaParameterDisplay } from '@/components/WocaParameterDisplay';

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

  // Zone distribution calculation for workshop using new method
  const getZoneDistribution = () => {
    if (!workshopData) return {};
    return workshopData.zone_distribution;
  };

  const zoneDistribution = getZoneDistribution();
  const currentData = viewMode === 'workshop' ? workshopData : selectedParticipant;
  
  // For workshop view, use dominant zone; for individual, calculate from their WOCA scores
  const getCurrentZoneInfo = () => {
    if (viewMode === 'workshop' && workshopData) {
      return {
        name: workshopData.dominant_zone,
        color: `bg-[${workshopData.dominant_zone_color}]`,
        description: `האזור התודעתי הדומיננטי של הקבוצה`
      };
    }
    if (viewMode === 'individual' && selectedParticipant) {
      return {
        name: selectedParticipant.woca_zone || 'לא זמין',
        color: `bg-[${selectedParticipant.woca_zone_color || '#666666'}]`,
        description: 'אזור תודעתי אישי'
      };
    }
    return { name: 'לא זמין', color: 'bg-gray-500', description: 'לא זמין' };
  };

  const zoneInfo = getCurrentZoneInfo();
  const currentScore = viewMode === 'workshop' 
    ? workshopData?.average_score || 0 
    : selectedParticipant?.overall_score || 0;

  const getDisplayTitle = () => {
    if (viewMode === 'workshop' && workshopData) return `סדנה ${workshopData.workshop_id}`;
    if (viewMode === 'individual' && selectedParticipant) return selectedParticipant.full_name;
    return 'ניתוח WOCA';
  };

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                לוח בקרה לניתוח WOCA
              </h2>
              <p className="text-gray-600">
                חפשו לפי משתתף בודד או נתחו קבוצות סדנה באמצעות שאלון 36 השאלות של WOCA
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
              חיפוש ובחירה
            </CardTitle>
            <CardDescription>
              חפשו משתתפים בודדים או בחרו מספר סדנה לניתוח קבוצתי
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search for individuals */}
              <div className="space-y-2">
                <label className="text-sm font-medium">חיפוש משתתף בודד</label>
                <div className="relative">
                  <Input
                    placeholder="חפשו משתתפי WOCA לפי שם או אימייל..."
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
                            <CommandEmpty>מחפש...</CommandEmpty>
                          )}
                          {!isSearchLoading && searchResults.length === 0 && (
                            <CommandEmpty>לא נמצאו משתתפים.</CommandEmpty>
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
                                      <span className="text-xs text-blue-600">סדנה {participant.workshop_id}</span>
                                    )}
                                  </div>
                                  <Badge>
                                    {participant.overall_score?.toFixed(1) || 'לא זמין'}
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

              <div className="text-center text-gray-500">או</div>

              {/* Workshop selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">בחירת מספר סדנה</label>
                <Select value={selectedWorkshopId?.toString()} onValueChange={handleWorkshopSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחרו סדנה לניתוח קבוצתי" />
                  </SelectTrigger>
                  <SelectContent>
                    {workshops.map((workshop) => (
                      <SelectItem key={workshop.id} value={workshop.id.toString()}>
                        <div className="flex flex-col">
                          <span className="font-medium">סדנה {workshop.id}</span>
                          <span className="text-sm text-gray-500">
                            {workshop.participant_count} משתתפים • {new Date(workshop.date).toLocaleDateString('he-IL')}
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
              <div className="text-gray-500">טוען נתונים...</div>
            </CardContent>
          </Card>
        )}

        {currentData && !isLoading && (
          <>
            {/* WOCA Zone Classification */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>סיווג אזור תודעתי WOCA</span>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setPresenterMode(true)}
                    >
                      <Maximize className="h-4 w-4 mr-2" />
                      מצב מציג
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowNames(!showNames)}
                    >
                      {showNames ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                      {showNames ? 'הסתר שמות' : 'הצג שמות'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportWorkshopData}>
                      <Download className="h-4 w-4 mr-2" />
                      יצא ניתוח
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
                  {viewMode === 'workshop' && workshopData && (
                    <>
                      <div className="text-2xl font-bold text-gray-900 mb-2">
                        האזור התודעתי הדומיננטי
                      </div>
                      <div className="text-lg text-gray-600 mb-4">
                        מבוסס על הפרמטר עם הציון הממוצע הגבוה ביותר
                      </div>
                      <div className="text-lg text-gray-600 mb-4">
                        {workshopData.participant_count} משתתפים
                      </div>
                    </>
                  )}
                  {viewMode === 'individual' && selectedParticipant && (
                    <>
                      <div className="text-2xl font-bold text-gray-900 mb-2">
                        {zoneInfo.name}
                      </div>
                      <div className="text-lg text-gray-600 mb-4">
                        אזור תודעתי אישי
                      </div>
                    </>
                  )}
                  <p className="text-gray-500 max-w-md mx-auto">
                    {zoneInfo.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* WOCA Parameters Display */}
            {viewMode === 'workshop' && workshopData && (
              <WocaParameterDisplay 
                scores={{
                  war: workshopData.participants.reduce((sum, p) => sum + (p.woca_scores?.war || 0), 0) / workshopData.participants.length,
                  opportunity: workshopData.participants.reduce((sum, p) => sum + (p.woca_scores?.opportunity || 0), 0) / workshopData.participants.length,
                  comfort: workshopData.participants.reduce((sum, p) => sum + (p.woca_scores?.comfort || 0), 0) / workshopData.participants.length,
                  apathy: workshopData.participants.reduce((sum, p) => sum + (p.woca_scores?.apathy || 0), 0) / workshopData.participants.length
                }}
                dominantZone={workshopData.dominant_zone}
                title="פרמטרי WOCA - ממוצע קבוצתי"
              />
            )}

            {viewMode === 'individual' && selectedParticipant && (
              <WocaParameterDisplay 
                scores={selectedParticipant.woca_scores}
                dominantZone={selectedParticipant.woca_zone}
                title="פרמטרי WOCA - ניתוח אישי"
              />
            )}

            {/* Visualizations */}
            {viewMode === 'workshop' && workshopData && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Group Distribution Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2" />
                        התפלגות אזורים תודעתיים
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
                        פרמטרי WOCA - ממוצע
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <WocaRadarChart participants={workshopData.participants} />
                    </CardContent>
                  </Card>
                </div>

                {/* Zone Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(zoneDistribution).map(([zone, count]) => {
                    const participant = workshopData.participants.find(p => p.woca_zone === zone);
                    const color = participant?.woca_zone_color || '#666666';
                    
                    return (
                      <Card key={zone} className="border-2" style={{ borderColor: color }}>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold mb-1" style={{ color }}>
                            {count}
                          </div>
                          <div className="text-sm font-medium" style={{ color }}>
                            {zone}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {Math.round((count / workshopData.participant_count) * 100)}%
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}

            {/* Individual participant details */}
            {viewMode === 'individual' && selectedParticipant && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    פרטי משתתף
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div><strong>שם:</strong> {showNames ? selectedParticipant.full_name : 'אנונימי'}</div>
                      <div><strong>אימייל:</strong> {showNames ? selectedParticipant.email : 'מוסתר'}</div>
                      {selectedParticipant.organization && (
                        <div><strong>ארגון:</strong> {selectedParticipant.organization}</div>
                      )}
                      {selectedParticipant.profession && (
                        <div><strong>מקצוע:</strong> {selectedParticipant.profession}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      {selectedParticipant.workshop_id && (
                        <div><strong>סדנה:</strong> {selectedParticipant.workshop_id}</div>
                      )}
                      {selectedParticipant.age && (
                        <div><strong>גיל:</strong> {selectedParticipant.age}</div>
                      )}
                      {selectedParticipant.experience_years && (
                        <div><strong>ניסיון:</strong> {selectedParticipant.experience_years} שנים</div>
                      )}
                      {selectedParticipant.created_at && (
                        <div><strong>תאריך סקר:</strong> {new Date(selectedParticipant.created_at).toLocaleDateString('he-IL')}</div>
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
