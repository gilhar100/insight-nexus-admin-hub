import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Loader2 } from 'lucide-react';
import { useWorkshops } from '@/hooks/useWorkshops';
import { useGroupData } from '@/hooks/useGroupData';
import { useWorkshopDetails } from '@/hooks/useWorkshopDetails';
import { EnhancedSalimaRadarChart } from '@/components/EnhancedSalimaRadarChart';
import { ArchetypeDistributionChart } from '@/components/ArchetypeDistributionChart';
import { WocaGroupBarChart } from '@/components/WocaGroupBarChart';
import { ZoneDistributionChart } from '@/components/ZoneDistributionChart';
import { WocaZonesTable } from '@/components/WocaZonesTable';
import { analyzeWorkshopWoca } from '@/utils/wocaAnalysis';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const GenerateReport: React.FC = () => {
  const [selectedGroupId, setSelectedGroupId] = useState<number | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);

  const { workshops, error: workshopsError } = useWorkshops();
  const { data: groupData, isLoading: groupLoading } = useGroupData(selectedGroupId || 0);
  const { workshopData, isLoading: workshopLoading } = useWorkshopDetails(selectedGroupId || 0);

  const handleGroupSelect = (value: string) => {
    const groupId = Number(value);
    setSelectedGroupId(groupId);
  };

  const handleDownloadPDF = async () => {
    if (!selectedGroupId) {
      alert("אנא בחר קבוצה תחילה");
      return;
    }
    
    setIsGenerating(true);
    console.log("Starting professional PDF generation...");
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      
      // Page 1: Title Page
      pdf.setFontSize(24);
      pdf.text("דוח תובנות קבוצתי", pageWidth / 2, 50, { align: 'center' });
      pdf.setFontSize(20);
      pdf.text("SALIMA & WOCA", pageWidth / 2, 70, { align: 'center' });
      
      const selectedWorkshop = workshops.find(w => w.id === selectedGroupId);
      pdf.setFontSize(16);
      pdf.text(selectedWorkshop?.name || '', pageWidth / 2, 90, { align: 'center' });
      pdf.setFontSize(12);
      pdf.text(`תאריך: ${new Date().toLocaleDateString('he-IL')}`, pageWidth / 2, 110, { align: 'center' });

      // Create individual section pages
      const sections = [
        { id: 'salima-summary', title: 'סיכום SALIMA' },
        { id: 'salima-radar', title: 'תרשים רדאר SALIMA' },
        { id: 'archetype-distribution', title: 'התפלגות סגנונות ניהול' },
        { id: 'woca-zone', title: 'אזור WOCA דומיננטי' },
        { id: 'woca-distribution', title: 'התפלגות אזורי WOCA' },
        { id: 'woca-strength', title: 'עוצמת אזורי WOCA' },
        { id: 'woca-matrix', title: 'מטריצת אזורי WOCA' }
      ];

      for (let i = 0; i < sections.length; i++) {
        pdf.addPage();
        
        // Add section title
        pdf.setFontSize(18);
        pdf.text(sections[i].title, pageWidth / 2, 30, { align: 'center' });
        
        // Create individual content for each section
        const sectionElement = document.createElement('div');
        sectionElement.style.width = '800px';
        sectionElement.style.backgroundColor = 'white';
        sectionElement.style.padding = '20px';
        sectionElement.style.fontFamily = 'Arial, sans-serif';
        
        // Add section-specific content
        switch (sections[i].id) {
          case 'salima-summary':
            sectionElement.innerHTML = `
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                <div style="text-align: center; padding: 20px; border: 2px solid #e5e7eb; border-radius: 10px;">
                  <h3 style="font-size: 18px; margin-bottom: 10px;">ציון ממוצע</h3>
                  <p style="font-size: 32px; font-weight: bold; color: #2563eb;">${groupData?.averages?.overall?.toFixed(1) || 'N/A'}</p>
                </div>
                <div style="text-align: center; padding: 20px; border: 2px solid #e5e7eb; border-radius: 10px;">
                  <h3 style="font-size: 18px; margin-bottom: 10px;">מאפיין חזק ביותר</h3>
                  <p style="font-size: 20px; font-weight: bold; color: #16a34a;">${strongest}</p>
                </div>
                <div style="text-align: center; padding: 20px; border: 2px solid #e5e7eb; border-radius: 10px;">
                  <h3 style="font-size: 18px; margin-bottom: 10px;">מאפיין חלש ביותר</h3>
                  <p style="font-size: 20px; font-weight: bold; color: #dc2626;">${weakest}</p>
                </div>
              </div>
              <div style="border: 2px solid #e5e7eb; border-radius: 10px; padding: 20px;">
                <h3 style="font-size: 18px; margin-bottom: 15px;">מקרא מאפייני SALIMA</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
                  <div><strong>אסטרטגיה (S):</strong> יכולת לפתח ולבצע אסטרטגיות ארוכות טווח</div>
                  <div><strong>הסתגלות (A):</strong> יכולת להתמודד עם שינויים ואתגרים</div>
                  <div><strong>למידה (L):</strong> רצון ויכולת ללמוד ולהתפתח כל הזמן</div>
                  <div><strong>השראה (I):</strong> יכולת להשפיע ולהניע אחרים</div>
                  <div><strong>משמעות (M):</strong> יכולת לייצר תחושת משמעות ומטרה</div>
                  <div><strong>אותנטיות (A2):</strong> יכולת להיות אמיתי ושקוף</div>
                </div>
              </div>
            `;
            break;
          
          case 'salima-radar':
          case 'archetype-distribution':
          case 'woca-zone':
          case 'woca-distribution':
          case 'woca-strength':
          case 'woca-matrix':
            // For charts, we'll capture them from the preview
            const chartElements = document.querySelectorAll(`[data-section="${sections[i].id}"]`);
            if (chartElements.length > 0) {
              const chartElement = chartElements[0] as HTMLElement;
              const canvas = await html2canvas(chartElement, {
                scale: 2,
                backgroundColor: '#ffffff',
                useCORS: true,
                allowTaint: true
              });
              
              const imgData = canvas.toDataURL('image/png');
              const imgWidth = pageWidth - (margin * 2);
              const imgHeight = (canvas.height * imgWidth) / canvas.width;
              
              if (imgHeight <= pageHeight - 80) {
                pdf.addImage(imgData, 'PNG', margin, 50, imgWidth, imgHeight);
              } else {
                // Scale down if too large
                const scaledHeight = pageHeight - 80;
                const scaledWidth = (canvas.width * scaledHeight) / canvas.height;
                pdf.addImage(imgData, 'PNG', (pageWidth - scaledWidth) / 2, 50, scaledWidth, scaledHeight);
              }
              continue;
            }
            break;
        }
        
        // For text-based sections, add to document and capture
        if (sections[i].id === 'salima-summary') {
          document.body.appendChild(sectionElement);
          
          const canvas = await html2canvas(sectionElement, {
            scale: 1.5,
            backgroundColor: '#ffffff',
            useCORS: true,
            allowTaint: true
          });
          
          document.body.removeChild(sectionElement);
          
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = pageWidth - (margin * 2);
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          pdf.addImage(imgData, 'PNG', margin, 50, imgWidth, Math.min(imgHeight, pageHeight - 80));
        }
      }
      
      const fileName = `דוח-תובנות-${selectedWorkshop?.name || selectedGroupId}-${new Date().toLocaleDateString('he-IL').replace(/\//g, '-')}.pdf`;
      pdf.save(fileName);
      
      console.log("Professional PDF generated successfully!");
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('שגיאה בהפקת הדוח. אנא נסה שוב.');
    } finally {
      setIsGenerating(false);
    }
  };

  const loading = groupLoading || workshopLoading;
  
  // Calculate WOCA analysis when we have workshop data
  const wocaAnalysis = workshopData?.participants 
    ? analyzeWorkshopWoca(workshopData.participants, selectedGroupId || 0)
    : null;

  const hasData = selectedGroupId && groupData && workshopData && wocaAnalysis;

  // Helper functions for calculations
  const getZoneColor = (zone: string): string => {
    switch (zone) {
      case 'war':
        return '#ef4444';
      case 'opportunity':
        return '#22c55e';
      case 'comfort':
        return '#3b82f6';
      case 'apathy':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getZoneName = (zone: string): string => {
    switch (zone) {
      case 'war':
        return 'אזור המלחמה';
      case 'opportunity':
        return 'אזור ההזדמנות';
      case 'comfort':
        return 'אזור הנוחות';
      case 'apathy':
        return 'אזור האדישות';
      default:
        return 'לא זוהה';
    }
  };

  const getStrongestWeakestDimensions = () => {
    if (!groupData?.averages) return { strongest: '', weakest: '' };
    
    const dimensions = {
      'אסטרטגיה': groupData.averages.strategy,
      'הסתגלות': groupData.averages.adaptability,
      'למידה': groupData.averages.learning,
      'השראה': groupData.averages.inspiration,
      'משמעות': groupData.averages.meaning,
      'אותנטיות': groupData.averages.authenticity
    };

    const entries = Object.entries(dimensions);
    const strongest = entries.reduce((a, b) => a[1] > b[1] ? a : b)[0];
    const weakest = entries.reduce((a, b) => a[1] < b[1] ? a : b)[0];

    return { strongest, weakest };
  };

  const getZoneDistribution = () => {
    if (!wocaAnalysis?.groupZoneCounts) return null;
    return {
      opportunity: wocaAnalysis.groupZoneCounts.opportunity || 0,
      comfort: wocaAnalysis.groupZoneCounts.comfort || 0,
      apathy: wocaAnalysis.groupZoneCounts.apathy || 0,
      war: wocaAnalysis.groupZoneCounts.war || 0
    };
  };

  // Transform group data for radar chart
  const getSalimaRadarData = () => {
    if (!groupData?.averages) return {
      strategy: 0,
      adaptability: 0,
      learning: 0,
      inspiration: 0,
      meaning: 0,
      authenticity: 0
    };
    return {
      strategy: groupData.averages.strategy,
      adaptability: groupData.averages.adaptability,
      learning: groupData.averages.learning,
      inspiration: groupData.averages.inspiration,
      meaning: groupData.averages.meaning,
      authenticity: groupData.averages.authenticity
    };
  };

  const zoneDistribution = getZoneDistribution();
  const { strongest, weakest } = getStrongestWeakestDimensions();
  const radarData = getSalimaRadarData();

  return (
    <div className="space-y-6" dir="rtl">
      <Card>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold text-foreground">
              דוח תובנות קבוצתי - SALIMA & WOCA
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            צור דוח PDF מקצועי המשלב ניתוח SALIMA ו-WOCA עבור קבוצה נבחרת
          </p>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-foreground">בחירת קבוצה</h2>
          <p className="text-muted-foreground">בחר קבוצה מהרשימה להפקת דוח מקצועי</p>
        </CardHeader>
        <CardContent>
          <Select onValueChange={handleGroupSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="בחר קבוצה..." />
            </SelectTrigger>
            <SelectContent>
              {workshops.map((workshop) => (
                <SelectItem key={workshop.id} value={workshop.id.toString()}>
                  {workshop.name} ({workshop.participant_count} משתתפים)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {workshopsError && (
            <div className="text-destructive text-sm mt-2">
              שגיאה בטעינת קבוצות: {workshopsError}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedGroupId && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-foreground">תצוגה מקדימה של הדוח</h2>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center space-x-2 text-primary">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>טוען נתונים...</span>
              </div>
            ) : hasData ? (
              <div id="insights-pdf-wrapper" className="space-y-8 p-6 bg-background">
                {/* Header */}
                <div className="text-center border-b pb-6">
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    דוח תובנות קבוצתי - SALIMA & WOCA
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    {workshops.find(w => w.id === selectedGroupId)?.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    תאריך: {new Date().toLocaleDateString('he-IL')}
                  </p>
                </div>

                {/* SALIMA Section */}
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold text-foreground border-b pb-2">ניתוח SALIMA</h2>
                  
                  {/* Average Score & Strongest/Weakest */}
                  <div data-section="salima-summary" className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-card rounded-lg border">
                      <h3 className="text-lg font-semibold text-foreground">ציון ממוצע</h3>
                      <p className="text-3xl font-bold text-primary">
                        {groupData?.averages?.overall?.toFixed(1) || 'N/A'}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-card rounded-lg border">
                      <h3 className="text-lg font-semibold text-foreground">מאפיין חזק ביותר</h3>
                      <p className="text-xl font-bold text-green-600">{strongest}</p>
                    </div>
                    <div className="text-center p-4 bg-card rounded-lg border">
                      <h3 className="text-lg font-semibold text-foreground">מאפיין חלש ביותר</h3>
                      <p className="text-xl font-bold text-red-600">{weakest}</p>
                    </div>
                  </div>

                  {/* SALIMA Radar Chart */}
                  <div data-section="salima-radar" className="bg-card p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold text-foreground mb-4">תרשים רדאר - מאפייני SALIMA</h3>
                    <div className="w-full h-[400px]">
                      <EnhancedSalimaRadarChart 
                        selfData={radarData}
                        activeDataSource="self"
                      />
                    </div>
                  </div>

                  {/* SALIMA Legend */}
                  <div className="bg-card p-4 rounded-lg border">
                    <h3 className="text-lg font-semibold text-foreground mb-4">מקרא מאפייני SALIMA</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div><strong>אסטרטגיה (S):</strong> יכולת לפתח ולבצע אסטרטגיות ארוכות טווח</div>
                      <div><strong>הסתגלות (A):</strong> יכולת להתמודד עם שינויים ואתגרים</div>
                      <div><strong>למידה (L):</strong> רצון ויכולת ללמוד ולהתפתח כל הזמן</div>
                      <div><strong>השראה (I):</strong> יכולת להשפיע ולהניע אחרים</div>
                      <div><strong>משמעות (M):</strong> יכולת לייצר תחושת משמעות ומטרה</div>
                      <div><strong>אותנטיות (A2):</strong> יכולת להיות אמיתי ושקוף</div>
                    </div>
                  </div>

                  {/* Archetype Distribution */}
                  <div data-section="archetype-distribution" className="bg-card p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold text-foreground mb-4">התפלגות סגנונות ניהול</h3>
                    <div className="w-full h-[400px]">
                      <ArchetypeDistributionChart groupNumber={selectedGroupId} isPresenterMode={true} />
                    </div>
                  </div>

                  {/* Archetype Legend */}
                  <div className="bg-card p-4 rounded-lg border">
                    <h3 className="text-lg font-semibold text-foreground mb-4">מקרא ארכיטיפים</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>מנהל הזדמנויות:</strong> מתמחה בזיהוי והטמעת הזדמנויות חדשות</div>
                      <div><strong>מנהל מעצים:</strong> מתמקד בהעצמת הצוות והפיתוח האישי</div>
                      <div><strong>מנהל סקרן:</strong> מנהיג המחפש ללמוד ולחקור תמיד</div>
                    </div>
                  </div>
                </div>

                {/* WOCA Section */}
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold text-foreground border-b pb-2">ניתוח WOCA</h2>
                  
                  {/* Analyzed Zone */}
                  <div data-section="woca-zone" className="bg-card p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold text-foreground mb-4">אזור דומיננטי</h3>
                    <div className="text-center">
                      {wocaAnalysis?.groupIsTieByCount ? (
                        <div className="inline-block px-6 py-3 rounded-full bg-gray-200">
                          <span className="text-lg font-semibold text-black">
                            תיקו בין אזורים
                          </span>
                        </div>
                      ) : wocaAnalysis?.groupDominantZoneByCount ? (
                        <div 
                          className="inline-block px-6 py-3 rounded-full" 
                          style={{ backgroundColor: getZoneColor(wocaAnalysis.groupDominantZoneByCount) }}
                        >
                          <span className="font-semibold text-black text-3xl">
                            {getZoneName(wocaAnalysis.groupDominantZoneByCount)}
                          </span>
                        </div>
                      ) : (
                        <div className="inline-block px-6 py-3 rounded-full bg-gray-200">
                          <span className="text-lg font-semibold text-black">
                            לא זוהה אזור דומיננטי
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Zone Distribution Pie Chart */}
                  {zoneDistribution && (
                    <div data-section="woca-distribution" className="bg-card p-6 rounded-lg border">
                      <h3 className="text-lg font-semibold text-foreground mb-4">התפלגות אזורי WOCA</h3>
                      <div className="w-full h-[400px]">
                        <ZoneDistributionChart zoneDistribution={zoneDistribution} />
                      </div>
                    </div>
                  )}

                  {/* Zone Strength Bar Chart */}
                  <div data-section="woca-strength" className="bg-card p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold text-foreground mb-4">עוצמת אזורי WOCA</h3>
                    <div className="w-full h-[500px]">
                      <WocaGroupBarChart groupCategoryScores={wocaAnalysis?.groupCategoryScores || { war: 0, opportunity: 0, comfort: 0, apathy: 0 }} />
                    </div>
                  </div>

                  {/* WOCA Legend */}
                  <div className="bg-card p-4 rounded-lg border">
                    <h3 className="text-lg font-semibold text-foreground mb-4">מקרא אזורי WOCA</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div><strong>הזדמנות:</strong> אזור של צמיחה, חדשנות ופיתוח</div>
                      <div><strong>נוחות:</strong> אזור של יציבות ושמירה על הקיים</div>
                      <div><strong>אדישות:</strong> אזור של חוסר מעורבות ואנרגיה נמוכה</div>
                      <div><strong>מלחמה:</strong> אזור של קונפליקט ומתח גבוה</div>
                    </div>
                  </div>

                  {/* WOCA Zone Matrix */}
                  <div data-section="woca-matrix" className="bg-card p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold text-foreground mb-4">מטריצת אזורי WOCA</h3>
                    <div className="w-full">
                      <WocaZonesTable 
                        dominantZone={wocaAnalysis?.groupDominantZoneByCount}
                        isPresenterMode={true}
                        isTie={wocaAnalysis?.groupIsTieByCount}
                        tiedCategories={wocaAnalysis?.groupTiedCategoriesByCount}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground text-center py-8">
                לא נמצאו נתונים לקבוצה זו
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {selectedGroupId && hasData && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-foreground">הפקת דוח</h2>
            <p className="text-muted-foreground">הדוח יכלול את כל הניתוחים והתרשימים המוצגים למעלה</p>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleDownloadPDF} 
              disabled={isGenerating || loading} 
              className="w-full h-12 text-lg" 
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  מפיק דוח PDF...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  הורד דוח PDF מקצועי
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};