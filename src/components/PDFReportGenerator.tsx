
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
import html2canvas from 'html2canvas';

/* -------------------  types ------------------- */

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

/* -------------------  component ------------------- */

export const PDFReportGenerator: React.FC = () => {
  const [groupNumber, setGroupNumber] = useState<number | null>(null);
  const [salimaData, setSalimaData] = useState<SalimaGroupData | null>(null);
  const [wocaData, setWocaData] = useState<WocaGroupData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: groupData, isLoading: salimaLoading, error: salimaError } = useGroupData(groupNumber || 0);
  const { workshopData, isLoading: wocaLoading, error: wocaError } = useWorkshopData(groupNumber || 0);

  /* -----------------  load data ----------------- */

  const loadGroupData = async () => {
    if (!groupNumber) {
      setError('Please enter a group number');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // hooks do the loading automatically
    } catch (err) {
      console.error(err);
      setError('Failed to load group data');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (groupData) setSalimaData(groupData as SalimaGroupData);
  }, [groupData]);

  React.useEffect(() => {
    if (workshopData) setWocaData(workshopData as WocaGroupData);
  }, [workshopData]);

  // Clean HTML function to remove React development attributes
  const cleanHTML = (html: string): string => {
    return html
      .replace(/data-lov-[^=]*="[^"]*"\s*/g, '')
      .replace(/data-component-[^=]*="[^"]*"\s*/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  /* --------------  export to PDF -------------- */

  const exportGroupPDF = async () => {
    console.log('🎯 Starting PDF export process...');
    console.log('📊 Available data - Salima:', !!salimaData, 'WOCA:', !!wocaData);
    
    if (!salimaData && !wocaData) {
      setError('No data available for export');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const wrapper = document.getElementById('group-report-wrapper');
      if (!wrapper) {
        console.error('❌ Group report wrapper not found');
        throw new Error('Group report wrapper not found');
      }

      console.log('✅ Found wrapper element');

      /* make wrapper visible for capture */
      const originalStyle = wrapper.style.cssText;
      wrapper.style.cssText =
        'position:absolute;top:0;left:0;width:794px;visibility:visible;display:block;z-index:-1;';

      console.log('⏳ Waiting for charts to render...');
      await new Promise((r) => setTimeout(r, 1000)); // allow charts to render

      console.log('📊 Converting charts to images...');
      /* convert charts to images */
      const charts = wrapper.querySelectorAll('.chart-snapshot');
      console.log('🎯 Found', charts.length, 'charts to convert');
      
      for (let i = 0; i < charts.length; i++) {
        const chart = charts[i] as HTMLElement;
        const chartId = chart.id || `chart-${i}`;
        console.log('📸 Capturing chart:', chartId);
        
        const canvas = await html2canvas(chart, {
          backgroundColor: '#ffffff',
          scale: 2,
          useCORS: true,
          allowTaint: true,
          width: chart.offsetWidth,
          height: chart.offsetHeight,
        });
        const img = document.createElement('img');
        img.src = canvas.toDataURL('image/png', 1.0);
        img.style.width = '100%';
        img.style.height = 'auto';
        chart.replaceWith(img);
        console.log('✅ Successfully converted chart:', chartId);
      }
      console.log('🎨 All charts converted to images');

      /* get clean HTML */
      const cleanedHTML = cleanHTML(wrapper.outerHTML);
      console.log('📋 Wrapper content after chart conversion:', cleanedHTML.substring(0, 200) + '...');
      console.log('📐 Wrapper dimensions:', {
        width: wrapper.offsetWidth,
        height: wrapper.offsetHeight
      });

      /* Build complete HTML document */
      const fullHTML = `
        <html dir="rtl" lang="he">
          <head>
            <meta charset="UTF-8">
            <style>
              html, body {
                width: 794px;
                height: auto;
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                background: white;
              }
              * {
                box-sizing: border-box;
              }
              img {
                max-width: 100%;
                height: auto;
                display: block;
              }
              .page {
                page-break-after: always;
                width: 794px;
                height: 1123px;
                padding: 48px;
                background: white;
              }
            </style>
          </head>
          <body>
            ${cleanedHTML}
          </body>
        </html>
      `;

      console.log('📤 Sending HTML to PDF service...');
      console.log('📄 HTML length:', fullHTML.length);
      console.log('📄 HTML sample (first 1000 chars):', fullHTML.substring(0, 1000));
      console.log('📄 HTML sample (last 500 chars):', fullHTML.substring(fullHTML.length - 500));

      /* send to PDF service */
      const response = await fetch('https://salima-pdf-backend.onrender.com/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: fullHTML }),
      });

      wrapper.style.cssText = originalStyle; // restore

      if (!response.ok) throw new Error(`PDF service returned ${response.status}`);

      const blob = await response.blob();
      console.log('📦 Received PDF blob:', blob.size, 'bytes');
      
      if (blob.size === 0) throw new Error('Received empty PDF file');

      /* download */
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `group_${Date.now()}_report.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      console.log('✅ PDF export completed successfully!');
    } catch (err) {
      console.error('❌ PDF export failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  /* ----------------  PDF layout renderer  ---------------- */

  const renderPDFLayout = () => {
    if (!salimaData && !wocaData) return null;

    return (
      <div
        id="group-report-wrapper"
        style={{
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
          visibility: 'hidden',
          width: '794px',
        }}
      >
        <div
          className="page"
          style={{
            width: '794px',
            height: '1123px',
            padding: '48px',
            direction: 'rtl',
            fontFamily: 'Arial, sans-serif',
            breakAfter: 'page',
            backgroundColor: 'white',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
              דוח קבוצתי משולב
            </h1>
            <p style={{ fontSize: '16px', color: '#6b7280' }}>
              קבוצה {groupNumber} • {new Date().toLocaleDateString('he-IL')}
            </p>
          </div>

          {/* Salima Section */}
          {salimaData && (
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px', textAlign: 'right' }}>
                ניתוח SALIMA
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div className="chart-snapshot" id="salima-radar">
                  <SalimaGroupRadarChart groupData={salimaData} />
                </div>
                <div className="chart-snapshot" id="archetype-chart">
                  <ArchetypeDistributionChart participants={salimaData.participants} />
                </div>
              </div>

              <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>
                  ממוצעי המימדים
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div>
                    <strong>אסטרטגיה:</strong> {salimaData.averages.strategy.toFixed(2)}
                  </div>
                  <div>
                    <strong>למידה:</strong> {salimaData.averages.learning.toFixed(2)}
                  </div>
                  <div>
                    <strong>השראה:</strong> {salimaData.averages.inspiration.toFixed(2)}
                  </div>
                  <div>
                    <strong>משמעות:</strong> {salimaData.averages.meaning.toFixed(2)}
                  </div>
                  <div>
                    <strong>אותנטיות:</strong> {salimaData.averages.authenticity.toFixed(2)}
                  </div>
                  <div>
                    <strong>הסתגלות:</strong> {salimaData.averages.adaptability.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* WOCA Section */}
          {wocaData && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px', textAlign: 'right' }}>
                ניתוח WOCA
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div className="chart-snapshot" id="woca-bar">
                  <WocaGroupBarChart groupCategoryScores={wocaData.groupCategoryScores} />
                </div>
                <div className="chart-snapshot" id="woca-radar">
                  <WocaRadarChart participants={wocaData.participants} />
                </div>
              </div>

              {wocaData.groupCategoryScores && (
                <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>
                    אזורי WOCA
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div><strong>🟢 אזור ההזדמנות:</strong> {wocaData.groupCategoryScores.opportunity.toFixed(2)}% - פתיחות לשינוי ואופטימיות.</div>
                    <div><strong>🔵 אזור הנוחות:</strong> {wocaData.groupCategoryScores.comfort.toFixed(2)}% - שביעות רצון מהמצב הנוכחי.</div>
                    <div><strong>🟡 אזור האדישות:</strong> {wocaData.groupCategoryScores.apathy.toFixed(2)}% - חוסר מעורבות ואדישות.</div>
                    <div><strong>🔥 אזור המלחמה (WIN/LOSE):</strong> {wocaData.groupCategoryScores.war.toFixed(2)}% - שליטה, חשדנות והתנגדות פעילה לשינוי.</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-bold mb-4">יצירת דוח PDF קבוצתי</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">מספר קבוצה</label>
            <Input
              type="number"
              value={groupNumber || ''}
              onChange={(e) => setGroupNumber(e.target.value ? parseInt(e.target.value) : null)}
              placeholder="הזן מספר קבוצה"
              className="max-w-xs"
            />
          </div>
          
          <div className="flex gap-4">
            <Button
              onClick={loadGroupData}
              disabled={isLoading || !groupNumber}
            >
              {isLoading ? 'טוען...' : 'טען נתוני קבוצה'}
            </Button>
            
            <Button
              onClick={exportGroupPDF}
              disabled={isLoading || (!salimaData && !wocaData)}
              variant="default"
            >
              {isLoading ? 'יוצר PDF...' : 'ייצא לPDF'}
            </Button>
          </div>
          
          {error && (
            <Alert>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {(salimaData || wocaData) && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-green-800">
                נתונים נטענו בהצלחה: 
                {salimaData && ` SALIMA (${salimaData.participant_count} משתתפים)`}
                {salimaData && wocaData && ', '}
                {wocaData && ` WOCA (${wocaData.participant_count} משתתפים)`}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {renderPDFLayout()}
    </div>
  );
};
