import { useEffect, useState } from "react";
import {
  HeatMapCell,
  KeyPerformanceIndicator,
  VoterStatPoint,
  VolunteerProgressPoint,
  analyticsService,
} from "../services/analytics-service";

export const useAnalytics = () => {
  const [kpis, setKpis] = useState<KeyPerformanceIndicator[]>([]);
  const [voterStats, setVoterStats] = useState<VoterStatPoint[]>([]);
  const [volunteerProgress, setVolunteerProgress] = useState<VolunteerProgressPoint[]>([]);
  const [heatMap, setHeatMap] = useState<HeatMapCell[]>([]);

  useEffect(() => {
    const load = async () => {
      const [kpiData, voterData, volunteerData, heatMapData] = await Promise.all([
        analyticsService.getKpis(),
        analyticsService.getVoterStats(),
        analyticsService.getVolunteerProgress(),
        analyticsService.getHeatMap(),
      ]);

      setKpis(kpiData);
      setVoterStats(voterData);
      setVolunteerProgress(volunteerData);
      setHeatMap(heatMapData);
    };

    load();
  }, []);

  return {
    kpis,
    voterStats,
    volunteerProgress,
    heatMap,
  };
};
