
import { Download, RotateCcw } from 'lucide-react';

interface ResultsActionsProps {
  surveyId: string | null;
}

const ResultsActions: React.FC<ResultsActionsProps> = ({ surveyId }) => {
  const handleRefresh = () => {
    alert("רענון תובנות... (ניתן לחבר מאוחר יותר)");
  };

  const handleDownload = () => {
    alert("הורדת PDF... (ניתן למימוש מאוחר יותר)");
  };

  return (
    <div className="flex justify-center gap-4">
      <button
        onClick={handleRefresh}
        className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
      >
        <RotateCcw size={18} />
        חזור לעמוד הבית
      </button>
      <button
        onClick={handleDownload}
        className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
      >
        <Download size={18} />
        הורד דוח אישי (PDF)
      </button>
    </div>
  );
};

export default ResultsActions;
