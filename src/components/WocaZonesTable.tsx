
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WocaZonesTableProps {
  dominantZone: string | null;
  isPresenterMode?: boolean;
  isTie?: boolean;
  tiedCategories?: string[];
}

export const WocaZonesTable: React.FC<WocaZonesTableProps> = ({ 
  dominantZone, 
  isPresenterMode = false,
  isTie = false,
  tiedCategories = []
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
    if (isTie) {
      return tiedCategories.includes(zoneKey);
    }
    return dominantZone === zoneKey;
  };

  const tableData = [
    {
      central: "חזון כקריאה לפעולה",
      war: "סדר יום אישי",
      comfort: "שומרים על הקיים",
      apathy: "היעדר חזון או יוזמה",
      opportunity: "חזון מעורר יוזמה",
      action: "ניסוח מחודש של חזון בעזרת מודל וייז"
    },
    {
      central: "ראייה מערכתית",
      war: "מיקוד בהישגים אישיים",
      comfort: "בלימה אקטיבית",
      apathy: "חוסר מעש",
      opportunity: "חיבורים בין מערכות",
      action: "תרגול סריקה מערכתית"
    },
    {
      central: "גמישות מחשבתית",
      war: "התנגדות לכל מחשבה אחרת",
      comfort: "תחושת איום",
      apathy: "חוסר קשב",
      opportunity: "פתיחות ויצירתיות",
      action: "עיבוד קונפליקטים כהזדמנות"
    },
    {
      central: "סקרנות מקצועית",
      war: "אמת אחת",
      comfort: "דבקות בקיים",
      apathy: "היעדר חלחול",
      opportunity: "סקרנות מקדמת למידה",
      action: "הזמנה לשאלות \"לא נוחות\""
    },
    {
      central: "נרטיב ארגוני",
      war: "נצמד לנרטיב שלי",
      comfort: "אין מקום לחידושים",
      apathy: "אין אמון בנרטיב חדש",
      opportunity: "סיפור רותם ומעורר השראה",
      action: "כתיבת נרטיב חדש עם הצוות"
    },
    {
      central: "תחושת שליחות",
      war: "רצון לנצח",
      comfort: "רצון לשמר",
      apathy: "דיבורי סרק",
      opportunity: "תחושת שליחות מניע ומנוע לתהליך",
      action: "שיח על ערכים ומשמעות בצוות"
    },
    {
      central: "תקשורת פתוחה",
      war: "שליטה ומניפולציה",
      comfort: "הקשבה לכאורה",
      apathy: "שומע ולא מקשיב",
      opportunity: "כנות ופתיחות",
      action: "תרגול משוב פתוח וישיר"
    },
    {
      central: "אמון ביכולת להוביל שינוי",
      war: "ממוקד ביעדים של עצמו",
      comfort: "מאוים משינוי",
      apathy: "חוסר אמון בשינוי",
      opportunity: "מאמין בשינוי",
      action: "בניית חוזה אמון ושיח ערכי"
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
                  isHighlighted('central') ? 'bg-purple-100 border-purple-300' : 'bg-gray-50'
                }`} style={{ color: '#000000' }}>
                  ערך מרכזי
                </TableHead>
                <TableHead className={`text-right font-bold border border-gray-300 p-3 ${isPresenterMode ? 'text-lg' : 'text-sm'} ${
                  isHighlighted('war') ? getZoneColor('war') + ' font-semibold shadow-md' : 'bg-gray-50'
                }`} style={{ color: '#000000' }}>
                  אזור מלחמה - WIN/LOSE
                </TableHead>
                <TableHead className={`text-right font-bold border border-gray-300 p-3 ${isPresenterMode ? 'text-lg' : 'text-sm'} ${
                  isHighlighted('comfort') ? getZoneColor('comfort') + ' font-semibold shadow-md' : 'bg-gray-50'
                }`} style={{ color: '#000000' }}>
                  אזור נוחות – LOSE/LOSE
                </TableHead>
                <TableHead className={`text-right font-bold border border-gray-300 p-3 ${isPresenterMode ? 'text-lg' : 'text-sm'} ${
                  isHighlighted('apathy') ? getZoneColor('apathy') + ' font-semibold shadow-md' : 'bg-gray-50'
                }`} style={{ color: '#000000' }}>
                  אזור אדישות – LOSE/LOSE
                </TableHead>
                <TableHead className={`text-right font-bold border border-gray-300 p-3 ${isPresenterMode ? 'text-lg' : 'text-sm'} ${
                  isHighlighted('opportunity') ? getZoneColor('opportunity') + ' font-semibold shadow-md' : 'bg-gray-50'
                }`} style={{ color: '#000000' }}>
                  אזור ההזדמנות – WIN/WIN
                </TableHead>
                <TableHead className={`text-right font-bold border border-gray-300 p-3 ${isPresenterMode ? 'text-lg' : 'text-sm'} ${
                  isHighlighted('action') ? 'bg-blue-100 border-blue-300' : 'bg-gray-50'
                }`} style={{ color: '#000000' }}>
                  פעולה למעבר לאזור ההזדמנות
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'} ${
                    isHighlighted('central') ? 'bg-purple-100 border-purple-300 font-semibold' : 'bg-white'
                  }`} style={{ color: '#000000' }}>
                    {row.central}
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
                    isHighlighted('opportunity') ? getZoneColor('opportunity') + ' font-semibold shadow-md' : 'bg-white'
                  }`} style={{ color: '#000000' }}>
                    {row.opportunity}
                  </TableCell>
                  <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'} ${
                    isHighlighted('action') ? 'bg-blue-100 border-blue-300 font-semibold' : 'bg-white'
                  }`} style={{ color: '#000000' }}>
                    {row.action}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {isTie ? (
          <div className="mt-4 p-4 rounded-lg text-center bg-yellow-100 border border-yellow-300">
            <p className={`font-semibold ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
              תיקו בין אזורים - הקבוצה מתפלגת באופן שווה בין מספר אזורים
            </p>
          </div>
        ) : dominantZone ? (
          <div className={`mt-4 p-4 rounded-lg text-center ${getZoneColor(dominantZone)}`}>
            <p className={`font-semibold ${isPresenterMode ? 'text-lg' : 'text-sm'}`}>
              הקבוצה נמצאת כרגע ב{dominantZone === 'opportunity' ? 'אזור ההזדמנות' : 
                dominantZone === 'comfort' ? 'אזור הנוחות' :
                dominantZone === 'war' ? 'אזור המלחמה' : 'אזור האדישות'}
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
