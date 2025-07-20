
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ZoneExplanationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  zone: string | null;
}

const zoneExplanations = {
  opportunity: {
    icon: '🌕',
    title: 'אזור ההזדמנות (WIN/WIN)',
    description: `זהו המצב התודעתי האידיאלי עבור ארגונים המבקשים לייצר ערך משותף, להתפתח, ולנוע לעבר עתיד בעל משמעות.

הארגון נמצא בתודעה פתוחה, סקרנית ומחוברת. מתקיימת הקשבה הדדית, יכולת ללמוד מטעויות, דיאלוג אותנטי ויכולת להכיל מורכבויות. המנהלים והעובדים פועלים מתוך תחושת שליחות וחיבור לחזון משותף – תוך שאיפה לאיזון בין אחריות אישית לאחריות מערכתית.

במצב זה יש נכונות לאמץ יוזמות חדשות, לשתף ידע, להתמודד עם קונפליקטים באופן בונה, ולהניע שינוי אמיתי. זהו מצב של WIN/WIN – כל בעלי העניין מרוויחים, ותחושת המשמעות הארגונית מתעצמת.`
  },
  comfort: {
    icon: '🌘',
    title: 'אזור הנוחות (LOSE/LOSE)',
    description: `הארגון מתפקד במצב של שימור הקיים, הימנעות משינויים, וחוסר מוכנות להיכנס לשיח מורכב או מאתגר.

במקום חשיבה פרואקטיבית, המערכת בוחרת ביציבות לכאורה – שמובילה בפועל לקיפאון. היוזמות נדחות בשקט, רעיונות חדשים אינם זוכים למרחב, והלמידה כמעט ולא מתקיימת.

מתרחשת הימנעות מ"קונפליקט בונה" – שהוא מנוע קריטי להתפתחות.

תרבות כזו יוצרת עייפות ארגונית ותחושת חוסר רלוונטיות. הארגון מאבד קשר עם החזון ועם השטח כאחד. מדובר במצב של LOSE/LOSE – כולם מפסידים: העובדים, ההנהלה והמערכת כולה.`
  },
  apathy: {
    icon: '🌑',
    title: 'אזור האדישות (LOSE/LOSE)',
    description: `תודעה ארגונית נמוכה המאופיינת בניתוק רגשי, חוסר מחוברות לערכים, והיעדר חוויית שליחות.

עובדים פועלים ממקום טכני בלבד, אין יוזמות, ואין תחושת מסוגלות להשפיע.

היעדר הקשבה, דינמיקה של "אין טעם", ותחושת סטגנציה עמוקה שולטת. זהו מצב בו אין מנהיגות אמיתית – לא פורמלית ולא אותנטית – והארגון שוקע לאדישות משותקת.

אזור זה מייצג את הנקודה הרחוקה ביותר מהתפתחות טרנספורמטיבית, וכל שותף בו נפגע. מדובר במצב מובהק של LOSE/LOSE.`
  },
  war: {
    icon: '🌑',
    title: 'אזור המלחמה (WIN/LOSE)',
    description: `הארגון פועל מתוך תודעה הישרדותית המתאפיינת במאבק על שליטה, מיקוד באגו, וחתירה מתמדת לניצחון – גם במחיר של פגיעה באחר. תרבות כזו מעודדת תחרותיות קיצונית, פוליטיקה ארגונית וחשדנות. אין הקשבה אמתית ואין שיתוף; מתקיימת נטייה לייצר דינמיקה של צד צודק מול צד טועה.

זהו מצב שבו מתקבלות החלטות מתוך תגובתיות ולא מתוך בחירה אסטרטגית. הארגון אמנם שורד, אך במחיר כבד של שחיקה, ניכור וחוסר קיימות. מדובר במערכת הפועלת במודל WIN/LOSE – צד אחד "מנצח", אך כולם משלמים את המחיר.`
  }
};

export const ZoneExplanationDialog: React.FC<ZoneExplanationDialogProps> = ({
  isOpen,
  onClose,
  zone
}) => {
  if (!zone || !zoneExplanations[zone as keyof typeof zoneExplanations]) {
    return null;
  }

  const zoneInfo = zoneExplanations[zone as keyof typeof zoneExplanations];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-right flex items-center justify-center">
            {zoneInfo.icon} {zoneInfo.title}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-6 text-lg leading-relaxed text-gray-700 text-right whitespace-pre-line">
          {zoneInfo.description}
        </div>
      </DialogContent>
    </Dialog>
  );
};
