
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useWocaSearch } from '@/hooks/useWocaSearch';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

interface SearchAndSelectionProps {
  workshops: Array<{ id: number; participant_count: number; date: string }>;
  selectedWorkshopId?: number;
  onWorkshopSelect: (workshopId: string) => void;
  onParticipantSelect: (participant: any) => void;
  error?: string | null;
}

export const SearchAndSelection: React.FC<SearchAndSelectionProps> = ({
  workshops,
  selectedWorkshopId,
  onWorkshopSelect,
  onParticipantSelect,
  error
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const { participants: searchResults, isLoading: isSearchLoading } = useWocaSearch(searchQuery);

  const handleParticipantSelect = (participant: any) => {
    onParticipantSelect(participant);
    setSearchQuery(participant.full_name);
    setIsDropdownOpen(false);
  };

  return (
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
            <Select value={selectedWorkshopId?.toString()} onValueChange={onWorkshopSelect}>
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
  );
};
