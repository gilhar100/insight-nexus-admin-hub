
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { SalimaRadarChart } from '@/components/SalimaRadarChart';
import { SalimaIntensityBar } from '@/components/SalimaIntensityBar';
import { exportSalimaReport, exportSalimaReportCSV } from '@/utils/exportUtils';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { RespondentData } from '@/hooks/useRespondentData';

interface IndividualResultsProps {
  respondentData: RespondentData;
  isPresenterMode: boolean;
}

export const IndividualResults: React.FC<IndividualResultsProps> = ({ 
  respondentData, 
  isPresenterMode 
}) => {
  const { toast } = useToast();

  const handleExport = (format: 'json' | 'csv') => {
    if (!respondentData) {
      toast({
        title: "אין נתונים לייצוא",
        description: "אנא נתח נבדק קודם",
        variant: "destructive"
      });
      return;
    }

    if (format === 'json') {
      exportSalimaReport(respondentData);
    } else {
      exportSalimaReportCSV(respondentData);
    }

    toast({
      title: "ייצוא הושלם בהצלחה",
      description: `הדוח יוצא כקובץ ${format.toUpperCase()}`,
    });
  };

  // Prepare radar chart data for individual
  const radarChartData = [
    { dimension: 'אסטרטגיה', score: respondentData.dimensions.strategy, color: '#3B82F6' },
    { dimension: 'הסתגלות', score: respondentData.dimensions.adaptability, color: '#F59E0B' },
    { dimension: 'למידה', score: respondentData.dimensions.learning, color: '#10B981' },
    { dimension: 'השראה', score: respondentData.dimensions.inspiration, color: '#EF4444' },
    { dimension: 'משמעות', score: respondentData.dimensions.meaning, color: '#8B5CF6' },
    { dimension: 'אותנטיות', score: respondentData.dimensions.authenticity, color: '#EC4899' }
  ];

  return (
    <div className={isPresenterMode ? "presenter-grid" : "grid grid-cols-1 lg:grid-cols-2 gap-8"}>
      {/* Individual Overall Score Summary */}
      <div className="card">
        <div className="card-header text-center">
          <div className={`flex items-center justify-between text-right card-title${isPresenterMode ? ' flex-col gap-4' : ''}`}>
            <span className={`font-bold${isPresenterMode ? ' text-4xl' : ' text-2xl'}`}>
              ציון SALIMA כללי (SLQ)
            </span>
            {!isPresenterMode && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 ml-2" />
                    ייצא דוח
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleExport('json')}>
                    ייצא כ-JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('csv')}>
                    ייצא כ-CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        <div className="card-content">
          <div className={`score-display`}>
            <div className={`font-bold text-blue-600 mb-4 score-number`}>
              {respondentData.overallScore.toFixed(1)}
            </div>
            <div className={`text-gray-600 font-semibold score-label`}>
              מתוך 5.0
            </div>
            <div className={`mt-6 text-gray-500 score-description`}>
              ממוצע בכל שישת ממדי SALIMA
            </div>
          </div>
        </div>
      </div>

      {/* Individual Radar Chart */}
      <div className="card">
        <div className="card-header text-center">
          <div className={`flex items-center justify-center text-right card-title${isPresenterMode ? " text-3xl" : ""}`}>
            <span className="ml-2"><svg className={isPresenterMode ? "h-10 w-10" : "h-6 w-6"} style={{display: "inline-block"}} viewBox="0 0 24 24"><path fill="currentColor" d="M5 10c-1.656 0-3 1.343-3 3 0 1.656 1.344 3 3 3h2v-6H5zm2 9V8c0-1.104.896-2 2-2h6v2H9v11H7zm8-2h2c1.657 0 3-1.344 3-3 0-1.657-1.343-3-3-3v6z"/></svg></span>
            גרף רדאר - שישה ממדים
          </div>
        </div>
        <div className="card-content">
          <div className="h-[520px] w-full flex items-center justify-center">
            <SalimaRadarChart data={radarChartData} />
          </div>
        </div>
      </div>

      {/* Individual Intensity Bars */}
      <div className="card">
        <div className="card-header text-center">
          <div className={`flex items-center justify-center text-right card-title${isPresenterMode ? " text-3xl" : ""}`}>
            <span className="ml-2"><svg className={isPresenterMode ? "h-10 w-10" : "h-6 w-6"} style={{display: "inline-block"}} viewBox="0 0 24 24"><path fill="currentColor" d="M5 10c-1.656 0-3 1.343-3 3 0 1.656 1.344 3 3 3h2v-6H5zm2 9V8c0-1.104.896-2 2-2h6v2H9v11H7zm8-2h2c1.657 0 3-1.344 3-3 0-1.657-1.343-3-3-3v6z"/></svg></span>
            עוצמת הממדים
          </div>
        </div>
        <div className="card-content">
          <div className="w-full">
            {radarChartData.map((dimension, index) => (
              <SalimaIntensityBar
                key={index}
                dimension={dimension.dimension}
                score={dimension.score}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Individual AI-Generated Insights */}
      <div className="card" style={{gridColumn: isPresenterMode ? "span 2" : undefined}}>
        <div className="card-header text-center">
          <div className={`card-title${isPresenterMode ? " text-3xl" : ""}`}>סיכום הניתוח</div>
          <div className={`text-right${isPresenterMode ? " text-xl" : ""}`}>
            בהתבסס על תגובות הסקר בפועל מנתוני {respondentData.source}
          </div>
        </div>
        <div className="card-content">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-8${isPresenterMode ? ' gap-12' : ''}`}>
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h4 className={`font-semibold text-green-800 mb-4 text-right ${isPresenterMode ? 'text-2xl' : ''}`}>
                ממדים בעלי הציון הגבוה ביותר
              </h4>
              <ul className={`text-sm text-green-700 space-y-2 ${isPresenterMode ? 'text-lg space-y-3' : ''}`}>
                {radarChartData
                  .sort((a, b) => b.score - a.score)
                  .slice(0, 3)
                  .map((dim, idx) => (
                    <li key={idx} className="text-right font-medium">• {dim.dimension}: {dim.score.toFixed(1)}/5.0</li>
                  ))}
              </ul>
            </div>
            <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
              <h4 className={`font-semibold text-amber-800 mb-4 text-right ${isPresenterMode ? 'text-2xl' : ''}`}>
                תחומים לפיתוח
              </h4>
              <ul className={`text-sm text-amber-700 space-y-2 ${isPresenterMode ? 'text-lg space-y-3' : ''}`}>
                {radarChartData
                  .sort((a, b) => a.score - b.score)
                  .slice(0, 3)
                  .map((dim, idx) => (
                    <li key={idx} className="text-right font-medium">• {dim.dimension}: {dim.score.toFixed(1)}/5.0</li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
