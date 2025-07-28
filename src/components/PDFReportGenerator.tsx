import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGroupData } from '@/hooks/useGroupData';
import { useWorkshopData } from '@/hooks/useWorkshopData';
import { SalimaGroupRadarChart } from '@/components/SalimaGroupRadarChart';
import { ArchetypeDistributionChart } from '@/components/ArchetypeDistributionChart';
import { WocaGroupBarChart } from '@/components/WocaGroupBarChart';
import { WocaCategoryRadarChart } from '@/components/WocaCategoryRadarChart';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface SalimaGroupData {
  group_number: number;
  participant_count: number;
  averages: {
    strategy: number;
    learning: number;
    inspiration: number;
    meaning: number;
    authenticity: number;
    adaptability: number;
    overall: number;
  };
  participants: Array<{
    dimension_s: number;
    dimension_l: number;
    dimension_i: number;
    dimension_m: number;
    dimension_a: number;
    dimension_a2: number;
    dominant_archetype?: string;
  }>;
}

interface WocaGroupData {
  workshop_id: number;
  participants: any[];
  participant_count: number;
  average_score: number;
  groupCategoryScores?: {
    opportunity: number;
    comfort: number;
    apathy: number;
    war: number;
  };
}

export const PDFReportGenerator: React.FC = () => {
  const [groupNumber, setGroupNumber] = useState<number | null>(null);
  const [salimaData, setSalimaData] = useState<SalimaGroupData | null>(null);
  const [wocaData, setWocaData] = useState<WocaGroupData | null>(null);
  const [pdfImages, setPdfImages] = useState<Record<string, string>>({});
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
      // Data will be loaded automatically by the hooks
      console.log('Loading data for group:', groupNumber);
    } catch (err) {
      console.error('Error loading group data:', err);
      setError('Failed to load group data');
    } finally {
      setIsLoading(false);
    }
  };

  // Update local state when hook data changes
  React.useEffect(() => {
    if (groupData) {
      setSalimaData(groupData as SalimaGroupData);
    }
  }, [groupData]);

  React.useEffect(() => {
    if (workshopData) {
      setWocaData(workshopData as WocaGroupData);
    }
  }, [workshopData]);

  const waitForChartRender = async (element: HTMLElement, maxWait: number = 3000) => {
    return new Promise<void>((resolve) => {
      let waited = 0;
      const checkInterval = 100;
      
      const checkRender = () => {
        // Check if Recharts SVG elements are present and have content
        const svgElements = element.querySelectorAll('svg');
        const hasValidSvg = svgElements.length > 0 && 
          Array.from(svgElements).some(svg => svg.children.length > 0);
        
        if (hasValidSvg || waited >= maxWait) {
          resolve();
        } else {
          waited += checkInterval;
          setTimeout(checkRender, checkInterval);
        }
      };
      
      checkRender();
    });
  };

  const captureChartElement = async (element: HTMLElement, id: string): Promise<string | null> => {
    try {
      console.log(`📸 Starting capture for ${id}`);
      
      // Make element visible and properly positioned
      const originalStyles = {
        position: element.style.position,
        top: element.style.top,
        left: element.style.left,
        zIndex: element.style.zIndex,
        visibility: element.style.visibility,
        display: element.style.display
      };

      // Position element visibly but off-screen
      element.style.position = 'fixed';
      element.style.top = '0px';
      element.style.left = '0px';
      element.style.zIndex = '9999';
      element.style.visibility = 'visible';
      element.style.display = 'block';

      // Wait for chart to render
      await waitForChartRender(element);
      
      // Additional wait for stability
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log(`📸 Capturing ${id} with html2canvas`);
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 800,
        height: 600,
        windowWidth: 1200,
        windowHeight: 800,
        removeContainer: false,
        imageTimeout: 10000,
        onclone: (clonedDoc) => {
          // Ensure all SVG elements are properly rendered in the clone
          const svgElements = clonedDoc.querySelectorAll('svg');
          svgElements.forEach(svg => {
            svg.style.backgroundColor = '#ffffff';
          });
        }
      });

      // Restore original styles
      Object.assign(element.style, originalStyles);

      // Validate canvas
      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        console.error(`❌ Invalid canvas for ${id}: ${canvas?.width}x${canvas?.height}`);
        return null;
      }

      // Convert to PNG and validate
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      
      if (!dataUrl || dataUrl.length < 1000 || !dataUrl.startsWith('data:image/png;base64,')) {
        console.error(`❌ Invalid PNG data for ${id}: length=${dataUrl?.length}`);
        return null;
      }

      // Additional validation: try to create an image to verify PNG is valid
      const testImg = new Image();
      const isValidPng = await new Promise<boolean>((resolve) => {
        testImg.onload = () => resolve(true);
        testImg.onerror = () => resolve(false);
        testImg.src = dataUrl;
      });

      if (!isValidPng) {
        console.error(`❌ PNG validation failed for ${id}`);
        return null;
      }

      console.log(`✅ Successfully captured ${id}: ${dataUrl.length} chars`);
      return dataUrl;
      
    } catch (err) {
      console.error(`❌ Error capturing ${id}:`, err);
      return null;
    }
  };

  const captureAllVisualizations = async () => {
    const elements = document.querySelectorAll('.pdf-capture');
    const capturedImages: Record<string, string> = {};

    console.log('📸 Starting chart capture, found elements:', elements.length);

    for (const el of elements) {
      const id = el.id;
      if (!id) continue;

      const imageData = await captureChartElement(el as HTMLElement, id);
      if (imageData) {
        capturedImages[id] = imageData;
      }
    }

    console.log('📸 Chart capture complete. Successfully captured:', Object.keys(capturedImages));
    return capturedImages;
  };

  const getDimensionInsights = (averages: SalimaGroupData['averages']) => {
    const dimensions = [
      { key: 'strategy', name: 'אסטרטגיה (S)', score: averages.strategy },
      { key: 'authenticity', name: 'אותנטיות (A2)', score: averages.authenticity },
      { key: 'learning', name: 'למידה (L)', score: averages.learning },
      { key: 'inspiration', name: 'השראה (I)', score: averages.inspiration },
      { key: 'meaning', name: 'משמעות (M)', score: averages.meaning },
      { key: 'adaptability', name: 'אדפטיביות (A)', score: averages.adaptability }
    ];
    
    const strongest = dimensions.reduce((max, dim) => dim.score > max.score ? dim : max);
    const weakest = dimensions.reduce((min, dim) => dim.score < min.score ? dim : min);
    
    return { strongest, weakest };
  };

  const exportGroupPDF = async () => {
    if (!salimaData && !wocaData) {
      setError('No data available for export');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🚀 Starting PDF export for group:', groupNumber);
      
      // Use a simpler approach - generate PDF directly from visible content
      const input = document.getElementById('pdf-export-root');
      if (!input) {
        throw new Error('PDF export root element not found');
      }

      // Show the PDF content temporarily
      input.style.display = 'block';
      input.style.position = 'absolute';
      input.style.top = '0px';
      input.style.left = '0px';
      input.style.zIndex = '9999';
      input.style.backgroundColor = '#ffffff';

      // Wait for content to render
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('🖼️ Generating PDF canvas...');
      const canvas = await html2canvas(input, {
        scale: 1.2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        scrollY: 0,
        windowWidth: 1200,
        windowHeight: 1600,
        removeContainer: false
      });

      // Hide the content again
      input.style.display = 'none';

      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error('Failed to generate PDF canvas');
      }

      console.log('📄 Creating PDF document...');
      const imgData = canvas.toDataURL('image/jpeg', 0.85);
      
      if (!imgData || imgData.length < 1000) {
        throw new Error('Failed to generate valid PDF image data');
      }

      const pdf = new jsPDF('p', 'pt', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Use JPEG format instead of PNG to avoid corruption issues
      pdf.addImage(imgData, 'JPEG', 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      console.log('💾 Saving PDF...');
      pdf.save(`Group_Report_${groupNumber}.pdf`);
      console.log('✅ PDF export completed successfully!');
      
    } catch (err) {
      console.error('❌ PDF Export Error:', err);
      setError(`Failed to generate PDF: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPDFLayout = () => {
    if (!salimaData && !wocaData) return null;

    const currentDate = new Date().toLocaleDateString('he-IL');
    const insights = salimaData ? getDimensionInsights(salimaData.averages) : null;

    return (
      <div id="pdf-export-root" style={{ display: 'none' }}>
        {/* Page 1: SALIMA Overview */}
        {salimaData && (
          <div
            style={{
              width: '794px',
              height: '1123px',
              padding: '48px',
              direction: 'rtl',
              fontFamily: 'Arial, sans-serif',
              pageBreakAfter: 'always',
              backgroundColor: '#fff',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h1 style={{ fontSize: '32px', color: '#1f2937', marginBottom: '16px' }}>
                דוח קבוצתי - SALIMA
              </h1>
              <p style={{ fontSize: '18px', color: '#6b7280' }}>
                קבוצה {groupNumber} | {currentDate} | {salimaData.participant_count} משתתפים
              </p>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', color: '#2563eb', marginBottom: '16px' }}>
                ציון מנהיגות קבוצתי
              </h2>
              <div style={{ fontSize: '72px', color: '#2563eb', fontWeight: 'bold' }}>
                {salimaData.averages.overall.toFixed(2)}
              </div>
            </div>

            {insights && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                <div style={{
                  width: '47%',
                  border: '2px solid #10b981',
                  borderRadius: '16px',
                  padding: '24px',
                  backgroundColor: '#ecfdf5',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '20px', color: '#047857', fontWeight: 'bold', marginBottom: '8px' }}>
                    הממד החזק ביותר
                  </div>
                  <div style={{ fontSize: '48px', color: '#047857', fontWeight: 'bold', marginBottom: '8px' }}>
                    {insights.strongest.score.toFixed(1)}
                  </div>
                  <div style={{ fontSize: '16px', color: '#047857' }}>
                    {insights.strongest.name}
                  </div>
                </div>

                <div style={{
                  width: '47%',
                  border: '2px solid #f59e0b',
                  borderRadius: '16px',
                  padding: '24px',
                  backgroundColor: '#fffbeb',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '20px', color: '#d97706', fontWeight: 'bold', marginBottom: '8px' }}>
                    ממד לפיתוח
                  </div>
                  <div style={{ fontSize: '48px', color: '#d97706', fontWeight: 'bold', marginBottom: '8px' }}>
                    {insights.weakest.score.toFixed(1)}
                  </div>
                  <div style={{ fontSize: '16px', color: '#d97706' }}>
                    {insights.weakest.name}
                  </div>
                </div>
              </div>
            )}

            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h3 style={{ fontSize: '20px', color: '#1f2937', marginBottom: '16px' }}>
                פרופיל קבוצתי ייחודי
              </h3>
              <div style={{ 
                width: '100%', 
                height: '400px', 
                border: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <SalimaGroupRadarChart averages={salimaData.averages} />
              </div>
            </div>
          </div>
        )}

        {/* Page 2: Archetype Chart */}
        {salimaData && (
          <div
            style={{
              width: '794px',
              height: '1123px',
              padding: '48px',
              direction: 'rtl',
              fontFamily: 'Arial, sans-serif',
              pageBreakAfter: 'always',
              backgroundColor: '#fff',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{ fontSize: '28px', color: '#1f2937', marginBottom: '32px' }}>
                התפלגות סגנון מנהיגות
              </h2>
              <div style={{ 
                width: '100%', 
                height: '500px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ArchetypeDistributionChart 
                  groupNumber={salimaData.group_number} 
                  isPresenterMode={false} 
                />
              </div>
            </div>
          </div>
        )}

        {/* Page 3: WOCA Bar Chart */}
        {wocaData && (
          <div
            style={{
              width: '794px',
              height: '1123px',
              padding: '48px',
              direction: 'rtl',
              fontFamily: 'Arial, sans-serif',
              pageBreakAfter: 'always',
              backgroundColor: '#fff',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{ fontSize: '28px', color: '#1f2937', marginBottom: '32px' }}>
                ניתוח WOCA - אזורי שינוי
              </h2>
              <div style={{ 
                width: '100%', 
                height: '500px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <WocaGroupBarChart 
                  groupCategoryScores={wocaData.groupCategoryScores!}
                />
              </div>
            </div>
          </div>
        )}

        {/* Page 4: WOCA Pie Chart */}
        {wocaData && (
          <div
            style={{
              width: '794px',
              height: '1123px',
              padding: '48px',
              direction: 'rtl',
              fontFamily: 'Arial, sans-serif',
              pageBreakAfter: 'always',
              backgroundColor: '#fff',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{ fontSize: '28px', color: '#1f2937', marginBottom: '32px' }}>
                התפלגות אזורי תודעה
              </h2>
              <div style={{ 
                width: '100%', 
                height: '500px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <WocaCategoryRadarChart 
                  categoryScores={wocaData.groupCategoryScores!}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
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

      {(salimaData || wocaData) && (
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


      {renderPDFLayout()}

      {salimaData && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">נתוני SALIMA שנטענו:</h3>
          <p>קבוצה: {salimaData.group_number}</p>
          <p>משתתפים: {salimaData.participant_count}</p>
          <p>ציון כללי: {salimaData.averages.overall.toFixed(2)}</p>
        </div>
      )}

      {wocaData && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">נתוני WOCA שנטענו:</h3>
          <p>קבוצה: {wocaData.workshop_id}</p>
          <p>משתתפים: {wocaData.participant_count}</p>
          <p>ציון ממוצע: {wocaData.average_score.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};
