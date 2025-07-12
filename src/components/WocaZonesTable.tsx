
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WocaZonesTableProps {
  dominantZone: string | null;
  isPresenterMode?: boolean;
}

export const WocaZonesTable: React.FC<WocaZonesTableProps> = ({ 
  dominantZone, 
  isPresenterMode = false 
}) => {
  const getZoneColor = (zoneKey: string) => {
    switch (zoneKey) {
      case 'opportunity':
        return 'bg-opportunity-light border-opportunity text-opportunity-dark';
      case 'comfort':
        return 'bg-comfort-light border-comfort text-comfort-dark';
      case 'apathy':
        return 'bg-apathy-light border-apathy text-apathy-dark';
      case 'war':
        return 'bg-war-light border-war text-war-dark';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const isHighlighted = (zoneKey: string) => {
    return dominantZone === zoneKey;
  };

  const tableData = [
    {
      action: "ניסוח מחודש של חזון בעזרת מודל וייז",
      opportunity: "חזון מעורר יוזמה",
      war: "הישרדות מיידית",
      comfort: "חזון רדום",
      apathy: "חזון מטושטש",
      central: "חזון כקריאה לפעולה"
    },
    {
      action: "תרגול סריקה מערכתית",
      opportunity: "חיבורים בין מערכות",
      war: "פוקוס על איומים",
      comfort: "קיפאון מחשבתי",
      apathy: "ראייה צרה",
      central: "ראייה מערכתית"
    },
    {
      action: "עיבוד קונפליקטים כהזדמנות",
      opportunity: "פתיחות ויצירתיות",
      war: "תגובתיות אגרסיבית",
      comfort: "נוחות מחשבתית",
      apathy: "קיבעון",
      central: "גמישות מחשבתית"
    },
    {
      action: "הזמנה לשאלות \"לא נוחות\"",
      opportunity: "שאלות חוקרות",
      war: "חיפוש כשלים",
      comfort: "סקרנות שטחית",
      apathy: "אדישות",
      central: "סקרנות מקצועית"
    },
    {
      action: "כתיבת נרטיב חדש עם הצוות",
      opportunity: "סיפור מעורר השראה",
      war: "\"אני שורד/ת\"",
      comfort: "סיפור \"בסדר\"",
      apathy: "חוסר נרטיב",
      central: "נרטיב אישי"
    },
    {
      action: "שיח על ערכים ומשמעות בצוות",
      opportunity: "חיבור לערכים",
      war: "שליחות הישרדותית",
      comfort: "\"לא מזיז לי\"",
      apathy: "אדישות",
      central: "תחושת שליחות"
    },
    {
      action: "תרגול משוב פתוח וישיר",
      opportunity: "כנות ופתיחות",
      war: "שליטה ומניפולציה",
      comfort: "נחמדות שטחית",
      apathy: "הסתרה",
      central: "תקשורת פתוחה"
    },
    {
      action: "בניית חוזה אמון ושיח ערכי",
      opportunity: "אמון מבוסס חיבור",
      war: "אמון מותנה",
      comfort: "\"כאילו\" אמון",
      apathy: "ניתוק",
      central: "אמון"
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className={`text-right ${isPresenterMode ? 'text-3xl' : 'text-xl'}`} style={{ color: '#000000' }}>
          מטריצת אזורי WOCA
        </CardTitle>
        <p className={`text-right ${isPresenterMode ? 'text-lg' : 'text-sm'}`} style={{ color: '#000000' }}>
          מדריך למעבר לאזור ההזדמנות
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto" dir="rtl">
          <Table className="w-full border-collapse">
            <TableHeader>
              <TableRow className="border-b-2 border-gray-300">
                <TableHead className={`text-right font-bold border border-gray-300 p-3 ${isPresenterMode ? 'text-lg' : 'text-sm'} ${
                  isHighlighted('action') ? 'bg-blue-100 border-blue-300' : 'bg-gray-50'
                }`} style={{ color: '#000000' }}>
                  פעולה למעבר לאזור ההזדמנות
                </TableHead>
                <TableHead className={`text-right font-bold border border-gray-300 p-3 ${isPresenterMode ? 'text-lg' : 'text-sm'} ${
                  isHighlighted('opportunity') ? getZoneColor('opportunity') + ' font-semibold shadow-md' : 'bg-gray-50'
                }`} style={{ color: '#000000' }}>
                  אזור ההזדמנות
                </TableHead>
                <TableHead className={`text-right font-bold border border-gray-300 p-3 ${isPresenterMode ? 'text-lg' : 'text-sm'} ${
                  isHighlighted('war') ? getZoneColor('war') + ' font-semibold shadow-md' : 'bg-gray-50'
                }`} style={{ color: '#000000' }}>
                  אזור מלחמה
                </TableHead>
                <TableHead className={`text-right font-bold border border-gray-300 p-3 ${isPresenterMode ? 'text-lg' : 'text-sm'} ${
                  isHighlighted('comfort') ? getZoneColor('comfort') + ' font-semibold shadow-md' : 'bg-gray-50'
                }`} style={{ color: '#000000' }}>
                  אזור נוחות
                </TableHead>
                <TableHead className={`text-right font-bold border border-gray-300 p-3 ${isPresenterMode ? 'text-lg' : 'text-sm'} ${
                  isHighlighted('apathy') ? getZoneColor('apathy') + ' font-semibold shadow-md' : 'bg-gray-50'
                }`} style={{ color: '#000000' }}>
                  אזור אדישות
                </TableHead>
                <TableHead className={`text-right font-bold border border-gray-300 p-3 ${isPresenterMode ? 'text-lg' : 'text-sm'} ${
                  isHighlighted('central') ? 'bg-purple-100 border-purple-300' : 'bg-gray-50'
                }`} style={{ color: '#000000' }}>
                  ערך מרכזי
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'} ${
                    isHighlighted('action') ? 'bg-blue-100 border-blue-300 font-semibold' : 'bg-white'
                  }`} style={{ color: '#000000' }}>
                    {row.action}
                  </TableCell>
                  <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'} ${
                    isHighlighted('opportunity') ? getZoneColor('opportunity') + ' font-semibold shadow-md' : 'bg-white'
                  }`} style={{ color: '#000000' }}>
                    {row.opportunity}
                  </TableCell>
                  <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'} ${
                    isHighlighted('war') ? getZoneColor('war') + ' font-semibold shadow-md' : 'bg-white'
                  }`} style={{ color: '#000000' }}>
                    {row.war}
                  </TableCell>
                  <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'} ${
                    isHighlighted('comfort') ? getZoneColor('comfort') + ' font-semibold shadow-md' : 'bg-white'
                  }`} style={{ color: '#000000' }}>
                    {row.comfort}
                  </TableCell>
                  <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'} ${
                    isHighlighted('apathy') ? getZoneColor('apathy') + ' font-semibold shadow-md' : 'bg-white'
                  }`} style={{ color: '#000000' }}>
                    {row.apathy}
                  </TableCell>
                  <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'} ${
                    isHighlighted('central') ? 'bg-purple-100 border-purple-300 font-semibold' : 'bg-white'
                  }`} style={{ color: '#000000' }}>
                    {row.central}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {dominantZone && (
          <div className={`mt-4 p-4 rounded-lg text-center ${getZoneColor(dominantZone)}`}>
            <p className={`font-semibold ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
              הקבוצה נמצאת כרגע ב{dominantZone === 'opportunity' ? 'אזור ההזדמנות' : 
                dominantZone === 'comfort' ? 'אזור הנוחות' :
                dominantZone === 'war' ? 'אזור המלחמה' : 'אזור האדישות'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
