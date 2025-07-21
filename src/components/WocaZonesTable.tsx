import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [isGuideFullscreen, setIsGuideFullscreen] = useState(false);
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
        
        {/* Opportunity Zone Guide */}
        <div className="mt-8">
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="text-center pb-4 relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsGuideFullscreen(true)}
                className="absolute left-4 top-4 bg-white hover:bg-gray-50 border-green-300"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
              <CardTitle className={`text-right ${isPresenterMode ? 'text-3xl' : 'text-xl'} text-black font-bold`}>
                מדריך למעבר לאזור ההזדמנות
              </CardTitle>
              <p className={`text-right ${isPresenterMode ? 'text-xl' : 'text-base'} text-black font-medium`}>
                ההתנהגויות הנדרשות כדי לנוע לאזור ההזדמנות:
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4" dir="rtl">
                <div className="grid gap-3">
                  {[
                    { title: "להגביר מודעות", desc: "לזיהוי המקום התודעתי בו אנו נמצאים." },
                    { title: "להבין קונפליקטים", desc: "לנהל אותם ככלי למידה וצמיחה." },
                    { title: "לאמץ למידה מתמשכת", desc: "סקרנות, שיתופי פעולה ויצירתיות." },
                    { title: "להציף משמעות", desc: "לקשר בין העשייה לחזון אישי וארגוני." },
                    { title: "לשדר השראה", desc: "דוגמה אישית, נרטיב ותקווה." },
                    { title: "לראות שינוי כהזדמנות", desc: "ולא כאיום." },
                    { title: "לטפח מנהיגות אותנטית", desc: "שקיפות, הקשבה ונוכחות רגשית." },
                    { title: "לבנות שותפויות", desc: "לטפח מערכות יחסים משמעותיות, להקשיב, לשתף פעולה ולייצר הדדיות לאורך זמן." }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-green-200 hover:bg-white/80 transition-colors">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-1">
                        {index + 1}
                      </div>
                      <div className="flex-1 text-right">
                        <h4 className={`font-bold text-black ${isPresenterMode ? 'text-lg' : 'text-base'}`}>
                          {item.title}:
                        </h4>
                        <p className={`text-black ${isPresenterMode ? 'text-base' : 'text-sm'} mt-1`}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className={`mt-6 p-4 bg-green-600 text-white rounded-lg text-center ${isPresenterMode ? 'text-lg' : 'text-base'}`}>
                  <p className="font-semibold">
                    כל אלה מאפשרים מעבר משלושת אזורי הקיפאון (נוחות, מלחמה, אדישות) לאזור ההזדמנות – בו מתקיים שינוי טרנספורמטיבי ויצירת ערך אמיתי.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fullscreen Guide Modal */}
        {isGuideFullscreen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="fixed inset-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-2xl animate-scale-in overflow-auto">
              <div className="p-8" dir="rtl">
                <div className="flex justify-between items-start mb-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsGuideFullscreen(false)}
                    className="bg-white hover:bg-gray-50 border-green-300"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="text-center flex-1 mr-8">
                    <h1 className="text-4xl font-bold text-black mb-4">
                      מדריך למעבר לאזור ההזדמנות
                    </h1>
                    <p className="text-2xl text-black font-medium">
                      ההתנהגויות הנדרשות כדי לנוע לאזור ההזדמנות:
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 max-w-5xl mx-auto">
                  {[
                    { title: "להגביר מודעות", desc: "לזיהוי המקום התודעתי בו אנו נמצאים." },
                    { title: "להבין קונפליקטים", desc: "לנהל אותם ככלי למידה וצמיחה." },
                    { title: "לאמץ למידה מתמשכת", desc: "סקרנות, שיתופי פעולה ויצירתיות." },
                    { title: "להציף משמעות", desc: "לקשר בין העשייה לחזון אישי וארגוני." },
                    { title: "לשדר השראה", desc: "דוגמה אישית, נרטיב ותקווה." },
                    { title: "לראות שינוי כהזדמנות", desc: "ולא כאיום." },
                    { title: "לטפח מנהיגות אותנטית", desc: "שקיפות, הקשבה ונוכחות רגשית." },
                    { title: "לבנות שותפויות", desc: "לטפח מערכות יחסים משמעותיות, להקשיב, לשתף פעולה ולייצר הדדיות לאורך זמן." }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-6 p-6 bg-white/80 rounded-xl border-2 border-green-200 hover:bg-white/90 transition-colors shadow-lg">
                      <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 text-right">
                        <h3 className="text-2xl font-bold text-black mb-3">
                          {item.title}:
                        </h3>
                        <p className="text-xl text-black leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-12 p-8 bg-green-600 text-white rounded-2xl text-center shadow-xl">
                  <p className="text-2xl font-semibold leading-relaxed">
                    כל אלה מאפשרים מעבר משלושת אזורי הקיפאון (נוחות, מלחמה, אדישות) לאזור ההזדמנות – בו מתקיים שינוי טרנספורמטיבי ויצירת ערך אמיתי.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
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
