import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { EnhancedSalimaRadarChart } from '@/components/EnhancedSalimaRadarChart';
import { SalimaIntensityBar } from '@/components/SalimaIntensityBar';
import { DataSourceToggle, DataSourceType } from '@/components/DataSourceToggle';
import { exportSalimaReport, exportSalimaReportCSV, exportIndividualSalimaPDFReport } from '@/utils/exportUtils';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EnhancedRespondentData } from '@/hooks/useEnhancedRespondentData';

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

  const handleDownloadPDF = async () => {
    if (!respondentData) {
      toast({
        title: "אין נתונים לייצוא",
        description: "אנא נתח נבדק קודם",
        variant: "destructive"
      });
      return;
    }

    try {
      await exportIndividualSalimaPDFReport(respondentData, activeDataSource);
      toast({
        title: "הדוח הופק בהצלחה",
        description: "קובץ ה-PDF נשמר במחשב שלך",
        variant: "default"
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "שגיאה ביצירת הדוח",
        description: "נכשל ביצירת קובץ ה-PDF",
        variant: "destructive"
      });
    }
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

  // Helper function to parse insight text and extract preserve/improve sections
  const parseInsightText = (insightText: string | null | undefined) => {
    if (!insightText) return { preserve: '', improve: '' };
    
    const lines = insightText.split('\n').filter(line => line.trim());
    
    // If there are at least 2 lines, assume first is preserve, second is improve
    if (lines.length >= 2) {
      return {
        preserve: lines[0].trim(),
        improve: lines[1].trim()
      };
    }
    
    // If only one line, put it in preserve
    return {
      preserve: lines[0] || '',
      improve: ''
    };
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
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadPDF}
                    className="text-right"
                  >
                    <Download className="h-4 w-4 ml-2" />
                    הורד דוח PDF
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 ml-2" />
                        ייצא נתונים
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
                </div>
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

        {/* Enhanced Radar Chart */}
        <div className="card">
          <div className="card-header text-center">
            <div className={`flex items-center justify-center text-right card-title${isPresenterMode ? " text-3xl" : ""}`}>
              <span className="ml-2"><svg className={isPresenterMode ? "h-10 w-10" : "h-6 w-6"} style={{display: "inline-block"}} viewBox="0 0 24 24"><path fill="currentColor" d="M5 10c-1.656 0-3 1.343-3 3 0 1.656 1.344 3 3 3h2v-6H5zm2 9V8c0-1.104.896-2 2-2h6v2H9v11H7zm8-2h2c1.657 0 3-1.344 3-3 0-1.657-1.343-3-3-3v6z"/></svg></span>
              גרף רדאר משופר - שישה ממדים
            </div>
          </div>
          <div className="card-content">
            <div className="h-[520px] w-full flex items-center justify-center">
              <EnhancedSalimaRadarChart
                selfData={respondentData.selfReport}
                colleagueData={respondentData.colleagueReport}
                combinedData={respondentData.combinedReport}
                activeDataSource={activeDataSource}
              />
            </div>
          </div>
        </div>

        {/* Individual Intensity Bars */}
        <div className="card">
          <div className="card-header text-center">
            <div className={`flex items-center justify-center text-right card-title${isPresenterMode ? " text-3xl" : ""}`}>
              <span className="ml-2"><svg className={isPresenterMode ? "h-10 w-10" : "h-6 w-6"} style={{display: "inline-block"}} viewBox="0 0 24 24"><path fill="currentColor" d="M5 10c-1.656 0-3 1.343-3 3 0 1.656 1.344 3 3 3h2v-6H5zm2 9V8c0-1.104.896-2 2-2h6v2H9v11H7zm8-2h2c1.657 0 3-1.344 3-3 0-1.657-1.343-3-3-3v6z"/></svg></span>
              עוצמת הממדים - {getDataSourceLabel()}
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

            {/* Individual Insights Section with Preserve and Improve */}
            {respondentData.rawData && (
              <div className="mt-8 space-y-6">
                {/* Strategy Insights */}
                {respondentData.rawData.insight_strategy && (
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h4 className={`font-semibold text-blue-800 mb-4 text-right ${isPresenterMode ? 'text-2xl' : 'text-lg'}`}>
                      תובנות אסטרטגיה
                    </h4>
                    <div className="space-y-4 text-right">
                      {(() => {
                        const parsed = parseInsightText(respondentData.rawData.insight_strategy);
                        return (
                          <>
                            {parsed.preserve && (
                              <div>
                                <h5 className="font-medium text-green-700 mb-2">שימור</h5>
                                <p className={`text-gray-700 leading-relaxed ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                                  {parsed.preserve}
                                </p>
                              </div>
                            )}
                            {parsed.improve && (
                              <div>
                                <h5 className="font-medium text-orange-700 mb-2">שיפור</h5>
                                <p className={`text-gray-700 leading-relaxed ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                                  {parsed.improve}
                                </p>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* Adaptability Insights */}
                {respondentData.rawData.insight_adaptive && (
                  <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                    <h4 className={`font-semibold text-orange-800 mb-4 text-right ${isPresenterMode ? 'text-2xl' : 'text-lg'}`}>
                      תובנות אדפטיביות
                    </h4>
                    <div className="space-y-4 text-right">
                      {(() => {
                        const parsed = parseInsightText(respondentData.rawData.insight_adaptive);
                        return (
                          <>
                            {parsed.preserve && (
                              <div>
                                <h5 className="font-medium text-green-700 mb-2">שימור</h5>
                                <p className={`text-gray-700 leading-relaxed ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                                  {parsed.preserve}
                                </p>
                              </div>
                            )}
                            {parsed.improve && (
                              <div>
                                <h5 className="font-medium text-orange-700 mb-2">שיפור</h5>
                                <p className={`text-gray-700 leading-relaxed ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                                  {parsed.improve}
                                </p>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* Learning Insights */}
                {respondentData.rawData.insight_learning && (
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h4 className={`font-semibold text-green-800 mb-4 text-right ${isPresenterMode ? 'text-2xl' : 'text-lg'}`}>
                      תובנות למידה
                    </h4>
                    <div className="space-y-4 text-right">
                      {(() => {
                        const parsed = parseInsightText(respondentData.rawData.insight_learning);
                        return (
                          <>
                            {parsed.preserve && (
                              <div>
                                <h5 className="font-medium text-green-700 mb-2">שימור</h5>
                                <p className={`text-gray-700 leading-relaxed ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                                  {parsed.preserve}
                                </p>
                              </div>
                            )}
                            {parsed.improve && (
                              <div>
                                <h5 className="font-medium text-orange-700 mb-2">שיפור</h5>
                                <p className={`text-gray-700 leading-relaxed ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                                  {parsed.improve}
                                </p>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* Inspiration Insights */}
                {respondentData.rawData.insight_inspiration && (
                  <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                    <h4 className={`font-semibold text-red-800 mb-4 text-right ${isPresenterMode ? 'text-2xl' : 'text-lg'}`}>
                      תובנות השראה
                    </h4>
                    <div className="space-y-4 text-right">
                      {(() => {
                        const parsed = parseInsightText(respondentData.rawData.insight_inspiration);
                        return (
                          <>
                            {parsed.preserve && (
                              <div>
                                <h5 className="font-medium text-green-700 mb-2">שימור</h5>
                                <p className={`text-gray-700 leading-relaxed ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                                  {parsed.preserve}
                                </p>
                              </div>
                            )}
                            {parsed.improve && (
                              <div>
                                <h5 className="font-medium text-orange-700 mb-2">שיפור</h5>
                                <p className={`text-gray-700 leading-relaxed ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                                  {parsed.improve}
                                </p>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* Meaning Insights */}
                {respondentData.rawData.insight_meaning && (
                  <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                    <h4 className={`font-semibold text-purple-800 mb-4 text-right ${isPresenterMode ? 'text-2xl' : 'text-lg'}`}>
                      תובנות משמעות
                    </h4>
                    <div className="space-y-4 text-right">
                      {(() => {
                        const parsed = parseInsightText(respondentData.rawData.insight_meaning);
                        return (
                          <>
                            {parsed.preserve && (
                              <div>
                                <h5 className="font-medium text-green-700 mb-2">שימור</h5>
                                <p className={`text-gray-700 leading-relaxed ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                                  {parsed.preserve}
                                </p>
                              </div>
                            )}
                            {parsed.improve && (
                              <div>
                                <h5 className="font-medium text-orange-700 mb-2">שיפור</h5>
                                <p className={`text-gray-700 leading-relaxed ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                                  {parsed.improve}
                                </p>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* Authenticity Insights */}
                {respondentData.rawData.insight_authentic && (
                  <div className="bg-pink-50 p-6 rounded-lg border border-pink-200">
                    <h4 className={`font-semibold text-pink-800 mb-4 text-right ${isPresenterMode ? 'text-2xl' : 'text-lg'}`}>
                      תובנות אותנטיות
                    </h4>
                    <div className="space-y-4 text-right">
                      {(() => {
                        const parsed = parseInsightText(respondentData.rawData.insight_authentic);
                        return (
                          <>
                            {parsed.preserve && (
                              <div>
                                <h5 className="font-medium text-green-700 mb-2">שימור</h5>
                                <p className={`text-gray-700 leading-relaxed ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                                  {parsed.preserve}
                                </p>
                              </div>
                            )}
                            {parsed.improve && (
                              <div>
                                <h5 className="font-medium text-orange-700 mb-2">שיפור</h5>
                                <p className={`text-gray-700 leading-relaxed ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
                                  {parsed.improve}
                                </p>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
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
