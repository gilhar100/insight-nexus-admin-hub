
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface InsufficientDataWarningProps {
  participantCount: number;
}

export const InsufficientDataWarning: React.FC<InsufficientDataWarningProps> = ({
  participantCount
}) => {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2" style={{ color: '#000000' }}>
          אין מספיק תגובות עדיין לחישוב תובנות ברמת הקבוצה
        </h3>
        <p className="text-base" style={{ color: '#000000' }}>
          נדרשות לפחות 3 תגובות לניתוח קבוצתי אמין
        </p>
        <p className="text-sm mt-2" style={{ color: '#000000' }}>
          כרגע יש {participantCount} תגובות
        </p>
      </CardContent>
    </Card>
  );
};
