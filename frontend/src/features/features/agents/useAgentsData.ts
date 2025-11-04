import { safeArray } from "@/infrastructure/shared/lib/safeData";
import { fetchAgents } from "./api";
import type { Agent, AgentFilters } from "./types";

type AgentsCacheEntry = {
  status: "pending" | "success" | "error";
  promise: Promise<Agent[]>;
  data?: Agent[];
  error?: unknown;
};

const agentsCache = new Map<string, AgentsCacheEntry>();

const serializeFilters = (filters: AgentFilters | undefined) =>
  JSON.stringify(filters ?? {});

const createAgentsEntry = (
  filters: AgentFilters | undefined,
  cacheKey: string,
): AgentsCacheEntry => {
  const entry: AgentsCacheEntry = {
    status: "pending",
    promise: fetchAgents(filters ?? {})
      .then((data) => {
        const safeData = safeArray<Agent>(data);
        entry.status = "success";
        entry.data = safeData;
        return safeData;
      })
      .catch((error) => {
        entry.status = "error";
        entry.error = error;
        agentsCache.delete(cacheKey);
        throw error;
      }),
  };

  return entry;
};

export const useAgentsData = (filters: AgentFilters | undefined) => {
  const key = serializeFilters(filters);
  let entry = agentsCache.get(key);

  if (!entry) {
    entry = createAgentsEntry(filters, key);
    agentsCache.set(key, entry);
  }

  if (entry.status === "pending") {
    throw entry.promise;
  }

  if (entry.status === "error") {
    throw entry.error ?? new Error("Failed to load agents");
  }

  return entry.data ?? [];
};

export const invalidateAgentsCache = (filters?: AgentFilters) => {
  if (!filters) {
    agentsCache.clear();
    return;
  }

  const key = serializeFilters(filters);
  agentsCache.delete(key);
};

export const primeAgentsCache = (
  filters: AgentFilters | undefined,
  data: Agent[],
) => {
  const key = serializeFilters(filters);
  const safeData = safeArray<Agent>(data);
  agentsCache.set(key, {
    status: "success",
    promise: Promise.resolve(safeData),
    data: safeData,
  });
};
