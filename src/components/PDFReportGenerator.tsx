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

  /* --------------  export to PDF -------------- */

  const exportGroupPDF = async () => {
    if (!salimaData && !wocaData) {
      setError('No data available for export');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const wrapper = document.getElementById('group-report-wrapper');
      if (!wrapper) throw new Error('Group report wrapper not found');

      /* make wrapper visible for capture */
      const originalStyle = wrapper.style.cssText;
      wrapper.style.cssText =
        'position:absolute;top:0;left:0;width:794px;visibility:visible;display:block;z-index:-1;';

      await new Promise((r) => setTimeout(r, 1000)); // allow charts to render

      /* convert charts to images */
      const charts = wrapper.querySelectorAll('.chart-snapshot');
      for (let i = 0; i < charts.length; i++) {
        const chart = charts[i] as HTMLElement;
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
      }

      /* clean HTML */
      const cleanHTML = wrapper.outerHTML
        .replace(/data-lov-[^=]*="[^"]*"\s*/g, '')
        .replace(/data-component-[^=]*="[^"]*"\s*/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      /* send ONLY the fragment — backend wraps it once */
      const response = await fetch('https://salima-pdf-backend.onrender.com/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: cleanHTML }),
      });

      wrapper.style.cssText = originalStyle; // restore

      if (!response.ok) throw new Error(`PDF service returned ${response.status}`);

      const blob = await response.blob();
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
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  /* ----------------  rest of component (unchanged)  ---------------- */
  /* renderPDFLayout() and JSX returned below are identical to your previous version */

  /* ... renderPDFLayout() unchanged ... */
  const renderPDFLayout = () => {
    /* same as before — omitted for brevity */
    /* KEEP YOUR EXISTING LAYOUT CODE HERE */
  };

  return (
    <div className="space-y-6 p-6">
      {/* UI + buttons section — unchanged */}
      {/* ... */}
      {renderPDFLayout()}
    </div>
  );
};
