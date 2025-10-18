import { useLanguage } from '@/contexts/LanguageContext';
import { GeoDistrict, GeoStatus } from '../data/mockGeoAreas';
import { MapContainer, TileLayer, Polygon, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';

interface Props {
  areas: GeoDistrict[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}

const statusColors: Record<GeoStatus, string> = {
  covered: '#16a34a',
  uncovered: '#dc2626',
  'high-priority': '#f59e0b',
};

export const GeoAreaMap = ({ areas, selectedId, onSelect }: Props) => {
  const { direction } = useLanguage();
  const center: [number, number] = [24.7, 46.7];

  return (
    <motion.div className="w-full h-full relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <MapContainer center={center} zoom={8} className="h-full w-full" scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {areas.map(area => (
          <Polygon
            key={area.id}
            positions={area.coordinates}
            pathOptions={{
              color: statusColors[area.status],
              weight: area.id === selectedId ? 4 : 2,
              fillOpacity: 0.3,
            }}
            eventHandlers={{
              click: () => onSelect?.(area.id),
            }}
          >
            <Tooltip direction={direction === 'rtl' ? 'left' : 'right'} sticky>
              {direction === 'rtl' ? area.name.ar : area.name.en}
            </Tooltip>
          </Polygon>
        ))}
      </MapContainer>
    </motion.div>
  );
};

export default GeoAreaMap;
