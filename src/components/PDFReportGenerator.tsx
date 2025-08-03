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
  /* ---------- state ---------- */
  const [groupNumber, setGroupNumber] = useState<number | null>(null);
  const [salimaData, setSalimaData] = useState<SalimaGroupData | null>(null);
  const [wocaData, setWocaData] = useState<WocaGroupData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------- hooks ---------- */
  const { data: groupData } = useGroupData(groupNumber || 0);
  const { workshopData } = useWorkshopData(groupNumber || 0);

  React.useEffect(() => setSalimaData(groupData as any), [groupData]);
  React.useEffect(() => setWocaData(workshopData as any), [workshopData]);

  /* ---------- helpers ---------- */

  const stripReactAttrs = (html: string) =>
    html.replace(/data-[^=]*="[^"]*"/g, '').replace(/\s{2,}/g, ' ').trim();

  /** wait until every internal canvas/svg has non‑zero size */
  const waitUntilChartsRender = async (wrapper: HTMLElement) => {
    const holders = Array.from(wrapper.querySelectorAll<HTMLElement>('.chart-snapshot'));
    let attempts = 0;
    return new Promise<void>((resolve) => {
      const tick = () => {
        const ready = holders.every((h) => {
          const el = h.querySelector('canvas,svg') as HTMLElement | null;
          return el && el.offsetWidth > 0 && el.offsetHeight > 0;
        });
        if (ready || attempts > 40) return resolve(); // ~4s max
        attempts += 1;
        requestAnimationFrame(tick);
      };
      tick();
    });
  };

  /** replace each chart snapshot with a base‑64 <img> */
  const replaceChartsWithImages = async () => {
    const holders = document.querySelectorAll<HTMLDivElement>('#group-report-wrapper .chart-snapshot');

    for (const holder of holders) {
      const canvasEl = holder.querySelector('canvas') as HTMLCanvasElement | null;
      const svgEl = holder.querySelector('svg') as SVGElement | null;
      let dataURL = '';

      if (canvasEl && canvasEl.width && canvasEl.height) {
        dataURL = canvasEl.toDataURL('image/png', 1.0);
      } else if (svgEl) {
        svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        const txt = new XMLSerializer().serializeToString(svgEl);
        dataURL = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(txt)));
      } else {
        // fallback: html2canvas capture of the whole holder
        const canvas = await html2canvas(holder, {
          backgroundColor: '#ffffff',
          scale: 2,
          useCORS: true,
        });
        dataURL = canvas.toDataURL('image/png', 1.0);
      }

      if (dataURL) {
        const img = new Image();
        img.src = dataURL;
        img.setAttribute('width', String(holder.offsetWidth || 400));
        img.setAttribute('height', String(holder.offsetHeight || 300));
        img.style.width = '100%';
        img.style.height = 'auto';
        holder.replaceWith(img);
      }
    }
  };

  /* ---------- export ---------- */

  const exportGroupPDF = async () => {
    if (!salimaData && !wocaData) return setError('אין נתונים לייצוא');

    setIsLoading(true);
    setError(null);

    try {
      const wrapper = document.getElementById('group-report-wrapper');
      if (!wrapper) throw new Error('ה‑wrapper לא נמצא');

      /* bring wrapper on‑screen (off‑viewport) so charts size properly */
      const oldCSS = wrapper.style.cssText;
      wrapper.style.cssText =
        'position:absolute;top:-9999px;left:-9999px;width:794px;visibility:visible;pointer-events:none;';

      await waitUntilChartsRender(wrapper);
      await replaceChartsWithImages();

      const htmlFragment = stripReactAttrs(wrapper.outerHTML);

      const res = await fetch('https://salima-pdf-backend.onrender.com/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: htmlFragment }),
      });

      wrapper.style.cssText = oldCSS; // restore

      if (!res.ok) throw new Error(`שגיאה ביצירת PDF (${res.status})`);
      const blob = await res.blob();
      if (!blob.size) throw new Error('קובץ PDF ריק הוחזר');

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `group_${Date.now()}_report.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'שגיאה לא ידועה');
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- data load ---------- */

  const loadGroupData = () => {
    if (!groupNumber) return setError('אנא הזן מספר קבוצה');
    setError(null);
    // hooks auto‑fetch – trigger by updating state only
  };

  /* ---------- PDF layout (unchanged) ---------- */

  const renderPDFLayout = () => {
    if (!salimaData && !wocaData) return null;
    return (
      <div
        id="group-report-wrapper"
        style={{ position: 'absolute', top: '-9999px', left: '-9999px', width: '794px' }}
      >
        {/* --- your existing page markup unchanged --- */}
        {/* ... keep the pages exactly as in your original code ... */}
      </div>
    );
  };

  /* ---------- render controls ---------- */

  return (
    <div className="space-y-6 p-6">
      {/* UI Panel */}
      <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
        <h2 className="text-2xl font-bold">יצירת דוח PDF קבוצתי</h2>
        <Input
          type="number"
          value={groupNumber ?? ''}
          onChange={(e) => setGroupNumber(e.target.value ? parseInt(e.target.value, 10) : null)}
          placeholder="מספר קבוצה"
          className="max-w-xs"
        />
        <div className="flex gap-4">
          <Button onClick={loadGroupData} disabled={!groupNumber || isLoading}>
            טען נתונים
          </Button>
          <Button onClick={exportGroupPDF} disabled={isLoading || (!salimaData && !wocaData)}>
            {isLoading ? 'יוצר PDF…' : 'ייצא ל‑PDF'}
          </Button>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {(salimaData || wocaData) && (
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-green-800">
              נתונים נטענו:
              {salimaData && ` SALIMA (${salimaData.participant_count})`}
              {salimaData && wocaData && ', '}
              {wocaData && ` WOCA (${wocaData.participant_count})`}
            </p>
          </div>
        )}
      </div>

      {/* hidden printable layout */}
      {renderPDFLayout()}
    </div>
  );
};
