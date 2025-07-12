
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users } from 'lucide-react';
import { Workshop } from '@/types/workshopTypes';

interface GroupSelectorProps {
  workshops: Workshop[];
  selectedGroupId?: number;
  onGroupSelect: (groupId: string) => void;
  error?: string | null;
}

export const GroupSelector: React.FC<GroupSelectorProps> = ({
  workshops,
  selectedGroupId,
  onGroupSelect,
  error
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-right text-lg" style={{ color: '#000000' }}>
          <Users className="h-5 w-5 ml-2" />
          בחירת קבוצה
        </CardTitle>
        <CardDescription className="text-right text-base" style={{ color: '#000000' }}>
          בחר קבוצה מטבלת woca_responses לניתוח דינמיקה קבוצתית
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <div className="flex-1">
            <Select value={selectedGroupId?.toString()} onValueChange={onGroupSelect}>
              <SelectTrigger>
                <SelectValue placeholder="בחר קבוצה" />
              </SelectTrigger>
              <SelectContent>
                {workshops.map(workshop => (
                  <SelectItem key={workshop.id} value={workshop.id.toString()}>
                    <div className="flex flex-col text-right">
                      <span className="font-medium text-base" style={{ color: '#000000' }}>{workshop.name}</span>
                      <span className="text-sm" style={{ color: '#000000' }}>
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
            <p className="text-sm text-right" style={{ color: '#000000' }}>{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
