
// Hebrew constants for WOCA analysis
export const WOCA_ZONES_HEBREW = {
  WAR: 'מלחמה',
  OPPORTUNITY: 'הזדמנות', 
  COMFORT: 'נוחות',
  APATHY: 'אדישות'
};

export const WOCA_INDICATORS_HEBREW = {
  willingness: 'נכונות',
  opportunity: 'הזדמנות',
  capability: 'יכולת', 
  anxiety: 'חרדה'
};

export const getHebrewZoneInfo = (score: number) => {
  if (score >= 4.2) return { 
    name: WOCA_ZONES_HEBREW.OPPORTUNITY, 
    color: 'bg-green-500', 
    description: 'חדשנות, מוטיבציה, השראה',
    explanation: 'קבוצה באזור ההזדמנות מתאפיינת ברמה גבוהה של מוטיבציה פנימית, פתיחות לרעיונות חדשים ויכולת לראות אפשרויות בכל מצב. חברי הקבוצה פעילים, יוזמים ומוכנים לקחת סיכונים מחושבים.',
    recommendations: 'המלצות: עודדו יוזמות חדשות, תנו אוטונומיה וחופש פעולה, הציבו אתגרים משמעותיים ותמכו בפרויקטים חדשניים.'
  };
  if (score >= 3.4) return { 
    name: WOCA_ZONES_HEBREW.COMFORT, 
    color: 'bg-blue-500', 
    description: 'יציבות, תפעול, שמרנות',
    explanation: 'קבוצה באזור הנוחות פועלת בצורה יעילה ויציבה, מקפידה על תהליכים ונוהלים. יש ביטחון ובטיחות, אך ייתכן חוסר נכונות לשינויים דרסטיים.',
    recommendations: 'המלצות: הציגו שינויים הדרגתיים, שמרו על מסגרות מוכרות תוך הוספת אלמנטים חדשים, חזקו את התחושה של ביטחון ויציבות.'
  };
  if (score >= 2.6) return { 
    name: WOCA_ZONES_HEBREW.APATHY, 
    color: 'bg-yellow-500', 
    description: 'ניתוק, אדישות, בלבול',
    explanation: 'קבוצה באזור האדישות מתאפיינת בחוסר מעורבות, אדישות למטרות הארגון וחוסר בהירות לגבי התפקיד והציפיות. עלולה להיות תחושה של חוסר משמעות.',
    recommendations: 'המלצות: בהירו מטרות וציפיות, חזקו את החיבור למשמעות העבודה, שפרו תקשורת ומעורבות, הציגו הצלחות קטנות לבניית מומנטום.'
  };
  return { 
    name: WOCA_ZONES_HEBREW.WAR, 
    color: 'bg-red-500', 
    description: 'קונפליקט, הישרדות, פחד',
    explanation: 'קבוצה באזור המלחמה נמצאת במצב של לחץ גבוה, קונפליקטים פנימיים ותחושת איום. מצב זה דורש התערבות מיידית וטיפול בגורמי הלחץ.',
    recommendations: 'המלצות: טפלו מיידית בקונפליקטים, הפחיתו לחצים מיותרים, חזקו תחושת ביטחון ותמיכה, שפרו תקשורת פתוחה וכנה.'
  };
};

export const CHART_LABELS_HEBREW = {
  scoreDistribution: 'התפלגות ציונים',
  participantsCount: 'מספר משתתפים',
  wocaIndicators: 'מדדי WOCA',
  averageScore: 'ציון ממוצע',
  consciousnessZone: 'אזור תודעתי',
  groupAnalysis: 'ניתוח קבוצתי',
  individualAnalysis: 'ניתוח אישי'
};
