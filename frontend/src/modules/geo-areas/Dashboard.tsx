import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Map, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { GeoAreaMap } from './components/GeoAreaMap';
import { GeoAreaStats } from './components/GeoAreaStats';
import { GeoAreaList } from './components/GeoAreaList';
import { GeoDistrict, GeoStatus, mockGeoDistricts } from './data/mockGeoAreas';
import { useLanguage } from '@/contexts/LanguageContext';

export const GeoAreasDashboard = () => {
  const { t } = useTranslation();
  const { language, direction } = useLanguage();
  const [view, setView] = useState<'map' | 'list'>('map');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<GeoStatus | 'all'>('all');
  const [areas, setAreas] = useState<GeoDistrict[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAreas(mockGeoDistricts);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const filtered = areas.filter((a) => {
    const matchesName = (language === 'ar' ? a.name.ar : a.name.en).toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === 'all' || a.status === status;
    return matchesName && matchesStatus;
  });

  const selectedArea = filtered.find((a) => a.id === selectedId);

  const statusOptions: { value: GeoStatus | 'all'; label: string }[] = [
    { value: 'all', label: t('common.all', { defaultValue: 'All' }) },
    { value: 'covered', label: t('geo_areas.statuses.covered') },
    { value: 'uncovered', label: t('geo_areas.statuses.uncovered') },
    { value: 'high-priority', label: t('geo_areas.statuses.high_priority') },
  ];

  return (
    <div className="space-y-4" aria-label={t('navigation.geo_areas')}>
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold">
        {t('geo_areas.title')}
      </motion.h1>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            placeholder={t('geo_areas.dashboard.search_placeholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass"
            aria-label={t('common.search')}
          />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v as GeoStatus | 'all')}>
          <SelectTrigger className="glass w-full md:w-48" aria-label={t('geo_areas.dashboard.status_filter')}>
            <SelectValue placeholder={t('geo_areas.dashboard.status_filter')} />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button
            variant={view === 'map' ? 'default' : 'outline'}
            onClick={() => setView('map')}
            className="glass-button"
            aria-pressed={view === 'map'}
          >
            <Map className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">{t('geo_areas.dashboard.map_view')}</span>
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            onClick={() => setView('list')}
            className="glass-button"
            aria-pressed={view === 'list'}
          >
            <List className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">{t('geo_areas.dashboard.list_view')}</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <Skeleton className="w-full h-96" />
      ) : view === 'map' ? (
        <div className="relative h-96">
          <GeoAreaMap areas={filtered} selectedId={selectedId} onSelect={setSelectedId} />
          {/* Legend */}
          <div className={`absolute bottom-4 ${direction === 'rtl' ? 'right-4' : 'left-4'} bg-background/80 backdrop-blur-sm p-3 rounded-md shadow-md text-sm`}
               aria-label={t('geo_areas.dashboard.legend')}>
            <div className="font-medium mb-1">{t('geo_areas.dashboard.legend')}</div>
            <ul className="space-y-1">
              {statusOptions.filter(s => s.value !== 'all').map((s) => (
                <li key={s.value} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-sm border"
                    style={{ backgroundColor: s.value === 'covered' ? '#16a34a' : s.value === 'uncovered' ? '#dc2626' : '#f59e0b', borderColor: '#00000033' }}
                  />
                  <span>{s.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Detail panel */}
          {selectedArea && (
            <div className={`absolute top-0 ${direction === 'rtl' ? 'left-0' : 'right-0'} w-full sm:w-80 h-full bg-background/90 backdrop-blur-md border ${direction === 'rtl' ? 'border-r' : 'border-l'} border-white/10 p-4 overflow-y-auto`}
                 aria-label={language === 'ar' ? selectedArea.name.ar : selectedArea.name.en}>
              <button
                onClick={() => setSelectedId(null)}
                className="mb-2 text-sm text-muted-foreground hover:text-primary"
              >
                {t('common.close', { defaultValue: 'Close' })}
              </button>
              <h2 className="text-lg font-semibold mb-4">
                {language === 'ar' ? selectedArea.name.ar : selectedArea.name.en}
              </h2>
              <GeoAreaStats area={selectedArea} />
            </div>
          )}
        </div>
      ) : (
        <GeoAreaList areas={filtered} />
      )}
    </div>
  );
};

export default GeoAreasDashboard;
