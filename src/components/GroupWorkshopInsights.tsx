// Modified GroupWorkshopInsights.tsx with requested changes

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, BarChart3, Radar, Download, TrendingUp, Eye, EyeOff, AlertCircle, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useWorkshopData } from '@/hooks/useWorkshopData';
import { WocaRadarChart } from '@/components/WocaRadarChart';
import { analyzeWorkshopWoca, getZoneDescription } from '@/utils/wocaAnalysis';
import { WOCA_ZONE_COLORS } from '@/utils/wocaColors';
import { PresenterMode } from '@/components/PresenterMode';
import { ZoneDescription } from '@/components/ZoneDescription';
import { ParticipantSearch } from '@/components/ParticipantSearch';
import { GapAnalysisChart } from '@/components/GapAnalysisChart';
import { HeatmapChart } from '@/components/HeatmapChart';

// ...rest of the unchanged imports and logic...

{/* Visualizations - Updated */}
<div className={`grid grid-cols-1 gap-6`}>
  {/* Enlarged Gap Analysis Chart */}
  <Card className="lg:col-span-2">
    <CardHeader>
      <CardTitle className={`flex items-center ${isPresenterMode ? 'text-2xl' : ''}`}>
        <BarChart3 className="h-5 w-5 mr-2" />
        השוואת ציונים לפי אזורים
      </CardTitle>
      {!isPresenterMode && (
        <CardDescription>
          פערים יחסית לאזור ההזדמנות
        </CardDescription>
      )}
    </CardHeader>
    <CardContent>
      <GapAnalysisChart categoryScores={wocaAnalysis.groupCategoryScores} />
    </CardContent>
  </Card>

  {/* Radar Chart */}
  <Card className="lg:col-span-2">
    <CardHeader>
      <CardTitle className={`flex items-center ${isPresenterMode ? 'text-2xl' : ''}`}>
        <Radar className="h-5 w-5 mr-2" />
        מחוונים WOCA
      </CardTitle>
    </CardHeader>
    <CardContent>
      <WocaRadarChart participants={workshopData.participants} />
    </CardContent>
  </Card>

  {/* Enlarged Heatmap Chart */}
  <Card className="lg:col-span-2">
    <CardHeader>
      <CardTitle className={`flex items-center ${isPresenterMode ? 'text-2xl' : ''}`}>
        <BarChart3 className="h-5 w-5 mr-2" />
        מפת חום לפי שאלות
      </CardTitle>
      {!isPresenterMode && (
        <CardDescription>
          ממוצע לכל שאלה לפי קטגוריית WOCA
        </CardDescription>
      )}
    </CardHeader>
    <CardContent>
      <HeatmapChart participants={workshopData.participants} />
    </CardContent>
  </Card>
</div>

{/* Informational Section - Why Move to Opportunity Zone */}
<Card className={`${isPresenterMode ? 'border-2 border-green-200 bg-green-50' : 'bg-green-50'} mt-6`}>
  <CardContent className={isPresenterMode ? 'p-8' : 'p-6'}>
    <div className={`text-center ${isPresenterMode ? 'space-y-6' : 'space-y-4'}`}>
      <h3 className={`${isPresenterMode ? 'text-2xl' : 'text-lg'} font-bold mb-4 text-green-800 flex items-center justify-center`}>
        <Lightbulb className="h-6 w-6 mr-2" />
        מדוע כדאי לנוע לאזור ההזדמנות
      </h3>
      <div className={`${isPresenterMode ? 'text-lg' : 'text-base'} leading-relaxed text-green-700 text-right`}>
        <p className="mb-4">
          <strong>מדוע אזור ההזדמנות הוא אידיאלי?</strong>
        </p>
        <p>
          אזור ההזדמנות מייצג איזון נדיר בין יוזמה לאחריות, בין יצירתיות לבקרה, ובין הישגיות לשיתוף פעולה.
          זהו המרחב שבו הארגון מסוגל ליזום שינוי, לנהל קונפליקטים באופן בונה, ולנוע לעבר עתיד משמעותי ובר־קיימא.
          תרבות ארגונית המתבססת על ערכים אלו אינה רק אפקטיבית יותר – היא גם עמידה, חדשנית ובעלת השפעה חיובית על עובדיה ועל סביבתה.
        </p>
      </div>
    </div>
  </CardContent>
</Card>
