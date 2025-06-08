import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, BarChart3, UserCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useManagerSearch } from '@/hooks/useManagerSearch';
import { useColleagueComparisonData } from '@/hooks/useColleagueComparisonData';
import { ComparisonChart } from '@/components/ComparisonChart';
import { TrueScoreDisplay } from '@/components/TrueScoreDisplay';
import { useToast } from '@/hooks/use-toast';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

export const ColleagueComparison: React.FC = () => {
  const [selectedManager, setSelectedManager] = useState<string>('');
  const [selectedName, setSelectedName] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { managers, isLoading, error } = useManagerSearch(searchQuery);
  const { data: comparisonData, isLoading: isDataLoading, error: dataError, fetchComparisonData } = useColleagueComparisonData();
  const { toast } = useToast();

  const handleManagerSelect = (manager: any) => {
    setSelectedName(manager.name);
    setSelectedManager(manager.id);
    setSearchQuery(manager.name);
    setIsDropdownOpen(false);
    console.log('Selected manager:', manager);
  };

  const handleAnalyzeResults = async () => {
    if (!selectedManager || !selectedName) {
      toast({
        title: "לא נבחר מנהל/ת",
        description: "יש לבחור מנהל/ת לניתוח",
        variant: "destructive"
      });
      return;
    }

    console.log('Analyzing results for:', { selectedManager, selectedName });
    await fetchComparisonData(selectedManager, selectedName);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              השוואת קולגות - מודל SALIMA
            </h2>
            <p className="text-gray-600">
              השוואה בין הערכה עצמית של מנהלים להערכת קולגות על פני שישה מימדי SALIMA
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <UserCheck className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Manager Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 ml-2" />
            חיפוש מנהל/ת (יש להקליד לפחות שתי אותיות)
          </CardTitle>
          <CardDescription>
            חיפוש והשוואה בין הערכה עצמית להערכת קולגות
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Input
                placeholder="חיפוש מנהלים לפי שם..."
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
                      {!isLoading && !error && managers.length === 0 && (
                        <CommandEmpty>לא נמצאו מנהלים.</CommandEmpty>
                      )}
                      {managers.length > 0 && (
                        <CommandGroup>
                          {managers.map((manager) => (
                            <CommandItem
                              key={manager.id}
                              value={manager.name}
                              onSelect={() => handleManagerSelect(manager)}
                              className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                            >
                              <div className="flex flex-col text-right">
                                <span className="font-medium">{manager.name}</span>
                                {manager.email && (
                                  <span className="text-sm text-gray-500">{manager.email}</span>
                                )}
                              </div>
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
              disabled={!selectedManager || isDataLoading}
            >
              {isDataLoading ? 'מנתח...' : 'נתח השוואה'}
            </Button>
          </div>
          {selectedName && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 text-right">
                נבחר: <span className="font-medium">{selectedName}</span>
              </p>
            </div>
          )}
          {dataError && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg">
              <p className="text-sm text-red-800 text-right">{dataError}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {comparisonData && (
        <>
          {/* Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 ml-2" />
                השוואת פרמטרים - עצמי מול קולגות
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ComparisonChart data={comparisonData} />
            </CardContent>
          </Card>

          {/* True Score Display */}
          <Card>
            <CardHeader>
              <CardTitle>ציון אמת (True Score) - הפרש בין הערכות</CardTitle>
              <CardDescription>
                ציון אמת = ממוצע קולגות - הערכה עצמית
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TrueScoreDisplay data={comparisonData} />
            </CardContent>
          </Card>
        </>
      )}

      {/* No Data Message */}
      {comparisonData && comparisonData.colleagueResponses.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-lg text-gray-600">
              לא נמצאו טפסים ממולאים על ידי קולגות עבור מנהל/ת זה/זו.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
