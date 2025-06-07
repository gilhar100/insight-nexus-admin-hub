
export const analyzeIndividualWoca = (participant: any) => {
  // WOCA question mapping
  const wocaQuestions = {
    opportunity: [1, 5, 9, 13, 17, 21, 25, 29, 33],
    comfort: [2, 6, 10, 14, 18, 22, 26, 30, 34],
    apathy: [3, 7, 11, 15, 19, 23, 27, 31, 35],
    war: [4, 8, 12, 16, 20, 24, 28, 32, 36]
  };

  const zoneScores = {
    opportunity: 0,
    comfort: 0,
    apathy: 0,
    war: 0
  };

  // Calculate scores for each zone
  Object.entries(wocaQuestions).forEach(([zone, questions]) => {
    let totalScore = 0;
    let validQuestions = 0;

    questions.forEach(questionNum => {
      const response = participant[`q${questionNum}`];
      if (response !== null && response !== undefined) {
        totalScore += response;
        validQuestions++;
      }
    });

    if (validQuestions > 0) {
      zoneScores[zone as keyof typeof zoneScores] = totalScore / validQuestions / 5; // Normalize to 0-1
    }
  });

  return {
    zoneScores,
    overallScore: Object.values(zoneScores).reduce((sum, score) => sum + score, 0) / 4
  };
};
