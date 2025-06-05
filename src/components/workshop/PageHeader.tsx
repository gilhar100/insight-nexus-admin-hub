
import React from 'react';
import { Users } from 'lucide-react';

export const PageHeader: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            לוח בקרה לניתוח WOCA
          </h2>
          <p className="text-gray-600">
            חפשו לפי משתתף בודד או נתחו קבוצות סדנה באמצעות שאלון 36 השאלות של WOCA
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <Users className="h-8 w-8 text-purple-600" />
        </div>
      </div>
    </div>
  );
};
