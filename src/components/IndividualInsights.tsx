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
import { PresenterMode } from '@/components/PresenterMode';

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
  const [isPresenterMode, setIsPresenterMode] = useState(false);
  
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

  const content = (
    <div className={`space-y-8${isPresenterMode ? ' presenter-mode' : ''}`} dir="rtl">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="flex items-center justify-between">
          <div className="text-right">
            <h2 className={`text-3xl font-bold text-gray-900 mb-4 ${isPresenterMode ? 'text-5xl' : ''}`}>
              תובנות אישיות וקבוצתיות - מודל SALIMA
            </h2>
            <p className={`text-gray-600 text-lg ${isPresenterMode ? 'text-2xl' : ''}`}>
              ניתוח תגובות אישיות או סטטיסטיקות קבוצתיות מסקר SALIMA בן 90 השאלות
            </p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg">
            <User className={`h-10 w-10 text-blue-600 ${isPresenterMode ? 'h-16 w-16' : ''}`} />
          </div>
        </div>
      </div>

      {/* Group Search Section - Hidden in presenter mode */}
      {!isPresenterMode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-right">
              <Users className="h-5 w-5 ml-2" />
              ניתוח קבוצתי
            </CardTitle>
            <CardDescription className="text-right">
              חיפוש וניתוח סטטיסטיקות קבוצתיות לפי מספר קבוצה
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Input
                  placeholder="חיפוש לפי מספר קבוצה..."
                  value={groupSearchQuery}
                  onChange={(e) => setGroupSearchQuery(e.target.value)}
                  className="w-full text-right"
                />
                {groupSearchQuery && !selectedGroup && filteredGroups.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border rounded-md shadow-lg max-h-40 overflow-y-auto">
                    {filteredGroups.slice(0, 10).map((groupNumber) => (
                      <button
                        key={groupNumber}
                        onClick={() => handleGroupSelect(groupNumber)}
                        className="w-full text-right px-3 py-2 hover:bg-gray-100 border-b last:border-b-0"
                      >
                        קבוצה {groupNumber}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {selectedGroup && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedGroup(null);
                    setGroupSearchQuery('');
                  }}
                >
                  נקה בחירה
                </Button>
              )}
            </div>
            {selectedGroup && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800 text-right">
                  נבחרה: <span className="font-medium">קבוצה {selectedGroup}</span>
                  {groupData && <span className="ml-2">({groupData.participant_count} משתתפים)</span>}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Individual Respondent Selection - Hidden in presenter mode */}
      {!isPresenterMode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-right">
              <Search className="h-5 w-5 ml-2" />
              ניתוח אישי
            </CardTitle>
            <CardDescription className="text-right">
              חיפוש ובחירת יחיד מטבלאות survey_responses או colleague_survey_responses (נתוני SALIMA בלבד)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Input
                  placeholder="חיפוש נבדקי SALIMA לפי שם או אימייל..."
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
                  className="w-full text-right"
                />
              
                {/* Dropdown Results */}
                {isDropdownOpen && (searchQuery.length >= 2) && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border rounded-md shadow-lg max-h-80 overflow-y-auto">
                    <Command>
                      <CommandList>
                        {isLoading && (
                          <CommandEmpty>מחפש...</CommandEmpty>
                        )}
                        {error && (
                          <CommandEmpty className="text-red-500">שגיאה: {error}</CommandEmpty>
                        )}
                        {!isLoading && !error && names.length === 0 && (
                          <CommandEmpty>לא נמצאו נבדקי SALIMA.</CommandEmpty>
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
                                <div className="flex flex-col text-right">
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
                {isDataLoading ? 'מנתח...' : 'נתח תוצאות'}
              </Button>
            </div>
            {selectedName && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 text-right">
                  נבחר: <span className="font-medium">{selectedName}</span>
                  {selectedSource && <span className="ml-2">({selectedSource})</span>}
                </p>
              </div>
            )}
            {dataError && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-red-800 text-right">שגיאה: {dataError}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Group Results Section */}
      {groupData && (
        <div className={isPresenterMode ? "presenter-grid" : "grid grid-cols-1 lg:grid-cols-2 gap-8"}>
          {/* Group Overall Score Summary */}
          <div className="card">
            <div className="card-header text-center">
              <div className={`flex items-center justify-between text-right card-title${isPresenterMode ? ' flex-col gap-4' : ''}`}>
                <span className={`font-bold${isPresenterMode ? ' text-4xl' : ' text-2xl'}`}>
                  קבוצה {groupData.group_number} - ציונים ממוצעים במודל SALIMA
                </span>
                <span className={`bg-green-100 text-green-800 rounded badge${isPresenterMode ? ' text-2xl px-8 py-4' : ''}`}>
                  {groupData.participant_count} משתתפים
                </span>
              </div>
            </div>
            <div className="card-content">
              <div className={`score-display`}>
                <div className={`font-bold text-green-600 mb-4 score-number`}>
                  {groupData.averages.overall.toFixed(1)}
                </div>
                <div className={`text-gray-600 font-semibold score-label`}>
                  ציון SLQ ממוצע
                </div>
                <div className={`mt-6 text-gray-500 score-description`}>
                  ממוצע קבוצתי בכל שישת ממדי SALIMA
                </div>
              </div>
            </div>
          </div>

          {/* Dimension Strength Pie Chart */}
          <div className="card">
            <div className="card-header text-center">
              <div className={`flex items-center justify-center text-right card-title${isPresenterMode ? " text-3xl" : ""}`}>
                <span className={`ml-3`}><svg className={isPresenterMode ? "h-10 w-10" : "h-6 w-6"} style={{display: "inline-block"}} viewBox="0 0 24 24"><path fill="currentColor" d="M5 10c-1.656 0-3 1.343-3 3 0 1.656 1.344 3 3 3h2v-6H5zm2 9V8c0-1.104.896-2 2-2h6v2H9v11H7zm8-2h2c1.657 0 3-1.344 3-3 0-1.657-1.343-3-3-3v6z"/></svg></span>
                התפלגות חוזקות הממדים
              </div>
            </div>
            <div className="card-content">
              <div className="h-[520px] w-full flex items-center justify-center">
                <SalimaDimensionPieChart participants={groupData.participants} />
              </div>
            </div>
          </div>

          {/* Score Distribution Chart - Full Width */}
          {groupData.participant_count > 5 && (
            <div className="card" style={{gridColumn: isPresenterMode ? "span 2" : undefined}}>
              <div className="card-header text-center">
                <div className={`flex items-center justify-center text-right card-title${isPresenterMode ? " text-3xl" : ""}`}>
                  <span className="ml-3"><svg className={isPresenterMode ? "h-10 w-10" : "h-6 w-6"} style={{display: "inline-block"}} viewBox="0 0 24 24"><path fill="currentColor" d="M5 10c-1.656 0-3 1.343-3 3 0 1.656 1.344 3 3 3h2v-6H5zm2 9V8c0-1.104.896-2 2-2h6v2H9v11H7zm8-2h2c1.657 0 3-1.344 3-3 0-1.657-1.343-3-3-3v6z"/></svg></span>
                  התפלגות טווחי ציונים
                </div>
              </div>
              <div className="card-content">
                <div className="h-[520px] w-full flex items-center justify-center">
                  <SalimaScoreDistributionChart participants={groupData.participants} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Individual Results Section */}
      {respondentData && (
        <div className={isPresenterMode ? "presenter-grid" : "grid grid-cols-1 lg:grid-cols-2 gap-8"}>
          {/* Individual Overall Score Summary */}
          <div className="card">
            <div className="card-header text-center">
              <div className={`flex items-center justify-between text-right card-title${isPresenterMode ? ' flex-col gap-4' : ''}`}>
                <span className={`font-bold${isPresenterMode ? ' text-4xl' : ' text-2xl'}`}>
                  ציון SALIMA כללי (SLQ)
                </span>
                {!isPresenterMode && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 ml-2" />
                        ייצא דוח
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleExport('json')}>
                        ייצא כ-JSON
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport('csv')}>
                        ייצא כ-CSV
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
            <div className="card-content">
              <div className={`score-display`}>
                <div className={`font-bold text-blue-600 mb-4 score-number`}>
                  {respondentData.overallScore.toFixed(1)}
                </div>
                <div className={`text-gray-600 font-semibold score-label`}>
                  מתוך 5.0
                </div>
                <div className={`mt-6 text-gray-500 score-description`}>
                  ממוצע בכל שישת ממדי SALIMA
                </div>
              </div>
            </div>
          </div>

          {/* Individual Radar Chart */}
          <div className="card">
            <div className="card-header text-center">
              <div className={`flex items-center justify-center text-right card-title${isPresenterMode ? " text-3xl" : ""}`}>
                <span className="ml-2"><svg className={isPresenterMode ? "h-10 w-10" : "h-6 w-6"} style={{display: "inline-block"}} viewBox="0 0 24 24"><path fill="currentColor" d="M5 10c-1.656 0-3 1.343-3 3 0 1.656 1.344 3 3 3h2v-6H5zm2 9V8c0-1.104.896-2 2-2h6v2H9v11H7zm8-2h2c1.657 0 3-1.344 3-3 0-1.657-1.343-3-3-3v6z"/></svg></span>
                גרף רדאר - שישה ממדים
              </div>
            </div>
            <div className="card-content">
              <div className="h-[520px] w-full flex items-center justify-center">
                <SalimaRadarChart data={radarChartData} />
              </div>
            </div>
          </div>

          {/* Individual Intensity Bars */}
          <div className="card">
            <div className="card-header text-center">
              <div className={`flex items-center justify-center text-right card-title${isPresenterMode ? " text-3xl" : ""}`}>
                <span className="ml-2"><svg className={isPresenterMode ? "h-10 w-10" : "h-6 w-6"} style={{display: "inline-block"}} viewBox="0 0 24 24"><path fill="currentColor" d="M5 10c-1.656 0-3 1.343-3 3 0 1.656 1.344 3 3 3h2v-6H5zm2 9V8c0-1.104.896-2 2-2h6v2H9v11H7zm8-2h2c1.657 0 3-1.344 3-3 0-1.657-1.343-3-3-3v6z"/></svg></span>
                עוצמת הממדים
              </div>
            </div>
            <div className="card-content">
              <div className="w-full">
                {radarChartData.map((dimension, index) => (
                  <SalimaIntensityBar
                    key={index}
                    dimension={dimension.dimension}
                    score={dimension.score}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Individual AI-Generated Insights */}
          <div className="card" style={{gridColumn: isPresenterMode ? "span 2" : undefined}}>
            <div className="card-header text-center">
              <div className={`card-title${isPresenterMode ? " text-3xl" : ""}`}>סיכום הניתוח</div>
              <div className={`text-right${isPresenterMode ? " text-xl" : ""}`}>
                בהתבסס על תגובות הסקר בפועל מנתוני {respondentData.source}
              </div>
            </div>
            <div className="card-content">
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-8${isPresenterMode ? ' gap-12' : ''}`}>
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h4 className={`font-semibold text-green-800 mb-4 text-right ${isPresenterMode ? 'text-2xl' : ''}`}>
                    ממדים בעלי הציון הגבוה ביותר
                  </h4>
                  <ul className={`text-sm text-green-700 space-y-2 ${isPresenterMode ? 'text-lg space-y-3' : ''}`}>
                    {radarChartData
                      .sort((a, b) => b.score - a.score)
                      .slice(0, 3)
                      .map((dim, idx) => (
                        <li key={idx} className="text-right font-medium">• {dim.dimension}: {dim.score.toFixed(1)}/5.0</li>
                      ))}
                  </ul>
                </div>
                <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
                  <h4 className={`font-semibold text-amber-800 mb-4 text-right ${isPresenterMode ? 'text-2xl' : ''}`}>
                    תחומים לפיתוח
                  </h4>
                  <ul className={`text-sm text-amber-700 space-y-2 ${isPresenterMode ? 'text-lg space-y-3' : ''}`}>
                    {radarChartData
                      .sort((a, b) => a.score - b.score)
                      .slice(0, 3)
                      .map((dim, idx) => (
                        <li key={idx} className="text-right font-medium">• {dim.dimension}: {dim.score.toFixed(1)}/5.0</li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <PresenterMode 
      isPresenterMode={isPresenterMode} 
      onToggle={() => setIsPresenterMode(!isPresenterMode)}
    >
      {content}
    </PresenterMode>
  );
};
