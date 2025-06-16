
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, Eye, EyeOff, Download, AlertCircle } from 'lucide-react';

interface WocaZoneSectionProps {
  wocaAnalysis: any;
  isPresenterMode: boolean;
  showNames: boolean;
  onToggleNames: () => void;
  onExportData: () => void;
}

export const WocaZoneSection: React.FC<WocaZoneSectionProps> = ({
  wocaAnalysis,
  isPresenterMode,
  showNames,
  onToggleNames,
  onExportData
}) => {
  const getZoneInfo = (zone: string | null) => {
    if (!zone) return {
      name: 'לא זוהה',
      color: 'bg-gray-500',
      description: 'לא ניתן לזהות אזור דומיננטי'
    };
    
    const zoneDescriptions = {
      opportunity: { 
        name: 'אזור ההזדמנות', 
        color: 'bg-green-500',
        description: 'ארגון הפועל מתוך תודעה של הזדמנות הוא ארגון פתוח, לומד וגמיש, שמזהה שינוי כהזדמנות ולא כאיום. מערכות היחסים בו מבוססות על הקשבה הדדית, יצירתיות, חשיבה לטווח ארוך ושיתוף פעולה בין יחידות. מדובר בארגון שמסוגל לנווט אל עבר "אוקיינוסים כחולים" בזכות תרבות של סקרנות, בחינת חלופות וחיפוש אחר משמעות. זהו המרחב היחיד שבו מתאפשרת דינמיקה של Win/Win – כולם מרוויחים דרך חיבור, ערכים וראייה מערכתית.'
      },
      comfort: { 
        name: 'אזור הנוחות', 
        color: 'bg-blue-500',
        description: 'ארגון המצוי באזור הנוחות מתאפיין בשימור השגרה ובהימנעות משינויים. קיימת תחושת איום מפני יוזמות חדשות, והמערכת כולה נוטה לקפוא על שמריה. היעדר יוזמה, רצון להישאר במוכר והתנגדות עקבית לתנועה קדימה, יוצרים תרבות של קיפאון. בתודעה זו, הארגון פועל במצב של Lose/Lose – לא מושגת פריצת דרך, והמערכת שוקעת בתחזוקה ולא בצמיחה.'
      },
      apathy: { 
        name: 'אזור האדישות', 
        color: 'bg-yellow-500',
        description: 'אזור האדישות מייצג מצב תודעתי ארגוני של ניתוק, חוסר תקווה ודכדוך. בארגון כזה אין הקשבה, אין יוזמה, ואין אמונה ביכולת לשנות או להשפיע. התחושות המרכזיות הן של עייפות, חוסר תכלית ותחושת אין־אונים קולקטיבית. זוהי תרבות ארגונית מקובעת, חסרת תנועה, שבה גם הפרטים וגם המערכת כולה שוקעים במצב של Lose/Lose – הפסד הדדי, חוסר ערך, וחוסר התקדמות.'
      },
      war: { 
        name: 'אזור המלחמה', 
        color: 'bg-red-500',
        description: 'כאשר ארגון פועל מתוך תודעה של מלחמה, הוא מתאפיין באווירה של עימות, תחרותיות פנימית, וניסיון מתמיד "לנצח" על חשבון אחרים. יחסי העבודה בו נוקשים, התקשורת סגורה, והדגש מושם על שליטה, צודקות וכוחניות. זוהי תרבות של הקשבה עצמית בלבד, שבה כל שינוי נתפס כאיום, ולא כהזדמנות. במצב זה, הארגון פועל מתוך לוגיקת Win/Lose – הצלחת אחד באה תמיד על חשבון האחר, מה שמוביל לשחיקה וחוסר אמון בין יחידות וצוותים.'
      }
    };
    
    const zoneDesc = zoneDescriptions[zone as keyof typeof zoneDescriptions] || { 
      name: 'לא זוהה', 
      color: 'bg-gray-500',
      description: 'לא ניתן לזהות אזור דומיננטי'
    };
    
    return zoneDesc;
  };

  const zoneInfo = wocaAnalysis ? getZoneInfo(wocaAnalysis.groupDominantZone) : null;

  return (
    <Card className={`${isPresenterMode ? 'border-2 border-green-200' : ''}`}>
      <CardContent className={isPresenterMode ? 'p-12' : 'p-8'}>
        <div className="text-center space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-3xl font-bold text-green-800 text-center flex-1 ${isPresenterMode ? 'text-4xl' : ''}`}>
              <Lightbulb className="h-8 w-8 ml-2 inline" />
              סיווג אזור WOCA
            </h3>
            {!isPresenterMode && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={onToggleNames}>
                  {showNames ? <EyeOff className="h-4 w-4 ml-2" /> : <Eye className="h-4 w-4 ml-2" />}
                  {showNames ? 'הסתר שמות' : 'הצג שמות'}
                </Button>
                <Button variant="outline" size="sm" onClick={onExportData}>
                  <Download className="h-4 w-4 ml-2" />
                  ייצא ניתוח
                </Button>
              </div>
            )}
          </div>

          {wocaAnalysis?.groupIsTie ? (
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-yellow-500 ml-2" />
                <span className={`font-semibold ${isPresenterMode ? 'text-2xl' : 'text-lg'}`}>תיקו בין אזורים</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {wocaAnalysis.groupTiedCategories.map((category: string) => {
                  const categoryZoneInfo = getZoneInfo(category);
                  return (
                    <Badge 
                      key={category} 
                      variant="secondary" 
                      className={`px-3 py-1 ${categoryZoneInfo.color} text-white ${isPresenterMode ? 'text-lg' : 'text-sm'}`}
                    >
                      {categoryZoneInfo.name}
                    </Badge>
                  );
                })}
              </div>
              <p className={`text-gray-600 mt-4 text-lg leading-relaxed text-right ${isPresenterMode ? 'text-xl' : ''}`}>
                לא זוהה אזור תודעה דומיננטי עקב ציונים זהים
              </p>
            </div>
          ) : zoneInfo && (
            <div className="bg-green-50 p-6 rounded-lg">
              <Badge 
                variant="secondary" 
                className={`px-6 py-3 ${zoneInfo.color} text-white mb-6 ${isPresenterMode ? 'text-4xl font-black' : 'text-3xl font-bold'}`}
              >
                {zoneInfo.name}
              </Badge>
              <div className={`${isPresenterMode ? 'text-2xl' : 'text-lg'} text-gray-600 mb-6`}>
                אזור תודעה ארגונית ({wocaAnalysis.participantCount} משתתפים)
              </div>

              {/* Zone Full Paragraph Description */}
              <div className={`text-lg leading-relaxed text-green-700 text-right px-4 mt-6 ${isPresenterMode ? 'text-xl' : ''}`}>
                {zoneInfo.description}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
