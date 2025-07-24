import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Loader2 } from 'lucide-react';
import { useWorkshops } from '@/hooks/useWorkshops';
import { exportCombinedPDFReport } from '@/utils/exportUtils';
import { EnhancedSalimaRadarChart } from '@/components/EnhancedSalimaRadarChart';
import { ArchetypeDistributionChart } from '@/components/ArchetypeDistributionChart';
import { WocaGroupBarChart } from '@/components/WocaGroupBarChart';
import { WocaZoneSection } from '@/components/WocaZoneSection';

export const GenerateReport: React.FC = () => {
  const [selectedGroupId, setSelectedGroupId] = useState<number | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { workshops, error: workshopsError } = useWorkshops();

  const handleGroupSelect = (value: string) => {
    const groupId = Number(value);
    setSelectedGroupId(groupId);
  };

  useEffect(() => {
    if (!selectedGroupId) return;

    const fetchReportData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("https://lhmrghebdtcbhmgtbqfe.supabase.co/functions/v1/getGroupInsights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ group_number: selectedGroupId })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch report');
        setReportData(data);
      } catch (err: any) {
        setError(err.message || 'Unexpected error');
        setReportData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [selectedGroupId]);

  const handleGenerateReport = async () => {
    if (!reportData || !selectedGroupId) return;
    setIsGenerating(true);
    try {
      await exportCombinedPDFReport({
        groupId: selectedGroupId,
        ...reportData
      });
    } catch (error) {
      console.error('Error generating PDF report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const hasData = reportData && reportData.salima && reportData.archetypes && reportData.woca;

  return (
    <div className="space-y-6" dir="rtl">
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

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-800">בחירת קבוצה</h2>
          <p className="text-gray-600">בחר קבוצה מהרשימה להפקת דוח מקצועי</p>
        </CardHeader>
        <CardContent>
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
          {workshopsError && (
            <div className="text-red-600 text-sm mt-2">
              שגיאה בטעינת קבוצות: {workshopsError}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedGroupId && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-800">מצב הנתונים</h2>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center space-x-2 text-blue-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>טוען נתונים...</span>
              </div>
            ) : error ? (
              <div className="text-red-600">שגיאה: {error}</div>
            ) : hasData ? (
              <div className="space-y-6">
                <EnhancedSalimaRadarChart data={reportData.salima.scores} />
                <ArchetypeDistributionChart data={reportData.archetypes.distribution} />
                <WocaGroupBarChart data={reportData.woca.scores} />
                <WocaZoneSection zone={reportData.woca.dominantZone} />
              </div>
            ) : (
              <div className="text-gray-600">לא נמצאו נתונים לקבוצה זו</div>
            )}
          </CardContent>
        </Card>
      )}

      {selectedGroupId && hasData && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-800">הפקת דוח</h2>
            <p className="text-gray-600">הדוח יכלול ניתוח SALIMA, ארכיטיפים ו-WOCA</p>
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
    </div>
  );
};