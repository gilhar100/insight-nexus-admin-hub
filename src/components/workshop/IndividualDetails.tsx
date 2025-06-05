
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface IndividualDetailsProps {
  selectedParticipant: any;
  showNames: boolean;
}

export const IndividualDetails: React.FC<IndividualDetailsProps> = ({ 
  selectedParticipant, 
  showNames 
}) => {
  return (
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
  );
};
