import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Loader2 } from 'lucide-react';
import { useWorkshops } from '@/hooks/useWorkshops';
import { useWorkshopDetails } from '@/hooks/useWorkshopDetails';
import { useGroupData } from '@/hooks/useGroupData';
import { exportCombinedPDFReport } from '@/utils/exportUtils';
import { analyzeWorkshopWoca } from '@/utils/wocaAnalysis';

export const GenerateReport: React.FC = () => {
  const [selectedGroupId, setSelectedGroupId] = useState<number | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { workshops, error: workshopsError } = useWorkshops();
  const { workshopData, isLoading: isLoadingWorkshop } = useWorkshopDetails(selectedGroupId);
  const { data: salimaGroupData, isLoading: isLoadingSalima } = useGroupData(selectedGroupId || 0);

  const handleGroupSelect = (value: string) => {
    const groupId = Number(value);
    setSelectedGroupId(groupId);
  };

  const handleGenerateReport = async () => {
    if (!workshopData || !salimaGroupData || !selectedGroupId) return;
    
    setIsGenerating(true);
    try {
      const wocaAnalysis = analyzeWorkshopWoca(workshopData.participants, workshopData.workshop_id);
      await exportCombinedPDFReport({
        groupId: selectedGroupId,
        salimaData: salimaGroupData,
        wocaData: {
          workshopData,
          wocaAnalysis
        }
      });
    } catch (error) {
      console.error('Error generating PDF report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const isLoading = isLoadingWorkshop || isLoadingSalima;
  const hasData = workshopData && salimaGroupData && workshopData.participants.length >= 3 && salimaGroupData.participants.length > 0;

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <Card>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              דוח תובנות קבוצתי - SALIMA & WOCA
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            צור דוח PDF מקצועי המשלב ניתוח SALIMA ו-WOCA עבור קבוצה נבחרת
          </p>
        </CardHeader>
      </Card>

      {/* Group Selection */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-800">בחירת קבוצה</h2>
          <p className="text-gray-600">בחר קבוצה מהרשימה להפקת דוח מקצועי</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                קבוצה
              </label>
              <Select onValueChange={handleGroupSelect}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="בחר קבוצה..." />
                </SelectTrigger>
                <SelectContent>
                  {workshops.map((workshop) => (
                    <SelectItem key={workshop.id} value={workshop.id.toString()}>
                      {workshop.name} ({workshop.participant_count} משתתפים)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {workshopsError && (
              <div className="text-red-600 text-sm">
                שגיאה בטעינת קבוצות: {workshopsError}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Data Status */}
      {selectedGroupId && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-800">מצב הנתונים</h2>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center space-x-2 text-blue-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>טוען נתונים...</span>
              </div>
            ) : hasData ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-green-600">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>נתוני SALIMA זמינים ({salimaGroupData?.participant_count} משתתפים)</span>
                </div>
                <div className="flex items-center space-x-2 text-green-600">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>נתוני WOCA זמינים ({workshopData?.participant_count} משתתפים)</span>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                  <p className="text-green-800 font-medium">
                    ✓ הנתונים מוכנים להפקת דוח מקצועי
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {!salimaGroupData?.participants.length && (
                  <div className="flex items-center space-x-2 text-red-600">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    <span>נתוני SALIMA לא זמינים</span>
                  </div>
                )}
                {(!workshopData || workshopData.participants.length < 3) && (
                  <div className="flex items-center space-x-2 text-red-600">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    <span>נתוני WOCA לא זמינים או לא מספקים (נדרשים לפחות 3 משתתפים)</span>
                  </div>
                )}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                  <p className="text-red-800 font-medium">
                    ⚠ לא ניתן להפיק דוח עבור קבוצה זו
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Generate Report */}
      {selectedGroupId && hasData && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-800">הפקת דוח</h2>
            <p className="text-gray-600">הדוח יכלול:</p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mt-2">
              <li>ניתוח ממדי SALIMA וארכיטיפים</li>
              <li>ניתוח אזורי WOCA וחלוקה ארגונית</li>
              <li>תרשימים וויזואליזציות צבעוניות</li>
              <li>מקרא מפורט לכל הממדים והמושגים</li>
              <li>סיכום והמלצות</li>
            </ul>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="w-full h-12 text-lg"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  מפיק דוח PDF...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  הורד דוח PDF מקצועי
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {!selectedGroupId && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              בחר קבוצה להתחלה
            </h3>
            <p className="text-gray-500">
              בחר קבוצה מהרשימה למעלה כדי לראות את מצב הנתונים ולהפיק דוח מקצועי
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};