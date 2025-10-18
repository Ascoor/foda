import { GeoDistrict } from '../data/mockGeoAreas';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Users, UserCheck, Building } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  area: GeoDistrict;
}

export const GeoAreaStats = ({ area }: Props) => {
  const { t } = useTranslation();
  const stats = [
    { label: t('geo_areas.dashboard.voters'), value: area.stats.voters, icon: Users },
    { label: t('geo_areas.dashboard.volunteers'), value: area.stats.volunteers, icon: UserCheck },
    { label: t('geo_areas.dashboard.committees'), value: area.stats.committees, icon: Building },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map(({ label, value, icon: Icon }) => (
        <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-card h-full">
            <CardContent className="flex items-center gap-3 p-4">
              <Icon className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">{label}</div>
                <div className="font-bold">{value.toLocaleString()}</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default GeoAreaStats;
