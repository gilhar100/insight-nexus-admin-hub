
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getSalimaColor } from '@/utils/salimaColors';

interface PersonalColorProfileProps {
  result: {
    dimensions: {
      [dimension: string]: {
        name: string;
        score: number;
      };
    };
  };
  showAsWheel?: boolean;
}

const PersonalColorProfile: React.FC<PersonalColorProfileProps> = ({ result, showAsWheel = false }) => {
  const dimensionsArray = Object.values(result.dimensions);
  const highest = dimensionsArray.reduce((a, b) => (a.score > b.score ? a : b));

  if (showAsWheel) {
    const chartData = dimensionsArray.map(dim => ({
      name: dim.name,
      value: dim.score,
      color: getSalimaColor(dim.name)
    }));

    return (
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 border rounded shadow-lg text-right">
                      <p className="font-semibold">{data.name}</p>
                      <p className="text-blue-600">ציון: {data.value.toFixed(2)}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry) => (
                <span style={{ color: entry.color, fontWeight: 'bold' }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

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
