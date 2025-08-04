
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { EnhancedSalimaRadarChart } from '@/components/EnhancedSalimaRadarChart';
import { DataSourceToggle, DataSourceType } from '@/components/DataSourceToggle';
import { exportSalimaReport, exportSalimaReportCSV } from '@/utils/exportUtils';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EnhancedRespondentData } from '@/hooks/useEnhancedRespondentData';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

interface IndividualResultsProps {
  respondentData: EnhancedRespondentData;
  isPresenterMode: boolean;
  activeDataSource: DataSourceType;
  onDataSourceChange: (source: DataSourceType) => void;
}

export const IndividualResults: React.FC<IndividualResultsProps> = ({ 
  respondentData, 
  isPresenterMode,
  activeDataSource,
  onDataSourceChange
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

    // Convert to legacy format for export
    const legacyData = {
      id: respondentData.id,
      name: respondentData.name,
      email: respondentData.email,
      source: 'survey' as const,
      dimensions: getCurrentDimensions(),
      overallScore: getCurrentOverallScore(),
      rawData: respondentData.rawData
    };

    if (format === 'json') {
      exportSalimaReport(legacyData);
    } else {
      exportSalimaReportCSV(legacyData);
    }

    toast({
      title: "ייצוא הושלם בהצלחה",
      description: `הדוח יוצא כקובץ ${format.toUpperCase()}`,
    });
  };

  const getCurrentDimensions = () => {
    switch (activeDataSource) {
      case 'colleague':
        return respondentData.colleagueReport || respondentData.selfReport;
      case 'combined':
        return respondentData.combinedReport || respondentData.selfReport;
      default:
        return respondentData.selfReport;
    }
  };

  const getCurrentOverallScore = () => {
    const dimensions = getCurrentDimensions();
    return dimensions.overall;
  };

  const getDataSourceLabel = () => {
    switch (activeDataSource) {
      case 'colleague':
        return 'דוח קולגות';
      case 'combined':
        return 'דוח משולב';
      default:
        return 'דוח עצמי';
    }
  };

  const currentDimensions = getCurrentDimensions();
  const radarChartData = [
    { dimension: 'אסטרטגיה', score: currentDimensions.strategy, color: '#3B82F6' },
    { dimension: 'אדפטיביות', score: currentDimensions.adaptability, color: '#F59E0B' },
    { dimension: 'למידה', score: currentDimensions.learning, color: '#10B981' },
    { dimension: 'השראה', score: currentDimensions.inspiration, color: '#EF4444' },
    { dimension: 'משמעות', score: currentDimensions.meaning, color: '#8B5CF6' },
    { dimension: 'אותנטיות', score: currentDimensions.authenticity, color: '#EC4899' }
  ];

  // Find strongest and weakest dimensions
  const strongestDimension = radarChartData.reduce((max, dim) => 
    dim.score > max.score ? dim : max
  );
  const weakestDimension = radarChartData.reduce((min, dim) => 
    dim.score < min.score ? dim : min
  );

  // Helper function to parse insights and return both paragraphs
  const parseInsights = (insightText: string | undefined) => {
    if (!insightText) return { preserve: '', improve: '' };
    
    const lines = insightText.split('\n').filter(line => line.trim());
    
    // Try to find lines that start with common Hebrew patterns
    let preserve = '';
    let improve = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // If it's the first substantial line and we don't have preserve yet, it's likely preserve
      if (!preserve && line.length > 10) {
        preserve = line;
      } 
      // If we have preserve and this is another substantial line, it's likely improve
      else if (preserve && !improve && line.length > 10) {
        improve = line;
      }
      // If we already have both, we can break
      else if (preserve && improve) {
        break;
      }
    }
    
    // Fallback: if we only got one line, split it or use it as preserve
    if (!improve && preserve) {
      const sentences = preserve.split('.');
      if (sentences.length >= 2) {
        preserve = sentences.slice(0, Math.ceil(sentences.length / 2)).join('.').trim() + '.';
        improve = sentences.slice(Math.ceil(sentences.length / 2)).join('.').trim();
        if (improve && !improve.endsWith('.')) improve += '.';
      }
    }
    
    return { 
      preserve: preserve || 'לא זמין', 
      improve: improve || 'לא זמין' 
    };
  };

  return (
    <div className="space-y-8">
      {/* Data Source Toggle - Hidden in presenter mode */}
      {!isPresenterMode && (
        <div className="card">
          <div className="card-content">
            <DataSourceToggle
              value={activeDataSource}
              onValueChange={onDataSourceChange}
              hasColleagueData={!!respondentData.colleagueReport}
            />
          </div>
        </div>
      )}

      <div className={isPresenterMode ? "presenter-grid" : "grid grid-cols-1 lg:grid-cols-2 gap-8"}>
        {/* Individual Overall Score Summary */}
        <div className="card">
          <div className="card-header text-center">
            <div className={`flex items-center justify-between text-right card-title${isPresenterMode ? ' flex-col gap-4' : ''}`}>
              <span className={`font-bold${isPresenterMode ? ' text-4xl' : ' text-2xl'}`}>
                ציון SALIMA כללי (SLQ) - {getDataSourceLabel()}
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
                {getCurrentOverallScore().toFixed(1)}
              </div>
              <div className={`text-gray-600 font-semibold score-label`}>
                מתוך 5.0
              </div>
              <div className={`mt-6 text-gray-500 score-description`}>
                {respondentData.colleagueReport && activeDataSource === 'colleague' && (
                  <div className="text-sm">
                    מבוסס על {respondentData.colleagueReport.responseCount} תגובות קולגות
                  </div>
                )}
                ממוצע בכל שישת ממדי SALIMA
              </div>
            </div>
          </div>
        </div>

        {/* Vertical Bar Chart */}
        <div className="card">
          <div className="card-header text-center">
            <div className={`flex items-center justify-center text-right card-title${isPresenterMode ? " text-3xl" : ""}`}>
              <span className="ml-2"><svg className={isPresenterMode ? "h-10 w-10" : "h-6 w-6"} style={{display: "inline-block"}} viewBox="0 0 24 24"><path fill="currentColor" d="M5 10c-1.656 0-3 1.343-3 3 0 1.656 1.344 3 3 3h2v-6H5zm2 9V8c0-1.104.896-2 2-2h6v2H9v11H7zm8-2h2c1.657 0 3-1.344 3-3 0-1.657-1.343-3-3-3v6z"/></svg></span>
              ציוני הממדים - {getDataSourceLabel()}
            </div>
          </div>
          <div className="card-content">
            <div className="h-[500px] w-full" dir="rtl">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={radarChartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <XAxis 
                    dataKey="dimension" 
                    tick={{ fontSize: 14, fontWeight: 'bold' }}
                    textAnchor="middle"
                    angle={0}
                    height={40}
                  />
                  <YAxis 
                    domain={[0, 5]}
                    tick={{ fontSize: 12 }}
                  />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                    {radarChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Strongest Dimension */}
        <div className="card">
          <div className="card-header text-center">
            <div className={`card-title text-green-600${isPresenterMode ? " text-3xl" : ""}`}>
              הממד החזק ביותר
            </div>
          </div>
          <div className="card-content">
            <div className="text-center space-y-4">
              <div className={`text-6xl font-bold${isPresenterMode ? ' text-8xl' : ''}`} style={{ color: strongestDimension.color }}>
                {strongestDimension.score.toFixed(1)}
              </div>
              <div className={`text-2xl font-semibold${isPresenterMode ? ' text-4xl' : ''}`} style={{ color: strongestDimension.color }}>
                {strongestDimension.dimension}
              </div>
              <div className={`text-gray-600${isPresenterMode ? ' text-xl' : ''}`}>
                נקודת החוזק הבולטת שלך
              </div>
            </div>
          </div>
        </div>

        {/* Weakest Dimension */}
        <div className="card">
          <div className="card-header text-center">
            <div className={`card-title text-orange-600${isPresenterMode ? " text-3xl" : ""}`}>
              הממד החלש ביותר
            </div>
          </div>
          <div className="card-content">
            <div className="text-center space-y-4">
              <div className={`text-6xl font-bold${isPresenterMode ? ' text-8xl' : ''}`} style={{ color: weakestDimension.color }}>
                {weakestDimension.score.toFixed(1)}
              </div>
              <div className={`text-2xl font-semibold${isPresenterMode ? ' text-4xl' : ''}`} style={{ color: weakestDimension.color }}>
                {weakestDimension.dimension}
              </div>
              <div className={`text-gray-600${isPresenterMode ? ' text-xl' : ''}`}>
                תחום עיקרי לפיתוח
              </div>
            </div>
          </div>
        </div>

        {/* Individual AI-Generated Insights */}
        <div className="card" style={{gridColumn: isPresenterMode ? "span 2" : undefined}}>
          <div className="card-header text-center">
            <div className={`card-title${isPresenterMode ? " text-3xl" : ""}`}>סיכום הניתוח</div>
            <div className={`text-right${isPresenterMode ? " text-xl" : ""}`}>
              בהתבסס על {getDataSourceLabel()} מנתוני הסקר
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

            {/* Individual Insights Section with Both Paragraphs */}
            {respondentData.rawData && (
              <div className="mt-8 space-y-6">
                {/* Strategy Insights */}
                {respondentData.rawData.insight_strategy && (
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h4 className={`font-semibold text-blue-800 mb-4 text-right ${isPresenterMode ? 'text-2xl' : 'text-lg'}`}>
                      תובנות אסטרטגיה
                    </h4>
                    {(() => {
                      const insights = parseInsights(respondentData.rawData.insight_strategy);
                      return (
                        <div className="space-y-4 text-right">
                          <div>
                            <h5 className="font-medium text-green-700 mb-2">שימור</h5>
                            <p className={`text-gray-700 leading-relaxed ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                              {insights.preserve}
                            </p>
                          </div>
                          <div>
                            <h5 className="font-medium text-orange-700 mb-2">שיפור</h5>
                            <p className={`text-gray-700 leading-relaxed ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                              {insights.improve}
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Adaptability Insights */}
                {respondentData.rawData.insight_adaptive && (
                  <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                    <h4 className={`font-semibold text-orange-800 mb-4 text-right ${isPresenterMode ? 'text-2xl' : 'text-lg'}`}>
                      תובנות אדפטיביות
                    </h4>
                    {(() => {
                      const insights = parseInsights(respondentData.rawData.insight_adaptive);
                      return (
                        <div className="space-y-4 text-right">
                          <div>
                            <h5 className="font-medium text-green-700 mb-2">שימור</h5>
                            <p className={`text-gray-700 leading-relaxed ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                              {insights.preserve}
                            </p>
                          </div>
                          <div>
                            <h5 className="font-medium text-orange-700 mb-2">שיפור</h5>
                            <p className={`text-gray-700 leading-relaxed ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                              {insights.improve}
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Learning Insights */}
                {respondentData.rawData.insight_learning && (
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h4 className={`font-semibold text-green-800 mb-4 text-right ${isPresenterMode ? 'text-2xl' : 'text-lg'}`}>
                      תובנות למידה
                    </h4>
                    {(() => {
                      const insights = parseInsights(respondentData.rawData.insight_learning);
                      return (
                        <div className="space-y-4 text-right">
                          <div>
                            <h5 className="font-medium text-green-700 mb-2">שימור</h5>
                            <p className={`text-gray-700 leading-relaxed ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                              {insights.preserve}
                            </p>
                          </div>
                          <div>
                            <h5 className="font-medium text-orange-700 mb-2">שיפור</h5>
                            <p className={`text-gray-700 leading-relaxed ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                              {insights.improve}
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Inspiration Insights */}
                {respondentData.rawData.insight_inspiration && (
                  <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                    <h4 className={`font-semibold text-red-800 mb-4 text-right ${isPresenterMode ? 'text-2xl' : 'text-lg'}`}>
                      תובנות השראה
                    </h4>
                    {(() => {
                      const insights = parseInsights(respondentData.rawData.insight_inspiration);
                      return (
                        <div className="space-y-4 text-right">
                          <div>
                            <h5 className="font-medium text-green-700 mb-2">שימור</h5>
                            <p className={`text-gray-700 leading-relaxed ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                              {insights.preserve}
                            </p>
                          </div>
                          <div>
                            <h5 className="font-medium text-orange-700 mb-2">שיפור</h5>
                            <p className={`text-gray-700 leading-relaxed ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                              {insights.improve}
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Meaning Insights */}
                {respondentData.rawData.insight_meaning && (
                  <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                    <h4 className={`font-semibold text-purple-800 mb-4 text-right ${isPresenterMode ? 'text-2xl' : 'text-lg'}`}>
                      תובנות משמעות
                    </h4>
                    {(() => {
                      const insights = parseInsights(respondentData.rawData.insight_meaning);
                      return (
                        <div className="space-y-4 text-right">
                          <div>
                            <h5 className="font-medium text-green-700 mb-2">שימור</h5>
                            <p className={`text-gray-700 leading-relaxed ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                              {insights.preserve}
                            </p>
                          </div>
                          <div>
                            <h5 className="font-medium text-orange-700 mb-2">שיפור</h5>
                            <p className={`text-gray-700 leading-relaxed ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                              {insights.improve}
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Authenticity Insights */}
                {respondentData.rawData.insight_authentic && (
                  <div className="bg-pink-50 p-6 rounded-lg border border-pink-200">
                    <h4 className={`font-semibold text-pink-800 mb-4 text-right ${isPresenterMode ? 'text-2xl' : 'text-lg'}`}>
                      תובנות אותנטיות
                    </h4>
                    {(() => {
                      const insights = parseInsights(respondentData.rawData.insight_authentic);
                      return (
                        <div className="space-y-4 text-right">
                          <div>
                            <h5 className="font-medium text-green-700 mb-2">שימור</h5>
                            <p className={`text-gray-700 leading-relaxed ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                              {insights.preserve}
                            </p>
                          </div>
                          <div>
                            <h5 className="font-medium text-orange-700 mb-2">שיפור</h5>
                            <p className={`text-gray-700 leading-relaxed ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                              {insights.improve}
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
