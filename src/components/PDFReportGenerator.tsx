
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGroupData } from '@/hooks/useGroupData';
import { useWorkshopData } from '@/hooks/useWorkshopData';
import { SalimaGroupRadarChart } from '@/components/SalimaGroupRadarChart';
import { ArchetypeDistributionChart } from '@/components/ArchetypeDistributionChart';
import { WocaGroupBarChart } from '@/components/WocaGroupBarChart';
import { WocaRadarChart } from '@/components/WocaRadarChart';

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

  const getDimensionInsights = (averages: SalimaGroupData['averages']) => {
    const dimensions = [
      { key: 'strategy', name: 'אסטרטגיה (S)', score: averages.strategy },
      { key: 'learning', name: 'למידה (L)', score: averages.learning },
      { key: 'inspiration', name: 'השראה (I)', score: averages.inspiration },
      { key: 'meaning', name: 'משמעות (M)', score: averages.meaning },
      { key: 'authenticity', name: 'אותנטיות (A2)', score: averages.authenticity },
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
      
      const wrapper = document.getElementById("group-report-wrapper");
      if (!wrapper) {
        console.error('❌ Group report wrapper not found in DOM');
        setError("Group report wrapper not found");
        return;
      }

      console.log('📋 Found wrapper element:', wrapper);
      console.log('📏 Wrapper dimensions:', {
        width: wrapper.offsetWidth,
        height: wrapper.offsetHeight,
        display: window.getComputedStyle(wrapper).display,
        visibility: window.getComputedStyle(wrapper).visibility
      });

      // Temporarily make the element visible for capture
      const originalStyle = wrapper.style.cssText;
      wrapper.style.cssText = 'position: absolute; top: 0; left: 0; width: 794px; visibility: visible; display: block; z-index: -1;';
      
      // Wait a moment for any dynamic content to render
      await new Promise(resolve => setTimeout(resolve, 500));

      const fullHTML = `
        <html dir="rtl" lang="he">
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
              * { box-sizing: border-box; }
            </style>
          </head>
          <body>
            ${wrapper.outerHTML}
          </body>
        </html>
      `;

      console.log('📤 Sending HTML to PDF service...');
      console.log('📄 HTML length:', fullHTML.length);

      const response = await fetch("https://salima-pdf-backend.onrender.com/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: fullHTML })
      });

      // Restore original styles
      wrapper.style.cssText = originalStyle;

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ PDF service error:', response.status, errorText);
        throw new Error(`PDF service returned ${response.status}: ${errorText}`);
      }

      const blob = await response.blob();
      console.log('📦 Received PDF blob:', blob.size, 'bytes');
      
      if (blob.size === 0) {
        throw new Error('Received empty PDF file');
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `group_${Date.now()}_report.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
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

    return (
      <div id="group-report-wrapper" style={{ 
        position: 'absolute', 
        top: '-9999px', 
        left: '-9999px',
        width: '794px',
        backgroundColor: '#fff',
        fontFamily: 'Arial, sans-serif'
      }}>
        {/* Page 1: Title Page */}
        <div
          style={{
            width: '794px',
            height: '1123px',
            padding: '48px',
            direction: 'rtl',
            fontFamily: 'Arial, sans-serif',
            pageBreakAfter: 'always',
            backgroundColor: '#fff',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <h1 style={{ 
            fontSize: '44px', 
            color: '#1e40af', 
            marginBottom: '32px', 
            fontWeight: 'bold',
            lineHeight: '1.2'
          }}>
            דוח תובנות קבוצתי - קבוצה {groupNumber}
          </h1>
          <h2 style={{ 
            fontSize: '28px', 
            color: '#374151', 
            marginBottom: '40px',
            fontWeight: 'normal'
          }}>
            שאלון מנהיגות
          </h2>
          <p style={{ fontSize: '18px', color: '#6b7280', marginTop: '40px' }}>
            {currentDate} | {(salimaData?.participant_count || 0) + (wocaData?.participant_count || 0)} משתתפים
          </p>
        </div>

        {/* Page 2: SALIMA Visualizations + Explanations */}
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
            {/* Charts Section - Top Half */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', height: '450px' }}>
              {/* Radar Chart */}
              <div style={{ width: '47%', textAlign: 'center' }}>
                <h3 style={{ fontSize: '20px', color: '#1f2937', marginBottom: '16px' }}>
                  פרופיל קבוצתי SALIMA
                </h3>
                <div style={{ 
                  width: '100%', 
                  height: '380px', 
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#f9fafb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <SalimaGroupRadarChart averages={salimaData.averages} />
                </div>
              </div>

              {/* Archetype Chart */}
              <div style={{ width: '47%', textAlign: 'center' }}>
                <h3 style={{ fontSize: '20px', color: '#1f2937', marginBottom: '16px' }}>
                  סגנון מנהיגות
                </h3>
                <div style={{ 
                  width: '100%', 
                  height: '380px', 
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#f9fafb',
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

            {/* Explanations Section - Bottom Half */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', lineHeight: '1.6' }}>
              {/* Left Column: SALIMA Dimensions */}
              <div style={{ width: '47%' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' }}>
                  ממדי SALIMA
                </h3>
                <div style={{ marginBottom: '12px' }}>
                  <strong>אסטרטגיה (S):</strong> ראייה מערכתית, תכנון לטווח ארוך ויכולת להוביל חזון.
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <strong>אדפטיביות (A):</strong> גמישות מחשבתית ורגשית ותגובה יעילה למצבים משתנים.
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <strong>למידה (L):</strong> פתיחות לרעיונות חדשים, חשיבה ביקורתית ולמידה מתמשכת.
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <strong>השראה (I):</strong> הנעה רגשית דרך דוגמה אישית וחזון שמעורר משמעות.
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <strong>משמעות (M):</strong> חיבור עמוק לערכים, תכלית ותחושת שליחות אישית וארגונית.
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <strong>אותנטיות (A2):</strong> כנות, שקיפות והתנהלות אנושית המחוברת לערכים פנימיים.
                </div>
              </div>

              {/* Right Column: Leadership Styles */}
              <div style={{ width: '47%' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' }}>
                  סגנונות מנהיגות
                </h3>
                <div style={{ marginBottom: '12px' }}>
                  <strong>מנהל ההזדמנות (S + A):</strong> רואה רחוק ופועל בגמישות, מזהה הזדמנויות ומתאים את עצמו למציאות משתנה.
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <strong>המנהל הסקרן (L + I):</strong> לומד כל הזמן, מלהיב אחרים בחיפוש אחר ידע וחדשנות.
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <strong>המנהל המעצים (M + A2):</strong> מוביל מתוך ערכים, יוצר חיבור אמיתי ומעצים אחרים דרך כנות ומשמעות.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Page 3: WOCA Insights */}
        {wocaData && (
          <div
            style={{
              width: '794px',
              height: '1123px',
              padding: '48px',
              direction: 'rtl',
              fontFamily: 'Arial, sans-serif',
              backgroundColor: '#fff',
              boxSizing: 'border-box'
            }}
          >
            {/* Title */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '32px', color: '#1f2937', marginBottom: '16px' }}>
                שאלון תודעה ארגונית
              </h2>
            </div>

            {/* Zone Label Box */}
            <div style={{
              textAlign: 'center',
              marginBottom: '32px',
              padding: '16px',
              backgroundColor: '#ecfdf5',
              border: '2px solid #10b981',
              borderRadius: '16px'
            }}>
              <h3 style={{ fontSize: '24px', color: '#047857', fontWeight: 'bold', margin: '0' }}>
                אזור ההזדמנות
              </h3>
            </div>

            {/* Charts Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', height: '300px' }}>
              {/* Bar Chart */}
              <div style={{ width: '47%', textAlign: 'center' }}>
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#f9fafb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <WocaGroupBarChart 
                    groupCategoryScores={wocaData.groupCategoryScores!}
                  />
                </div>
              </div>

              {/* Zone Distribution Chart */}
              <div style={{ width: '47%', textAlign: 'center' }}>
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#f9fafb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <WocaRadarChart participants={wocaData.participants} />
                </div>
              </div>
            </div>

            {/* Zone Legend */}
            <div style={{ fontSize: '16px', lineHeight: '1.6', marginTop: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>
                הסבר על אזורי התודעה
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <strong>🌕 אזור ההזדמנות (WIN/WIN):</strong> שיח פתוח, יוזמה משותפת, צמיחה וחדשנות.
                </div>
                <div>
                  <strong>🌤 אזור הנוחות (LOSE/LOSE):</strong> הימנעות משינוי, שחיקה ושמירה על הסטטוס קוו.
                </div>
                <div>
                  <strong>🌑 אזור האדישות (LOSE/LOSE):</strong> נתק רגשי, חוסר מעורבות ואבדן כיוון.
                </div>
                <div>
                  <strong>🔥 אזור המלחמה (WIN/LOSE):</strong> שליטה, חשדנות והתנגדות פעילה לשינוי.
                </div>
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
            📄 ייצוא PDF
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
