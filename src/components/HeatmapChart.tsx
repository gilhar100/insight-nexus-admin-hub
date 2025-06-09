
import React from 'react';
import { ChartContainer } from '@/components/ui/chart';
import { WOCA_QUESTION_MAPPING, reverseScore } from '@/utils/wocaAnalysis';
import { WOCA_ZONE_COLORS } from '@/utils/wocaColors';

interface HeatmapChartProps {
  participants: Array<{
    id: string;
    question_responses?: any;
    full_name: string;
  }>;
}

export const HeatmapChart: React.FC<HeatmapChartProps> = ({ participants }) => {
  // Calculate averages for each question
  const questionAverages = React.useMemo(() => {
    const questionData: { [key: string]: { values: number[], category: string } } = {};
    
    // Initialize question data
    Object.entries(WOCA_QUESTION_MAPPING).forEach(([questionKey, questionInfo]) => {
      questionData[questionKey] = {
        values: [],
        category: questionInfo.category
      };
    });
    
    // Collect all responses
    participants.forEach(participant => {
      if (participant.question_responses) {
        Object.entries(WOCA_QUESTION_MAPPING).forEach(([questionKey, questionInfo]) => {
          const rawScore = participant.question_responses[questionKey];
          if (rawScore !== null && rawScore !== undefined && !isNaN(rawScore)) {
            const processedScore = questionInfo.isReversed ? reverseScore(rawScore) : rawScore;
            questionData[questionKey].values.push(processedScore);
          }
        });
      }
    });
    
    // Calculate averages
    return Object.entries(questionData).map(([questionKey, data]) => ({
      question: questionKey,
      category: data.category,
      average: data.values.length > 0 ? data.values.reduce((sum, val) => sum + val, 0) / data.values.length : 0,
      count: data.values.length
    }));
  }, [participants]);

  // Group by category
  const groupedData = React.useMemo(() => {
    const grouped: { [key: string]: typeof questionAverages } = {};
    questionAverages.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return grouped;
  }, [questionAverages]);

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      opportunity: 'הזדמנות',
      comfort: 'נוחות',
      apathy: 'אדישות',
      war: 'מלחמה'
    };
    return labels[category] || category;
  };

  const getIntensityColor = (score: number) => {
    const intensity = score / 5; // Normalize to 0-1
    return `rgba(59, 130, 246, ${intensity})`; // Blue with varying opacity
  };

  const chartConfig = {
    average: {
      label: 'ממוצע',
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[500px]">
      <div className="w-full h-full p-4 overflow-auto">
        <div className="grid grid-cols-1 gap-6">
          {Object.entries(groupedData).map(([category, questions]) => (
            <div key={category} className="space-y-2">
              <h4 
                className="text-lg font-semibold text-center py-2 px-4 rounded-lg text-white"
                style={{ backgroundColor: WOCA_ZONE_COLORS[category as keyof typeof WOCA_ZONE_COLORS] }}
              >
                {getCategoryLabel(category)}
              </h4>
              <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-2">
                {questions.map((question) => (
                  <div
                    key={question.question}
                    className="aspect-square flex flex-col items-center justify-center rounded-lg border border-gray-200 p-2 text-center hover:shadow-md transition-shadow"
                    style={{ 
                      backgroundColor: getIntensityColor(question.average),
                      color: question.average > 2.5 ? 'white' : 'black'
                    }}
                    title={`${question.question}: ממוצע ${question.average.toFixed(2)} (${question.count} תגובות)`}
                  >
                    <div className="text-xs font-medium">
                      {question.question.replace('q', 'ש')}
                    </div>
                    <div className="text-sm font-bold">
                      {question.average.toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="mt-6 flex items-center justify-center space-x-4 rtl:space-x-reverse">
          <span className="text-sm text-gray-600">נמוך</span>
          <div className="flex space-x-1 rtl:space-x-reverse">
            {[1, 2, 3, 4, 5].map(level => (
              <div
                key={level}
                className="w-6 h-6 rounded border border-gray-300"
                style={{ backgroundColor: getIntensityColor(level) }}
                title={`רמה ${level}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">גבוה</span>
        </div>
      </div>
    </ChartContainer>
  );
};
