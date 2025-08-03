import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchAnalytics } from './api';
import { AnalyticsData } from './types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const Analytics = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetchAnalytics();
      setData(res);
    };
    load();
    const id = setInterval(load, 10000);
    return () => clearInterval(id);
  }, []);

  if (!data) {
    return <div>{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('analytics.title')}</h1>

      <div className="glass-card p-4">
        <h2 className="mb-2 font-semibold">{t('analytics.kpi')}</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data.kpis}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card p-4">
        <h2 className="mb-2 font-semibold">{t('analytics.heatmap')}</h2>
        <div className="grid grid-cols-12 gap-1">
          {data.heatmap.map((v, i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-sm"
              style={{ backgroundColor: `rgba(59,130,246,${v})` }}
            />
          ))}
        </div>
      </div>

      <div className="glass-card p-4">
        <h2 className="mb-2 font-semibold">{t('analytics.funnel')}</h2>
        <ul className="space-y-2">
          {data.funnel.map((step, i) => (
            <li key={step.name} className="flex items-center">
              <span className="w-24">{step.name}</span>
              <div className="flex-1 bg-muted/40 h-4 mx-2">
                <div
                  className="bg-primary h-4"
                  style={{ width: `${(step.value / data.funnel[0].value) * 100}%` }}
                />
              </div>
              <span>{step.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
