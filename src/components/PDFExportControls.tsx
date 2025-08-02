
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PDFExportControlsProps {
  onGroupNumberChange: (groupNumber: number | null) => void;
  onLoadGroup: () => void;
  onExportPDF: () => Promise<void>;
  onExportDOCX: () => Promise<void>;
  onExportCSV: () => void;
  isLoading: boolean;
  isExporting: boolean;
  hasData: boolean;
  error?: string;
}

export const PDFExportControls: React.FC<PDFExportControlsProps> = ({
  onGroupNumberChange,
  onLoadGroup,
  onExportPDF,
  onExportDOCX,
  onExportCSV,
  isLoading,
  isExporting,
  hasData,
  error,
}) => {
  const [groupNumber, setGroupNumber] = useState<number | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleGroupNumberChange = (value: string) => {
    const num = Number(value);
    setGroupNumber(num || null);
    onGroupNumberChange(num || null);
  };

  const handleExportPDF = async () => {
    try {
      setExportError(null);
      await onExportPDF();
    } catch (err) {
      setExportError(`Failed to generate PDF: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleExportDOCX = async () => {
    try {
      setExportError(null);
      await onExportDOCX();
    } catch (err) {
      setExportError(`Failed to generate DOCX: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleExportCSV = () => {
    try {
      setExportError(null);
      onExportCSV();
    } catch (err) {
      setExportError(`Failed to generate CSV: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="space-y-6">
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
          onChange={(e) => handleGroupNumberChange(e.target.value)}
          className="w-48"
        />
        <Button 
          onClick={onLoadGroup} 
          disabled={isLoading || isExporting}
        >
          {isLoading ? 'טוען...' : 'טען קבוצה'}
        </Button>
      </div>

      {(error || exportError) && (
        <Alert variant="destructive">
          <AlertDescription>{error || exportError}</AlertDescription>
        </Alert>
      )}

      {hasData && (
        <div className="text-center space-x-4">
          <Button 
            onClick={handleExportPDF}
            disabled={isExporting}
            className="text-lg px-8 py-4"
          >
            {isExporting ? '🔄 מכין דוח...' : '📄 הורד דוח PDF'}
          </Button>
          <Button 
            onClick={handleExportDOCX}
            disabled={isExporting}
            className="text-lg px-8 py-4"
            variant="outline"
          >
            {isExporting ? '🔄 מכין דוח...' : '📝 הורד דוח DOCX'}
          </Button>
          <Button 
            onClick={handleExportCSV}
            disabled={isExporting}
            className="text-lg px-8 py-4"
            variant="secondary"
          >
            📊 ייצוא CSV
          </Button>
        </div>
      )}
    </div>
  );
};
