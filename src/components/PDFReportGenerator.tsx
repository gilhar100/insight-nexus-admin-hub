import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGroupData } from '@/hooks/useGroupData';
import { useWorkshopDetails } from '@/hooks/useWorkshopDetails';
import { useWorkshops } from '@/hooks/useWorkshops';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

interface GroupPDFExportLayoutProps {
  pdfImages: Record<string, string>;
  groupNumber: number;
  participantCount: number;
  salimaScore: number;
  strongestDimension: { name: string; score: number };
  weakestDimension: { name: string; score: number };
  wocaScore: number;
  wocaParticipantCount: number;
}

export const GroupPDFExportLayout: React.FC<GroupPDFExportLayoutProps> = ({
  pdfImages,
  groupNumber,
  participantCount,
  salimaScore,
  strongestDimension,
  weakestDimension,
  wocaScore,
  wocaParticipantCount
}) => {
  const pageStyle = {
    width: '794px',
    height: '1123px',
    padding: '48px',
    pageBreakAfter: 'always' as const,
    backgroundColor: '#fff',
    direction: 'rtl' as const,
    fontFamily: 'Arial, sans-serif',
    boxSizing: 'border-box' as const,
    position: 'relative' as const,
    overflow: 'hidden' as const
  };

  const chartStyle = {
    width: '100%',
    maxHeight: '450px',
    objectFit: 'contain' as const,
    display: 'block',
    margin: '24px auto'
  };

  return (
    <div id="pdf-export-root">

      <div style={pageStyle}>
        <h1 style={{ fontSize: '24px', textAlign: 'center' }}>דוח קבוצתי - SALIMA</h1>
        <div style={{ textAlign: 'center', marginBottom: '12px', fontSize: '16px' }}>
          קבוצה {groupNumber} | {participantCount} משתתפים | {new Date().toLocaleDateString('he-IL')}
        </div>
        <h2 style={{ fontSize: '20px', textAlign: 'center', marginTop: '24px' }}>ציון מנהיגות קבוצתי</h2>
        <div style={{ fontSize: '60px', color: '#0072f5', textAlign: 'center', fontWeight: 'bold' }}>{salimaScore.toFixed(2)}</div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '48px' }}>
          <div style={{ width: '45%', backgroundColor: '#fffbe6', border: '2px solid #ffc107', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', color: '#ff6f00', fontWeight: 'bold' }}>ממד לפיתוח</div>
            <div style={{ fontSize: '36px', color: '#ff6f00', fontWeight: 'bold' }}>{weakestDimension.score}</div>
            <div>{weakestDimension.name}</div>
          </div>

          <div style={{ width: '45%', backgroundColor: '#e8f5e9', border: '2px solid #4caf50', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', color: '#2e7d32', fontWeight: 'bold' }}>הממד החזק ביותר</div>
            <div style={{ fontSize: '36px', color: '#2e7d32', fontWeight: 'bold' }}>{strongestDimension.score}</div>
            <div>{strongestDimension.name}</div>
          </div>
        </div>

        <h3 style={{ fontSize: '18px', textAlign: 'center', marginTop: '48px' }}>פרופיל קבוצתי ייחודי</h3>
        <img src={pdfImages['radar-chart']} alt="Radar Chart" style={chartStyle} />
      </div>

      <div style={pageStyle}>
        <h2 style={{ fontSize: '22px', textAlign: 'center' }}>התפלגות סגנון מנהיגות</h2>
        <img src={pdfImages['archetype-chart']} alt="Archetype Chart" style={chartStyle} />

        <div style={{ padding: '0 32px', fontSize: '16px', lineHeight: '1.6' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>הסבר על סגנונות המנהיגות</h3>
          <p><strong>המנהל הסקרן:</strong> חוקר, שואל שאלות, מוביל באנרגיה של למידה וצמיחה.</p>
          <p><strong>המנהל המעצים:</strong> פועל מתוך כנות ותחושת שליחות, מחבר את האנשים למשמעות.</p>
          <p><strong>מנהל ההזדמנות:</strong> חושב קדימה, מזהה מגמות, פועל בגמישות ובחזון.</p>
        </div>
      </div>

      <div style={pageStyle}>
        <h2 style={{ fontSize: '22px', textAlign: 'center' }}>WOCA - ניתוח אזורי שינוי</h2>
        <div style={{ textAlign: 'center', fontSize: '16px', marginBottom: '8px' }}>
          {wocaParticipantCount} משתתפים | ציון ממוצע: {wocaScore.toFixed(2)}
        </div>
        <img src={pdfImages['woca-bar']} alt="WOCA Bar Chart" style={chartStyle} />

        <div style={{ padding: '0 32px', fontSize: '16px', lineHeight: '1.6' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>הסבר על אזורי השינוי</h3>
          <p><strong>הזדמנות:</strong> אזור עם פוטנציאל גבוה לצמיחה.</p>
          <p><strong>נוחות:</strong> אזור יציב אך עם סיכון להתקבעות.</p>
          <p><strong>אדישות:</strong> אזור של חוסר מעורבות ודורש התעוררות.</p>
          <p><strong>מלחמה:</strong> התנגדות פעילה לשינוי.</p>

          <div style={{ backgroundColor: '#fff8e1', border: '1px solid #fbc02d', padding: '12px', marginTop: '24px', fontSize: '14px', textAlign: 'center' }}>
            ⚠️ הערה: גרף זה מציג ציונים ממוצעים, לא התפלגות אזורי תודעה בין המשתתפים
          </div>
        </div>
      </div>

    </div>
  );
};

// Helper function to get dimension insights
const getDimensionInsights = (averages: any) => {
  const dimensions = [
    { name: 'אסטרטגיה', score: averages.strategy, key: 'strategy' },
    { name: 'למידה', score: averages.learning, key: 'learning' },
    { name: 'השראה', score: averages.inspiration, key: 'inspiration' },
    { name: 'משמעות', score: averages.meaning, key: 'meaning' },
    { name: 'אותנטיות', score: averages.authenticity, key: 'authenticity' },
    { name: 'הסתגלות', score: averages.adaptability, key: 'adaptability' }
  ];

  const strongest = dimensions.reduce((max, dim) => 
    dim.score > max.score ? dim : max
  );
  
  const weakest = dimensions.reduce((min, dim) => 
    dim.score < min.score ? dim : min
  );

  return { strongest, weakest };
};

// Main PDFReportGenerator component
export const PDFReportGenerator: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [pdfImages, setPdfImages] = useState<Record<string, string>>({});
  const [isExporting, setIsExporting] = useState(false);

  const { workshops } = useWorkshops();
  const { data: salimaData, isLoading: salimaLoading, error: salimaError } = useGroupData(selectedGroup);
  const { workshopData: wocaData, isLoading: wocaLoading, error: wocaError } = useWorkshopDetails(selectedGroup);

  const captureAllVisualizations = async (): Promise<Record<string, string>> => {
    const images: Record<string, string> = {};
    
    // Capture radar chart
    const radarElement = document.querySelector('[data-chart="radar"]');
    if (radarElement) {
      const canvas = await html2canvas(radarElement as HTMLElement, { 
        useCORS: true, 
        backgroundColor: '#ffffff',
        scale: 2 
      });
      images['radar-chart'] = canvas.toDataURL('image/jpeg', 0.8);
    }

    // Capture archetype chart
    const archetypeElement = document.querySelector('[data-chart="archetype"]');
    if (archetypeElement) {
      const canvas = await html2canvas(archetypeElement as HTMLElement, { 
        useCORS: true, 
        backgroundColor: '#ffffff',
        scale: 2 
      });
      images['archetype-chart'] = canvas.toDataURL('image/jpeg', 0.8);
    }

    // Capture WOCA bar chart
    const wocaElement = document.querySelector('[data-chart="woca-bar"]');
    if (wocaElement) {
      const canvas = await html2canvas(wocaElement as HTMLElement, { 
        useCORS: true, 
        backgroundColor: '#ffffff',
        scale: 2 
      });
      images['woca-bar'] = canvas.toDataURL('image/jpeg', 0.8);
    }

    return images;
  };

  const exportGroupPDF = async () => {
    if (!salimaData || !wocaData) {
      toast.error('נתונים לא זמינים לייצוא');
      return;
    }

    setIsExporting(true);
    
    try {
      // Capture visualizations first
      const captured = await captureAllVisualizations();
      setPdfImages(captured);

      // Small delay to ensure images are set
      await new Promise(resolve => setTimeout(resolve, 100));

      const element = document.getElementById('pdf-export-root');
      if (!element) {
        throw new Error('PDF export element not found');
      }

      // Temporarily show the element
      element.style.display = 'block';
      
      const canvas = await html2canvas(element, {
        useCORS: true,
        backgroundColor: '#ffffff',
        scale: 1.5,
        width: 794,
        height: 1123 * 4 // 4 pages
      });

      // Hide the element again
      element.style.display = 'none';

      const imgData = canvas.toDataURL('image/jpeg', 0.8);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight * 4);
      
      pdf.save(`דוח-קבוצתי-${selectedGroup}-${new Date().toLocaleDateString('he-IL')}.pdf`);
      toast.success('הדוח יוצא בהצלחה!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('שגיאה ביצירת הדוח');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>יצירת דוח PDF קבוצתי</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">בחר קבוצה לייצוא דוח</label>
            <Select value={selectedGroup?.toString()} onValueChange={(value) => setSelectedGroup(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder="בחר קבוצה" />
              </SelectTrigger>
              <SelectContent>
                {workshops.map(workshop => (
                  <SelectItem key={workshop.id} value={workshop.id.toString()}>
                    <div className="flex flex-col text-right">
                      <span className="font-medium">{workshop.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {workshop.participant_count} משתתפים • {new Date(workshop.date).toLocaleDateString('he-IL')}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedGroup && (
            <div className="space-y-4">
              {(salimaLoading || wocaLoading) && <p>טוען נתונים...</p>}
              {(salimaError || wocaError) && <p className="text-red-500">שגיאה בטעינת הנתונים</p>}
              
              {salimaData && wocaData && (
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    קבוצה {selectedGroup} • {salimaData.participant_count} משתתפים SALIMA • {wocaData.participant_count} משתתפים WOCA
                  </div>
                  
                  <Button 
                    onClick={exportGroupPDF}
                    disabled={isExporting}
                    className="w-full"
                  >
                    {isExporting ? 'מייצא דוח...' : 'ייצא דוח PDF'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {salimaData && wocaData && (
        <div id="pdf-export-root" style={{ display: 'none' }}>
          <GroupPDFExportLayout
            pdfImages={pdfImages}
            groupNumber={selectedGroup!}
            participantCount={salimaData.participant_count}
            salimaScore={salimaData.averages.overall}
            strongestDimension={getDimensionInsights(salimaData.averages).strongest}
            weakestDimension={getDimensionInsights(salimaData.averages).weakest}
            wocaScore={wocaData.average_score}
            wocaParticipantCount={wocaData.participant_count}
          />
        </div>
      )}
    </div>
  );
};