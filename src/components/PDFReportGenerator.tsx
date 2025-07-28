
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGroupData } from '@/hooks/useGroupData';
import { useWorkshopData } from '@/hooks/useWorkshopData';

export const PDFReportGenerator: React.FC = () => {
  const [groupNumber, setGroupNumber] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: groupData, isLoading: salimaLoading, error: salimaError } = useGroupData(groupNumber || 0);
  const { workshopData, isLoading: wocaLoading, error: wocaError } = useWorkshopData(groupNumber || 0);

  const loadGroupData = async () => {
    if (!groupNumber) {
      setError('Please enter a group number');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Loading data for group:', groupNumber);
    } catch (err) {
      console.error('Error loading group data:', err);
      setError('Failed to load group data');
    } finally {
      setIsLoading(false);
    }
  };

  const exportGroupPDF = async () => {
    if (!groupData && !workshopData) {
      setError('No data available for export');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🚀 Starting PDF export for group:', groupNumber);
      // PDF generation logic will be implemented here
      console.log('✅ PDF export completed successfully!');
    } catch (err) {
      console.error('❌ PDF Export Error:', err);
      setError(`Failed to generate PDF: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          יצירת דוח PDF קבוצתי
        </h1>
        <p className="text-gray-600">
          צור דוח מקיף המשלב תובנות SALIMA ו-WOCA עבור קבוצה
        </p>
      </div>

      <div className="flex gap-4 items-center justify-center">
        <Input
          type="number"
          placeholder="הזן מספר קבוצה"
          value={groupNumber || ''}
          onChange={(e) => setGroupNumber(Number(e.target.value))}
          className="w-48"
        />
        <Button 
          onClick={loadGroupData} 
          disabled={isLoading || salimaLoading || wocaLoading}
        >
          {isLoading || salimaLoading || wocaLoading ? 'טוען...' : 'טען קבוצה'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {(salimaError || wocaError) && (
        <Alert variant="destructive">
          <AlertDescription>
            {salimaError || wocaError}
          </AlertDescription>
        </Alert>
      )}

      {(groupData || workshopData) && (
        <div className="text-center">
          <Button 
            onClick={exportGroupPDF}
            disabled={isLoading}
            className="text-lg px-8 py-4"
          >
            📄 הורד דוח קבוצתי (SALIMA + WOCA)
          </Button>
        </div>
      )}

      {groupData && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">נתוני SALIMA שנטענו:</h3>
          <p>קבוצה: {groupData.group_number}</p>
          <p>משתתפים: {groupData.participant_count}</p>
          <p>ציון כללי: {groupData.averages.overall.toFixed(2)}</p>
        </div>
      )}

      {workshopData && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">נתוני WOCA שנטענו:</h3>
          <p>קבוצה: {workshopData.workshop_id}</p>
          <p>משתתפים: {workshopData.participant_count}</p>
          <p>ציון ממוצע: {workshopData.average_score.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};
