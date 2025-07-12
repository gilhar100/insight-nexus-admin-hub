
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WocaZonesTableProps {
  dominantZone: string | null;
  isPresenterMode?: boolean;
}

const zoneData = [
  {
    zone: 'אזור אדישות',
    zoneKey: 'apathy',
    characteristics: 'חסר נרטיב',
    issues: 'סגירות שחית',
    solution: 'הסתרה',
    action: 'כתיבת נרטיב חדש עם הצוות'
  },
  {
    zone: 'אזור נוחות', 
    zoneKey: 'comfort',
    characteristics: 'חזון קרא להפעלה',
    issues: 'נמדנות שחית',
    solution: 'שליטה ומניפולציה',
    action: 'תרגול משוב פתוח ושיר'
  },
  {
    zone: 'אזור מלחמה',
    zoneKey: 'war',
    characteristics: 'השרדות מדית',
    issues: 'חיפוש כשלים',
    solution: 'שליטה היררכית',
    action: 'בניית חזון אמון ושיח ערכי'
  },
  {
    zone: 'אזור הזדמנות',
    zoneKey: 'opportunity', 
    characteristics: 'פוקוס על אומים',
    issues: 'תקשורת פתוחה',
    solution: '"אני שותף"',
    action: 'פעולה למעבר לאזור ההזדמנות'
  },
  {
    zone: 'ערך מרכזי',
    zoneKey: 'central',
    characteristics: 'ראיה מערכתית',
    issues: 'גישות מחשבתית',
    solution: '"לא מדד לי"',
    action: 'תחושת שליחות'
  },
  {
    zone: 'פעולה למעבר לאזור ההזדמנות',
    zoneKey: 'action',
    characteristics: 'נסיות מחודש של חזון בעזרת מודל WOCA',
    issues: 'תקשורת שליחות',
    solution: 'שיח על ערכים ומשמעות בצוות',
    action: 'שיח על ערכים ומשמעות בצוות'
  },
  {
    zone: 'תרגול משוב פתוח ושיר',
    zoneKey: 'feedback',
    characteristics: 'תקשורת פתוחה',
    issues: 'שליטה ומניפולציה',
    solution: 'נמדנות שחית',
    action: 'הסתרה'
  },
  {
    zone: 'בניית חזון אמון ושיח ערכי',
    zoneKey: 'vision',
    characteristics: 'אמון',
    issues: 'אמון מותנה',
    solution: '"בלאדי" אמון',
    action: 'נתוק'
  }
];

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
                <TableHead className={`text-right font-bold border border-gray-300 p-3 ${isPresenterMode ? 'text-lg' : 'text-sm'}`} style={{ color: '#000000' }}>
                  אזור אדישות
                </TableHead>
                <TableHead className={`text-right font-bold border border-gray-300 p-3 ${isPresenterMode ? 'text-lg' : 'text-sm'}`} style={{ color: '#000000' }}>
                  אזור נוחות
                </TableHead>
                <TableHead className={`text-right font-bold border border-gray-300 p-3 ${isPresenterMode ? 'text-lg' : 'text-sm'}`} style={{ color: '#000000' }}>
                  אזור מלחמה
                </TableHead>
                <TableHead className={`text-right font-bold border border-gray-300 p-3 ${isPresenterMode ? 'text-lg' : 'text-sm'}`} style={{ color: '#000000' }}>
                  אזור הזדמנות
                </TableHead>
                <TableHead className={`text-right font-bold border border-gray-300 p-3 ${isPresenterMode ? 'text-lg' : 'text-sm'}`} style={{ color: '#000000' }}>
                  פעולה למעבר לאזור ההזדמנות
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Row 1: Main characteristics */}
              <TableRow>
                <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'} ${
                  isHighlighted('apathy') ? getZoneColor('apathy') + ' font-semibold shadow-md' : 'bg-white'
                }`} style={{ color: '#000000' }}>
                  חסר נרטיב
                </TableCell>
                <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'} ${
                  isHighlighted('comfort') ? getZoneColor('comfort') + ' font-semibold shadow-md' : 'bg-white'
                }`} style={{ color: '#000000' }}>
                  חזון קרא להפעלה
                </TableCell>
                <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'} ${
                  isHighlighted('war') ? getZoneColor('war') + ' font-semibold shadow-md' : 'bg-white'
                }`} style={{ color: '#000000' }}>
                  השרדות מדית
                </TableCell>
                <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'} ${
                  isHighlighted('opportunity') ? getZoneColor('opportunity') + ' font-semibold shadow-md' : 'bg-white'
                }`} style={{ color: '#000000' }}>
                  פוקוס על אומים
                </TableCell>
                <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'}`} style={{ color: '#000000' }}>
                  נסיות מחודש של חזון בעזרות מודל WOCA
                </TableCell>
              </TableRow>

              {/* Row 2: Issues */}
              <TableRow>
                <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'} ${
                  isHighlighted('apathy') ? getZoneColor('apathy') + ' font-semibold shadow-md' : 'bg-white'
                }`} style={{ color: '#000000' }}>
                  ראיה צרה
                </TableCell>
                <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'} ${
                  isHighlighted('comfort') ? getZoneColor('comfort') + ' font-semibold shadow-md' : 'bg-white'
                }`} style={{ color: '#000000' }}>
                  ראיה מערכתית
                </TableCell>
                <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'} ${
                  isHighlighted('war') ? getZoneColor('war') + ' font-semibold shadow-md' : 'bg-white'
                }`} style={{ color: '#000000' }}>
                  חזון דרום
                </TableCell>
                <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'} ${
                  isHighlighted('opportunity') ? getZoneColor('opportunity') + ' font-semibold shadow-md' : 'bg-white'
                }`} style={{ color: '#000000' }}>
                  תקשורת פתוחה
                </TableCell>
                <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'}`} style={{ color: '#000000' }}>
                  שיח על ערכים ומשמעות בצוות
                </TableCell>
              </TableRow>

              {/* Row 3: Solutions */}
              <TableRow>
                <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'} ${
                  isHighlighted('apathy') ? getZoneColor('apathy') + ' font-semibold shadow-md' : 'bg-white'
                }`} style={{ color: '#000000' }}>
                  לכלווון
                </TableCell>
                <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'} ${
                  isHighlighted('comfort') ? getZoneColor('comfort') + ' font-semibold shadow-md' : 'bg-white'
                }`} style={{ color: '#000000' }}>
                  גישות מחשבתית
                </TableCell>
                <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'} ${
                  isHighlighted('war') ? getZoneColor('war') + ' font-semibold shadow-md' : 'bg-white'
                }`} style={{ color: '#000000' }}>
                  תחות מחשבתית
                </TableCell>
                <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'} ${
                  isHighlighted('opportunity') ? getZoneColor('opportunity') + ' font-semibold shadow-md' : 'bg-white'
                }`} style={{ color: '#000000' }}>
                  "אני שותף"
                </TableCell>
                <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'}`} style={{ color: '#000000' }}>
                  תרגול משוב פתוח ושיר
                </TableCell>
              </TableRow>

              {/* Row 4: Actions */}
              <TableRow>
                <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'} ${
                  isHighlighted('apathy') ? getZoneColor('apathy') + ' font-semibold shadow-md' : 'bg-white'
                }`} style={{ color: '#000000' }}>
                  אדישות
                </TableCell>
                <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'} ${
                  isHighlighted('comfort') ? getZoneColor('comfort') + ' font-semibold shadow-md' : 'bg-white'
                }`} style={{ color: '#000000' }}>
                  סקרנות שחית
                </TableCell>
                <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'} ${
                  isHighlighted('war') ? getZoneColor('war') + ' font-semibold shadow-md' : 'bg-white'
                }`} style={{ color: '#000000' }}>
                  "סיפור "בסדר
                </TableCell>
                <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'} ${
                  isHighlighted('opportunity') ? getZoneColor('opportunity') + ' font-semibold shadow-md' : 'bg-white'
                }`} style={{ color: '#000000' }}>
                  חסר נרטיב
                </TableCell>
                <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'}`} style={{ color: '#000000' }}>
                  תקשורת פתוחה
                </TableCell>
              </TableRow>

              {/* Row 5: Bottom actions */}
              <TableRow>
                <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'} ${
                  isHighlighted('apathy') ? getZoneColor('apathy') + ' font-semibold shadow-md' : 'bg-white'
                }`} style={{ color: '#000000' }}>
                  אדישות
                </TableCell>
                <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'} ${
                  isHighlighted('comfort') ? getZoneColor('comfort') + ' font-semibold shadow-md' : 'bg-white'
                }`} style={{ color: '#000000' }}>
                  תחושת שליחות
                </TableCell>
                <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'} ${
                  isHighlighted('war') ? getZoneColor('war') + ' font-semibold shadow-md' : 'bg-white'
                }`} style={{ color: '#000000' }}>
                  "לא מדד לי"
                </TableCell>
                <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'} ${
                  isHighlighted('opportunity') ? getZoneColor('opportunity') + ' font-semibold shadow-md' : 'bg-white'
                }`} style={{ color: '#000000' }}>
                  אדישות
                </TableCell>
                <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'}`} style={{ color: '#000000' }}>
                  שליטה ומניפולציה
                </TableCell>
              </TableRow>

              {/* Row 6: Final row */}
              <TableRow>
                <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'}`} style={{ color: '#000000' }}>
                  הסתרה
                </TableCell>
                <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'}`} style={{ color: '#000000' }}>
                  שליטה היררכית
                </TableCell>
                <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'}`} style={{ color: '#000000' }}>
                  שליטה היררכית
                </TableCell>
                <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'}`} style={{ color: '#000000' }}>
                  "בלאדי" אמון
                </TableCell>
                <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'}`} style={{ color: '#000000' }}>
                  נמדנות שחית
                </TableCell>
              </TableRow>

              {/* Row 7: Bottom row */}
              <TableRow>
                <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'}`} style={{ color: '#000000' }}>
                  נתוק
                </TableCell>
                <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'}`} style={{ color: '#000000' }}>
                  אמון מותנה
                </TableCell>
                <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'}`} style={{ color: '#000000' }}>
                  אמון מותנה
                </TableCell>
                <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'}`} style={{ color: '#000000' }}>
                  "בלאדי" אמון
                </TableCell>
                <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'}`} style={{ color: '#000000' }}>
                  הסתרה
                </TableCell>
              </TableRow>
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
