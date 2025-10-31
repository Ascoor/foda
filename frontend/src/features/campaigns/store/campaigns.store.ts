import { create } from "zustand";

type CampaignsState = {
  activeAreaId?: number;
  activeCampaignId?: number;
  activeElectionId?: number;
  setArea: (id?: number) => void;
  setCampaign: (id?: number) => void;
  setElection: (id?: number) => void;
};

export const useCampaignsStore = create<CampaignsState>((set) => ({
  setArea: (id) => set({ activeAreaId: id, activeCampaignId: undefined, activeElectionId: undefined }),
  setCampaign: (id) => set({ activeCampaignId: id, activeElectionId: undefined }),
  setElection: (id) => set({ activeElectionId: id }),
}));
