
interface ResultsActionsProps {
  surveyId: string | null;
}

const ResultsActions: React.FC<ResultsActionsProps> = ({ surveyId }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">פעולות</h3>
      <div className="flex gap-4 justify-center">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          הורד דוח PDF
        </button>
        <button className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors">
          שתף תוצאות
        </button>
      </div>
    </div>
  );
};

export default ResultsActions;
