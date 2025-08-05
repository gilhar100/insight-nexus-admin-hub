
interface ResultsActionsProps {
  surveyId: string | null;
}

const ResultsActions: React.FC<ResultsActionsProps> = ({ surveyId }) => {
  const handleRefresh = () => {
    alert("Refreshing insights… (you can wire this later)");
  };

  const handleDownload = () => {
    alert("Downloading PDF… (you can implement this later)");
  };

  return (
    <div className="flex justify-center gap-4 mt-6">
      <button
        onClick={handleRefresh}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        רענן תובנות
      </button>
      <button
        onClick={handleDownload}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        הורד דוח PDF
      </button>
    </div>
  );
};

export default ResultsActions;
