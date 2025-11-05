import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { useFloatingExperienceStore } from "./store";

const mansouraCoordinates: [number, number] = [31.037933, 31.381523];

const markerPalette = ["#22d3ee", "#34d399", "#fbbf24", "#a855f7"];

const points = [
  {
    name: "المنصورة",
    position: [31.037933, 31.381523] as [number, number],
    voters: "450k",
    participation: "62%",
  },
  {
    name: "ميت غمر",
    position: [30.706154, 31.258825] as [number, number],
    voters: "210k",
    participation: "58%",
  },
  {
    name: "السنبلاوين",
    position: [30.618292, 31.512454] as [number, number],
    voters: "165k",
    participation: "54%",
  },
  {
    name: "طلخا",
    position: [31.061735, 31.377392] as [number, number],
    voters: "120k",
    participation: "66%",
  },
];

export const MapSection = () => {
  const { theme } = useFloatingExperienceStore();

  const tileLayer = useMemo(
    () =>
      theme === "day"
        ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    [theme],
  );

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
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
            خريطة المنصورة / الدقهلية
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            استكشف مراكز الاقتراع عبر الخريطة التفاعلية وتابع نسب المشاركة.
          </p>
        </div>
        <div className="h-[360px] overflow-hidden rounded-2xl border border-white/20 shadow-inner">
          <MapContainer
            center={mansouraCoordinates}
            zoom={10}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={false}
          >
            <TileLayer url={tileLayer} />
            {points.map((point, index) => (
              <Marker
                key={point.name}
                position={point.position}
                icon={L.divIcon({
                  html: `<span style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:9999px;background:${markerPalette[index % markerPalette.length]};box-shadow:0 0 18px rgba(59,130,246,0.35);border:3px solid rgba(255,255,255,0.85);"></span>`,
                  className: "border-0 bg-transparent",
                })}
              >
                <Popup>
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold">{point.name}</p>
                    <p>الناخبون: {point.voters}</p>
                    <p>نسبة المشاركة: {point.participation}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </motion.div>
  );
};
