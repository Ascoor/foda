import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useFloatingExperienceStore } from "./store";

const fallbackCoordinates: [number, number] = [31.037933, 31.381523];

const markerPalette = ["#22d3ee", "#34d399", "#fbbf24", "#a855f7"];

export interface MapPoint {
  lat: number;
  lng: number;
  label?: string;
  voters?: number;
  participation?: number;
}

interface MapSectionProps {
  title: string;
  description: string;
  emptyMessage: string;
  points: MapPoint[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const MapSkeleton = () => (
  <div className="flex h-[360px] items-center justify-center">
    <div className="h-12 w-12 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
  </div>
);

export const MapSection = ({
  title,
  description,
  emptyMessage,
  points,
  isLoading = false,
  error,
  onRetry,
}: MapSectionProps) => {
  const { theme, language } = useFloatingExperienceStore();
  const { t } = useTranslation("floating");

  const tileLayer = useMemo(
    () =>
      theme === "day"
        ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    [theme]
  );

  const safePoints = useMemo(() => (Array.isArray(points) ? points : []), [points]);

  const center = useMemo(() => {
    if (safePoints.length > 0) {
      const { lat, lng } = safePoints[0];
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        return [Number(lat), Number(lng)] as [number, number];
      }
    }

    return fallbackCoordinates;
  }, [safePoints]);

  const hasPoints = safePoints.some((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng));

  return (
    <motion.div
      id="zones"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/30 shadow-[0_25px_65px_rgba(14,116,144,0.25)] backdrop-blur-2xl dark:bg-slate-900/50"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/20 via-emerald-200/10 to-purple-300/20" />
      <div className="relative z-10 space-y-4 p-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p>
        </div>
        <div className="h-[360px] overflow-hidden rounded-2xl border border-white/20 shadow-inner">
          {isLoading ? (
            <MapSkeleton />
          ) : error ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-sm text-slate-600 dark:text-slate-300">
              <p>{error}</p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="rounded-full border border-white/40 bg-white/70 px-4 py-2 text-xs font-semibold text-slate-800 shadow-sm transition hover:bg-white dark:bg-slate-800/70 dark:text-slate-100"
                  type="button"
                >
                  {t("dashboard.retry", language === "ar" ? "إعادة المحاولة" : "Retry")}
                </button>
              )}
            </div>
          ) : hasPoints ? (
            <MapContainer center={center} zoom={9} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
              <TileLayer url={tileLayer} />
              {safePoints
                .filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng))
                .map((point, index) => {
                  const lat = Number(point.lat);
                  const lng = Number(point.lng);
                  const label = point.label ?? `${language === "ar" ? "نقطة" : "Point"} ${index + 1}`;
                  const voters = Number.isFinite(point.voters ?? NaN) ? Number(point.voters) : null;
                  const participation = Number.isFinite(point.participation ?? NaN)
                    ? Number(point.participation)
                    : null;

                  return (
                    <Marker
                      key={`${lat}-${lng}-${index}`}
                      position={[lat, lng] as [number, number]}
                      icon={L.divIcon({
                        html: `<span style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:9999px;background:${markerPalette[index % markerPalette.length]};box-shadow:0 0 18px rgba(59,130,246,0.35);border:3px solid rgba(255,255,255,0.85);"></span>`,
                        className: "border-0 bg-transparent",
                      })}
                    >
                      <Popup>
                        <div className="space-y-1 text-sm">
                          <p className="font-semibold">{label}</p>
                          <p>
                            {language === "ar" ? "خط العرض" : "Lat"}: {lat.toFixed(3)}
                          </p>
                          <p>
                            {language === "ar" ? "خط الطول" : "Lng"}: {lng.toFixed(3)}
                          </p>
                          {voters !== null && (
                            <p>
                              {language === "ar" ? "الناخبون" : "Voters"}: {voters.toLocaleString(language === "ar" ? "ar-EG" : "en-US")}
                            </p>
                          )}
                          {participation !== null && (
                            <p>
                              {language === "ar" ? "نسبة المشاركة" : "Participation"}: {participation.toFixed(1)}%
                            </p>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
            </MapContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-600 dark:text-slate-300">
              {emptyMessage}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
