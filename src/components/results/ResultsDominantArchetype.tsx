
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ResultsDominantArchetypeProps {
  dominantArchetype: string | null | undefined;
}

// Sample archetypes - these would come from your data
const ARCHETYPES = [
  "מנהל התקדמות",
  "מנהל המעניק",
  "מנהל הסקרן", 
  "מנהל האחראי",
  "מנהל הצוותי"
];

const ResultsDominantArchetype: React.FC<ResultsDominantArchetypeProps> = ({ dominantArchetype }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? ARCHETYPES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === ARCHETYPES.length - 1 ? 0 : prev + 1));
  };

  const currentArchetype = dominantArchetype || ARCHETYPES[currentIndex];

  return (
    <div className="bg-white p-6 rounded-xl shadow text-center">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">סגנון מנהיגות</h2>
      
      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          onClick={handlePrevious}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="min-w-[200px]">
          <p className="text-xl font-bold text-purple-600">{currentArchetype}</p>
        </div>
        
        <button
          onClick={handleNext}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="flex justify-center gap-2">
        {ARCHETYPES.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ResultsDominantArchetype;
