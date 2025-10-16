import React from 'react';
import { ResponsiveContainer, AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useTranslation } from 'react-i18next';
import { useDashboardStore, themePalettes } from '../store';

export const AreaChart = ({ data, xKey = 'name', areaKeys = ['turnout', 'participation'] }) => {
  const { theme } = useDashboardStore();
  const palette = themePalettes[theme] || themePalettes.day;
  const { t } = useTranslation();

  const [primaryKey, secondaryKey] = areaKeys;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RechartsAreaChart data={data}>
        <defs>
          <linearGradient id={`areaGradientPrimary-${theme}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={palette.accent.primary} stopOpacity={0.9} />
            <stop offset="95%" stopColor={palette.accent.primary} stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id={`areaGradientSecondary-${theme}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={palette.accent.secondary} stopOpacity={0.8} />
            <stop offset="95%" stopColor={palette.accent.secondary} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'night' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(71, 85, 105, 0.2)'} />
        <XAxis dataKey={xKey} stroke={theme === 'night' ? '#E2E8F0' : '#1E293B'} style={{ fontSize: '12px' }} />
        <YAxis stroke={theme === 'night' ? '#E2E8F0' : '#1E293B'} style={{ fontSize: '12px' }} />
        <Tooltip
          formatter={(value, label) => [`${value}%`, label === primaryKey ? t('participationRate') : t('turnoutByDistrict')]}
          contentStyle={{
            backgroundColor: theme === 'night' ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            padding: '12px'
          }}
        />
        <Area type="monotone" dataKey={primaryKey} stroke={palette.accent.primary} fill={`url(#areaGradientPrimary-${theme})`} strokeWidth={3} />
        {secondaryKey && (
          <Area type="monotone" dataKey={secondaryKey} stroke={palette.accent.tertiary} fill={`url(#areaGradientSecondary-${theme})`} strokeWidth={2} />
        )}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
};

AreaChart.defaultProps = {
  data: []
};

export default AreaChart;
