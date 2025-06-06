
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Users, TrendingUp, BarChart3 } from 'lucide-react';
import { WorkshopData } from '@/types/workshop';
import { ZONE_HEBREW_NAMES } from '@/utils/wocaScoring';

interface WocaGroupStatisticsProps {
  workshopData: WorkshopData;
}

const ZONE_COLORS = {
  war: '#EF4444',
  opportunity: '#10B981',
  comfort: '#3B82F6',
  apathy: '#F59E0B'
};

const chartConfig = {
  score: {
    label: "ציון ממוצע קבוצתי",
    color: "#2563eb",
  },
};

export const WocaGroupStatistics: React.FC<WocaGroupStatisticsProps> = ({ workshopData }) => {
  console.log('📊 Rendering WOCA Group Statistics for', workshopData.participant_count, 'participants');

  // Calculate group average scores
  const groupScores = {
    war: workshopData.participants.reduce((sum, p) => sum + (p.woca_scores?.war || 0), 0) / workshopData.participants.length,
    opportunity: workshopData.participants.reduce((sum, p) => sum + (p.woca_scores?.opportunity || 0), 0) / workshopData.participants.length,
    comfort: workshopData.participants.reduce((sum, p) => sum + (p.woca_scores?.comfort || 0), 0) / workshopData.participants.length,
    apathy: workshopData.participants.reduce((sum, p) => sum + (p.woca_scores?.apathy || 0), 0) / workshopData.participants.length
  };

  console.log('📈 Group average scores:', groupScores);

  // Prepare chart data
  const chartData = Object.entries(groupScores)
    .map(([key, value]) => ({
      zone: ZONE_HEBREW_NAMES[key as keyof typeof ZONE_HEBREW_NAMES],
      score: Number(value.toFixed(2)),
      color: ZONE_COLORS[key as keyof typeof ZONE_COLORS],
      key: key
    }))
    .sort((a, b) => b.score - a.score); // Sort by score descending

  // Find the dominant zone
  const dominantZone = chartData[0];
  const maxScore = Math.max(...Object.values(groupScores));
  const minScore = Math.min(...Object.values(groupScores));

  // Generate interpretation based on scores
  const getGroupInterpretation = () => {
    if (maxScore < 2.5) {
      return "הקבוצה מציגה רמות נמוכות בכל האזורים התודעתיים - מצב שעשוי לדרוש התערבות מיידית.";
    } else if (dominantZone.key === 'opportunity') {
      return "הקבוצה נמצאת באזור ההזדמנות - מצב אידיאלי לצמיחה וחדשנות.";
    } else if (dominantZone.key === 'war') {
      return "הקבוצה מציגה רמות גבוהות של מתח וקונפליקטים - נדרשת התערבות דחופה.";
    } else if (dominantZone.key === 'comfort') {
      return "הקבוצה נמצאת באזור הנוחות - יציבה אך עלולה להיתקע ללא התקדמות.";
    } else {
      return "הקבוצה מציגה רמות גבוהות של אדישות - נדרש חיזוק המעורבות והמוטיבציה.";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            <span>סטטיסטיקות קבוצתיות - ניתוח WOCA</span>
          </div>
          <Badge variant="secondary" className="text-sm">
            {workshopData.participant_count} משתתפים
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Group Summary */}
        <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="mb-4">
            <Badge 
              variant="secondary" 
              className="text-lg px-4 py-2 text-white mb-2"
              style={{ backgroundColor: workshopData.dominant_zone_color }}
            >
              אזור דומיננטי: {workshopData.dominant_zone}
            </Badge>
          </div>
          <div className="text-lg text-gray-700 mb-2">
            {workshopData.group_zone_result?.description}
          </div>
          <div className="text-sm text-gray-600">
            {getGroupInterpretation()}
          </div>
        </div>

        {/* Horizontal Bar Chart */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            ציונים ממוצעים לפי אזור תודעתי
          </h3>
          <ChartContainer config={chartConfig} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData} 
                layout="horizontal"
                margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number"
                  domain={[0, 5]}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  type="category"
                  dataKey="zone"
                  tick={{ fontSize: 12 }}
                  width={90}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: any, name: any, props: any) => [
                    `${value}`,
                    'ציון ממוצע קבוצתי'
                  ]}
                  labelFormatter={(label: any) => `אזור ${label}`}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      fillOpacity={0.3 + (entry.score / 5) * 0.7} // Intensity based on score
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Detailed Scores Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {chartData.map((zone) => (
            <div 
              key={zone.key}
              className="p-4 rounded-lg border-2 text-center"
              style={{ 
                borderColor: zone.color,
                backgroundColor: `${zone.color}10`
              }}
            >
              <div 
                className="text-sm font-medium mb-2"
                style={{ color: zone.color }}
              >
                {zone.zone}
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {zone.score}
              </div>
              <div className="text-xs text-gray-500">
                ממוצע קבוצתי
              </div>
            </div>
          ))}
        </div>

        {/* Group Insights */}
        {workshopData.group_zone_result?.explanation && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              ניתוח קבוצתי:
            </h4>
            <p className="text-blue-700 text-sm">
              {workshopData.group_zone_result.explanation}
            </p>
          </div>
        )}
        
        {workshopData.group_zone_result?.recommendations && (
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">המלצות לקבוצה:</h4>
            <p className="text-green-700 text-sm">
              {workshopData.group_zone_result.recommendations}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
