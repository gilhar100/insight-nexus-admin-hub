
interface GroupAverages {
  strategy: number;
  learning: number;
  inspiration: number;
  meaning: number;
  authenticity: number;
  adaptability: number;
  overall: number;
}

interface DimensionInsight {
  key: string;
  name: string;
  score: number;
}

export interface DimensionInsightsResult {
  strongest: DimensionInsight;
  weakest: DimensionInsight;
  isSameDimension: boolean;
}

export const getDimensionInsights = (averages: GroupAverages): DimensionInsightsResult => {
  const dimensions = [{
    key: 'strategy',
    name: 'אסטרטגיה (S)',
    score: averages.strategy
  }, {
    key: 'authenticity',
    name: 'אותנטיות (A2)',
    score: averages.authenticity
  }, {
    key: 'learning',
    name: 'למידה (L)',
    score: averages.learning
  }, {
    key: 'inspiration',
    name: 'השראה (I)',
    score: averages.inspiration
  }, {
    key: 'meaning',
    name: 'משמעות (M)',
    score: averages.meaning
  }, {
    key: 'adaptability',
    name: 'הסתגלות (A)',
    score: averages.adaptability
  }];

  const strongest = dimensions.reduce((max, dim) => dim.score > max.score ? dim : max);
  const weakest = dimensions.reduce((min, dim) => dim.score < min.score ? dim : min);

  return {
    strongest,
    weakest,
    isSameDimension: strongest.key === weakest.key
  };
};
