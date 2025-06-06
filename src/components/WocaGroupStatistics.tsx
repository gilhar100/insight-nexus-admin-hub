
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Users, TrendingUp, BarChart3, AlertCircle } from 'lucide-react';
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

  // Check minimum threshold
  if (workshopData.participant_count < 3) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              <span>סטטיסטיקות קבוצתיות - ניתוח WOCA</span>
            </div>
            <Badge variant="secondary" className="text-sm">
              {workshopData.participant_count} תגובות
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
            <div className="text-lg text-gray-600 mb-2">
              אין מספיק נתונים להצגת תובנות קבוצתיות.
            </div>
            <div className="text-sm text-gray-500">
              נדרשות לפחות 3 תגובות לניתוח קבוצתי אמין
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate group average scores from ALL participants
  const groupScores = {
    war: workshopData.participants.reduce((sum, p) => sum + (p.woca_scores?.war || 0), 0) / workshopData.participants.length,
    opportunity: workshopData.participants.reduce((sum, p) => sum + (p.woca_scores?.opportunity || 0), 0) / workshopData.participants.length,
    comfort: workshopData.participants.reduce((sum, p) => sum + (p.woca_scores?.comfort || 0), 0) / workshopData.participants.length,
    apathy: workshopData.participants.reduce((sum, p) => sum + (p.woca_scores?.apathy || 0), 0) / workshopData.participants.length
  };

  console.log('📈 Group average scores calculated from', workshopData.participants.length, 'participants:', groupScores);

  // Prepare chart data
  const chartData = Object.entries(groupScores)
    .map(([key, value]) => ({
      zone: ZONE_HEBREW_NAMES[key as keyof typeof ZONE_HEBREW_NAMES],
      score: Number(value.toFixed(2)),
      color: ZONE_COLORS[key as keyof typeof ZONE_COLORS],
      key: key
    }))
    .sort((a, b) => b.score - a.score); // Sort by score descending

  // Find highest and lowest zones for interpretation
  const highestZone = chartData[0];
  const lowestZone = chartData[chartData.length - 1];

  // Generate Hebrew interpretation based on group scores
  const getGroupInterpretation = () => {
    const highZoneName = highestZone.zone;
    const lowZoneName = lowestZone.zone;
    
    let interpretation = `הקבוצה מפגינה רמה גבוהה של ${highZoneName} (${highestZone.score}) ורמה נמוכה יותר של ${lowZoneName} (${lowestZone.score})`;
    
    if (highestZone.key === 'opportunity') {
      interpretation += " – דבר המעיד על קבוצה מוכנה לצמיחה וחדשנות.";
    } else if (highestZone.key === 'war') {
      interpretation += " – דבר המעיד על מתחים וקונפליקטים פנימיים הדורשים התערבות.";
    } else if (highestZone.key === 'comfort') {
      interpretation += " – דבר המעיד על יציבות אך פוטנציאל תקיעות ללא התקדמות.";
    } else {
      interpretation += " – דבר המעיד על חוסר מעורבות הדורש חיזוק המוטיבציה.";
    }
    
    return interpretation;
  };

  // Generate recommendations based on dominant zone
  const getGroupRecommendations = () => {
    switch (highestZone.key) {
      case 'opportunity':
        return "המשיכו לעודד יוזמות, תנו אוטונומיה והציבו אתגרים חדשים.";
      case 'war':
        return "טפלו באופן מיידי בקונפליקטים, הפחיתו לחצים וחזקו תחושת ביטחון.";
      case 'comfort':
        return "הציגו שינויים הדרגתיים תוך שמירה על מסגרות מוכרות.";
      case 'apathy':
        return "בהירו מטרות, חזקו חיבור למשמעות ושפרו מעורבות.";
      default:
        return "נדרש ניתוח מעמיק נוסף לקביעת אסטרטגיית התערבות.";
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
        
        {/* Group Interpretation Summary */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-r-4 border-blue-500">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">ניתוח קבוצתי:</h3>
          <p className="text-blue-700 text-sm leading-relaxed">
            {getGroupInterpretation()}
          </p>
        </div>

        {/* Dominant Zone Badge */}
        <div className="text-center">
          <Badge 
            variant="secondary" 
            className="text-lg px-4 py-2 text-white mb-2"
            style={{ backgroundColor: highestZone.color }}
          >
            אזור דומיננטי: {highestZone.zone} ({highestZone.score})
          </Badge>
        </div>

        {/* Horizontal Bar Chart */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            ציונים ממוצעים קבוצתיים לפי אזור תודעתי
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
                  label={{ value: 'ציון ממוצע', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  type="category"
                  dataKey="zone"
                  tick={{ fontSize: 12 }}
                  width={90}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: any) => [`${value}`, 'ציון ממוצע קבוצתי']}
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
                ממוצע {workshopData.participant_count} משתתפים
              </div>
            </div>
          ))}
        </div>

        {/* Group Recommendations */}
        <div className="p-4 bg-green-50 rounded-lg border-r-4 border-green-500">
          <h4 className="font-semibold text-green-800 mb-2 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            המלצות לקבוצה:
          </h4>
          <p className="text-green-700 text-sm">
            {getGroupRecommendations()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
