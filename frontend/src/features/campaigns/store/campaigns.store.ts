import { create } from "zustand";

export type CampaignIdentifier = string | null;
export type ElectionIdentifier = string | null;

export interface CampaignsState {
  activeCampaignId: CampaignIdentifier;
  activeElectionId: ElectionIdentifier;
  setActiveCampaign: (campaignId: CampaignIdentifier) => void;
  setActiveElection: (electionId: ElectionIdentifier) => void;
  reset: () => void;
}

export const useCampaignsStore = create<CampaignsState>((set) => ({
  activeCampaignId: null,
  activeElectionId: null,
  setActiveCampaign: (campaignId) =>
    set((state) => {
      if (!campaignId) {
        return { activeCampaignId: null, activeElectionId: null };
      }

      const shouldPreserveElection =
        state.activeCampaignId === campaignId && state.activeElectionId !== null;

      return {
        activeCampaignId: campaignId,
        activeElectionId: shouldPreserveElection ? state.activeElectionId : null,
      };
    }),
  setActiveElection: (electionId) =>
    set((state) => ({
      activeElectionId: electionId ?? null,
      activeCampaignId: state.activeCampaignId ?? null,
    })),
  reset: () => set({ activeCampaignId: null, activeElectionId: null }),
}));
