import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { FeatureFlag } from "@/routing/nav/nav.schema";

const parseInitialFlags = (value?: unknown): Set<FeatureFlag> => {
  if (value instanceof Set) {
    return new Set(value) as Set<FeatureFlag>;
  }

  if (Array.isArray(value)) {
    return new Set(value.filter(Boolean) as FeatureFlag[]);
  }

  if (typeof value === "string") {
    return new Set(
      value
        .split(",")
        .map((flag) => flag.trim())
        .filter(Boolean) as FeatureFlag[],
    );
  }

  const env = import.meta.env.VITE_FEATURE_FLAGS;
  if (typeof env === "string" && env.length > 0) {
    return parseInitialFlags(env);
  }

  return new Set();
};

export interface FeatureFlagState {
  flags: Set<FeatureFlag>;
  isEnabled: (flag: FeatureFlag) => boolean;
  enable: (flag: FeatureFlag) => void;
  disable: (flag: FeatureFlag) => void;
  toggle: (flag: FeatureFlag, nextState?: boolean) => void;
  setFlags: (next: Iterable<FeatureFlag>) => void;
}

const FeatureFlagContext = createContext<FeatureFlagState | null>(null);

export interface FeatureFlagProviderProps {
  children: ReactNode;
  initialFlags?: Iterable<FeatureFlag> | FeatureFlag[] | string | Set<FeatureFlag>;
}

export const FeatureFlagProvider = ({
  children,
  initialFlags,
}: FeatureFlagProviderProps) => {
  const [flags, setFlags] = useState<Set<FeatureFlag>>(() => parseInitialFlags(initialFlags));

  const setFlagsSafe = useCallback((next: Iterable<FeatureFlag>) => {
    setFlags(new Set(next));
  }, []);

  const enable = useCallback((flag: FeatureFlag) => {
    setFlags((current) => {
      const next = new Set(current);
      next.add(flag);
      return next;
    });
  }, []);

  const disable = useCallback((flag: FeatureFlag) => {
    setFlags((current) => {
      const next = new Set(current);
      next.delete(flag);
      return next;
    });
  }, []);

  const toggle = useCallback((flag: FeatureFlag, nextState?: boolean) => {
    setFlags((current) => {
      const next = new Set(current);
      const shouldEnable = nextState ?? !next.has(flag);
      if (shouldEnable) {
        next.add(flag);
      } else {
        next.delete(flag);
      }
      return next;
    });
  }, []);

  const value = useMemo<FeatureFlagState>(() => ({
    flags,
    isEnabled: (flag: FeatureFlag) => flags.has(flag),
    enable,
    disable,
    toggle,
    setFlags: setFlagsSafe,
  }), [disable, enable, flags, setFlagsSafe, toggle]);

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

export const useFeatureFlags = (): FeatureFlagState => {
  const ctx = useContext(FeatureFlagContext);
  if (!ctx) {
    throw new Error("useFeatureFlags must be used within a FeatureFlagProvider");
  }
  return ctx;
};
