
interface ResultsHeaderProps {
  surveyId: string;
}

const ResultsHeader: React.FC<ResultsHeaderProps> = ({ surveyId }) => {
  return (
    <div className="flex items-center justify-between w-full">
      <h1 className="text-2xl font-bold text-gray-800">תוצאות שאלון מנהיגות</h1>
      <span className="text-sm text-gray-500">מזהה שאלון: {surveyId}</span>
    </div>
  );
};

export default ResultsHeader;
