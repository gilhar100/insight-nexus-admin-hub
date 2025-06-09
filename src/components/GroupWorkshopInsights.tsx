// Full updated file with added charts: StackedBarChart, HeatmapChart

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, BarChart3, Radar, Download, TrendingUp, Eye, EyeOff, AlertCircle, PieChart, LayoutGrid } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useWorkshopData } from '@/hooks/useWorkshopData';
import { WocaRadarChart } from '@/components/WocaRadarChart';
import { analyzeWorkshopWoca, getZoneDescription } from '@/utils/wocaAnalysis';
import { WOCA_ZONE_COLORS } from '@/utils/wocaColors';
import { PresenterMode } from '@/components/PresenterMode';
import { ZoneDescription } from '@/components/ZoneDescription';
import { ParticipantSearch } from '@/components/ParticipantSearch';
import { GapAnalysisChart } from '@/components/GapAnalysisChart';
import { ZoneDistributionChart } from '@/components/ZoneDistributionChart';
import { StackedBarChart } from '@/components/StackedBarChart';
import { HeatmapChart } from '@/components/HeatmapChart';

// Existing component code remains unchanged until visualization grid section

{/* Visualizations - Enhanced */}
<div className={`grid grid-cols-1 ${isPresenterMode ? 'gap-12' : 'lg:grid-cols-2 gap-6'}`}>
  {/* Gap Analysis Chart */}
  <Card>
    <CardHeader>
      <CardTitle className={`flex items-center ${isPresenterMode ? 'text-2xl' : ''}`}>
        <BarChart3 className="h-5 w-5 mr-2" />
        ניתוח פערים
      </CardTitle>
      {!isPresenterMode && <CardDescription>פערים יחסית לאזור ההזדמנות</CardDescription>}
    </CardHeader>
    <CardContent>
      <GapAnalysisChart categoryScores={wocaAnalysis.groupCategoryScores} />
    </CardContent>
  </Card>

  {/* Zone Distribution Pie Chart */}
  <Card>
    <CardHeader>
      <CardTitle className={`flex items-center ${isPresenterMode ? 'text-2xl' : ''}`}>
        <PieChart className="h-5 w-5 mr-2" />
        התפלגות משתתפים לפי אזורים
      </CardTitle>
      {!isPresenterMode && <CardDescription>מספר משתתפים בכל אזור WOCA</CardDescription>}
    </CardHeader>
    <CardContent>
      <ZoneDistributionChart zoneDistribution={zoneDistribution} />
    </CardContent>
  </Card>

  {/* Stacked Bar Chart */}
  <Card className={isPresenterMode ? 'lg:col-span-2' : ''}>
    <CardHeader>
      <CardTitle className={`flex items-center ${isPresenterMode ? 'text-2xl' : ''}`}>
        <LayoutGrid className="h-5 w-5 mr-2" />
        פרופיל משתתפים לפי ציונים יחסיים
      </CardTitle>
      {!isPresenterMode && <CardDescription>ציונים לכל אזור עבור כל משתתף</CardDescription>}
    </CardHeader>
    <CardContent>
      <StackedBarChart participants={workshopData.participants} />
    </CardContent>
  </Card>

  {/* Radar Chart */}
  <Card className={isPresenterMode ? 'lg:col-span-2' : ''}>
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

  {/* Heatmap of Question-Level Data */}
  <Card className={isPresenterMode ? 'lg:col-span-2' : ''}>
    <CardHeader>
      <CardTitle className={`flex items-center ${isPresenterMode ? 'text-2xl' : ''}`}>
        <BarChart3 className="h-5 w-5 mr-2" />
        מפת חום לפי שאלות
      </CardTitle>
      {!isPresenterMode && <CardDescription>ממוצע לכל שאלה לפי קטגוריית WOCA</CardDescription>}
    </CardHeader>
    <CardContent>
      <HeatmapChart participants={workshopData.participants} />
    </CardContent>
  </Card>
</div>

// Rest of the code unchanged