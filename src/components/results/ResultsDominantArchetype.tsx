
interface ResultsDominantArchetypeProps {
  dominantArchetype?: string;
}

const ResultsDominantArchetype: React.FC<ResultsDominantArchetypeProps> = ({ dominantArchetype }) => {
  if (!dominantArchetype) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">הארכיטיפ הדומיננטי</h3>
      <div className="text-center">
        <div className="text-xl font-bold text-purple-600">{dominantArchetype}</div>
      </div>
    </div>
  );
};

export default ResultsDominantArchetype;
