
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ZoneDescriptionProps {
  zone: string;
  isPresenterMode?: boolean;
}

const zoneDescriptions = {
  war: {
    icon: '🌑',
    title: 'War – תודעה של אזור מלחמה (WIN/lose)',
    description: `הארגון פועל מתוך תודעה הישרדותית המתאפיינת במאבק על שליטה, מיקוד באגו, וחתירה מתמדת לניצחון – גם במחיר של פגיעה באחר. תרבות כזו מעודדת תחרותיות קיצונית, פוליטיקה ארגונית וחשדנות. אין הקשבה אמתית ואין שיתוף; מתקיימת נטייה לייצר דינמיקה של צד צודק מול צד טועה.

זהו מצב שבו מתקבלות החלטות מתוך תגובתיות ולא מתוך בחירה אסטרטגית. הארגון אמנם שורד, אך במחיר כבד של שחיקה, ניכור וחוסר קיימות. מדובר במערכת הפועלת במודל WIN/lose – צד אחד "מנצח", אך כולם משלמים את המחיר.`
  },
  opportunity: {
    icon: '🌕',
    title: 'Opportunity – תודעה של אזור ההזדמנות (WIN/WIN)',
    description: `זהו המצב התודעתי האידיאלי עבור ארגונים המבקשים לייצר ערך משותף, להתפתח, ולנוע לעבר עתיד בעל משמעות.

הארגון נמצא בתודעה פתוחה, סקרנית ומחוברת. מתקיימת הקשבה הדדית, יכולת ללמוד מטעויות, דיאלוג אותנטי ויכולת להכיל מורכבויות. המנהלים והעובדים פועלים מתוך תחושת שליחות וחיבור לחזון משותף – תוך שאיפה לאיזון בין אחריות אישית לאחריות מערכתית (Accountability).

במצב זה יש נכונות לאמץ יוזמות חדשות, לשתף ידע, להתמודד עם קונפליקטים באופן בונה, ולהניע שינוי אמיתי. זהו מצב של WIN/WIN – כל בעלי העניין מרוויחים, ותחושת המשמעות הארגונית מתעצמת.`
  },
  comfort: {
    icon: '🌘',
    title: 'Comfort – תודעה של אזור נוחות (LOSE/LOSE)',
    description: `הארגון מתפקד במצב של שימור הקיים, הימנעות משינויים, וחוסר מוכנות להיכנס לשיח מורכב או מאתגר.

במקום חשיבה פרואקטיבית, המערכת בוחרת ביציבות לכאורה – שמובילה בפועל לקיפאון. היוזמות נדחות בשקט, רעיונות חדשים אינם זוכים למרחב, והלמידה כמעט ולא מתקיימת.

מתרחשת הימנעות מ"קונפליקט בונה" – שהוא מנוע קריטי להתפתחות.

תרבות כזו יוצרת עייפות ארגונית ותחושת חוסר רלוונטיות. הארגון מאבד קשר עם החזון ועם השטח כאחד. מדובר במצב של LOSE/LOSE – כולם מפסידים: העובדים, ההנהלה והמערכת כולה.`
  },
  apathy: {
    icon: '🌑',
    title: 'Apathy – תודעה של אזור אדישות (LOSE/LOSE)',
    description: `תודעה ארגונית נמוכה המאופיינת בניתוק רגשי, חוסר מחוברות לערכים, והיעדר חוויית שליחות.

עובדים פועלים ממקום טכני בלבד, אין יוזמות, ואין תחושת מסוגלות להשפיע.

היעדר הקשבה, דינמיקה של "אין טעם", ותחושת סטגנציה עמוקה שולטת. זהו מצב בו אין מנהיגות אמיתית – לא פורמלית ולא אותנטית – והארגון שוקע לאדישות משותקת.

אזור זה מייצג את הנקודה הרחוקה ביותר מהתפתחות טרנספורמטיבית, וכל שותף בו נפגע. מדובר במצב מובהק של LOSE/LOSE.`
  }
};

const opportunityJustification = {
  icon: '🔷',
  title: 'מדוע אזור ההזדמנות הוא אידיאלי?',
  description: `אזור ההזדמנות מייצג איזון נדיר בין יוזמה לאחריות, בין יצירתיות לבקרה, ובין הישגיות לשיתוף פעולה.

זהו המרחב שבו הארגון מסוגל ליזום שינוי, לנהל קונפליקטים באופן בונה, ולנוע לעבר עתיד משמעותי ובר־קיימא.

תרבות ארגונית המתבססת על ערכים אלו אינה רק אפקטיבית יותר – היא גם עמידה, חדשנית ובעלת השפעה חיובית על עובדיה ועל סביבתה.`
};

export const ZoneDescription: React.FC<ZoneDescriptionProps> = ({
  zone,
  isPresenterMode = false
}) => {
  const zoneInfo = zoneDescriptions[zone as keyof typeof zoneDescriptions];
  
  if (!zoneInfo) return null;

  const textSize = isPresenterMode ? 'text-lg' : 'text-base';
  const titleSize = isPresenterMode ? 'text-2xl' : 'text-lg';
  const spacing = isPresenterMode ? 'space-y-6' : 'space-y-4';

  return (
    <div className={spacing}>
      <Card className={isPresenterMode ? 'border-2' : ''}>
        <CardContent className={isPresenterMode ? 'p-8' : 'p-6'}>
          <div className={`${spacing} text-center`}>
            <h3 className={`${titleSize} font-bold mb-4`}>
              {zoneInfo.icon} {zoneInfo.title}
            </h3>
            <div className={`${textSize} leading-relaxed text-gray-700 whitespace-pre-line text-right`}>
              {zoneInfo.description}
            </div>
          </div>
        </CardContent>
      </Card>

      {zone === 'opportunity' && (
        <Card className={isPresenterMode ? 'border-2 border-blue-200 bg-blue-50' : 'bg-blue-50'}>
          <CardContent className={isPresenterMode ? 'p-8' : 'p-6'}>
            <div className={`${spacing} text-center`}>
              <h3 className={`${titleSize} font-bold mb-4 text-blue-800`}>
                {opportunityJustification.icon} {opportunityJustification.title}
              </h3>
              <div className={`${textSize} leading-relaxed text-blue-700 whitespace-pre-line text-right`}>
                {opportunityJustification.description}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
