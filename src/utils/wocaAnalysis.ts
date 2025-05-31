
// WOCA 36-question survey analysis utility with reverse scoring and Hebrew diagnosis

export interface WocaQuestion {
  id: number;
  category: 'War' | 'Apathy' | 'Comfort' | 'Opportunity';
  isReversed: boolean;
  textHebrew: string;
  textEnglish: string;
}

export interface WocaCategoryScores {
  War: number;
  Apathy: number;
  Comfort: number;
  Opportunity: number;
}

export interface WocaAnalysisResult {
  categoryScores: WocaCategoryScores;
  leadingCategory: keyof WocaCategoryScores;
  participantCount: number;
  diagnosis: string;
  recommendations: string[];
  strengths: string[];
  weaknesses: string[];
}

// WOCA 36-question mapping with reverse scoring indicators
export const WOCA_QUESTIONS: WocaQuestion[] = [
  // War Zone Questions (1-9)
  { id: 1, category: 'War', isReversed: false, textHebrew: 'אני חש/ה תחת לחץ מתמיד בעבודה', textEnglish: 'I feel under constant pressure at work' },
  { id: 2, category: 'War', isReversed: false, textHebrew: 'קיימים קונפליקטים תכופים בין חברי הצוות', textEnglish: 'There are frequent conflicts between team members' },
  { id: 3, category: 'War', isReversed: false, textHebrew: 'אני חושש/ת לבטא את דעתי בפגישות', textEnglish: 'I am afraid to express my opinion in meetings' },
  { id: 4, category: 'War', isReversed: false, textHebrew: 'התחרות בין עובדים היא קשה ולא בריאה', textEnglish: 'Competition between employees is harsh and unhealthy' },
  { id: 5, category: 'War', isReversed: false, textHebrew: 'אני מרגיש/ה שהעבודה שלי בסיכון תמידי', textEnglish: 'I feel that my job is in constant danger' },
  { id: 6, category: 'War', isReversed: false, textHebrew: 'המנהלים שלנו לא תומכים בעובדים', textEnglish: 'Our managers do not support employees' },
  { id: 7, category: 'War', isReversed: false, textHebrew: 'יש אווירה של חוסר אמון בארגון', textEnglish: 'There is an atmosphere of mistrust in the organization' },
  { id: 8, category: 'War', isReversed: false, textHebrew: 'אני עובד/ת בסביבה עוינת', textEnglish: 'I work in a hostile environment' },
  { id: 9, category: 'War', isReversed: false, textHebrew: 'השינויים בארגון מתרחשים ללא הכנה מתאימה', textEnglish: 'Changes in the organization happen without proper preparation' },

  // Apathy Zone Questions (10-18)
  { id: 10, category: 'Apathy', isReversed: false, textHebrew: 'אני מרגיש/ה מנותק/ת מהמטרות של הארגון', textEnglish: 'I feel disconnected from the organization\'s goals' },
  { id: 11, category: 'Apathy', isReversed: false, textHebrew: 'העבודה שלי חסרת משמעות', textEnglish: 'My work lacks meaning' },
  { id: 12, category: 'Apathy', isReversed: false, textHebrew: 'אין לי מספיק מידע על מה שקורה בארגון', textEnglish: 'I don\'t have enough information about what\'s happening in the organization' },
  { id: 13, category: 'Apathy', isReversed: false, textHebrew: 'אני עושה/ת את המינימום הנדרש', textEnglish: 'I do the minimum required' },
  { id: 14, category: 'Apathy', isReversed: false, textHebrew: 'אין לי הזדמנויות לפיתוח מקצועי', textEnglish: 'I have no opportunities for professional development' },
  { id: 15, category: 'Apathy', isReversed: false, textHebrew: 'אני מרגיש/ה שהדעה שלי לא חשובה', textEnglish: 'I feel that my opinion doesn\'t matter' },
  { id: 16, category: 'Apathy', isReversed: false, textHebrew: 'אין לי מוטיבציה להשקיע יותר', textEnglish: 'I have no motivation to invest more' },
  { id: 17, category: 'Apathy', isReversed: false, textHebrew: 'התקשורת בארגון לא ברורה', textEnglish: 'Communication in the organization is unclear' },
  { id: 18, category: 'Apathy', isReversed: false, textHebrew: 'אני מרגיש/ה שהעבודה שלי לא מוערכת', textEnglish: 'I feel that my work is not appreciated' },

  // Comfort Zone Questions (19-27)
  { id: 19, category: 'Comfort', isReversed: false, textHebrew: 'אני מעדיף/ה לעבוד על משימות מוכרות', textEnglish: 'I prefer to work on familiar tasks' },
  { id: 20, category: 'Comfort', isReversed: false, textHebrew: 'השגרה בעבודה נותנת לי ביטחון', textEnglish: 'The routine at work gives me security' },
  { id: 21, category: 'Comfort', isReversed: false, textHebrew: 'אני מרוצה/ה מהמצב הנוכחי בעבודה', textEnglish: 'I am satisfied with the current situation at work' },
  { id: 22, category: 'Comfort', isReversed: false, textHebrew: 'אני נוהג/ת לפעול לפי הנהלים הקיימים', textEnglish: 'I tend to follow existing procedures' },
  { id: 23, category: 'Comfort', isReversed: false, textHebrew: 'אני מעדיף/ה יציבות על פני שינוי', textEnglish: 'I prefer stability over change' },
  { id: 24, category: 'Comfort', isReversed: false, textHebrew: 'אני מרגיש/ה בטוח/ה בתפקיד הנוכחי', textEnglish: 'I feel secure in my current role' },
  { id: 25, category: 'Comfort', isReversed: false, textHebrew: 'אני מעדיף/ה לא לקחת סיכונים בעבודה', textEnglish: 'I prefer not to take risks at work' },
  { id: 26, category: 'Comfort', isReversed: false, textHebrew: 'המערכות הקיימות עובדות טוב', textEnglish: 'The existing systems work well' },
  { id: 27, category: 'Comfort', isReversed: false, textHebrew: 'אני מרוצה/ה מהקצב הנוכחי של העבודה', textEnglish: 'I am satisfied with the current pace of work' },

  // Opportunity Zone Questions (28-36)
  { id: 28, category: 'Opportunity', isReversed: false, textHebrew: 'אני מתלהב/ת מאתגרים חדשים בעבודה', textEnglish: 'I am excited by new challenges at work' },
  { id: 29, category: 'Opportunity', isReversed: false, textHebrew: 'אני מרגיש/ה שיש לי השפעה על השינויים בארגון', textEnglish: 'I feel that I have influence on changes in the organization' },
  { id: 30, category: 'Opportunity', isReversed: false, textHebrew: 'אני נהנה/ת ללמוד דברים חדשים', textEnglish: 'I enjoy learning new things' },
  { id: 31, category: 'Opportunity', isReversed: false, textHebrew: 'אני מרגיש/ה שהעבודה שלי תורמת למשהו חשוב', textEnglish: 'I feel that my work contributes to something important' },
  { id: 32, category: 'Opportunity', isReversed: false, textHebrew: 'יש לי הזדמנויות לצמיחה מקצועית', textEnglish: 'I have opportunities for professional growth' },
  { id: 33, category: 'Opportunity', isReversed: false, textHebrew: 'אני מרגיש/ת חופש לחדש ולהמציא', textEnglish: 'I feel free to innovate and invent' },
  { id: 34, category: 'Opportunity', isReversed: false, textHebrew: 'הקבוצה שלי עובדת היטב יחד', textEnglish: 'My team works well together' },
  { id: 35, category: 'Opportunity', isReversed: false, textHebrew: 'אני מרגיש/ת השראה מהעבודה שלי', textEnglish: 'I feel inspired by my work' },
  { id: 36, category: 'Opportunity', isReversed: false, textHebrew: 'יש לי תמיכה מהמנהלים שלי', textEnglish: 'I have support from my managers' }
];

// Hebrew diagnosis texts for each zone
export const ZONE_DIAGNOSIS = {
  Opportunity: {
    title: 'אזור ההזדמנות',
    description: 'חדשנות, השראה, מחוברות רגשית. זהו האזור הרצוי ביותר, המעיד על תרבות ארגונית פתוחה וצומחת.',
    implications: 'הארגון מתאפיין בסביבת עבודה תומכת, מעודדת חדשנות ומאפשרת צמיחה אישית ומקצועית. העובדים מרגישים מעורבים, מוטיבציה גבוהה ותחושת משמעות בעבודתם.',
    recommendations: [
      'שמירה על התרבות החיובית הקיימת',
      'המשך עידוד חדשנות ויצירתיות',
      'פיתוח נוסף של הזדמנויות צמיחה',
      'חיזוק התקשורת הפתוחה והתומכת'
    ]
  },
  Comfort: {
    title: 'אזור הנוחות',
    description: 'שמרנות, יציבות, תפעול. מעיד על שמירה על הקיים תוך היעדר תנופה ארגונית.',
    implications: 'הארגון פועל בצורה יציבה ותפעולית, אך חסר דינמיקה ויכולת חדשנות. העובדים מרוצים מהמצב הקיים אך עלולים להיות חסרי מוטיבציה לשינוי ושיפור.',
    recommendations: [
      'עידוד יוזמות חדשנות ושינוי',
      'יצירת אתגרים מקצועיים חדשים',
      'פיתוח תוכניות צמיחה והתפתחות',
      'עידוד קבלת סיכונים מחושבים'
    ]
  },
  Apathy: {
    title: 'אזור האדישות',
    description: 'ניתוק, בלבול, חוסר מעורבות. מעיד על חולשה ניהולית ועל אובדן משמעות בעבודה.',
    implications: 'הארגון סובל מחוסר מעורבות העובדים, תקשורת לקויה ואובדן תחושת המשמעות. זהו מצב הדורש התערבות מיידית לשיפור המצב.',
    recommendations: [
      'שיפור התקשורת הארגונית',
      'חיזוק תחושת המשמעות והמטרה',
      'עידוד מעורבות והשתתפות בקבלת החלטות',
      'פיתוח תוכניות הכרה והערכה'
    ]
  },
  War: {
    title: 'אזור המלחמה',
    description: 'פחד, קונפליקט, הישרדות. מצביע על סביבת עבודה רעילה ודחופה להתערבות.',
    implications: 'הארגון נמצא במצב קריטי של סביבת עבודה רעילה, עם רמות גבוהות של עקה, קונפליקטים ופחד. נדרשת התערבות דחופה וקיצונית.',
    recommendations: [
      'התערבות מיידית לפתרון קונפליקטים',
      'שיפור האקלים הארגוני',
      'חיזוק האמון והביטחון',
      'יישום תוכניות ניהול משברים'
    ]
  }
};

export const reverseScore = (score: number): number => {
  return 6 - score; // For 1-5 scale: 1->5, 2->4, 3->3, 4->2, 5->1
};

export const calculateWocaCategoryScores = (responses: any): WocaCategoryScores => {
  const categoryTotals = { War: 0, Apathy: 0, Comfort: 0, Opportunity: 0 };
  const categoryCounts = { War: 0, Apathy: 0, Comfort: 0, Opportunity: 0 };

  WOCA_QUESTIONS.forEach(question => {
    const response = responses[`q${question.id}`];
    if (response && typeof response === 'number') {
      const score = question.isReversed ? reverseScore(response) : response;
      categoryTotals[question.category] += score;
      categoryCounts[question.category]++;
    }
  });

  return {
    War: categoryCounts.War > 0 ? categoryTotals.War / categoryCounts.War : 0,
    Apathy: categoryCounts.Apathy > 0 ? categoryTotals.Apathy / categoryCounts.Apathy : 0,
    Comfort: categoryCounts.Comfort > 0 ? categoryTotals.Comfort / categoryCounts.Comfort : 0,
    Opportunity: categoryCounts.Opportunity > 0 ? categoryTotals.Opportunity / categoryCounts.Opportunity : 0
  };
};

export const analyzeWorkshopWoca = (participants: any[]): WocaAnalysisResult => {
  if (!participants.length) {
    return {
      categoryScores: { War: 0, Apathy: 0, Comfort: 0, Opportunity: 0 },
      leadingCategory: 'Apathy',
      participantCount: 0,
      diagnosis: '',
      recommendations: [],
      strengths: [],
      weaknesses: []
    };
  }

  // Calculate average scores for each category across all participants
  const totalCategoryScores = { War: 0, Apathy: 0, Comfort: 0, Opportunity: 0 };
  let validParticipants = 0;

  participants.forEach(participant => {
    if (participant.question_responses) {
      const categoryScores = calculateWocaCategoryScores(participant.question_responses);
      totalCategoryScores.War += categoryScores.War;
      totalCategoryScores.Apathy += categoryScores.Apathy;
      totalCategoryScores.Comfort += categoryScores.Comfort;
      totalCategoryScores.Opportunity += categoryScores.Opportunity;
      validParticipants++;
    }
  });

  const avgCategoryScores: WocaCategoryScores = {
    War: validParticipants > 0 ? totalCategoryScores.War / validParticipants : 0,
    Apathy: validParticipants > 0 ? totalCategoryScores.Apathy / validParticipants : 0,
    Comfort: validParticipants > 0 ? totalCategoryScores.Comfort / validParticipants : 0,
    Opportunity: validParticipants > 0 ? totalCategoryScores.Opportunity / validParticipants : 0
  };

  // Find leading category
  const leadingCategory = Object.entries(avgCategoryScores).reduce((a, b) => 
    avgCategoryScores[a[0] as keyof WocaCategoryScores] > avgCategoryScores[b[0] as keyof WocaCategoryScores] ? a : b
  )[0] as keyof WocaCategoryScores;

  const diagnosis = ZONE_DIAGNOSIS[leadingCategory];

  // Generate strengths and weaknesses based on scores
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (avgCategoryScores.Opportunity > 3.5) strengths.push('רמת הזדמנויות גבוהה - חדשנות ומוטיבציה');
  if (avgCategoryScores.Comfort > 3.5) strengths.push('יציבות תפעולית גבוהה');
  if (avgCategoryScores.Apathy > 3.0) weaknesses.push('רמת אדישות מוגברת - נדרש שיפור מעורבות');
  if (avgCategoryScores.War > 2.5) weaknesses.push('קיימים אלמנטים של קונפליקט וחוסר ביטחון');

  return {
    categoryScores: avgCategoryScores,
    leadingCategory,
    participantCount: validParticipants,
    diagnosis: diagnosis.implications,
    recommendations: diagnosis.recommendations,
    strengths,
    weaknesses
  };
};
