import { create } from "zustand";

import { setCampaignId as setApiCampaignId } from "@/shared/api/http";

type CampaignState = {
  campaignId: string | null;
  setCampaignId: (id: string | null) => void;
};

export const useCampaignStore = create<CampaignState>((set) => ({
  campaignId: null,
  setCampaignId: (id) => {
    setApiCampaignId(id);
    set({ campaignId: id });
  },
}));
