import { PropsWithChildren, createContext, useContext } from "react";

import {
  OfflineSyncState,
  useOfflineSync as useOfflineSyncImplementation,
} from "@shared/hooks/use-offline-sync";

const OfflineContext = createContext<OfflineSyncState | null>(null);

export const OfflineProvider = ({ children }: PropsWithChildren) => {
  const offlineState = useOfflineSyncImplementation();
  return (
    <OfflineContext.Provider value={offlineState}>{children}</OfflineContext.Provider>
  );
};

export const useOfflineSyncContext = (): OfflineSyncState => {
  const context = useContext(OfflineContext);

  if (!context) {
    throw new Error("useOfflineSync must be used within an OfflineProvider");
  }

  return context;
};
