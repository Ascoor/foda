import React, { useMemo } from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks';

const defaultColors = ['primary', 'secondary', 'tertiary'];

export const PieChart = ({ data, valueKey = 'value', nameKey = 'name', colors }) => {
  const { theme, palette } = useTheme();
  const { t } = useTranslation();

  const slices = useMemo(() => data || [], [data]);
  const paletteColors = useMemo(() => {
    if (Array.isArray(colors) && colors.length) return colors;
    const accents = Object.values(palette.accent);
    return slices.map((_, index) => accents[index % accents.length]);
  }, [colors, palette.accent, slices]);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RechartsPieChart>
        <Pie
          data={slices}
          dataKey={valueKey}
          nameKey={nameKey}
          cx="50%"
          cy="50%"
          outerRadius={90}
          innerRadius={45}
          paddingAngle={4}
        >
          {slices.map((entry, index) => (
            <Cell key={entry.key || `${nameKey}-${index}`} fill={paletteColors[index % paletteColors.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, label) => [`${value} %`, t('voteResults')]}
          contentStyle={{
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            borderRadius: '16px',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            padding: '12px'
          }}
          labelStyle={{ color: '#E2E8F0' }}
        />
        <Legend
          verticalAlign="bottom"
          iconType="circle"
          wrapperStyle={{
            paddingTop: 12,
            color: theme === 'night' ? '#E0F2FE' : '#0F172A'
          }}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

PieChart.defaultProps = {
  data: [],
  colors: defaultColors
};

export default PieChart;
