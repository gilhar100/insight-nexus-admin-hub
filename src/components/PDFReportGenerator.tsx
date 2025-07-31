
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
import { GroupPDFExportLayout } from '@/components/GroupPDFExportLayout';
import { analyzeWorkshopWoca } from '@/utils/wocaAnalysis';
import { downloadGroupReportPDF } from '@/utils/downloadGroupReportPDF';
import html2canvas from 'html2canvas';

export const PDFReportGenerator: React.FC = () => {
  const [groupNumber, setGroupNumber] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfImages, setPdfImages] = useState<Record<string, string>>({});
  const [showPDFLayout, setShowPDFLayout] = useState(false);
  
  const chartsContainerRef = useRef<HTMLDivElement>(null);
  const pdfLayoutRef = useRef<HTMLDivElement>(null);

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

  const captureChartAsImage = async (elementId: string): Promise<string> => {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    console.log(`📸 Capturing chart: ${elementId}`);
    
    // Force a longer wait for SVG charts to fully render
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Force redraw of SVG elements
    const svgElements = element.querySelectorAll('svg');
    svgElements.forEach(svg => {
      svg.style.overflow = 'visible';
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    });
    
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 4, // Increased scale for better quality
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: false, // Better for SVG rendering
      height: element.offsetHeight,
      width: element.offsetWidth,
      logging: true, // Enable logging for debugging
      onclone: (clonedDoc) => {
        // Ensure all text elements are visible in the clone
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          const textElements = clonedElement.querySelectorAll('text');
          textElements.forEach(text => {
            text.style.visibility = 'visible';
            text.style.opacity = '1';
            text.style.fontSize = text.style.fontSize || '16px';
            text.style.fontWeight = text.style.fontWeight || 'bold';
          });
          
          // Ensure SVG paths are visible
          const pathElements = clonedElement.querySelectorAll('path');
          pathElements.forEach(path => {
            if (path.getAttribute('fill') !== 'none') {
              path.style.opacity = '1';
            }
          });
        }
      }
    });

    const base64Image = canvas.toDataURL('image/png', 1.0);
    
    // Verify the image is not blank
    if (base64Image === 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==') {
      throw new Error(`Captured image for ${elementId} is blank`);
    }
    
    console.log(`✅ Successfully captured ${elementId}`);
    return base64Image;
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
      
      // Capture all required charts
      const chartImages: Record<string, string> = {};
      
      // Capture SALIMA radar chart
      if (groupData) {
        chartImages['radar-chart'] = await captureChartAsImage('radar-chart');
        chartImages['archetype-chart'] = await captureChartAsImage('archetype-chart');
      }
      
      // Capture WOCA charts
      if (workshopData) {
        chartImages['woca-bar'] = await captureChartAsImage('woca-bar');
        chartImages['woca-pie'] = await captureChartAsImage('woca-pie');
      }
      
      console.log('📊 All charts captured successfully:', Object.keys(chartImages));
      
      // Store images and show PDF layout
      setPdfImages(chartImages);
      setShowPDFLayout(true);
      
      // Wait for PDF layout to render
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get the PDF layout HTML
      const pdfElement = document.getElementById('pdf-export-root');
      if (!pdfElement) {
        throw new Error('PDF export element not found');
      }
      
      const pdfHtml = pdfElement.outerHTML;
      console.log('📄 PDF HTML generated, length:', pdfHtml.length);
      
      // Generate filename
      const filename = `Group_Report_${groupNumber || 'Unknown'}.pdf`;
      
      // Download the PDF
      await downloadGroupReportPDF(pdfHtml, filename);
      
      console.log('✅ PDF export completed successfully!');
    } catch (err) {
      console.error('❌ PDF Export Error:', err);
      setError(`Failed to generate PDF: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate required data for PDF layout
  const getPDFLayoutData = () => {
    if (!groupData || !workshopData) return null;

    const wocaAnalysis = analyzeWorkshopWoca(workshopData.participants, workshopData.workshop_id);
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

    return {
      groupNumber: groupData.group_number,
      participantCount: groupData.participant_count,
      salimaScore: groupData.averages.overall,
      strongestDimension,
      weakestDimension,
      wocaZoneLabel: wocaAnalysis.groupDominantZoneByCount || 'לא זוהה',
      wocaScore: workshopData.average_score,
      wocaParticipantCount: workshopData.participant_count,
      wocaAnalysis,
    };
  };

  const pdfLayoutData = getPDFLayoutData();

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
            {isLoading ? '🔄 מכין דוח...' : '📄 הורד דוח קבוצתי (SALIMA + WOCA)'}
          </Button>
        </div>
      )}

      {/* Hidden charts container for capturing - larger sizes for better PDF quality */}
      <div 
        ref={chartsContainerRef}
        className="fixed -top-[15000px] left-0 bg-white"
        style={{ width: '1200px', height: 'auto' }}
      >
        {groupData && (
          <>
            <div id="radar-chart" className="w-full bg-white p-8" style={{ height: '600px' }}>
              <SalimaGroupRadarChart averages={groupData.averages} />
            </div>
            <div id="archetype-chart" className="w-full bg-white p-8" style={{ height: '600px' }}>
              <SalimaArchetypeDistributionChart participants={groupData.participants} />
            </div>
          </>
        )}
        
        {workshopData && pdfLayoutData?.wocaAnalysis && (
          <>
            <div id="woca-bar" className="w-full bg-white p-8" style={{ height: '800px' }}>
              <WocaGroupBarChart groupCategoryScores={pdfLayoutData.wocaAnalysis.groupCategoryScores} />
            </div>
            <div id="woca-pie" className="w-full bg-white p-8" style={{ height: '800px' }}>
              <ZoneDistributionChart 
                zoneDistribution={{
                  opportunity: pdfLayoutData.wocaAnalysis.groupZoneCounts.opportunity,
                  comfort: pdfLayoutData.wocaAnalysis.groupZoneCounts.comfort,
                  apathy: pdfLayoutData.wocaAnalysis.groupZoneCounts.apathy,
                  war: pdfLayoutData.wocaAnalysis.groupZoneCounts.war,
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* PDF Layout */}
      {showPDFLayout && pdfLayoutData && (
        <div id="pdf-export-root" ref={pdfLayoutRef}>
          <GroupPDFExportLayout
            pdfImages={pdfImages}
            groupNumber={pdfLayoutData.groupNumber}
            participantCount={pdfLayoutData.participantCount}
            salimaScore={pdfLayoutData.salimaScore}
            strongestDimension={pdfLayoutData.strongestDimension}
            weakestDimension={pdfLayoutData.weakestDimension}
            wocaZoneLabel={pdfLayoutData.wocaZoneLabel}
            wocaScore={pdfLayoutData.wocaScore}
            wocaParticipantCount={pdfLayoutData.wocaParticipantCount}
          />
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
