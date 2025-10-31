import { create } from "zustand";

interface CampaignsState {
  activeCampaignId: string | null;
  activeElectionId: string | null;
  setActiveCampaign: (campaignId: string | null) => void;
  setActiveElection: (electionId: string | null) => void;
  reset: () => void;
}

export const useCampaignsStore = create<CampaignsState>((set) => ({
  activeCampaignId: null,
  activeElectionId: null,
  setActiveCampaign: (campaignId) =>
    set((state) => ({
      activeCampaignId: campaignId,
      activeElectionId:
        state.activeElectionId && campaignId === state.activeCampaignId
          ? state.activeElectionId
          : null,
    })),
  setActiveElection: (activeElectionId) => set({ activeElectionId }),
  reset: () => set({ activeCampaignId: null, activeElectionId: null }),
}));
