
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

interface WocaZonesTableProps {
  dominantZone: string | null;
  isPresenterMode?: boolean;
}

export const WocaZonesTable: React.FC<WocaZonesTableProps> = ({ 
  dominantZone, 
  isPresenterMode = false 
}) => {
  const isMobile = useIsMobile();

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

  const getDimmedStyle = (zoneKey: string) => {
    if (isHighlighted(zoneKey) || zoneKey === 'action' || zoneKey === 'central') {
      return '';
    }
    return 'opacity-60';
  };

  const getEmphasizedStyle = (zoneKey: string) => {
    if (isHighlighted(zoneKey) || zoneKey === 'action') {
      return 'bg-green-50 border-2 border-green-200 shadow-sm font-semibold';
    }
    return '';
  };

  const tableData = [
    {
      central: "חזון כקריאה לפעולה",
      war: "הישרדות מיידית",
      comfort: "חזון רדום",
      apathy: "חזון מטושטש",
      opportunity: "חזון מעורר יוזמה",
      action: "ניסוח מחודש של חזון בעזרת מודל וייז"
    },
    {
      central: "ראייה מערכתית",
      war: "פוקוס על איומים",
      comfort: "קיפאון מחשבתי",
      apathy: "ראייה צרה",
      opportunity: "חיבורים בין מערכות",
      action: "תרגול סריקה מערכתית"
    },
    {
      central: "גמישות מחשבתית",
      war: "תגובתיות אגרסיבית",
      comfort: "נוחות מחשבתית",
      apathy: "קיבעון",
      opportunity: "פתיחות ויצירתיות",
      action: "עיבוד קונפליקטים כהזדמנות"
    },
    {
      central: "סקרנות מקצועית",
      war: "חיפוש כשלים",
      comfort: "סקרנות שטחית",
      apathy: "אדישות",
      opportunity: "שאלות חוקרות",
      action: "הזמנה לשאלות \"לא נוחות\""
    },
    {
      central: "נרטיב אישי",
      war: "\"אני שורד/ת\"",
      comfort: "סיפור \"בסדר\"",
      apathy: "חוסר נרטיב",
      opportunity: "סיפור מעורר השראה",
      action: "כתיבת נרטיב חדש עם הצוות"
    },
    {
      central: "תחושת שליחות",
      war: "שליחות הישרדותית",
      comfort: "\"לא מזיז לי\"",
      apathy: "אדישות",
      opportunity: "חיבור לערכים",
      action: "שיח על ערכים ומשמעות בצוות"
    },
    {
      central: "תקשורת פתוחה",
      war: "שליטה ומניפולציה",
      comfort: "נחמדות שטחית",
      apathy: "הסתרה",
      opportunity: "כנות ופתיחות",
      action: "תרגול משוב פתוח וישיר"
    },
    {
      central: "אמון",
      war: "אמון מותנה",
      comfort: "\"כאילו\" אמון",
      apathy: "ניתוק",
      opportunity: "אמון מבוסס חיבור",
      action: "בניית חוזה אמון ושיח ערכי"
    }
  ];

  const renderMobileTable = () => (
    <div className="space-y-4">
      {tableData.map((row, index) => (
        <Card key={index} className="border border-gray-200">
          <CardContent className="p-4 space-y-3">
            <div className="font-semibold text-purple-700 text-right border-b pb-2">
              {row.central}
            </div>
            
            {/* Current State (Dominant Zone) */}
            <div className={`p-3 rounded-lg ${getEmphasizedStyle(dominantZone || '')} ${
              isHighlighted(dominantZone || '') ? getZoneColor(dominantZone || '') : 'bg-gray-50'
            }`}>
              <div className="text-sm font-medium text-gray-600 mb-1">מצב נוכחי:</div>
              <div className="font-semibold">
                {dominantZone === 'war' ? row.war :
                 dominantZone === 'comfort' ? row.comfort :
                 dominantZone === 'apathy' ? row.apathy : 
                 dominantZone === 'opportunity' ? row.opportunity : 'לא זוהה'}
              </div>
            </div>

            {/* Action */}
            <div className={`p-3 rounded-lg ${getEmphasizedStyle('action')} bg-green-50 border-2 border-green-200`}>
              <div className="text-sm font-medium text-gray-600 mb-1">פעולה מומלצת:</div>
              <div className="font-semibold text-green-800">
                {row.action}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderDesktopTable = () => (
    <div className="overflow-x-auto" dir="rtl">
      <Table className="w-full border-collapse">
        <TableHeader>
          <TableRow className="border-b-2 border-gray-300">
            <TableHead className={`text-right font-bold border border-gray-300 p-3 ${isPresenterMode ? 'text-lg' : 'text-sm'} bg-purple-50 border-purple-200`} style={{ color: '#000000' }}>
              ערך מרכזי
            </TableHead>
            
            {/* Grouped header for emphasis */}
            <TableHead 
              colSpan={2} 
              className={`text-center font-bold border border-green-300 p-3 ${isPresenterMode ? 'text-lg' : 'text-sm'} bg-green-100 text-green-800`}
            >
              המלצות לשיפור
            </TableHead>
            
            <TableHead className={`text-right font-bold border border-gray-300 p-3 ${isPresenterMode ? 'text-lg' : 'text-sm'} ${getDimmedStyle('war')} ${
              isHighlighted('war') ? getZoneColor('war') + ' font-semibold shadow-md' : 'bg-gray-50'
            }`} style={{ color: '#000000' }}>
              אזור מלחמה
            </TableHead>
            <TableHead className={`text-right font-bold border border-gray-300 p-3 ${isPresenterMode ? 'text-lg' : 'text-sm'} ${getDimmedStyle('comfort')} ${
              isHighlighted('comfort') ? getZoneColor('comfort') + ' font-semibold shadow-md' : 'bg-gray-50'
            }`} style={{ color: '#000000' }}>
              אזור נוחות
            </TableHead>
            <TableHead className={`text-right font-bold border border-gray-300 p-3 ${isPresenterMode ? 'text-lg' : 'text-sm'} ${getDimmedStyle('apathy')} ${
              isHighlighted('apathy') ? getZoneColor('apathy') + ' font-semibold shadow-md' : 'bg-gray-50'
            }`} style={{ color: '#000000' }}>
              אזור אדישות
            </TableHead>
            <TableHead className={`text-right font-bold border border-gray-300 p-3 ${isPresenterMode ? 'text-lg' : 'text-sm'} ${getDimmedStyle('opportunity')} ${
              isHighlighted('opportunity') ? getZoneColor('opportunity') + ' font-semibold shadow-md' : 'bg-gray-50'
            }`} style={{ color: '#000000' }}>
              אזור ההזדמנות
            </TableHead>
          </TableRow>
          <TableRow className="border-b-2 border-gray-300">
            <TableHead className="border border-gray-300 p-0"></TableHead>
            
            {/* Sub-headers for the grouped columns */}
            <TableHead className={`text-right font-bold border border-green-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'} ${getEmphasizedStyle(dominantZone || '')} ${
              isHighlighted(dominantZone || '') ? getZoneColor(dominantZone || '') + ' font-semibold shadow-md' : 'bg-green-50'
            }`} style={{ color: '#000000' }}>
              {dominantZone === 'opportunity' ? 'אזור ההזדמנות' :
               dominantZone === 'comfort' ? 'אזור הנוחות' :
               dominantZone === 'war' ? 'אזור המלחמה' :
               dominantZone === 'apathy' ? 'אזור האדישות' : 'המצב הנוכחי'}
            </TableHead>
            <TableHead className={`text-right font-bold border border-green-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'} ${getEmphasizedStyle('action')} bg-green-50 border-green-200 shadow-sm`} style={{ color: '#000000' }}>
              פעולה למעבר לאזור ההזדמנות
            </TableHead>
            
            <TableHead className="border border-gray-300 p-0"></TableHead>
            <TableHead className="border border-gray-300 p-0"></TableHead>
            <TableHead className="border border-gray-300 p-0"></TableHead>
            <TableHead className="border border-gray-300 p-0"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((row, index) => (
            <TableRow key={index}>
              <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'} bg-purple-50 border-purple-200 font-semibold`} style={{ color: '#000000' }}>
                {row.central}
              </TableCell>
              
              {/* Emphasized columns */}
              <TableCell className={`text-right border border-green-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'} ${getEmphasizedStyle(dominantZone || '')} ${
                isHighlighted(dominantZone || '') ? getZoneColor(dominantZone || '') + ' font-semibold shadow-md' : 'bg-green-50'
              }`} style={{ color: '#000000' }}>
                {dominantZone === 'war' ? row.war :
                 dominantZone === 'comfort' ? row.comfort :
                 dominantZone === 'apathy' ? row.apathy : 
                 dominantZone === 'opportunity' ? row.opportunity : ''}
              </TableCell>
              <TableCell className={`text-right border border-green-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'} ${getEmphasizedStyle('action')} bg-green-50 border-green-200 shadow-sm font-semibold text-green-800`}>
                {row.action}
              </TableCell>
              
              {/* Dimmed columns */}
              <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'} ${getDimmedStyle('war')} ${
                isHighlighted('war') ? getZoneColor('war') + ' font-semibold shadow-md' : 'bg-white'
              }`} style={{ color: '#000000' }}>
                {row.war}
              </TableCell>
              <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'} ${getDimmedStyle('comfort')} ${
                isHighlighted('comfort') ? getZoneColor('comfort') + ' font-semibold shadow-md' : 'bg-white'
              }`} style={{ color: '#000000' }}>
                {row.comfort}
              </TableCell>
              <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'} ${getDimmedStyle('apathy')} ${
                isHighlighted('apathy') ? getZoneColor('apathy') + ' font-semibold shadow-md' : 'bg-white'
              }`} style={{ color: '#000000' }}>
                {row.apathy}
              </TableCell>
              <TableCell className={`text-right border border-gray-300 p-3 ${isPresenterMode ? 'text-base' : 'text-sm'} ${getDimmedStyle('opportunity')} ${
                isHighlighted('opportunity') ? getZoneColor('opportunity') + ' font-semibold shadow-md' : 'bg-white'
              }`} style={{ color: '#000000' }}>
                {row.opportunity}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

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
        {isMobile ? renderMobileTable() : renderDesktopTable()}
        
        {dominantZone && (
          <div className={`mt-4 p-4 rounded-lg text-center ${getZoneColor(dominantZone)} shadow-sm`}>
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
