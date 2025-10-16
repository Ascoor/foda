import React from 'react';
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { useTranslation } from 'react-i18next';
import { useDashboardStore, themePalettes } from '../store';

export const LineChart = ({ data, dataKey = 'rate', xKey = 'month' }) => {
  const { theme } = useDashboardStore();
  const palette = themePalettes[theme] || themePalettes.day;
  const { t } = useTranslation();

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'night' ? 'rgba(148, 163, 184, 0.25)' : 'rgba(71, 85, 105, 0.25)'} />
        <XAxis dataKey={xKey} stroke={theme === 'night' ? '#CBD5F5' : '#0F172A'} style={{ fontSize: '12px' }} />
        <YAxis stroke={theme === 'night' ? '#CBD5F5' : '#0F172A'} style={{ fontSize: '12px' }} />
        <Tooltip
          labelFormatter={(label) => `${t('month')}: ${label}`}
          formatter={(value) => [`${value}%`, t('participation')]}
          contentStyle={{
            backgroundColor: theme === 'night' ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            border: '1px solid rgba(148, 163, 184, 0.25)',
            padding: '12px'
          }}
        />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={palette.accent.primary}
          strokeWidth={3}
          dot={{ fill: palette.accent.secondary, r: 6 }}
          activeDot={{ r: 8 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

LineChart.defaultProps = {
  data: []
};

export default LineChart;
