export type Campaign = {
  id: string;
  name: string;
  created_at: string;
  meta?: Record<string, unknown>;
};

export type MetricsSummary = {
  hasData: boolean;
  widgets?: Record<string, unknown>[];
};

type CreateCampaignPayload = {
  name: string;
};

const STORAGE_KEY = "mock_campaigns";
const LATENCY = 500;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const defaultCampaigns: Campaign[] = [
  {
    id: "seed-1",
    name: "حملة وسط المدينة",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    meta: { seeded: true, tone: "evening" },
  },
  {
    id: "new-1",
    name: "Launch 2025",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    meta: { seeded: false },
  },
];

const getFallbackCampaigns = () => defaultCampaigns.map((campaign) => ({ ...campaign }));

const memoryStore: { campaigns: Campaign[] } = {
  campaigns: getFallbackCampaigns(),
};

const ensureLocalStore = (): Campaign[] | undefined => {
  if (typeof window === "undefined") return undefined;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryStore.campaigns));
    return memoryStore.campaigns;
  }

  try {
    const parsed = JSON.parse(raw) as Campaign[];
    memoryStore.campaigns = parsed;
    return parsed;
  } catch (error) {
    console.error("Failed to parse campaigns from storage", error);
    window.localStorage.removeItem(STORAGE_KEY);
    memoryStore.campaigns = getFallbackCampaigns();
    return memoryStore.campaigns;
  }
};

const writeLocalStore = (campaigns: Campaign[]) => {
  memoryStore.campaigns = campaigns;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
  }
};

const simulateLatency = async () => {
  await sleep(LATENCY);
};

const refreshStore = () => ensureLocalStore() ?? memoryStore.campaigns;

export const campaignService = {
  async getCampaigns(): Promise<Campaign[]> {
    await simulateLatency();
    const campaigns = refreshStore();
    return campaigns.slice();
  },

  async createCampaign(payload: CreateCampaignPayload): Promise<Campaign> {
    if (!payload.name.trim()) {
      throw new Error("Campaign name is required");
    }

    await simulateLatency();

    const campaigns = refreshStore();
    const newCampaign: Campaign = {
      id: typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `campaign-${Date.now()}`,
      name: payload.name.trim(),
      created_at: new Date().toISOString(),
      meta: { seeded: false },
    };

    const updatedCampaigns = [newCampaign, ...campaigns];
    writeLocalStore(updatedCampaigns);

    return newCampaign;
  },

  async getMetricsSummary(campaignId: string): Promise<MetricsSummary> {
    await simulateLatency();

    const campaigns = refreshStore();
    const campaign = campaigns.find((item) => item.id === campaignId);

    if (!campaign) {
      throw new Error("Campaign not found");
    }

    const seeded = Boolean(campaign.meta?.seeded);

    if (!seeded) {
      return { hasData: false };
    }

    return {
      hasData: true,
      widgets: [
        {
          id: "turnout",
          title: "نسبة المشاركة",
          value: 68,
          trend: 5,
        },
        {
          id: "volunteers",
          title: "Active Volunteers",
          value: 126,
          trend: -3,
        },
        {
          id: "donations",
          title: "Donations (24h)",
          value: 24300,
          trend: 12,
        },
      ],
    };
  },
};

export type CampaignService = typeof campaignService;
