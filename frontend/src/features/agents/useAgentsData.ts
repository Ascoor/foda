import { use } from "react";
import { safeArray } from "@/shared/lib/safeData";
import { fetchAgents } from "./api";
import type { Agent, AgentFilters } from "./types";

const agentsCache = new Map<string, Promise<Agent[]>>();

const serializeFilters = (filters: AgentFilters | undefined) =>
  JSON.stringify(filters ?? {});

const createAgentsPromise = (
  filters: AgentFilters | undefined,
  cacheKey: string,
) =>
  fetchAgents(filters ?? {})
    .then((data) => safeArray<Agent>(data))
    .catch((error) => {
      agentsCache.delete(cacheKey);
      throw error;
    });

export const useAgentsData = (filters: AgentFilters | undefined) => {
  const key = serializeFilters(filters);
  let promise = agentsCache.get(key);

  if (!promise) {
    promise = createAgentsPromise(filters, key);
    agentsCache.set(key, promise);
  }

  return use(promise);
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
  agentsCache.set(key, Promise.resolve(safeArray<Agent>(data)));
};
