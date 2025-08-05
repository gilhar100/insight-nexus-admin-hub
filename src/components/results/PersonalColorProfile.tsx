
interface PersonalColorProfileProps {
  result: {
    dimensions: {
      [dimension: string]: {
        name: string;
        score: number;
      };
    };
  };
}

const PersonalColorProfile: React.FC<PersonalColorProfileProps> = ({ result }) => {
  const dimensionsArray = Object.values(result.dimensions);
  const highest = dimensionsArray.reduce((a, b) => (a.score > b.score ? a : b));

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-center">פרופיל אישי</h3>
      <div className="text-center">
        <div className="text-sm text-gray-600 mb-2">הממד הדומיננטי שלך:</div>
        <div className="text-2xl font-bold text-blue-600">{highest.name}</div>
        <div className="text-lg text-gray-700 mt-2">{highest.score.toFixed(2)} / 5</div>
      </div>
    </div>
  );
};

export default PersonalColorProfile;
