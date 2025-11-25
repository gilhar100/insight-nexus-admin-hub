import { archetypeExplanations } from "@/utils/archetypeDescriptions";

interface ResultsDominantArchetypeProps {
  dominantArchetype: string | null | undefined;
}

const ResultsDominantArchetype: React.FC<ResultsDominantArchetypeProps> = ({ dominantArchetype }) => {
  if (!dominantArchetype) return null;

  const archetypeInfo = archetypeExplanations[dominantArchetype];

  return (
    <div className="bg-white p-6 rounded-xl shadow" dir="rtl">
      <h2 className="text-xl font-semibold text-gray-800 mb-3 text-center">סגנון מנהיגות</h2>
      <p className="text-2xl font-bold text-purple-600 mb-3 text-center">{dominantArchetype}</p>
      {archetypeInfo && (
        <p className="text-base text-gray-700 leading-relaxed text-right">
          {archetypeInfo.description}
        </p>
      )}
    </div>
  );
};

export default ResultsDominantArchetype;
