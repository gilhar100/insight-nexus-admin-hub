export interface WocaQuestionMapping {
  [key: string]: {
    category: 'war' | 'opportunity' | 'comfort' | 'apathy';
    isReversed: boolean;
    text: string;
  };
}

// WOCA question mapping based on the provided categorization
export const WOCA_QUESTION_MAPPING: WocaQuestionMapping = {
  // OPPORTUNITY category → Questions: 1, 3, 5, 10, 13, 19, 21, 24, 35
  'q1': { category: 'opportunity', isReversed: false, text: 'העובדים מרגישים חופשיים לשתף רעיונות גם אם הם יוצאי דופן' },
  'q3': { category: 'opportunity', isReversed: false, text: 'הנהלת הארגון מגדירה חזון מעורר השראה' },
  'q5': { category: 'opportunity', isReversed: false, text: 'נהוג להציג את הסיפור שמאחורי ההחלטות' },
  'q10': { category: 'opportunity', isReversed: false, text: 'קיימת תקשורת פתוחה בגובה העיניים בין מנהלים לעובדים' },
  'q13': { category: 'opportunity', isReversed: false, text: 'שיתוף פעולה בין צוותים מוביל לרעיונות חדשים' },
  'q19': { category: 'opportunity', isReversed: false, text: 'תחושת האמון בארגון גבוהה' },
  'q21': { category: 'opportunity', isReversed: false, text: 'הארגון פועל מתוך ראייה רחבה של עתיד משתנה' },
  'q24': { category: 'opportunity', isReversed: false, text: 'חוסר ודאות נתפסת כהזדמנות ללמידה' },
  'q35': { category: 'opportunity', isReversed: false, text: 'נהוג לשקול מגוון של חלופות לפני קבלת החלטה' },

  // WAR category → Questions: 2, 4, 6, 14, 18, 22, 26, 30, 36 (all reversed)
  'q2': { category: 'war', isReversed: true, text: 'פעמים רבות לא ברור לאן הארגון שואף להגיע' },
  'q4': { category: 'war', isReversed: true, text: 'שינויים בארגון מתקבלים בקושי רב' },
  'q6': { category: 'war', isReversed: true, text: 'העובדים נרתעים מהבעת ביקורת או הצגת חלופות' },
  'q14': { category: 'war', isReversed: true, text: 'העובדים חשים שהמנהלים לא קשובים לצרכים שלהם' },
  'q18': { category: 'war', isReversed: true, text: 'נהוג להסתיר בעיות כדי להימנע מעימותים' },
  'q22': { category: 'war', isReversed: true, text: 'תהליך קבלת ההחלטות אינו כולל שיח פתוח עם עובדים' },
  'q26': { category: 'war', isReversed: true, text: 'קיימת תחושת ניתוק בין הנהלה לעובדים' },
  'q30': { category: 'war', isReversed: true, text: 'הארגון מתקשה להסתגל לשינויים חיצוניים' },
  'q36': { category: 'war', isReversed: true, text: 'יש מחסור בבהירות לגבי כיווני פעולה ארגוניים' },

  // COMFORT category → Questions: 7, 11, 12, 16, 25, 28, 31, 33, 34
  'q7': { category: 'comfort', isReversed: false, text: 'בארגון קיימת מחויבות לתרומה שמעבר למטרות אישיות' },
  'q11': { category: 'comfort', isReversed: false, text: 'קיימת תחושת משמעות רחבה בעבודת היומיום' },
  'q12': { category: 'comfort', isReversed: true, text: 'העובדים נמנעים משיח ערכי בנוגע לעבודתם' },
  'q16': { category: 'comfort', isReversed: true, text: 'אין מוטיבציה ליזום או להציע דרכי פעולה חדשות' },
  'q25': { category: 'comfort', isReversed: false, text: 'לעובדים קל להביע תחושות ורעיונות אישיים' },
  'q28': { category: 'comfort', isReversed: true, text: 'לא מקדישים זמן ללמידה ושיפור' },
  'q31': { category: 'comfort', isReversed: false, text: 'תחושת השייכות בארגון חזקה ומחברת' },
  'q33': { category: 'comfort', isReversed: false, text: 'הארגון מדגיש מטרות ארגוניות עם ערך חברתי' },
  'q34': { category: 'comfort', isReversed: true, text: 'תחושת שליחות אישית אינה מקבלת ביטוי' },

  // APATHY category → Questions: 8, 9, 15, 17, 20, 23, 27, 29, 32
  'q8': { category: 'apathy', isReversed: true, text: 'לא נהוג לשתף בהצלחות או בכישלונות כדי ללמוד מהן' },
  'q9': { category: 'apathy', isReversed: false, text: 'ההנהלה מתנהלת בשקיפות מלאה' },
  'q15': { category: 'apathy', isReversed: false, text: 'קיימת אווירה של סקרנות וחיפוש ידע חדש' },
  'q17': { category: 'apathy', isReversed: false, text: 'הארגון מעודד התפתחות אישית של כל עובד' },
  'q20': { category: 'apathy', isReversed: true, text: 'לא מקיימים שיחות עומק עם העובדים על מטרותיהם' },
  'q23': { category: 'apathy', isReversed: false, text: 'השראה היא חלק בלתי נפרד מהתרבות הארגונית' },
  'q27': { category: 'apathy', isReversed: false, text: 'בארגון יודעים לנהל קונפליקטים באופן בונה' },
  'q29': { category: 'apathy', isReversed: false, text: 'יש נכונות אמיתית להקשיב לדעות שונות' },
  'q32': { category: 'apathy', isReversed: false, text: 'המנהיגים מציגים דוגמה אישית' }
};

export interface WocaCategoryScores {
  war: number;
  opportunity: number;
  comfort: number;
  apathy: number;
}

export interface WocaZoneCounts {
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
  // New frequency-based analysis
  groupZoneCounts: WocaZoneCounts;
  groupDominantZoneByCount: string | null;
  groupIsTieByCount: boolean;
  groupTiedCategoriesByCount: string[];
}

// Reverse score a value (1->5, 2->4, 3->3, 4->2, 5->1)
export const reverseScore = (score: number): number => {
  return 6 - score;
};

// Calculate WOCA category scores for a single participant
export const calculateWocaCategoryScores = (questionResponses: any): WocaCategoryScores => {
  const categoryTotals = { war: 0, opportunity: 0, comfort: 0, apathy: 0 };
  const categoryCounts = { war: 0, opportunity: 0, comfort: 0, apathy: 0 };

  console.log('Calculating WOCA scores for responses:', questionResponses);

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
      
      console.log(`Question ${questionKey} (${questionInfo.category}): raw=${questionResponses[responseKey]}, processed=${score}, reversed=${questionInfo.isReversed}`);
    }
  });

  // Calculate averages for each category
  const categoryScores: WocaCategoryScores = {
    war: categoryCounts.war > 0 ? categoryTotals.war / categoryCounts.war : 0,
    opportunity: categoryCounts.opportunity > 0 ? categoryTotals.opportunity / categoryCounts.opportunity : 0,
    comfort: categoryCounts.comfort > 0 ? categoryTotals.comfort / categoryCounts.comfort : 0,
    apathy: categoryCounts.apathy > 0 ? categoryTotals.apathy / categoryCounts.apathy : 0
  };

  console.log('Category scores:', categoryScores);
  console.log('Category counts:', categoryCounts);

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
    .filter(([_, score]) => Math.abs(score - maxScore) < 0.01) // Use small epsilon for floating point comparison
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

// NEW: Determine dominant zone by participant count
export const getDominantZoneByCount = (zoneCounts: WocaZoneCounts): {
  dominantZone: string | null;
  isTie: boolean;
  tiedCategories: string[];
} => {
  const categories = Object.entries(zoneCounts);
  const maxCount = Math.max(...categories.map(([_, count]) => count));
  
  if (maxCount === 0) {
    return { dominantZone: null, isTie: false, tiedCategories: [] };
  }
  
  const topCategories = categories
    .filter(([_, count]) => count === maxCount)
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
  
  console.log('Analyzing workshop with participants:', participants.length);
  
  // Analyze each participant
  participants.forEach((participant, index) => {
    const analysis = analyzeParticipantWoca(
      participant,
      participant.full_name || `Participant ${index + 1}`,
      participant.id
    );
    participantAnalyses.push(analysis);
    console.log(`Participant ${index + 1} analysis:`, analysis);
  });
  
  // Calculate group averages (for radar chart and other visualizations)
  const groupTotals = { war: 0, opportunity: 0, comfort: 0, apathy: 0 };
  const validParticipants = participantAnalyses.filter(p => 
    p.categoryScores.war > 0 || p.categoryScores.opportunity > 0 || 
    p.categoryScores.comfort > 0 || p.categoryScores.apathy > 0
  );
  
  console.log('Valid participants for group analysis:', validParticipants.length);
  
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
  
  console.log('Group category scores:', groupCategoryScores);
  
  // Calculate frequency-based zone analysis from analyzed_score in database
  const groupZoneCounts: WocaZoneCounts = { war: 0, opportunity: 0, comfort: 0, apathy: 0 };
  
  // Count how many participants fall into each zone based on analyzed_score field
  participants.forEach(participant => {
    const analyzedScore = participant.analyzed_score;
    if (analyzedScore) {
      const zoneName = analyzedScore.toLowerCase();
      if (zoneName === 'war' || zoneName === 'מלחמה') {
        groupZoneCounts.war++;
      } else if (zoneName === 'opportunity' || zoneName === 'הזדמנות') {
        groupZoneCounts.opportunity++;
      } else if (zoneName === 'comfort' || zoneName === 'נוחות') {
        groupZoneCounts.comfort++;
      } else if (zoneName === 'apathy' || zoneName === 'אדישות') {
        groupZoneCounts.apathy++;
      }
    }
  });
  
  console.log('Group zone counts from analyzed_score:', groupZoneCounts);
  
  // Determine group's dominant zone by participant count (NEW APPROACH)
  const { 
    dominantZone: groupDominantZoneByCount, 
    isTie: groupIsTieByCount, 
    tiedCategories: groupTiedCategoriesByCount 
  } = getDominantZoneByCount(groupZoneCounts);
  
  // Keep the old score-based approach for backward compatibility
  const { dominantZone: groupDominantZone, isTie: groupIsTie, tiedCategories: groupTiedCategories } = 
    getDominantZone(groupCategoryScores);
  
  console.log('Group dominant zone by count:', groupDominantZoneByCount, 'Is tie by count:', groupIsTieByCount);
  console.log('Group dominant zone by score:', groupDominantZone, 'Is tie by score:', groupIsTie);
  
  return {
    workshopId,
    groupCategoryScores,
    groupDominantZone,
    groupIsTie,
    groupTiedCategories,
    participants: participantAnalyses,
    participantCount: participants.length,
    // New frequency-based results
    groupZoneCounts,
    groupDominantZoneByCount,
    groupIsTieByCount,
    groupTiedCategoriesByCount
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
