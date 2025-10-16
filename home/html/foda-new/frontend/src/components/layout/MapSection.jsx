import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDashboardStore, themePalettes } from './store';
import { mapCenters } from './data';

import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

export const MapSection = ({ centers = mapCenters }) => {
  const { theme } = useDashboardStore();
  const palette = themePalettes[theme] || themePalettes.day;
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-[320px] rounded-3xl bg-white/5 animate-pulse" />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="overflow-hidden rounded-3xl"
    >
      <MapContainer
        center={[31.0412, 31.3807]}
        zoom={12}
        scrollWheelZoom={false}
        style={{ height: 320, width: '100%' }}
        className="focus:outline-none"
      >
        <TileLayer
          url={palette.mapTiles}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {centers.map((center) => (
          <Marker key={center.id} position={center.position}>
            <Popup>
              <div className="space-y-1">
                <h3 className="font-semibold text-base">{center.name}</h3>
                <p className="text-sm opacity-80">
                  {center.voters.toLocaleString()} {t('voters')}
                </p>
                <p className="text-sm">
                  {t('participation')}: {center.participation}%
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </motion.div>
  );
};

export default MapSection;
