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

/* ---------- types ---------- */

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

/* ---------- component ---------- */

export const PDFReportGenerator: React.FC = () => {
  const [groupNumber, setGroupNumber] = useState<number | null>(null);
  const [salimaData, setSalimaData] = useState<SalimaGroupData | null>(null);
  const [wocaData, setWocaData] = useState<WocaGroupData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: groupData } = useGroupData(groupNumber || 0);
  const { workshopData } = useWorkshopData(groupNumber || 0);

  React.useEffect(() => void setSalimaData(groupData as any), [groupData]);
  React.useEffect(() => void setWocaData(workshopData as any), [workshopData]);

  /* ---------- helper: convert charts ---------- */

  const replaceChartsWithImg = () => {
    const charts = document.querySelectorAll<HTMLDivElement>('#group-report-wrapper .chart-snapshot');

    charts.forEach((holder) => {
      const canvas = holder.querySelector('canvas');
      const svg = holder.querySelector('svg');

      let dataURL = '';

      if (canvas) {
        dataURL = (canvas as HTMLCanvasElement).toDataURL('image/png', 1.0);
      } else if (svg) {
        const cloned = svg.cloneNode(true) as SVGElement;
        const svgTxt = new XMLSerializer().serializeToString(cloned);
        dataURL = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgTxt)));
      }

      if (dataURL) {
        const img = new Image();
        img.src = dataURL;
        img.style.width = '100%';
        img.style.height = 'auto';
        holder.replaceWith(img);
      }
    });
  };

  /* ---------- export ---------- */

  const exportGroupPDF = async () => {
    if (!salimaData && !wocaData) return setError('אין נתונים לייצוא');

    setIsLoading(true);
    setError(null);

    try {
      const wrapper = document.getElementById('group-report-wrapper');
      if (!wrapper) throw new Error('ה-wrapper לא נמצא');

      /* 1️⃣  temporarily SHOW the wrapper so charts can size themselves */
      const oldCss = wrapper.style.cssText;
      wrapper.style.cssText =
        'position:fixed;top:0;left:0;width:794px;opacity:0;pointer-events:none;z-index:-1;';

      // allow one frame + resize event
      await new Promise((r) => requestAnimationFrame(r));
      window.dispatchEvent(new Event('resize'));
      await new Promise((r) => setTimeout(r, 300));

      /* 2️⃣  swap every chart with a <img src="data:…"> */
      replaceChartsWithImg();

      /* 3️⃣  clean html */
      const cleanHTML = wrapper.outerHTML
        .replace(/data-[^=]*="[^"]*"/g, '')
        .replace(/\s{2,}/g, ' ')
        .trim();

      /* 4️⃣  send to backend (backend wraps once) */
      const res = await fetch('https://salima-pdf-backend.onrender.com/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: cleanHTML }),
      });

      wrapper.style.cssText = oldCss; // restore

      if (!res.ok) throw new Error('שגיאה בשירות PDF');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `group_${Date.now()}_report.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e.message || 'שגיאה לא ידועה');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- layout (unchanged) ---------- */
  /* keep your existing renderPDFLayout() here – only the outer style changed */

  const renderPDFLayout = () => (
    <div
      id="group-report-wrapper"
      style={{
        position: 'fixed',       // instead of -9999px
        top: 0,
        left: 0,
        width: 794,
        opacity: 0,              // invisible but takes space
        pointerEvents: 'none',
        zIndex: -1,
        background: '#fff',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* … All your existing page markup … */}
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      {/* controls + errors (unchanged) */}
      {renderPDFLayout()}
    </div>
  );
};
