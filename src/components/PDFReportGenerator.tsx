
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

  const captureAllVisualizations = async () => {
    const elements = document.querySelectorAll('.pdf-capture');
    const capturedImages: Record<string, string> = {};

    for (const el of elements) {
      const id = el.id;
      if (!id) continue;

      try {
        // Temporarily show the element for capturing
        const element = el as HTMLElement;
        const originalDisplay = element.style.display;
        element.style.display = 'block';
        element.style.position = 'fixed';
        element.style.top = '-9999px';
        element.style.left = '-9999px';
        element.style.zIndex = '-1';

        await new Promise(resolve => setTimeout(resolve, 100));

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          scrollY: -window.scrollY,
          backgroundColor: '#ffffff',
          logging: false,
          allowTaint: true
        });

        capturedImages[id] = canvas.toDataURL('image/png');

        // Restore original display
        element.style.display = originalDisplay;
        element.style.position = 'absolute';
      } catch (err) {
        console.error(`Error capturing ${id}:`, err);
      }
    }

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
      // Wait for charts to render
      await new Promise(resolve => setTimeout(resolve, 500));
      const images = await captureAllVisualizations();
      setPdfImages(images);

      // Small delay to ensure images are set
      await new Promise(resolve => setTimeout(resolve, 100));

      const input = document.getElementById('pdf-export-root');
      if (!input) {
        throw new Error('PDF export root element not found');
      }

      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        scrollY: -window.scrollY,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Group_Report_${groupNumber}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
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
              <img
                src={pdfImages['radar-chart']}
                alt="Radar Chart"
                style={{
                  width: '100%',
                  maxHeight: '400px',
                  objectFit: 'contain',
                  display: 'block',
                  margin: '0 auto'
                }}
              />
            </div>
          </div>
        )}

        {/* Page 2: SALIMA Archetype Distribution */}
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
              <h2 style={{ fontSize: '28px', color: '#1f2937', marginBottom: '16px' }}>
                התפלגות סגנון מנהיגות
              </h2>
              <img
                src={pdfImages['archetype-chart']}
                alt="Archetype Chart"
                style={{
                  width: '100%',
                  maxHeight: '600px',
                  objectFit: 'contain',
                  display: 'block',
                  margin: '0 auto'
                }}
              />
            </div>

            <div style={{ marginTop: '40px' }}>
              <h3 style={{ fontSize: '20px', color: '#1f2937', marginBottom: '16px' }}>
                הסבר על סגנונות המנהיגות
              </h3>
              <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#374151' }}>
                <p style={{ marginBottom: '16px' }}>
                  <strong>המנהל הסקרן:</strong> מנהל שמוביל דרך סקרנות, חיפוש מתמיד אחר ידע, והשראה.
                </p>
                <p style={{ marginBottom: '16px' }}>
                  <strong>המנהל המעצים:</strong> מנהל שפועל מתוך כנות, הקשבה ותחושת שליחות.
                </p>
                <p style={{ marginBottom: '16px' }}>
                  <strong>מנהל ההזדמנות:</strong> מנהל שמזהה מגמות, חושב קדימה, ופועל בזריזות.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Page 3: WOCA Analysis */}
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
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '28px', color: '#1f2937', marginBottom: '16px' }}>
                ניתוח WOCA - אזורי שינוי
              </h2>
              <p style={{ fontSize: '16px', color: '#6b7280' }}>
                {wocaData.participant_count} משתתפים | ציון ממוצע: {wocaData.average_score.toFixed(2)}
              </p>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <img
                src={pdfImages['woca-bar']}
                alt="WOCA Bar Chart"
                style={{
                  width: '100%',
                  maxHeight: '400px',
                  objectFit: 'contain',
                  display: 'block',
                  margin: '0 auto'
                }}
              />
            </div>

            <div style={{ marginTop: '40px' }}>
              <h3 style={{ fontSize: '20px', color: '#1f2937', marginBottom: '16px' }}>
                הסבר על אזורי השינוי
              </h3>
              <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#374151' }}>
                <p style={{ marginBottom: '16px' }}>
                  <strong>הזדמנות:</strong> אזור בו קיים פוטנציאל גבוה לשינוי חיובי.
                </p>
                <p style={{ marginBottom: '16px' }}>
                  <strong>נוחות:</strong> אזור יציב שמספק ביטחון אך עלול להגביל צמיחה.
                </p>
                <p style={{ marginBottom: '16px' }}>
                  <strong>אדישות:</strong> אזור של חוסר מעורבות הדורש התערבות.
                </p>
                <p style={{ marginBottom: '16px' }}>
                  <strong>מלחמה:</strong> אזור של התנגדות פעילה לשינוי.
                </p>
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

      {/* Charts for capturing - hidden but rendered */}
      {salimaData && (
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <div className="pdf-capture" id="radar-chart" style={{ width: '800px', height: '600px', backgroundColor: '#ffffff' }}>
            <SalimaGroupRadarChart averages={salimaData.averages} />
          </div>
          <div className="pdf-capture" id="archetype-chart" style={{ width: '800px', height: '600px', backgroundColor: '#ffffff' }}>
            <ArchetypeDistributionChart 
              groupNumber={salimaData.group_number} 
              isPresenterMode={false} 
            />
          </div>
        </div>
      )}

      {wocaData?.groupCategoryScores && (
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <div className="pdf-capture" id="woca-bar" style={{ width: '800px', height: '600px', backgroundColor: '#ffffff' }}>
            <WocaGroupBarChart 
              groupCategoryScores={wocaData.groupCategoryScores}
            />
          </div>
          <div className="pdf-capture" id="woca-radar" style={{ width: '800px', height: '600px', backgroundColor: '#ffffff' }}>
            <WocaCategoryRadarChart 
              categoryScores={wocaData.groupCategoryScores}
            />
          </div>
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
