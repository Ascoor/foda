import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

const data = [
  { party: 'Party A', votes: 12500 },
  { party: 'Party B', votes: 10200 },
  { party: 'Party C', votes: 8900 },
  { party: 'Party D', votes: 6700 },
  { party: 'Party E', votes: 5200 }
];

export const BarChartComponent = () => {
  const { t } = useTranslation();

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
        <XAxis 
          dataKey="party" 
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: '12px' }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '12px',
            padding: '8px'
          }}
          formatter={(value) => [`${value} ${t('votes')}`, t('party')]}
        />
        <Bar 
          dataKey="votes" 
          fill="url(#colorGradient)"
          radius={[12, 12, 0, 0]}
        />
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(172, 55%, 45%)" />
            <stop offset="100%" stopColor="hsl(270, 55%, 58%)" />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  );
};
