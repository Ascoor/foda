import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiFetch } from '@/lib/api';

export const HeatmapCard: React.FC = () => {
  const { t, language } = useLanguage();
  const [points, setPoints] = useState<Array<{lat: number; lng: number}>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch('/api/v1/home/heatmap')
      .then((data) => setPoints(data.data))
      .catch(() => setError(t('common.error')))
      .finally(() => setLoading(false));
  }, [t]);

  return (
    <Card className="glass transition-glow hover:neon-glow-blue">
      <CardHeader>
        <CardTitle className={language === 'ar' ? 'font-arabic-heading' : ''}>
          {t('dashboard.heatmap_points')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <div>{t('common.loading')}</div>}
        {error && <div className="text-destructive">{error}</div>}
        {!loading && !error && (
          <div className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic-heading' : ''}`}>
            {points.length}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
