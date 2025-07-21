
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
      central: "חזון",
      comfort: "נתפס כמיותר או חלום",
      war: "מעורר התנגדות",
      apathy: "מנותק מהמציאות",
      opportunity: "קריאה לפעולה, מייצר השראה"
    },
    {
      central: "קונפליקט",
      comfort: "מודחק",
      war: "בעוצמה גבוהה",
      apathy: "מוביל לניתוק",
      opportunity: "מנוהל ללמידה, ברור ערכים וחזון"
    },
    {
      central: "למידה",
      comfort: "פורמלית, טכנית",
      war: "ניסוי וטעייה",
      apathy: "שטחית או מדוכאת",
      opportunity: "מתמשכת, סקרנית, טרנספורמטיבית"
    },
    {
      central: "משמעות",
      comfort: "נשחקה או חבויה",
      war: "נתפסת כאיום זהותי",
      apathy: "חסרה או ממוסכת",
      opportunity: "יוצרת מחויבות ותחושת שליחות"
    },
    {
      central: "השראה",
      comfort: "לא נדרשת",
      war: "צינית או מאיימת",
      apathy: "חסרת השפעה",
      opportunity: "מניעה יוזמה, רתימה ואחריות"
    },
    {
      central: "ניהול שינוי",
      comfort: "שינוי כפרויקט",
      war: "מאבק הישרדותי",
      apathy: "אדישות לתהליך",
      opportunity: "שינוי כאורח חיים, כולל התמודדות רגשית"
    },
    {
      central: "סגנון מנהיגות",
      comfort: "תפעולי, ניהולי",
      war: "סמכותי ותגובתי",
      apathy: "טכני, מנותק",
      opportunity: "טרנספורמטיבי, מחובר, אותנטי"
    },
    {
      central: "תגובת עובדים",
      comfort: "שביעות רצון עם שעמום",
      war: "לחץ, מגננה, התנגדות",
      apathy: "ניכור, ציניות",
      opportunity: "מעורבות, התלהבות, יצירתיות"
    },
    {
      central: "שותפויות ומערכות יחסים",
      comfort: "שטחיות, תפקודיות בלבד",
      war: "מניפולטיביות, כוחניות",
      apathy: "מנותקות, אדישות",
      opportunity: "שיתופיות, מבוססות אמון והדדיות"
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
                  ערך / מושג
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
