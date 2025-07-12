
import React from 'react';
import { Users } from 'lucide-react';

export const GroupInsightsHeader: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div className="text-right">
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#000000' }}>
            ניתוח קבוצתי - מודל WOCA
          </h2>
          <p className="text-base" style={{ color: '#000000' }}>
            ניתוח דינמיקה קבוצתי ואפקטיביות הסדנה באמצעות 36 שאלות מודל WOCA
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <Users className="h-8 w-8 text-purple-600" />
        </div>
      </div>
    </div>
  );
};
