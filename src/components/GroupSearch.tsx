
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

interface GroupSearchProps {
  selectedGroup: number | null;
  groupSearchQuery: string;
  onGroupSelect: (groupNumber: number) => void;
  onGroupSearchChange: (query: string) => void;
  onClearSelection: () => void;
  groupData: any;
}

export const GroupSearch: React.FC<GroupSearchProps> = ({
  selectedGroup,
  groupSearchQuery,
  onGroupSelect,
  onGroupSearchChange,
  onClearSelection,
  groupData
}) => {
  const [availableGroups, setAvailableGroups] = useState<number[]>([]);

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

  const filteredGroups = availableGroups.filter(group => 
    group.toString().includes(groupSearchQuery.replace('קבוצה ', ''))
  );

  return (
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
              onChange={(e) => onGroupSearchChange(e.target.value)}
              className="w-full text-right"
            />
            {groupSearchQuery && !selectedGroup && filteredGroups.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border rounded-md shadow-lg max-h-40 overflow-y-auto">
                {filteredGroups.slice(0, 10).map((groupNumber) => (
                  <button
                    key={groupNumber}
                    onClick={() => onGroupSelect(groupNumber)}
                    className="w-full text-right px-3 py-2 hover:bg-gray-100 border-b last:border-b-0"
                  >
                    קבוצה {groupNumber}
                  </button>
                ))}
              </div>
            )}
          </div>
          {selectedGroup && (
            <Button variant="outline" onClick={onClearSelection}>
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
  );
};
