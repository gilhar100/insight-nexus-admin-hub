
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const LoadingState: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <div className="text-gray-500">טוען נתונים...</div>
      </CardContent>
    </Card>
  );
};
