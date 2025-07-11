
import React from 'react';
import { SalimaGroupRadarChart } from '@/components/SalimaGroupRadarChart';
import { SalimaArchetypeDistributionChart } from '@/components/SalimaArchetypeDistributionChart';
import { DimensionInsights } from '@/components/DimensionInsights';
import { getDimensionInsights } from '@/utils/dimensionInsights';

interface GroupData {
  group_number: number;
  participant_count: number;
  averages: {
    strategy: number;
    learning: number;
    inspiration: number;
    meaning: number;
    authenticity: number;
    adaptability: number;
    overall: number;
  };
  participants: Array<{
    dimension_s: number;
    dimension_l: number;
    dimension_i: number;
    dimension_m: number;
    dimension_a: number;
    dimension_a2: number;
    archetype_1_score?: number | null;
    archetype_2_score?: number | null;
    archetype_3_score?: number | null;
  }>;
}

interface GroupResultsProps {
  groupData: GroupData;
  isPresenterMode: boolean;
}

export const GroupResults: React.FC<GroupResultsProps> = ({
  groupData,
  isPresenterMode
}) => {
  // Add safety check for groupData
  if (!groupData || !groupData.participants || groupData.participants.length === 0) {
    return (
      <div className="card">
        <div className="card-content p-8 text-center">
          <p className="text-gray-600">אין נתונים להצגה עבור קבוצה זו</p>
        </div>
      </div>
    );
  }

  // Add safety check for dimension insights
  let dimensionInsights;
  try {
    dimensionInsights = getDimensionInsights(groupData.averages);
  } catch (error) {
    console.error('Error calculating dimension insights:', error);
    dimensionInsights = {
      strongest: { key: 'strategy', name: 'אסטרטגיה', score: 0 },
      weakest: { key: 'strategy', name: 'אסטרטגיה', score: 0 },
      isSameDimension: false
    };
  }

  const { strongest, weakest, isSameDimension } = dimensionInsights;

  // Transform participants data for archetype chart
  const archetypeParticipants = groupData.participants.map(participant => ({
    archetype_1_score: participant.archetype_1_score || 0,
    archetype_2_score: participant.archetype_2_score || 0,
    archetype_3_score: participant.archetype_3_score || 0
  }));

  return (
    <div className={isPresenterMode ? "presenter-grid" : "grid grid-cols-1 lg:grid-cols-2 gap-8"}>
      {/* Dimension Insights Section */}
      <DimensionInsights
        strongest={strongest}
        weakest={weakest}
        isSameDimension={isSameDimension}
        isPresenterMode={isPresenterMode}
      />

      {/* Radar Chart – Group Averages per SALIMA Dimension */}
      <div className="card">
        <div className="card-header text-center">
          <div className={`flex items-center justify-center text-right card-title${isPresenterMode ? " text-3xl" : ""}`}>
            תרשים רדאר – פרופיל קבוצתי לפי ממד
          </div>
        </div>
        <div className="card-content">
          <div className="h-[520px] w-full flex items-center justify-center">
            <SalimaGroupRadarChart averages={groupData.averages} />
          </div>
        </div>
      </div>

      {/* Archetype Distribution Chart */}
      <div className="card">
        <div className="card-header text-center">
          <div className={`flex items-center justify-center text-right card-title${isPresenterMode ? " text-3xl" : ""}`}>
            התפלגות ארכיטיפי מנהיגות
          </div>
        </div>
        <div className="card-content">
          <SalimaArchetypeDistributionChart 
            participants={archetypeParticipants}
            isPresenterMode={isPresenterMode}
          />
        </div>
      </div>
    </div>
  );
};
