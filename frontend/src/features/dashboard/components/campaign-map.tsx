import { motion } from "framer-motion";
import { useLanguage } from "@shared/hooks";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";

const hotspots = [
  { id: 1, top: "20%", left: "30%" },
  { id: 2, top: "45%", left: "55%" },
  { id: 3, top: "65%", left: "40%" }
];

export const CampaignMap = () => {
  const { direction } = useLanguage();
  const { t } = useTranslation();

  return (
    <Card className="relative overflow-hidden">
      <CardHeader>
        <CardTitle>{t("dashboard.mapTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="relative h-64 overflow-hidden rounded-xl border border-dashed border-primary/30 bg-gradient-to-br from-primary/5 via-white to-accent/10"
          dir={direction}
        >
          {hotspots.map((spot, index) => (
            <motion.span
              key={spot.id}
              className="absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-primary shadow-lg"
              style={{ top: spot.top, left: spot.left }}
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
            />
          ))}
          <div className="absolute inset-4 rounded-lg border border-white/40 bg-white/30 backdrop-blur">
            <div className="flex h-full items-center justify-center text-sm font-medium text-primary">
              {t("dashboard.overview")}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
