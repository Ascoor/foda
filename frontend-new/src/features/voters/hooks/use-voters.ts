import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CreateVoterInput,
  Voter,
  VoterFilters,
  VoterInteractionInput,
  VoterStatus,
  voterService,
} from "../services/voter-service";

type UseVotersState = {
  voters: Voter[];
  filteredVoters: Voter[];
  filters: VoterFilters;
  statusCounts: Record<VoterStatus, number>;
  loading: boolean;
  error: string | null;
};

const defaultFilters: VoterFilters = {
  status: "all",
};

const getStatusCounts = (voters: Voter[]): Record<VoterStatus, number> => {
  const counts: Record<VoterStatus, number> = {
    supporter: 0,
    leaning: 0,
    undecided: 0,
    opposed: 0,
    unknown: 0,
  };

  voters.forEach((voter) => {
    counts[voter.status] += 1;
  });

  return counts;
};

export const useVoters = () => {
  const [state, setState] = useState<UseVotersState>({
    voters: [],
    filteredVoters: [],
    filters: defaultFilters,
    statusCounts: {
      supporter: 0,
      leaning: 0,
      undecided: 0,
      opposed: 0,
      unknown: 0,
    },
    loading: true,
    error: null,
  });
  const [precincts, setPrecincts] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [initialVoters, knownPrecincts] = await Promise.all([
          voterService.getVoters(defaultFilters),
          voterService.getPrecincts(),
        ]);

        setState((prev) => ({
          ...prev,
          voters: initialVoters,
          filteredVoters: initialVoters,
          statusCounts: getStatusCounts(initialVoters),
          loading: false,
          error: null,
        }));
        setPrecincts(knownPrecincts);
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "Failed to load voters",
        }));
      }
    };

    load();
  }, []);

  const updateFilters = useCallback((updates: Partial<VoterFilters>) => {
    setState((prev) => {
      const nextFilters = { ...prev.filters, ...updates };
      const filteredVoters = applyFilters(prev.voters, nextFilters);

      return {
        ...prev,
        filters: nextFilters,
        filteredVoters,
      };
    });
  }, []);

  const refreshPrecincts = useCallback(async () => {
    const knownPrecincts = await voterService.getPrecincts();
    setPrecincts(knownPrecincts);
  }, []);

  const addVoter = useCallback(async (input: CreateVoterInput) => {
    const newVoter = await voterService.createVoter(input);

    setState((prev) => {
      const voters = [...prev.voters, newVoter];
      const filteredVoters = applyFilters(voters, prev.filters);

      return {
        ...prev,
        voters,
        filteredVoters,
        statusCounts: getStatusCounts(voters),
      };
    });

    refreshPrecincts();
  }, [refreshPrecincts]);

  const updateStatus = useCallback(async (id: string, status: VoterStatus) => {
    const updated = await voterService.updateVoterStatus(id, status);
    if (!updated) return;

    setState((prev) => {
      const voters = prev.voters.map((voter) => (voter.id === id ? updated : voter));
      return {
        ...prev,
        voters,
        filteredVoters: applyFilters(voters, prev.filters),
        statusCounts: getStatusCounts(voters),
      };
    });
  }, []);

  const logInteraction = useCallback(async (id: string, interaction: VoterInteractionInput) => {
    const updated = await voterService.logInteraction(id, interaction);
    if (!updated) return;

    setState((prev) => {
      const voters = prev.voters.map((voter) => (voter.id === id ? updated : voter));
      return {
        ...prev,
        voters,
        filteredVoters: applyFilters(voters, prev.filters),
        statusCounts: getStatusCounts(voters),
      };
    });
  }, []);

  const totalVoters = useMemo(() => state.voters.length, [state.voters.length]);

  return {
    voters: state.voters,
    filteredVoters: state.filteredVoters,
    filters: state.filters,
    statusCounts: state.statusCounts,
    totalVoters,
    loading: state.loading,
    error: state.error,
    precincts,
    addVoter,
    updateFilters,
    updateStatus,
    logInteraction,
  };
};

const applyFilters = (voters: Voter[], filters: VoterFilters) => {
  return voters.filter((voter) => {
    const matchesSearch = filters.search
      ? voter.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
        voter.precinct.toLowerCase().includes(filters.search.toLowerCase())
      : true;

    const matchesStatus = filters.status && filters.status !== "all" ? voter.status === filters.status : true;
    const matchesPrecinct = filters.precinct ? voter.precinct === filters.precinct : true;
    const matchesScore = typeof filters.minScore === "number" ? voter.likelihoodScore >= filters.minScore : true;

    return matchesSearch && matchesStatus && matchesPrecinct && matchesScore;
  });
};
