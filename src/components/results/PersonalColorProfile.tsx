
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
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

    const renderCustomLabel = ({ name, value }: any) => {
      return `${name}`;
    };

    return (
      <div className="space-y-4">
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
                label={renderCustomLabel}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
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
        
        {/* Color legend below the chart */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
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
