
// WOCA scoring utilities with reverse scoring and zone assignment based on highest parameter average

export interface WocaScores {
  war: number;
  opportunity: number;
  comfort: number;
  apathy: number;
}

export interface WocaZoneResult {
  zone: string;
  zones: string[];
  score: number;
  color: string;
  description: string;
  explanation?: string;
  recommendations?: string;
}

// Question mappings for each WOCA parameter (limited to 36 questions)
export const WOCA_QUESTION_MAPPING = {
  war: {
    normal: [1, 5, 9, 13, 17, 21, 25, 29, 33], // Questions scored normally
    reverse: [2, 6, 10, 14, 18, 22, 26, 30, 34] // Questions scored in reverse
  },
  opportunity: {
    normal: [3, 7, 11, 15, 19, 23, 27, 31, 35],
    reverse: [4, 8, 12, 16, 20, 24, 28, 32, 36]
  },
  comfort: {
    normal: [2, 6, 10, 14, 18, 22, 26, 30, 34],
    reverse: [1, 5, 9, 13, 17, 21, 25, 29, 33]
  },
  apathy: {
    normal: [4, 8, 12, 16, 20, 24, 28, 32, 36],
    reverse: [3, 7, 11, 15, 19, 23, 27, 31, 35]
  }
};

// Hebrew zone mappings
export const ZONE_HEBREW_NAMES = {
  war: 'מלחמה',
  opportunity: 'הזדמנות',
  comfort: 'נוחות',
  apathy: 'אדישות'
};

// Hebrew explanations for each zone
export const WOCA_ZONE_EXPLANATIONS = {
  opportunity: {
    title: 'אזור ההזדמנות',
    description: 'מצב תודעה בריא שבו שיח פתוח מתקיים גם בנושאים מאתגרים. קיימת נכונות ללמוד, לחדש, ולשתף פעולה מתוך אמון הדדי וחזון משותף. זהו המצב הארגוני הרצוי.',
    color: '#10B981'
  },
  comfort: {
    title: 'אזור הנוחות',
    description: 'אווירה רגועה אך תקועה. נמנעים מעיסוק בקונפליקטים, חדשנות אינה מקודמת, ויש העדפה לשמר את הקיים גם במחיר של חוסר התקדמות.',
    color: '#3B82F6'
  },
  war: {
    title: 'אזור המלחמה',
    description: 'מצב של חוסר אמון, פוליטיקה ארגונית, ומאבקי כוח. שיח גלוי חסר, והעובדים חשים מאוימים או ממותגים כאשר מביעים דעה שונה.',
    color: '#EF4444'
  },
  apathy: {
    title: 'אזור האדישות',
    description: 'מצב של ניתוק, חוסר מוטיבציה, ותחושת חוסר משמעות. העובדים פועלים מתוך אינרציה, ללא תחושת שייכות או חיבור למטרות הארגון.',
    color: '#F59E0B'
  }
};

// Ideal zone explanation
export const IDEAL_ZONE_EXPLANATION = {
  title: 'למה אזור ההזדמנות הוא האידיאל?',
  content: 'אזור ההזדמנות מייצג את המצב התודעתי האופטימלי עבור ארגונים. במצב זה, חברי הצוות מרגישים בטוחים לבטא דעות, לקחת סיכונים מחושבים ולחדש. קיים שיח פתוח ובונה שמאפשר צמיחה אישית וארגונית, ויצירת סביבת עבודה בריאה ופרודוקטיבית.'
};

// Reverse score transformation: 1→5, 2→4, 3→3, 4→2, 5→1
export const reverseScore = (score: number): number => {
  return 6 - score;
};

// Calculate WOCA parameter scores from question responses (limited to q1-q36)
export const calculateWocaScores = (questionResponses: any): WocaScores => {
  console.log('🔍 Calculating WOCA scores for:', questionResponses);
  
  // Handle null/undefined question responses
  if (!questionResponses || typeof questionResponses !== 'object') {
    console.log('❌ No valid question responses found');
    return { war: 0, opportunity: 0, comfort: 0, apathy: 0 };
  }

  const scores: WocaScores = { war: 0, opportunity: 0, comfort: 0, apathy: 0 };
  
  Object.keys(WOCA_QUESTION_MAPPING).forEach(parameter => {
    const mapping = WOCA_QUESTION_MAPPING[parameter as keyof typeof WOCA_QUESTION_MAPPING];
    let totalScore = 0;
    let questionCount = 0;

    console.log(`📊 Processing ${parameter} parameter...`);

    // Process normal scoring questions (only q1-q36)
    mapping.normal.forEach(questionNum => {
      if (questionNum <= 36) { // Limit to 36 questions
        const response = questionResponses[`q${questionNum}`];
        if (response && typeof response === 'number' && response >= 1 && response <= 5) {
          totalScore += response;
          questionCount++;
          console.log(`  Normal Q${questionNum}: ${response}`);
        }
      }
    });

    // Process reverse scoring questions (only q1-q36)
    mapping.reverse.forEach(questionNum => {
      if (questionNum <= 36) { // Limit to 36 questions
        const response = questionResponses[`q${questionNum}`];
        if (response && typeof response === 'number' && response >= 1 && response <= 5) {
          const reversedScore = reverseScore(response);
          totalScore += reversedScore;
          questionCount++;
          console.log(`  Reverse Q${questionNum}: ${response} → ${reversedScore}`);
        }
      }
    });

    // Calculate average for this parameter only if questions were answered
    const average = questionCount > 0 ? totalScore / questionCount : 0;
    scores[parameter as keyof WocaScores] = average;
    
    console.log(`✅ ${parameter}: ${totalScore}/${questionCount} = ${average.toFixed(3)}`);
  });

  console.log('🎯 Final scores:', scores);
  return scores;
};

// Determine WOCA zone based on highest parameter average with proper tie handling
export const determineWocaZone = (scores: WocaScores): WocaZoneResult => {
  console.log('🎯 Determining WOCA zone from scores:', scores);
  
  const parameterScores = [
    { name: ZONE_HEBREW_NAMES.war, key: 'war', score: scores.war, color: '#EF4444' },
    { name: ZONE_HEBREW_NAMES.opportunity, key: 'opportunity', score: scores.opportunity, color: '#10B981' },
    { name: ZONE_HEBREW_NAMES.comfort, key: 'comfort', score: scores.comfort, color: '#3B82F6' },
    { name: ZONE_HEBREW_NAMES.apathy, key: 'apathy', score: scores.apathy, color: '#F59E0B' }
  ];

  // Find the highest score(s) - use a small tolerance for floating point comparison
  const maxScore = Math.max(...parameterScores.map(p => p.score));
  const dominantParameters = parameterScores.filter(p => Math.abs(p.score - maxScore) < 0.001);

  console.log('📈 Max score:', maxScore);
  console.log('🏆 Dominant parameters:', dominantParameters.map(p => `${p.name}: ${p.score.toFixed(3)}`));

  // Create zone name and description with proper Hebrew formatting
  const zoneNames = dominantParameters.map(p => p.name);
  let zoneName: string;
  let description: string;

  if (dominantParameters.length === 1) {
    zoneName = zoneNames[0];
    description = `אזור תודעתי דומיננטי: ${zoneName}`;
  } else if (dominantParameters.length === 2) {
    zoneName = zoneNames.join('/');
    description = `המשתתף נמצא בשני אזורי תודעה: ${zoneNames[0]} ו-${zoneNames[1]}`;
  } else {
    zoneName = zoneNames.join('/');
    description = `המשתתף נמצא במספר אזורי תודעה: ${zoneNames.join(', ')}`;
  }

  const primaryColor = dominantParameters[0].color;

  // Get appropriate explanation based on dominant zone(s)
  let explanation = '';
  let recommendations = '';

  if (dominantParameters.length === 1) {
    const dominantZone = dominantParameters[0].key;
    switch (dominantZone) {
      case 'war':
        explanation = 'אזור המלחמה מתאפיין בלחץ גבוה, קונפליקטים פנימיים ותחושת איום. מצב זה דורש התערבות מיידית.';
        recommendations = 'טפלו מיידית בקונפליקטים, הפחיתו לחצים מיותרים, חזקו תחושת ביטחון ותמיכה.';
        break;
      case 'opportunity':
        explanation = 'אזור ההזדמנות מתאפיין ברמה גבוהה של מוטיבציה פנימית, פתיחות לרעיונות חדשים ויכולת לראות אפשרויות.';
        recommendations = 'עודדו יוזמות חדשות, תנו אוטונומיה וחופש פעולה, הציבו אתגרים משמעותיים.';
        break;
      case 'comfort':
        explanation = 'אזור הנוחות מתאפיין ביעילות ויציבות, הקפדה על תהליכים ונוהלים עם ביטחון ובטיחות.';
        recommendations = 'הציגו שינויים הדרגתיים, שמרו על מסגרות מוכרות תוך הוספת אלמנטים חדשים.';
        break;
      case 'apathy':
        explanation = 'אזור האדישות מתאפיין בחוסר מעורבות, אדישות למטרות הארגון וחוסר בהירות לגבי התפקיד.';
        recommendations = 'בהירו מטרות וציפיות, חזקו את החיבור למשמעות העבודה, שפרו תקשורת ומעורבות.';
        break;
    }
  } else {
    explanation = `התוצאה מציגה שילוב של מספר אזורים תודעתיים דומיננטיים: ${zoneNames.join(', ')}.`;
    recommendations = 'נדרש ניתוח מעמיק יותר לקביעת אסטרטגיית התערבות מתאימה.';
  }

  const result = {
    zone: zoneName,
    zones: zoneNames,
    score: maxScore,
    color: primaryColor,
    description,
    explanation,
    recommendations
  };

  console.log('🏁 Final zone result:', result);
  return result;
};

// Calculate group zone for multiple participants
export const calculateGroupZone = (participants: any[]): WocaZoneResult => {
  console.log('👥 Calculating group zone for', participants.length, 'participants');

  if (participants.length === 0) {
    return {
      zone: 'לא זמין',
      zones: [],
      score: 0,
      color: '#666666',
      description: 'אין נתונים זמינים',
      explanation: '',
      recommendations: ''
    };
  }

  // Calculate average scores across all participants
  const groupScores: WocaScores = {
    war: 0,
    opportunity: 0,
    comfort: 0,
    apathy: 0
  };

  participants.forEach(participant => {
    if (participant.woca_scores) {
      groupScores.war += participant.woca_scores.war || 0;
      groupScores.opportunity += participant.woca_scores.opportunity || 0;
      groupScores.comfort += participant.woca_scores.comfort || 0;
      groupScores.apathy += participant.woca_scores.apathy || 0;
    }
  });

  // Calculate group averages
  groupScores.war /= participants.length;
  groupScores.opportunity /= participants.length;
  groupScores.comfort /= participants.length;
  groupScores.apathy /= participants.length;

  console.log('📊 Group average scores:', groupScores);

  // Determine group zone using the same logic as individual
  const groupZoneResult = determineWocaZone(groupScores);

  // Update description for group context
  if (groupZoneResult.zones.length === 1) {
    groupZoneResult.description = `האזור התודעתי הדומיננטי של הקבוצה: ${groupZoneResult.zone}`;
  } else if (groupZoneResult.zones.length === 2) {
    groupZoneResult.description = `הקבוצה מזוהה עם שני אזורי תודעה: ${groupZoneResult.zones[0]} ו-${groupZoneResult.zones[1]}`;
  } else {
    groupZoneResult.description = `הקבוצה מזוהה עם מספר אזורי תודעה: ${groupZoneResult.zones.join(', ')}`;
  }

  console.log('🏁 Final group zone result:', groupZoneResult);
  return groupZoneResult;
};
