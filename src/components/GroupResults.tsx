import React, { useState } from 'react';
import { SalimaGroupRadarChart } from '@/components/SalimaGroupRadarChart';
import { ArchetypeDistributionChart } from '@/components/ArchetypeDistributionChart';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface GroupData {
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

interface GroupResultsProps {
  groupData: GroupData;
  isPresenterMode: boolean;
}

const getDimensionInsights = (averages: GroupData['averages']) => {
  const dimensions = [{
    key: 'strategy',
    name: 'אסטרטגיה (S)',
    score: averages.strategy
  }, {
    key: 'authenticity',
    name: 'אותנטיות (A2)',
    score: averages.authenticity
  }, {
    key: 'learning',
    name: 'למידה (L)',
    score: averages.learning
  }, {
    key: 'inspiration',
    name: 'השראה (I)',
    score: averages.inspiration
  }, {
    key: 'meaning',
    name: 'משמעות (M)',
    score: averages.meaning
  }, {
    key: 'adaptability',
    name: 'אדפטיביות (A)',
    score: averages.adaptability
  }];
  const strongest = dimensions.reduce((max, dim) => dim.score > max.score ? dim : max);
  const weakest = dimensions.reduce((min, dim) => dim.score < min.score ? dim : min);
  return {
    strongest,
    weakest,
    isSameDimension: strongest.key === weakest.key
  };
};

const getDimensionExplanation = (dimensionKey: string) => {
  const explanations = {
    strategy: "היכולת לראות את התמונה הגדולה, לזהות הזדמנויות במצבים משתנים, ולפעול מתוך חזון ברור ולא רק מתוך תגובה למציאות הנוכחית. מנהלים עם ממד אסטרטגי גבוה מתמקדים באפקטיביות לטווח ארוך.",
    adaptability: "גמישות מחשבתית והתנהגותית, היכולת להסתגל במהירות לשינויים, להתמודד עם אי-ודאות ולפעול ביצירתיות גם במצבי קצה. ממד זה קשור לחוסן ולקבלת שינוי כהזדמנות.",
    learning: "גישה של צמיחה מתמשכת, פתיחות למשוב וללמידה מהצלחות וכישלונות. ממד הלמידה מצביע על סקרנות, עומק מקצועי ורצון להתפתח ולהשתפר כל הזמן.",
    inspiration: "היכולת להניע אחרים באמצעות נרטיב, ערכים ודוגמה אישית. מנהלים עם השראה גבוהה יוצרים אמון, מעוררים מוטיבציה ומקרינים נוכחות מנהיגותית.",
    meaning: "קשר עמוק לערכים פנימיים, מחויבות לתרומה שמעבר לעצמי ולתחושת שליחות. ממד המשמעות מייצג מנהיגות קשובה שפועלת בהלימה למטרות ערכיות.",
    authenticity: "שקיפות, יושרה ויכולת להביא את עצמך באופן כן ומדויק גם במצבי לחץ. ממד זה עוסק בכנות, אמפתיה, ובחיבור בין העולם הפנימי שלך להתנהלותך המקצועית."
  };
  return explanations[dimensionKey as keyof typeof explanations] || "";
};

const captureAllVisualizations = async () => {
  const elements = document.querySelectorAll('.pdf-capture');
  const capturedImages: Record<string, string> = {};

  for (const el of elements) {
    const id = el.id;
    if (!id) continue;

    // Wait a bit for charts to fully render
    await new Promise(resolve => setTimeout(resolve, 500));

    const canvas = await html2canvas(el as HTMLElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      scrollY: -window.scrollY,
      logging: false
    });

    capturedImages[id] = canvas.toDataURL('image/png');
  }

  return capturedImages;
};

export const GroupResults: React.FC<GroupResultsProps> = ({
  groupData,
  isPresenterMode
}) => {
  const { toast } = useToast();
  const [pdfImages, setPdfImages] = useState<Record<string, string>>({});

  const preparePDF = async () => {
    const images = await captureAllVisualizations();
    setPdfImages(images);
    return images;
  };

  const exportGroupSalimaPDF = async () => {
    try {
      toast({
        title: "מייצר דוח PDF...",
        description: "אנא המתן בזמן שהדוח נוצר",
      });

      // Capture all visualizations
      const images = await preparePDF();
      
      // Wait for state to update
      await new Promise(resolve => setTimeout(resolve, 1000));

      const input = document.getElementById('pdf-export-root');
      if (!input) {
        throw new Error('PDF export container not found');
      }

      // Make the container visible temporarily for capture
      input.style.display = 'block';
      input.style.visibility = 'visible';

      const canvas = await html2canvas(input, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        scrollY: -window.scrollY,
        logging: false,
        width: 794,
        height: input.scrollHeight
      });

      // Hide the container again
      input.style.display = 'none';
      input.style.visibility = 'hidden';

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

      const fileName = `salima-group-${groupData.group_number}-report-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      toast({
        title: "הדוח יוצא בהצלחה!",
        description: "הדוח הועבר להורדה",
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: "שגיאה בייצוא הדוח",
        description: "נסה שוב מאוחר יותר",
        variant: "destructive",
      });
    }
  };

  if (!groupData || !groupData.participants || groupData.participants.length === 0) {
    return <div className="card">
        <div className="card-content p-8 text-center">
          <p className="text-gray-600">אין נתונים להצגה עבור קבוצה זו</p>
        </div>
      </div>;
  }

  let dimensionInsights;
  try {
    dimensionInsights = getDimensionInsights(groupData.averages);
  } catch (error) {
    console.error('Error calculating dimension insights:', error);
    dimensionInsights = {
      strongest: {
        key: 'strategy',
        name: 'אסטרטגיה',
        score: 0
      },
      weakest: {
        key: 'strategy',
        name: 'אסטרטגיה',
        score: 0
      },
      isSameDimension: false
    };
  }

  const {
    strongest,
    weakest,
    isSameDimension
  } = dimensionInsights;

  return (
    <>
      <div className="space-y-8">
        {/* Group Mean SLQ Score at the top */}
        <div className="card">
          <div className="card-content p-6 text-center">
            <div className="flex justify-between items-center mb-4">
              <h2 className={`font-bold text-blue-800 ${isPresenterMode ? 'text-3xl' : 'text-xl'}`}>
                ציון מנהיגות קבוצתי
              </h2>
              {!isPresenterMode && (
                <Button 
                  onClick={exportGroupSalimaPDF}
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  הורד דוח PDF
                </Button>
              )}
            </div>
            <div className="pdf-capture" id="overall-score">
              <div className={`font-bold text-blue-600 ${isPresenterMode ? 'text-6xl' : 'text-4xl'}`}>
                {groupData.averages.overall.toFixed(2)}
              </div>
              <p className={`text-blue-500 mt-2 ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                ממוצע ציוני SLQ של {groupData.participant_count} משתתפים
              </p>
            </div>
          </div>
        </div>

        <div className={isPresenterMode ? "presenter-grid" : "grid grid-cols-1 lg:grid-cols-2 gap-8"}>
          {/* Dimension Insights Section */}
          <div className="card" style={{ gridColumn: isPresenterMode ? "span 2" : undefined }}>
            <div className="card-header text-center"></div>
            <div className="card-content">
              <div className="pdf-capture" id="dimension-insights">
                {!isSameDimension ? <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {/* Strongest Dimension */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <h3 className={`font-bold text-green-800 mb-3 ${isPresenterMode ? 'text-2xl' : 'text-xl'}`}>
                    הממד החזק ביותר
                  </h3>
                  <div className={`font-bold text-green-600 mb-2 ${isPresenterMode ? 'text-4xl' : 'text-3xl'}`}>
                    {strongest.score.toFixed(1)}
                  </div>
                  <div className={`text-green-700 font-semibold ${isPresenterMode ? 'text-xl' : 'text-lg'}`}>
                    {strongest.name}
                  </div>
                  <p className={`text-green-600 mt-2 ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                    הממד עם הציון הממוצע הגבוה ביותר בקבוצה
                  </p>
                  
                  <div className={`mt-4 p-4 bg-white border border-green-300 rounded-lg text-right ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                    <p className="text-gray-700 leading-relaxed">
                      {getDimensionExplanation(strongest.key)}
                    </p>
                  </div>
                </div>

                {/* Weakest Dimension */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
                  <h3 className={`font-bold text-orange-800 mb-3 ${isPresenterMode ? 'text-2xl' : 'text-xl'}`}>
                    ממד לפיתוח
                  </h3>
                  <div className={`font-bold text-orange-600 mb-2 ${isPresenterMode ? 'text-4xl' : 'text-3xl'}`}>
                    {weakest.score.toFixed(1)}
                  </div>
                  <div className={`text-orange-700 font-semibold ${isPresenterMode ? 'text-xl' : 'text-lg'}`}>
                    {weakest.name}
                  </div>
                  <p className={`text-orange-600 mt-2 ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                    הממד הדורש הכי הרבה פיתוח בקבוצה
                  </p>
                  
                  <div className={`mt-4 p-4 bg-white border border-orange-300 rounded-lg text-right ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                    <p className="text-gray-700 leading-relaxed">
                      {getDimensionExplanation(weakest.key)}
                    </p>
                  </div>
                </div>
              </div> : <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <h3 className={`font-bold text-yellow-800 mb-3 ${isPresenterMode ? 'text-2xl' : 'text-xl'}`}>
                  ממד דומיננטי
                </h3>
                <div className={`font-bold text-yellow-600 mb-2 ${isPresenterMode ? 'text-4xl' : 'text-3xl'}`}>
                  {strongest.score.toFixed(1)}
                </div>
                <div className={`text-yellow-700 font-semibold ${isPresenterMode ? 'text-xl' : 'text-lg'}`}>
                  {strongest.name}
                </div>
                <p className={`text-yellow-600 mt-2 ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                  אותו ממד זוהה כחזק ביותר וכדורש פיתוח—כדאי לבחון את התפלגות הציונים
                </p>
                
                <div className={`mt-4 p-4 bg-white border border-yellow-300 rounded-lg text-right ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                  <p className="text-gray-700 leading-relaxed">
                    {getDimensionExplanation(strongest.key)}
                  </p>
                </div>
              </div>}
              </div>
            </div>
          </div>

          {/* Radar Chart – Group Averages per SALIMA Dimension */}
          <div className="card">
            <div className="card-header text-center pb-2">
              <div className={`flex items-center justify-center text-right card-title${isPresenterMode ? " text-3xl" : ""}`}>פרופיל קבוצתי ייחודי</div>
            </div>
            <div className="card-content">
              <div className="h-[520px] w-full flex items-center justify-center">
                <div className="pdf-capture" id="radar-chart">
                  <SalimaGroupRadarChart averages={groupData.averages} />
                </div>
              </div>
            </div>
          </div>

          {/* Archetype Distribution Chart */}
          <div className="card">
            <div className="card-header text-center">
              {/* Title removed as requested */}
            </div>
            <div className="card-content">
              <div className="pdf-capture" id="archetype-chart">
                <ArchetypeDistributionChart groupNumber={groupData.group_number} isPresenterMode={isPresenterMode} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden PDF Layout Container */}
      <div 
        id="pdf-export-root" 
        style={{ 
          display: 'none', 
          visibility: 'hidden',
          direction: 'rtl', 
          fontFamily: 'Arial, sans-serif',
          backgroundColor: 'white',
          width: '794px',
          minHeight: '1123px'
        }}
      >
        <PDFLayout 
          groupData={groupData} 
          pdfImages={pdfImages} 
        />
      </div>
    </>
  );
};

// PDF Layout Component
const PDFLayout: React.FC<{ groupData: GroupData; pdfImages: Record<string, string> }> = ({ groupData, pdfImages }) => {
  const dimensionInsights = getDimensionInsights(groupData.averages);
  const { strongest, weakest } = dimensionInsights;

  return (
    <div style={{ padding: '48px', lineHeight: '1.6' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1e40af', marginBottom: '16px' }}>
          דוח תובנות קבוצתי SALIMA
        </h1>
        <div style={{ fontSize: '24px', color: '#374151', marginBottom: '12px' }}>
          קבוצה מספר: {groupData.group_number}
        </div>
        <div style={{ fontSize: '18px', color: '#6b7280', marginBottom: '12px' }}>
          {groupData.participant_count} משתתפים
        </div>
        <div style={{ fontSize: '16px', color: '#9ca3af' }}>
          {new Date().toLocaleDateString('he-IL')}
        </div>
      </div>

      {/* Overall Score */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ 
          backgroundColor: '#dbeafe', 
          border: '2px solid #93c5fd',
          borderRadius: '12px',
          padding: '32px',
          display: 'inline-block'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e40af', marginBottom: '16px' }}>
            ציון מנהיגות קבוצתי
          </h2>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#2563eb', marginBottom: '8px' }}>
            {groupData.averages.overall.toFixed(2)}
          </div>
          <div style={{ fontSize: '16px', color: '#3b82f6' }}>
            ממוצע ציוני SLQ
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '48px' }}>
        <div style={{ 
          backgroundColor: '#f0fdf4', 
          border: '2px solid #bbf7d0',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#166534', marginBottom: '16px' }}>
            הממד החזק ביותר
          </h3>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#16a34a', marginBottom: '8px' }}>
            {strongest.score.toFixed(1)}
          </div>
          <div style={{ fontSize: '16px', color: '#15803d', fontWeight: '600' }}>
            {strongest.name}
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#fff7ed', 
          border: '2px solid #fed7aa',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#9a3412', marginBottom: '16px' }}>
            ממד לפיתוח
          </h3>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#ea580c', marginBottom: '8px' }}>
            {weakest.score.toFixed(1)}
          </div>
          <div style={{ fontSize: '16px', color: '#c2410c', fontWeight: '600' }}>
            {weakest.name}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', textAlign: 'center', color: '#1e40af', marginBottom: '24px' }}>
          פרופיל קבוצתי ייחודי - שישה ממדים
        </h2>
        {pdfImages['radar-chart'] && (
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <img 
              src={pdfImages['radar-chart']} 
              style={{ maxWidth: '100%', height: 'auto' }}
              alt="Radar Chart"
            />
          </div>
        )}
      </div>

      <div style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', textAlign: 'center', color: '#1e40af', marginBottom: '24px' }}>
          התפלגות סגנון מנהיגות
        </h2>
        {pdfImages['archetype-chart'] && (
          <div style={{ textAlign: 'center' }}>
            <img 
              src={pdfImages['archetype-chart']} 
              style={{ maxWidth: '100%', height: 'auto' }}
              alt="Archetype Distribution Chart"
            />
          </div>
        )}
      </div>
    </div>
  );
};
