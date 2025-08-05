
interface RawSupabaseRow {
  [key: string]: any;
  survey_id: string;
}

export function mapRawDataToResultsViewerProps(row: RawSupabaseRow) {
  const answers = [];
  for (let i = 1; i <= 90; i++) {
    const value = row[`q${i}`];
    if (value !== undefined && value !== null) {
      answers.push({ questionId: i, value });
    }
  }

  // Simulate computing dimension scores
  const results = {
    averageScore:
      answers.reduce((sum, a) => sum + a.value, 0) / answers.length,
    dimensions: {
      strategy: { name: "אסטרטגיה", score: row.dimension_s || 4 },
      adaptive: { name: "אדפטיביות", score: row.dimension_a || 3 },
      learning: { name: "לומד", score: row.dimension_l || 4 },
      inspiration: { name: "השראה", score: row.dimension_i || 4 },
      meaning: { name: "משמעות", score: row.dimension_m || 4 },
      authentic: { name: "אותנטיות", score: row.dimension_a2 || 4 },
    },
  };

  return {
    results,
    answers,
    insights: {
      insight_strategy: row.insight_strategy || "",
      insight_adaptive: row.insight_adaptive || "",
      insight_learning: row.insight_learning || "",
      insight_inspiration: row.insight_inspiration || "",
      insight_meaning: row.insight_meaning || "",
      insight_authentic: row.insight_authentic || "",
      dominant_archetype: row.dominant_archetype || null,
    },
    gptResults: null,
    surveyId: row.survey_id,
  };
}
