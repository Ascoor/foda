import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  type CampaignIdentifier,
  getActiveCampaignId,
  setActiveCampaignId,
} from "@/infrastructure/shared/lib/campaign";

interface CampaignContextValue {
  campaignId: string;
  setCampaignId: (identifier: CampaignIdentifier | null) => void;
}

const CampaignContext = createContext<CampaignContextValue | undefined>(undefined);

export const CampaignProvider = ({ children }: { children: ReactNode }) => {
  const [campaignId, setCampaignIdState] = useState<string>(getActiveCampaignId);

  const setCampaignId = useCallback((identifier: CampaignIdentifier | null) => {
    const normalized = setActiveCampaignId(identifier);
    setCampaignIdState(normalized);
  }, []);

  const value = useMemo(
    () => ({
      campaignId,
      setCampaignId,
    }),
    [campaignId, setCampaignId],
  );

  return (
    <CampaignContext.Provider value={value}>
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaignContext = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error("useCampaignContext must be used within a CampaignProvider");
  }
  return context;
};
