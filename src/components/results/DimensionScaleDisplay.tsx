interface DimensionScaleDisplayProps {
  dimensions: {
    [dimension: string]: {
      name: string;
      score: number;
    };
  };
}

const DimensionScaleDisplay: React.FC<DimensionScaleDisplayProps> = ({ dimensions }) => {
  const maxScore = 5;

  return (
    <div className="bg-white p-6 rounded-xl shadow" dir="rtl">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">מיקום בכל פרמטר</h3>
      <div className="space-y-6">
        {Object.entries(dimensions).map(([key, { name, score }]) => {
          const percentage = (score / maxScore) * 100;
          
          return (
            <div key={key} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-base font-medium text-gray-700">{name}</span>
                <span className="text-base font-bold text-purple-600">{score.toFixed(1)}</span>
              </div>
              
              <div className="relative">
                {/* Background track */}
                <div className="w-full h-3 bg-gray-200 rounded-full relative">
                  {/* Filled portion */}
                  <div 
                    className="h-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                  
                  {/* Position marker */}
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500"
                    style={{ left: `${percentage}%` }}
                  >
                    <div className="w-5 h-5 bg-purple-600 border-3 border-white rounded-full shadow-lg" />
                  </div>
                </div>
                
                {/* Scale markers */}
                <div className="flex justify-between mt-1 px-1">
                  {[0, 1, 2, 3, 4, 5].map((tick) => (
                    <span key={tick} className="text-xs text-gray-400">{tick}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DimensionScaleDisplay;
