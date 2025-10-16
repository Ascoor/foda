import React from 'react';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks';

export const BarChart = ({ data, dataKey = 'votes', xKey = 'party' }) => {
  const { theme, palette } = useTheme();
  const { t } = useTranslation();

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'night' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(71, 85, 105, 0.2)'} />
        <XAxis dataKey={xKey} stroke={theme === 'night' ? '#E2E8F0' : '#1E293B'} style={{ fontSize: '12px' }} />
        <YAxis stroke={theme === 'night' ? '#E2E8F0' : '#1E293B'} style={{ fontSize: '12px' }} />
        <Tooltip
          formatter={(value) => [`${value} ${t('votes')}`, t('campaignOverview')]}
          contentStyle={{
            backgroundColor: theme === 'night' ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            border: '1px solid rgba(148, 163, 184, 0.25)',
            padding: '12px'
          }}
        />
        <Bar dataKey={dataKey} radius={[16, 16, 12, 12]} fill={`url(#barGradient-${theme})`} />
        <defs>
          <linearGradient id={`barGradient-${theme}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={palette.accent.secondary} />
            <stop offset="100%" stopColor={palette.accent.tertiary} />
          </linearGradient>
        </defs>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

BarChart.defaultProps = {
  data: []
};

export default BarChart;
