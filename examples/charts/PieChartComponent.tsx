import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTranslation } from 'react-i18next';

const data = [
  { name: 'Candidate A', value: 35, color: 'hsl(172, 55%, 45%)' },
  { name: 'Candidate B', value: 28, color: 'hsl(180, 60%, 55%)' },
  { name: 'Candidate C', value: 22, color: 'hsl(220, 65%, 62%)' },
  { name: 'Candidate D', value: 15, color: 'hsl(270, 55%, 58%)' }
];

export const PieChartComponent = () => {
  const { t } = useTranslation();

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value}%`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};
