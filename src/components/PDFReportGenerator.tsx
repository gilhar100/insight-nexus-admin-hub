import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGroupData } from '@/hooks/useGroupData';
import { useWorkshopData } from '@/hooks/useWorkshopData';
import { SalimaGroupRadarChart } from '@/components/SalimaGroupRadarChart';
import { SalimaArchetypeDistributionChart } from '@/components/SalimaArchetypeDistributionChart';
import { WocaGroupBarChart } from '@/components/WocaGroupBarChart';
import { ZoneDistributionChart } from '@/components/ZoneDistributionChart';
import { WocaCategoryRadarChart } from '@/components/WocaCategoryRadarChart';
import { analyzeWorkshopWoca } from '@/utils/wocaAnalysis';
import { downloadGroupReportDOCX } from '@/utils/downloadGroupReportDOCX';
import html2canvas from 'html2canvas';

export const PDFReportGenerator: React.FC = () => {
  const [groupNumber, setGroupNumber] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const chartsContainerRef = useRef<HTMLDivElement>(null);

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

  const captureChartAsBase64 = async (elementId: string): Promise<string> => {
    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`Element with id "${elementId}" not found`);
      return '';
    }

    console.log(`📸 Capturing chart: ${elementId}`);
    
    // Wait a bit for the chart to fully render
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      height: element.offsetHeight,
      width: element.offsetWidth,
    });

    const base64Image = canvas.toDataURL('image/png');
    console.log(`✅ Successfully captured ${elementId}`);
    return base64Image;
  };

  const exportGroupDOCX = async () => {
    if (!groupData && !workshopData) {
      setError('No data available for export');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🚀 Starting DOCX export for group:', groupNumber);
      
      // Capture all required charts as base64
      const chartImages = {
        'radar-chart': await captureChartAsBase64('radar-chart'),
        'archetype-chart': await captureChartAsBase64('archetype-chart'),
        'woca-bar': await captureChartAsBase64('woca-bar'),
        'woca-pie': await captureChartAsBase64('woca-pie'),
        'woca-matrix': await captureChartAsBase64('woca-matrix'),
      };
      
      console.log('📊 All charts captured successfully');
      
      // Prepare dynamic data
      let requestBody: any = {
        groupNumber: groupNumber,
        images: chartImages
      };

      // Add SALIMA data if available
      if (groupData) {
        const strongestDimension = Object.entries(groupData.averages)
          .filter(([key]) => key !== 'overall')
          .reduce((max, [key, value]) => 
            value > max.score ? { name: key, score: value } : max, 
            { name: '', score: 0 }
          );
        
        const weakestDimension = Object.entries(groupData.averages)
          .filter(([key]) => key !== 'overall')
          .reduce((min, [key, value]) => 
            value < min.score ? { name: key, score: value } : min, 
            { name: '', score: 5 }
          );

        requestBody = {
          ...requestBody,
          participantCount: groupData.participant_count,
          salimaScore: groupData.averages.overall,
          strongestDimension,
          weakestDimension,
        };
      }

      // Add WOCA data if available
      if (workshopData) {
        const wocaAnalysis = analyzeWorkshopWoca(workshopData.participants, workshopData.workshop_id);
        requestBody = {
          ...requestBody,
          wocaZoneLabel: wocaAnalysis.groupDominantZoneByCount || 'לא זוהה',
          wocaScore: workshopData.average_score,
          wocaParticipantCount: workshopData.participant_count,
        };
      }

      console.log('📄 Request body prepared:', requestBody);
      
      // Download the DOCX
      await downloadGroupReportDOCX(requestBody, groupNumber || 0);
      
      console.log('✅ DOCX export completed successfully!');
    } catch (err) {
      console.error('❌ DOCX Export Error:', err);
      setError(`Failed to generate DOCX: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          יצירת דוח DOCX קבוצתי
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
            onClick={exportGroupDOCX}
            disabled={isLoading}
            className="text-lg px-8 py-4"
          >
            {isLoading ? '🔄 מכין דוח...' : '📄 הורד דוח קבוצתי (DOCX)'}
          </Button>
        </div>
      )}

      {/* Hidden charts container for capturing */}
      <div 
        ref={chartsContainerRef}
        className="fixed -top-[10000px] left-0 bg-white"
        style={{ width: '800px', height: 'auto' }}
      >
        {groupData && (
          <>
            <div id="radar-chart" className="w-full h-96 bg-white p-4">
              <SalimaGroupRadarChart averages={groupData.averages} />
            </div>
            <div id="archetype-chart" className="w-full h-96 bg-white p-4">
              <SalimaArchetypeDistributionChart participants={groupData.participants} />
            </div>
          </>
        )}
        
        {workshopData && (
          <>
            {(() => {
              const wocaAnalysis = analyzeWorkshopWoca(workshopData.participants, workshopData.workshop_id);
              return (
                <>
                  <div id="woca-bar" className="w-full h-96 bg-white p-4">
                    <WocaGroupBarChart groupCategoryScores={wocaAnalysis.groupCategoryScores} />
                  </div>
                  <div id="woca-pie" className="w-full h-96 bg-white p-4">
                    <ZoneDistributionChart 
                      zoneDistribution={{
                        opportunity: wocaAnalysis.groupZoneCounts.opportunity,
                        comfort: wocaAnalysis.groupZoneCounts.comfort,
                        apathy: wocaAnalysis.groupZoneCounts.apathy,
                        war: wocaAnalysis.groupZoneCounts.war,
                      }}
                    />
                  </div>
                  <div id="woca-matrix" className="w-full h-96 bg-white p-4">
                    <WocaCategoryRadarChart categoryScores={wocaAnalysis.groupCategoryScores} />
                  </div>
                </>
              );
            })()}
          </>
        )}
      </div>

      {/* Data display sections remain the same */}
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
