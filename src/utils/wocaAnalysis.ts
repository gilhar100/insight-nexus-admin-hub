
export interface WocaQuestionMapping {
  [key: string]: {
    category: 'war' | 'opportunity' | 'comfort' | 'apathy';
    isReversed: boolean;
    text: string;
  };
}

// WOCA question mapping based on the provided categorization
export const WOCA_QUESTION_MAPPING: WocaQuestionMapping = {
  // WAR category (all reversed questions)
  'q1': { category: 'war', isReversed: true, text: 'פעמים רבות לא ברור לאן הארגון שואף להגיע' },
  'q2': { category: 'war', isReversed: true, text: 'שינויים בארגון מתקבלים בקושי רב' },
  'q3': { category: 'war', isReversed: true, text: 'העובדים נרתעים מהבעת ביקורת או הצגת חלופות' },
  'q4': { category: 'war', isReversed: true, text: 'העובדים חשים שהמנהלים לא קשובים לצרכים שלהם' },
  'q5': { category: 'war', isReversed: true, text: 'נהוג להסתיר בעיות כדי להימנע מעימותים' },
  'q6': { category: 'war', isReversed: true, text: 'תהליך קבלת ההחלטות אינו כולל שיח פתוח עם עובדים' },
  'q7': { category: 'war', isReversed: true, text: 'קיימת תחושת ניתוק בין הנהלה לעובדים' },
  'q8': { category: 'war', isReversed: true, text: 'הארגון מתקשה להסתגל לשינויים חיצוניים' },
  'q9': { category: 'war', isReversed: true, text: 'יש מחסור בבהירות לגבי כיווני פעולה ארגוניים' },

  // OPPORTUNITY category (no reversed questions)
  'q10': { category: 'opportunity', isReversed: false, text: 'העובדים מרגישים חופשיים לשתף רעיונות גם אם הם יוצאי דופן' },
  'q11': { category: 'opportunity', isReversed: false, text: 'קיימת תקשורת פתוחה בגובה העיניים בין מנהלים לעובדים' },
  'q12': { category: 'opportunity', isReversed: false, text: 'הנהלת הארגון מגדירה חזון מעורר השראה' },
  'q13': { category: 'opportunity', isReversed: false, text: 'שיתוף פעולה בין צוותים מוביל לרעיונות חדשים' },
  'q14': { category: 'opportunity', isReversed: false, text: 'נהוג להציג את הסיפור שמאחורי ההחלטות' },
  'q15': { category: 'opportunity', isReversed: false, text: 'תחושת האמון בארגון גבוהה' },
  'q16': { category: 'opportunity', isReversed: false, text: 'הארגון פועל מתוך ראייה רחבה של עתיד משתנה' },
  'q17': { category: 'opportunity', isReversed: false, text: 'חוסר ודאות נתפסת כהזדמנות ללמידה' },
  'q18': { category: 'opportunity', isReversed: false, text: 'נהוג לשקול מגוון של חלופות לפני קבלת החלטה' },

  // COMFORT category (mixed - some reversed)
  'q19': { category: 'comfort', isReversed: false, text: 'בארגון קיימת מחויבות לתרומה שמעבר למטרות אישיות' },
  'q20': { category: 'comfort', isReversed: false, text: 'קיימת תחושת משמעות רחבה בעבודת היומיום' },
  'q21': { category: 'comfort', isReversed: true, text: 'העובדים נמנעים משיח ערכי בנוגע לעבודתם' },
  'q22': { category: 'comfort', isReversed: true, text: 'אין מוטיבציה ליזום או להציע דרכי פעולה חדשות' },
  'q23': { category: 'comfort', isReversed: false, text: 'לעובדים קל להביע תחושות ורעיונות אישיים' },
  'q24': { category: 'comfort', isReversed: true, text: 'לא מקדישים זמן ללמידה ושיפור' },
  'q25': { category: 'comfort', isReversed: false, text: 'תחושת השייכות בארגון חזקה ומחברת' },
  'q26': { category: 'comfort', isReversed: false, text: 'הארגון מדגיש מטרות ארגוניות עם ערך חברתי' },
  'q27': { category: 'comfort', isReversed: true, text: 'תחושת שליחות אישית אינה מקבלת ביטוי' },

  // APATHY category (mixed - some reversed)
  'q28': { category: 'apathy', isReversed: true, text: 'לא נהוג לשתף בהצלחות או בכישלונות כדי ללמוד מהן' },
  'q29': { category: 'apathy', isReversed: false, text: 'ההנהלה מתנהלת בשקיפות מלאה' },
  'q30': { category: 'apathy', isReversed: false, text: 'קיימת אווירה של סקרנות וחיפוש ידע חדש' },
  'q31': { category: 'apathy', isReversed: false, text: 'הארגון מעודד התפתחות אישית של כל עובד' },
  'q32': { category: 'apathy', isReversed: true, text: 'לא מקיימים שיחות עומק עם העובדים על מטרותיהם' },
  'q33': { category: 'apathy', isReversed: false, text: 'השראה היא חלק בלתי נפרד מהתרבות הארגונית' },
  'q34': { category: 'apathy', isReversed: false, text: 'בארגון יודעים לנהל קונפליקטים באופן בונה' },
  'q35': { category: 'apathy', isReversed: false, text: 'יש נכונות אמיתית להקשיב לדעות שונות' },
  'q36': { category: 'apathy', isReversed: false, text: 'המנהיגים מציגים דוגמה אישית' }
};

export interface WocaCategoryScores {
  war: number;
  opportunity: number;
  comfort: number;
  apathy: number;
}

export interface WocaAnalysisResult {
  categoryScores: WocaCategoryScores;
  dominantZone: string | null;
  isTie: boolean;
  tiedCategories: string[];
  participantName: string;
  participantId: string;
}

export interface WorkshopWocaAnalysis {
  workshopId: number;
  groupCategoryScores: WocaCategoryScores;
  groupDominantZone: string | null;
  groupIsTie: boolean;
  groupTiedCategories: string[];
  participants: WocaAnalysisResult[];
  participantCount: number;
}

// Reverse score a value (1->5, 2->4, 3->3, 4->2, 5->1)
export const reverseScore = (score: number): number => {
  return 6 - score;
};

// Calculate WOCA category scores for a single participant
export const calculateWocaCategoryScores = (questionResponses: any): WocaCategoryScores => {
  const categoryTotals = { war: 0, opportunity: 0, comfort: 0, apathy: 0 };
  const categoryCounts = { war: 0, opportunity: 0, comfort: 0, apathy: 0 };

  // Process each question response
  Object.entries(WOCA_QUESTION_MAPPING).forEach(([questionKey, questionInfo]) => {
    const responseKey = questionKey; // Assuming responses are stored as q1, q2, etc.
    let score = questionResponses[responseKey];
    
    if (score !== null && score !== undefined && !isNaN(score)) {
      // Apply reverse scoring if needed
      if (questionInfo.isReversed) {
        score = reverseScore(score);
      }
      
      categoryTotals[questionInfo.category] += score;
      categoryCounts[questionInfo.category]++;
    }
  });

  // Calculate averages for each category
  const categoryScores: WocaCategoryScores = {
    war: categoryCounts.war > 0 ? categoryTotals.war / categoryCounts.war : 0,
    opportunity: categoryCounts.opportunity > 0 ? categoryTotals.opportunity / categoryCounts.opportunity : 0,
    comfort: categoryCounts.comfort > 0 ? categoryTotals.comfort / categoryCounts.comfort : 0,
    apathy: categoryCounts.apathy > 0 ? categoryTotals.apathy / categoryCounts.apathy : 0
  };

  return categoryScores;
};

// Determine dominant zone and handle ties
export const getDominantZone = (categoryScores: WocaCategoryScores): {
  dominantZone: string | null;
  isTie: boolean;
  tiedCategories: string[];
} => {
  const categories = Object.entries(categoryScores);
  const maxScore = Math.max(...categories.map(([_, score]) => score));
  
  if (maxScore === 0) {
    return { dominantZone: null, isTie: false, tiedCategories: [] };
  }
  
  const topCategories = categories
    .filter(([_, score]) => score === maxScore)
    .map(([category, _]) => category);
  
  if (topCategories.length > 1) {
    return {
      dominantZone: null,
      isTie: true,
      tiedCategories: topCategories
    };
  }
  
  return {
    dominantZone: topCategories[0],
    isTie: false,
    tiedCategories: []
  };
};

// Analyze single participant
export const analyzeParticipantWoca = (
  participant: any,
  participantName: string,
  participantId: string
): WocaAnalysisResult => {
  const categoryScores = calculateWocaCategoryScores(participant.question_responses || {});
  const { dominantZone, isTie, tiedCategories } = getDominantZone(categoryScores);
  
  return {
    categoryScores,
    dominantZone,
    isTie,
    tiedCategories,
    participantName,
    participantId
  };
};

// Analyze entire workshop
export const analyzeWorkshopWoca = (participants: any[], workshopId: number): WorkshopWocaAnalysis => {
  const participantAnalyses: WocaAnalysisResult[] = [];
  
  // Analyze each participant
  participants.forEach((participant, index) => {
    const analysis = analyzeParticipantWoca(
      participant,
      participant.full_name || `Participant ${index + 1}`,
      participant.id
    );
    participantAnalyses.push(analysis);
  });
  
  // Calculate group averages
  const groupTotals = { war: 0, opportunity: 0, comfort: 0, apathy: 0 };
  const validParticipants = participantAnalyses.filter(p => 
    p.categoryScores.war > 0 || p.categoryScores.opportunity > 0 || 
    p.categoryScores.comfort > 0 || p.categoryScores.apathy > 0
  );
  
  if (validParticipants.length > 0) {
    validParticipants.forEach(participant => {
      groupTotals.war += participant.categoryScores.war;
      groupTotals.opportunity += participant.categoryScores.opportunity;
      groupTotals.comfort += participant.categoryScores.comfort;
      groupTotals.apathy += participant.categoryScores.apathy;
    });
    
    Object.keys(groupTotals).forEach(key => {
      groupTotals[key as keyof typeof groupTotals] /= validParticipants.length;
    });
  }
  
  const groupCategoryScores: WocaCategoryScores = {
    war: groupTotals.war,
    opportunity: groupTotals.opportunity,
    comfort: groupTotals.comfort,
    apathy: groupTotals.apathy
  };
  
  const { dominantZone: groupDominantZone, isTie: groupIsTie, tiedCategories: groupTiedCategories } = 
    getDominantZone(groupCategoryScores);
  
  return {
    workshopId,
    groupCategoryScores,
    groupDominantZone,
    groupIsTie,
    groupTiedCategories,
    participants: participantAnalyses,
    participantCount: participants.length
  };
};

// Hebrew zone descriptions
export const getZoneDescription = (zone: string): {
  name: string;
  description: string;
  implications: string;
  tone: string;
} => {
  const descriptions = {
    opportunity: {
      name: 'אזור ההזדמנות',
      description: 'חדשנות, השראה, מחוברות רגשית',
      implications: 'זהו האזור הרצוי ביותר, המעיד על תרבות ארגונית פתוחה וצומחת.',
      tone: 'חיובי ומעורר השראה'
    },
    comfort: {
      name: 'אזור הנוחות',
      description: 'שמרנות, יציבות, תפעול',
      implications: 'מעיד על שמירה על הקיים תוך היעדר תנופה ארגונית.',
      tone: 'יציב אך חסר דינמיות'
    },
    apathy: {
      name: 'אזור האדישות',
      description: 'ניתוק, בלבול, חוסר מעורבות',
      implications: 'מעיד על חולשה ניהולית ועל אובדן משמעות בעבודה.',
      tone: 'מדאיג ודורש התערבות'
    },
    war: {
      name: 'אזור המלחמה',
      description: 'פחד, קונפליקט, הישרדות',
      implications: 'מצביע על סביבת עבודה רעילה ודחופה להתערבות.',
      tone: 'קריטי ודורש פעולה מיידית'
    }
  };
  
  return descriptions[zone as keyof typeof descriptions] || {
    name: 'לא זוהה',
    description: 'לא ניתן לזהות אזור דומיננטי',
    implications: 'יש צורך בניתוח נוסף',
    tone: 'לא ברור'
  };
};
