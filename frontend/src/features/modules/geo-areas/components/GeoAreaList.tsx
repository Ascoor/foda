import { GeoDistrict, GeoStatus } from "../data/mockGeoAreas";
import { useLanguage } from "@/infrastructure/shared/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { Badge } from "@/infrastructure/shared/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  areas: GeoDistrict[];
}

const statusStyles: Record<GeoStatus, string> = {
  covered: "bg-success/20 text-success border-success/30",
  uncovered: "bg-destructive/20 text-destructive border-destructive/30",
  "high-priority": "bg-warning/20 text-warning border-warning/30",
};

export const GeoAreaList = ({ areas }: Props) => {
  const { language } = useLanguage();
  const { t } = useTranslation();

  if (!areas.length) {
    return (
      <div className="glass-card p-8 text-center text-muted-foreground">
        {t("geo_areas.dashboard.no_areas")}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto glass-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left">
            <th className="px-4 py-2">{t("common.name")}</th>
            <th className="px-4 py-2">
              {t("geo_areas.dashboard.status_filter")}
            </th>
            <th className="px-4 py-2">{t("geo_areas.dashboard.voters")}</th>
            <th className="px-4 py-2">{t("geo_areas.dashboard.volunteers")}</th>
            <th className="px-4 py-2">{t("geo_areas.dashboard.committees")}</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {areas.map((area) => (
              <motion.tr
                key={area.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="border-t border-white/10"
              >
                <td className="px-4 py-2 font-medium">
                  {language === "ar" ? area.name.ar : area.name.en}
                </td>
                <td className="px-4 py-2">
                  <Badge
                    variant="outline"
                    className={`${statusStyles[area.status]} text-xs`}
                  >
                    {t(`geo_areas.statuses.${area.status.replace("-", "_")}`)}
                  </Badge>
                </td>
                <td className="px-4 py-2">
                  {area.stats.voters.toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  {area.stats.volunteers.toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  {area.stats.committees.toLocaleString()}
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
};

export default GeoAreaList;
