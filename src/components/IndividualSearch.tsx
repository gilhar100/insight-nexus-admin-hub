
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNameSearch } from '@/hooks/useNameSearch';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

interface IndividualSearchProps {
  selectedRespondent: string;
  selectedName: string;
  selectedSource: string;
  searchQuery: string;
  isDataLoading: boolean;
  dataError: string | null;
  onNameSelect: (nameOption: any) => void;
  onSearchQueryChange: (query: string) => void;
  onAnalyzeResults: () => void;
}

export const IndividualSearch: React.FC<IndividualSearchProps> = ({
  selectedRespondent,
  selectedName,
  selectedSource,
  searchQuery,
  isDataLoading,
  dataError,
  onNameSelect,
  onSearchQueryChange,
  onAnalyzeResults
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { names, isLoading, error } = useNameSearch(searchQuery);

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'survey': return 'bg-blue-100 text-blue-800';
      case 'colleague': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleNameSelect = (nameOption: any) => {
    onNameSelect(nameOption);
    setIsDropdownOpen(false);
  };

  return (
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
                onSearchQueryChange(e.target.value);
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
            onClick={onAnalyzeResults} 
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
  );
};
