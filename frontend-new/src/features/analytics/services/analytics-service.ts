export type KeyPerformanceIndicator = {
  id: string;
  label: string;
  value: string;
  trend: "up" | "down" | "steady";
  delta: string;
};

export type VoterStatPoint = {
  month: string;
  supporters: number;
  undecided: number;
};

export type VolunteerProgressPoint = {
  week: string;
  trained: number;
  active: number;
};

export type HeatMapCell = {
  neighborhood: string;
  contactRate: number;
};

const kpis: KeyPerformanceIndicator[] = [
  { id: "supporters", label: "Supporters identified", value: "3,482", trend: "up", delta: "+12%" },
  { id: "contacts", label: "Weekly contacts", value: "864", trend: "up", delta: "+5%" },
  { id: "volunteers", label: "Active volunteers", value: "128", trend: "steady", delta: "=" },
];

const voterStats: VoterStatPoint[] = [
  { month: "May", supporters: 2200, undecided: 1400 },
  { month: "Jun", supporters: 2560, undecided: 1320 },
  { month: "Jul", supporters: 2980, undecided: 1180 },
  { month: "Aug", supporters: 3482, undecided: 950 },
];

const volunteerProgress: VolunteerProgressPoint[] = [
  { week: "Week 1", trained: 40, active: 25 },
  { week: "Week 2", trained: 58, active: 41 },
  { week: "Week 3", trained: 79, active: 60 },
  { week: "Week 4", trained: 98, active: 73 },
];

const heatMap: HeatMapCell[] = [
  { neighborhood: "Downtown", contactRate: 0.82 },
  { neighborhood: "North Ridge", contactRate: 0.67 },
  { neighborhood: "Riverfront", contactRate: 0.74 },
  { neighborhood: "Westview", contactRate: 0.58 },
];

export const analyticsService = {
  async getKpis() {
    return kpis;
  },
  async getVoterStats() {
    return voterStats;
  },
  async getVolunteerProgress() {
    return volunteerProgress;
  },
  async getHeatMap() {
    return heatMap;
  },
};
