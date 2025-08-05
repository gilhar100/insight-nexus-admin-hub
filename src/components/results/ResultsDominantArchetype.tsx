
interface ResultsDominantArchetypeProps {
  dominantArchetype: string | null | undefined;
}

const ResultsDominantArchetype: React.FC<ResultsDominantArchetypeProps> = ({ dominantArchetype }) => {
  if (!dominantArchetype) return null;

  return (
    <div className="bg-white p-4 rounded-xl shadow text-center">
      <h2 className="text-lg font-semibold text-gray-800 mb-1">סגנון מנהיגות</h2>
      <p className="text-xl font-bold text-purple-600">{dominantArchetype}</p>
    </div>
  );
};

export default ResultsDominantArchetype;
